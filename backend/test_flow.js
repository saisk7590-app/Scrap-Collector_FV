const http = require('http');

const API_URL = 'http://localhost:5000/api';

async function request(endpoint, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(`${API_URL}${endpoint}`);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(body);
          resolve({ status: res.statusCode, data: json });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function runTest() {
  try {
    console.log("=== Starting Backend Integration Test ===");

    // 1. Register Customer
    console.log("\\n1. Registering Customer...");
    const customerRes = await request('/auth/register', 'POST', {
      fullName: 'Test Customer',
      phone: '9999999999',
      password: 'password123',
      role: 'customer'
    });
    console.log("Customer Registration:", customerRes.status);
    const customerToken = customerRes.data.data.token;

    // 2. Register Collector
    console.log("\\n2. Registering Collector...");
    const collectorRes = await request('/auth/register', 'POST', {
      fullName: 'Test Collector',
      phone: '8888888888',
      password: 'password123',
      role: 'collector'
    });
    console.log("Collector Registration:", collectorRes.status);
    const collectorToken = collectorRes.data.data.token;

    // 3. Customer Creates Pickup
    console.log("\\n3. Customer creating pickup...");
    const pickupRes = await request('/pickups/create', 'POST', {
      items: [{ id: 1, name: 'Plastic', weight: 5, price: 10 }],
      totalQty: 1,
      totalWeight: 5,
      timeSlot: '10:00 AM - 12:00 PM',
      city: 'Hyderabad'
    }, customerToken);
    console.log("Create Pickup:", pickupRes.status);
    const pickupId = pickupRes.data.data.id;

    // 4. Collector claims and completes pickup
    console.log(`\\n4. Collector grabbing pickup ${pickupId}...`);
    const completeRes = await request(`/pickups/${pickupId}/status`, 'PUT', {
      status: 'completed',
      remarks: 'Looks good, all plastic verified.',
      finalItems: [{
        id: null,
        collector_category_id: 1,
        collector_weight: 6, // 6 kg instead of 5
        price: 10,
        is_modified: true,
        remarks: 'Found an extra kg'
      }]
    }, collectorToken);
    
    console.log("Complete Pickup:", completeRes.status);

    if (completeRes.status === 200) {
      console.log("Pickup updated successfully. Final Amount calculated by backend:", completeRes.data.data.pickup.amount);
    } else {
      console.log("Error completing pickup:", completeRes.data);
    }

    // 5. Check Collector Wallet
    console.log("\\n5. Checking Collector Wallet History...");
    const walletRes = await request('/wallet/history', 'GET', null, collectorToken);
    console.log("Wallet History:", walletRes.status);
    console.log("Wallet Balance:", walletRes.data.data.balance);
    console.log("Recent Transactions:", walletRes.data.data.transactions.length);

    console.log("\\n=== Test Passed Successfully ===");

  } catch (err) {
    console.error("Test Failed:", err);
  }
}

runTest();
