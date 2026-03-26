async function testLogin2() {
  try {
    const res = await fetch('http://localhost:8081/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@scrapmgmt.com', password: 'admin123' })
    });
    const data = await res.json();
    console.log('Login Res:', JSON.stringify(data, null, 2));

    if (data.data && data.data.token) {
        const fetchCategories = await fetch('http://localhost:8081/api/admin/scrap-categories', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${data.data.token}` }
        });
        console.log('Categories Res (status):', fetchCategories.status);
        console.log('Categories Res (body):', await fetchCategories.text());
    }
  } catch (err) {
    console.error(err);
  }
}
testLogin2();
