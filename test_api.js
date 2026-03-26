// Quick test script for the backend API
const http = require('http');

function testApi(path, method, body) {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: `/api${path}`,
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                console.log(`\n✅ ${method} ${path}`);
                console.log(`Status: ${res.statusCode}`);
                console.log('Response:', JSON.parse(data));
                resolve();
            });
        });

        req.on('error', reject);
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    try {
        // Test 1: Health check
        await testApi('/health', 'GET', null);

        // Test 2: Register
        await testApi('/auth/register', 'POST', {
            email: 'testuser@test.com',
            password: 'Test@1234',
            fullName: 'Test User',
            phone: '9876543210',
            role: 'customer'
        });

        // Test 3: Login
        await testApi('/auth/login', 'POST', {
            email: 'testuser@test.com',
            password: 'Test@1234'
        });
    } catch (err) {
        console.error('❌ Test error:', err.message);
    }
}

runTests();
