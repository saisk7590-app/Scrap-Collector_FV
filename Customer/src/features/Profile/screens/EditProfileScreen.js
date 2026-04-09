import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Camera, Image as ImageIcon } from "lucide-react-native";
import Toast from "react-native-toast-message";

import Header from "@components/Header";
import ProfileAvatar from "@components/ProfileAvatar";
import { useAppTheme } from "@context/ThemeContext";
import { apiRequest, mergeStoredUser, uploadMultipart } from "@lib/api";

const BASIC_FIELDS = [
  { key: "fullName", label: "Full Name", placeholder: "Enter full name" },
  {
    key: "phone",
    label: "Phone Number",
    placeholder: "Enter phone number",
    keyboardType: "phone-pad",
  },
];

const ROLE_FIELDS = {
  corporate: [
    { key: "companyName", label: "Company Name", placeholder: "Enter company name" },
    { key: "contactPerson", label: "Contact Person", placeholder: "Enter contact person" },
    { key: "contactPhone", label: "Contact Number", placeholder: "Enter contact number", keyboardType: "phone-pad" },
    { key: "companyEmail", label: "Company Email", placeholder: "Enter company email", keyboardType: "email-address" },
    { key: "gstNumber", label: "GST Number", placeholder: "Enter GST number" },
    { key: "officeAddress", label: "Address", placeholder: "Enter office address", multiline: true },
  ],
  govt_sector: [
    { key: "departmentName", label: "Department Name", placeholder: "Enter department name" },
    { key: "officerName", label: "Officer Name", placeholder: "Enter officer name" },
    { key: "contactNumber", label: "Contact Number", placeholder: "Enter contact number", keyboardType: "phone-pad" },
    { key: "zone", label: "Zone", placeholder: "Enter zone" },
    { key: "officeLocation", label: "Address", placeholder: "Enter office address", multiline: true },
  ],
  gated_community: [
    { key: "communityName", label: "Community Name", placeholder: "Enter community name" },
    { key: "managerName", label: "Manager Name", placeholder: "Enter manager name" },
    { key: "managerPhone", label: "Manager Phone", placeholder: "Enter manager phone", keyboardType: "phone-pad" },
    { key: "totalUnits", label: "Total Units", placeholder: "Enter total units", keyboardType: "number-pad" },
    { key: "areaAddress", label: "Address", placeholder: "Enter area address", multiline: true },
  ],
};

const emptyForm = {
  fullName: "",
  phone: "",
  companyName: "",
  contactPerson: "",
  contactPhone: "",
  companyEmail: "",
  gstNumber: "",
  officeAddress: "",
  departmentName: "",
  officerName: "",
  contactNumber: "",
  zone: "",
  officeLocation: "",
  communityName: "",
  managerName: "",
  managerPhone: "",
  totalUnits: "",
  areaAddress: "",
};

const normalizePhone = (value) => value.replace(/[^\d+]/g, "").trim();

const buildSnapshot = (form, role, imageUri) => ({
  role,
  imageUri: imageUri || "",
  ...Object.fromEntries(
    Object.entries(form).map(([key, value]) => [key, typeof value === "string" ? value.trim() : value || ""])
  ),
});

const inferMimeType = (uri) => {
  const normalized = (uri || "").toLowerCase();
  if (normalized.endsWith(".png")) return "image/png";
  if (normalized.endsWith(".webp")) return "image/webp";
  return "image/jpeg";
};

async function createUploadFormData(asset) {
  const formData = new FormData();
  const fileName = asset.fileName || `profile-${Date.now()}.jpg`;
  const mimeType = asset.mimeType || inferMimeType(asset.uri);

  if (Platform.OS === "web") {
    const response = await fetch(asset.uri);
    const blob = await response.blob();
    formData.append("profileImage", blob, fileName);
    return formData;
  }

  formData.append("profileImage", {
    uri: asset.uri,
    name: fileName,
    type: mimeType,
  });

  return formData;
}

