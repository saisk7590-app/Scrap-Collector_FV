const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

const getProfileWithRoleData = async (client, userId) => {
    const profileResult = await client.query(
        `SELECT
            p.*,
            r.name AS role_name,
            ua.id AS default_address_id,
            ua.type AS default_address_type,
            ua.house_no AS default_house_no,
            ua.area AS default_area,
            ua.pincode AS default_pincode,
            ua.landmark AS default_landmark,
            ua.address AS default_address_text
         FROM profiles p
         JOIN roles r ON p.role_id = r.id
         LEFT JOIN user_addresses ua
           ON ua.user_id = p.user_id
          AND ua.is_default = TRUE
         WHERE p.user_id = $1`,
        [userId]
    );

    if (profileResult.rows.length === 0) {
        return null;
    }

    const profile = profileResult.rows[0];
    const defaultAddressParts = [
        profile.default_house_no,
        profile.default_address_text,
        profile.default_area,
        profile.default_pincode,
    ].filter(Boolean);
    const resolvedAddress = defaultAddressParts.length > 0
        ? defaultAddressParts.join(', ')
        : profile.address;
    const role = (profile.role_name || '').toLowerCase();
    let roleData = {};

    if (role === 'corporate') {
        const corp = await client.query('SELECT * FROM corporates WHERE user_id = $1', [userId]);
        roleData = corp.rows[0] || {};
    } else if (role === 'govt_sector') {
        const govt = await client.query('SELECT * FROM government_sectors WHERE user_id = $1', [userId]);
        roleData = govt.rows[0] || {};
    } else if (role === 'gated_community') {
        const community = await client.query('SELECT * FROM gated_communities WHERE user_id = $1', [userId]);
        roleData = community.rows[0] || {};
    }

    return {
        id: profile.id,
        userId: profile.user_id,
        fullName: profile.full_name,
        phone: profile.phone,
        role: profile.role_name,
        walletBalance: profile.wallet_balance,
        address: resolvedAddress,
        defaultAddress: profile.default_address_text ? {
            id: profile.default_address_id,
            type: profile.default_address_type,
            houseNo: profile.default_house_no,
            area: profile.default_area,
            pincode: profile.default_pincode,
            landmark: profile.default_landmark,
            address: profile.default_address_text,
            formattedAddress: resolvedAddress,
        } : null,
        createdAt: profile.created_at,
        profileImageUrl: profile.profile_image_url,
        companyName: roleData.company_name,
        contactPerson: roleData.contact_person,
        contactPhone: roleData.contact_phone,
        companyEmail: roleData.company_email,
        gstNumber: roleData.gst_number,
        officeAddress: roleData.address,
        departmentName: roleData.department_name,
        officerName: roleData.officer_name,
        contactNumber: roleData.contact_number,
        zone: roleData.zone,
        officeLocation: roleData.address,
        communityName: roleData.community_name,
        managerName: roleData.manager_name,
        managerPhone: roleData.manager_phone,
        totalUnits: roleData.total_units,
        areaAddress: roleData.address,
    };
};