export default function EditProfileScreen({ navigation }) {
  const { colors } = useAppTheme();
  const styles = useMemo(() => getStyles(colors), [colors]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [role, setRole] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [profileImageUri, setProfileImageUri] = useState("");
  const [initialSnapshot, setInitialSnapshot] = useState(null);
  const [imageRefreshKey, setImageRefreshKey] = useState(Date.now());

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await apiRequest("/profile");
      if (data.profile) {
        const nextForm = {
          ...emptyForm,
          fullName: data.profile.fullName || "",
          phone: data.profile.phone || "",
          companyName: data.profile.companyName || "",
          contactPerson: data.profile.contactPerson || "",
          contactPhone: data.profile.contactPhone || "",
          companyEmail: data.profile.companyEmail || "",
          gstNumber: data.profile.gstNumber || "",
          officeAddress: data.profile.officeAddress || "",
          departmentName: data.profile.departmentName || "",
          officerName: data.profile.officerName || "",
          contactNumber: data.profile.contactNumber || "",
          zone: data.profile.zone || "",
          officeLocation: data.profile.officeLocation || "",
          communityName: data.profile.communityName || "",
          managerName: data.profile.managerName || "",
          managerPhone: data.profile.managerPhone || "",
          totalUnits: data.profile.totalUnits != null ? String(data.profile.totalUnits) : "",
          areaAddress: data.profile.areaAddress || "",
        };

        setForm(nextForm);
        setRole((data.profile.role || "").toLowerCase());
        setProfileImageUri(data.profile.profileImageUrl || "");
        setInitialSnapshot(buildSnapshot(nextForm, (data.profile.role || "").toLowerCase(), data.profile.profileImageUrl || ""));
        setImageRefreshKey(Date.now());
      }
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const roleFields = ROLE_FIELDS[role] || [];
  const currentSnapshot = useMemo(
    () => buildSnapshot(form, role, profileImageUri),
    [form, role, profileImageUri]
  );
  const hasChanges = initialSnapshot ? JSON.stringify(initialSnapshot) !== JSON.stringify(currentSnapshot) : false;

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const persistProfile = async (profile) => {
    if (!profile) return;
    await mergeStoredUser({
      fullName: profile.fullName,
      phone: profile.phone,
      address: profile.address,
      role: profile.role,
      profileImageUrl: profile.profileImageUrl,
    });
  };

  const handlePhotoUpload = async (asset) => {
    const previousUri = profileImageUri;
    setProfileImageUri(asset.uri);
    setUploadingImage(true);

    try {
      const formData = await createUploadFormData(asset);
      const response = await uploadMultipart("/profile/photo", formData);
      const uploadedProfile = response.profile;
      const nextImageUrl = uploadedProfile?.profileImageUrl || asset.uri;

      setProfileImageUri(nextImageUrl);
      setInitialSnapshot((prev) => prev ? { ...prev, imageUri: nextImageUrl } : prev);
      setImageRefreshKey(Date.now());
      await persistProfile(uploadedProfile);
      await fetchProfile();

      Toast.show({
        type: "success",
        text1: "Photo updated",
        text2: "Your profile photo was uploaded successfully.",
      });
    } catch (err) {
      setProfileImageUri(previousUri);
      Alert.alert("Upload failed", err.message || "Failed to upload profile photo");
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePhotoRemoval = async () => {
    const previousUri = profileImageUri;
    setProfileImageUri("");
    setUploadingImage(true);

    try {
      const response = await apiRequest("/profile/photo", "DELETE");
      setInitialSnapshot((prev) => prev ? { ...prev, imageUri: "" } : prev);
      setImageRefreshKey(Date.now());
      await persistProfile(response.profile);
      await fetchProfile();
      Toast.show({
        type: "success",
        text1: "Photo removed",
        text2: "Your profile photo was removed successfully.",
      });
    } catch (err) {
      setProfileImageUri(previousUri);
      Alert.alert("Error", err.message || "Failed to remove profile photo");
    } finally {
      setUploadingImage(false);
    }
  };

  const launchPicker = async (type) => {
    try {
      if (type === "camera") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permission required", "Camera permission is needed to take a profile photo.");
          return;
        }
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permission required", "Gallery permission is needed to choose a profile photo.");
          return;
        }
      }

      const result =
        type === "camera"
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: [ImagePicker.MediaType.images],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: [ImagePicker.MediaType.images],
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

      if (!result.canceled && result.assets?.[0]) {
        await handlePhotoUpload(result.assets[0]);
      }
    } catch (err) {
      Alert.alert("Error", err.message || "Unable to open image picker");
    }
  };

  const showPhotoOptions = () => {
    const options = [
      { text: "Take Photo", onPress: () => launchPicker("camera") },
      { text: "Choose from Gallery", onPress: () => launchPicker("gallery") },
    ];

    if (profileImageUri) {
      options.push({ text: "Remove Photo", style: "destructive", onPress: handlePhotoRemoval });
    }

    options.push({ text: "Cancel", style: "cancel" });

    Alert.alert("Change Profile Photo", "Choose how you want to update your photo.", options);
  };

  const validate = () => {
    if (!form.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!normalizePhone(form.phone)) {
      return "Please enter your phone number.";
    }

    if (normalizePhone(form.phone).length < 10) {
      return "Please enter a valid phone number.";
    }

    for (const field of roleFields) {
      const value = (form[field.key] || "").trim();
      if (!value) {
        return `Please enter ${field.label.toLowerCase()}.`;
      }
    }

    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      Alert.alert("Validation", validationError);
      return;
    }

    setSaving(true);
    try {
      const payload = {
        fullName: form.fullName.trim(),
        phone: normalizePhone(form.phone),
      };

      if (role === "corporate") {
        payload.roleFields = {
          companyName: form.companyName.trim(),
          contactPerson: form.contactPerson.trim(),
          contactPhone: normalizePhone(form.contactPhone),
          companyEmail: form.companyEmail.trim(),
          gstNumber: form.gstNumber.trim(),
          officeAddress: form.officeAddress.trim(),
        };
      } else if (role === "govt_sector") {
        payload.roleFields = {
          departmentName: form.departmentName.trim(),
          officerName: form.officerName.trim(),
          contactNumber: normalizePhone(form.contactNumber),
          zone: form.zone.trim(),
          officeLocation: form.officeLocation.trim(),
        };
      } else if (role === "gated_community") {
        payload.roleFields = {
          communityName: form.communityName.trim(),
          managerName: form.managerName.trim(),
          managerPhone: normalizePhone(form.managerPhone),
          totalUnits: Number(form.totalUnits) || 0,
          areaAddress: form.areaAddress.trim(),
        };
      }

      const response = await apiRequest("/profile", "PUT", payload);
      const updatedProfile = response.profile;

      await persistProfile(updatedProfile);

      const nextSnapshot = buildSnapshot(
        {
          ...form,
          fullName: updatedProfile?.fullName || form.fullName,
          phone: updatedProfile?.phone || form.phone,
        },
        role,
        updatedProfile?.profileImageUrl || profileImageUri
      );

      setInitialSnapshot(nextSnapshot);

      Toast.show({
        type: "success",
        text1: "Profile saved",
        text2: "Your profile changes have been saved.",
      });

      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.centered, styles.screen]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <Header title="Edit Profile" showBack />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.photoCard}>
            <View style={styles.avatarWrap}>
              <ProfileAvatar
                uri={profileImageUri ? `${profileImageUri}${profileImageUri.includes("?") ? "&" : "?"}t=${imageRefreshKey}` : ""}
                name={form.fullName}
                size={108}
                backgroundColor={colors.primary}
                borderColor={colors.surface}
              />
              <TouchableOpacity
                style={styles.cameraBadge}
                onPress={showPhotoOptions}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Camera size={18} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>

            <Text style={styles.photoTitle}>Profile Photo</Text>
            <Text style={styles.photoText}>Add a clear photo so your account feels complete and trusted.</Text>

            <TouchableOpacity
              style={styles.photoButton}
              onPress={showPhotoOptions}
              disabled={uploadingImage}
            >
              <ImageIcon size={16} color={colors.primary} />
              <Text style={styles.photoButtonText}>
                {uploadingImage ? "Uploading..." : "Change Profile Photo"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Information</Text>
            <View style={styles.card}>
              {BASIC_FIELDS.map((field) => (
                <FieldInput
                  key={field.key}
                  styles={styles}
                  label={field.label}
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  keyboardType={field.keyboardType}
                  onChangeText={(value) => updateField(field.key, value)}
                />
              ))}
            </View>
          </View>

          {roleFields.length ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Role Information</Text>
              <View style={styles.card}>
                {roleFields.map((field) => (
                  <FieldInput
                    key={field.key}
                    styles={styles}
                    label={field.label}
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    keyboardType={field.keyboardType}
                    multiline={field.multiline}
                    onChangeText={(value) => updateField(field.key, value)}
                  />
                ))}
              </View>
            </View>
          ) : null}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.saveButton,
              (!hasChanges || saving || uploadingImage) && styles.saveButtonDisabled,
            ]}
            onPress={handleSave}
            disabled={!hasChanges || saving || uploadingImage}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.saveButtonText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function FieldInput({
  styles,
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  multiline,
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        placeholder={placeholder}
        placeholderTextColor={styles.placeholder.color}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}

const getStyles = (colors) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    centered: {
      justifyContent: "center",
      alignItems: "center",
    },
    content: {
      padding: 16,
      paddingBottom: 120,
    },
    photoCard: {
      alignItems: "center",
      backgroundColor: colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 20,
      paddingVertical: 24,
    },
    avatarWrap: {
      position: "relative",
      marginBottom: 16,
    },
    cameraBadge: {
      position: "absolute",
      right: 2,
      bottom: 2,
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 2,
      borderColor: colors.surface,
    },
    photoTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: colors.text,
    },
    photoText: {
      fontSize: 13,
      color: colors.textMuted,
      textAlign: "center",
      marginTop: 6,
      lineHeight: 20,
    },
    photoButton: {
      marginTop: 16,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 999,
      backgroundColor: colors.primarySoft,
    },
    photoButtonText: {
      color: colors.primary,
      fontWeight: "700",
      fontSize: 14,
    },
    section: {
      marginTop: 18,
    },
    sectionTitle: {
      fontSize: 13,
      fontWeight: "700",
      color: colors.textMuted,
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: 0.8,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
    },
    fieldWrap: {
      marginBottom: 16,
    },
    fieldLabel: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 8,
      fontWeight: "600",
    },
    input: {
      minHeight: 52,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 16,
      backgroundColor: colors.background,
      color: colors.text,
      paddingHorizontal: 14,
      fontSize: 15,
    },
    inputMultiline: {
      minHeight: 96,
      paddingTop: 14,
    },
    placeholder: {
      color: colors.textSoft,
    },
    footer: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      paddingHorizontal: 16,
      paddingTop: 12,
      paddingBottom: 16,
      backgroundColor: colors.surface,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    saveButton: {
      height: 54,
      borderRadius: 18,
      backgroundColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    saveButtonDisabled: {
      opacity: 0.45,
    },
    saveButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "700",
    },
  });