const removeLocalProfileImage = (imageUrl) => {
    if (!imageUrl || !imageUrl.includes('/uploads/profiles/')) {
        return;
    }

    const filename = imageUrl.split('/uploads/profiles/')[1];
    if (!filename) {
        return;
    }

    const filePath = path.join(__dirname, '..', '..', 'uploads', 'profiles', filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

const buildFileUrl = (req, filename) => `${req.protocol}://${req.get('host')}/uploads/profiles/${filename}`;

exports.getProfile = async (req, res, next) => {
    const client = await pool.connect();

    try {
        const profile = await getProfileWithRoleData(client, req.user.id);

        if (!profile) {
            return ApiResponse.error(res, 'Profile not found', 404);
        }

        return ApiResponse.success(res, 'Profile retrieved', { profile });
    } catch (err) {
        return next(err);
    } finally {
        client.release();
    }
};

exports.updateProfile = async (req, res, next) => {
    const client = await pool.connect();

    try {
        const userId = req.user.id;
        const { fullName, phone, address, roleFields } = req.body;
        const hasBasicField =
            typeof fullName !== 'undefined' ||
            typeof phone !== 'undefined' ||
            typeof address !== 'undefined';

        if (!hasBasicField && !roleFields) {
            return ApiResponse.error(res, 'At least one field is required', 400);
        }

        await client.query('BEGIN');

        const fields = [];
        const values = [];
        let paramIndex = 1;

        if (typeof fullName !== 'undefined') {
            fields.push(`full_name = $${paramIndex++}`);
            values.push(fullName);
        }

        if (typeof phone !== 'undefined') {
            fields.push(`phone = $${paramIndex++}`);
            values.push(phone);
        }

        if (typeof address !== 'undefined') {
            fields.push(`address = $${paramIndex++}`);
            values.push(address);
        }

        if (fields.length > 0) {
            fields.push('updated_at = NOW()');
            values.push(userId);
            const query = `UPDATE profiles SET ${fields.join(', ')} WHERE user_id = $${paramIndex}`;
            await client.query(query, values);
        }

        const roleResult = await client.query(
            'SELECT r.name FROM roles r JOIN profiles p ON r.id = p.role_id WHERE p.user_id = $1',
            [userId]
        );
        const roleName = (roleResult.rows[0]?.name || '').toLowerCase();

        if (roleFields) {
            if (roleName === 'corporate') {
                const {
                    companyName,
                    contactPerson,
                    contactPhone,
                    companyEmail,
                    gstNumber,
                    officeAddress,
                } = roleFields;

                await client.query(
                    `INSERT INTO corporates (user_id, company_name, contact_person, contact_phone, company_email, gst_number, address)
                     VALUES ($1, $2, $3, $4, $5, $6, $7)
                     ON CONFLICT (user_id) DO UPDATE SET
                     company_name = EXCLUDED.company_name,
                     contact_person = EXCLUDED.contact_person,
                     contact_phone = EXCLUDED.contact_phone,
                     company_email = EXCLUDED.company_email,
                     gst_number = EXCLUDED.gst_number,
                     address = EXCLUDED.address`,
                    [userId, companyName, contactPerson, contactPhone, companyEmail, gstNumber, officeAddress]
                );
            } else if (roleName === 'govt_sector') {
                const {
                    departmentName,
                    officerName,
                    contactNumber,
                    zone,
                    officeLocation,
                } = roleFields;

                await client.query(
                    `INSERT INTO government_sectors (user_id, department_name, officer_name, contact_number, zone, address)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     ON CONFLICT (user_id) DO UPDATE SET
                     department_name = EXCLUDED.department_name,
                     officer_name = EXCLUDED.officer_name,
                     contact_number = EXCLUDED.contact_number,
                     zone = EXCLUDED.zone,
                     address = EXCLUDED.address`,
                    [userId, departmentName, officerName, contactNumber, zone, officeLocation]
                );
            } else if (roleName === 'gated_community') {
                const {
                    communityName,
                    managerName,
                    managerPhone,
                    totalUnits,
                    areaAddress,
                } = roleFields;

                await client.query(
                    `INSERT INTO gated_communities (user_id, community_name, manager_name, manager_phone, total_units, address)
                     VALUES ($1, $2, $3, $4, $5, $6)
                     ON CONFLICT (user_id) DO UPDATE SET
                     community_name = EXCLUDED.community_name,
                     manager_name = EXCLUDED.manager_name,
                     manager_phone = EXCLUDED.manager_phone,
                     total_units = EXCLUDED.total_units,
                     address = EXCLUDED.address`,
                    [userId, communityName, managerName, managerPhone, totalUnits, areaAddress]
                );
            }
        }

        await client.query('COMMIT');

        const profile = await getProfileWithRoleData(client, userId);
        return ApiResponse.success(res, 'Profile updated successfully', { profile });
    } catch (err) {
        await client.query('ROLLBACK');
        return next(err);
    } finally {
        client.release();
    }
};

exports.uploadProfilePhoto = async (req, res, next) => {
    const client = await pool.connect();

    try {
        if (!req.file) {
            return ApiResponse.error(res, 'Profile image is required', 400);
        }

        const currentProfile = await client.query(
            'SELECT profile_image_url FROM profiles WHERE user_id = $1',
            [req.user.id]
        );

        if (currentProfile.rows.length === 0) {
            return ApiResponse.error(res, 'Profile not found', 404);
        }

        const nextImageUrl = buildFileUrl(req, req.file.filename);

        await client.query(
            'UPDATE profiles SET profile_image_url = $1, updated_at = NOW() WHERE user_id = $2',
            [nextImageUrl, req.user.id]
        );

        removeLocalProfileImage(currentProfile.rows[0].profile_image_url);

        const profile = await getProfileWithRoleData(client, req.user.id);
        return ApiResponse.success(res, 'Profile photo updated successfully', { profile });
    } catch (err) {
        if (req.file?.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
        return next(err);
    } finally {
        client.release();
    }
};

exports.removeProfilePhoto = async (req, res, next) => {
    const client = await pool.connect();

    try {
        const profileResult = await client.query(
            'SELECT profile_image_url FROM profiles WHERE user_id = $1',
            [req.user.id]
        );

        if (profileResult.rows.length === 0) {
            return ApiResponse.error(res, 'Profile not found', 404);
        }

        const currentImageUrl = profileResult.rows[0].profile_image_url;

        await client.query(
            'UPDATE profiles SET profile_image_url = NULL, updated_at = NOW() WHERE user_id = $1',
            [req.user.id]
        );

        removeLocalProfileImage(currentImageUrl);

        const profile = await getProfileWithRoleData(client, req.user.id);
        return ApiResponse.success(res, 'Profile photo removed successfully', { profile });
    } catch (err) {
        return next(err);
    } finally {
        client.release();
    }
};
