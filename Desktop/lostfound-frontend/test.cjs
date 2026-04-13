const axios = require('axios');

async function test() {
  const api = axios.create({ baseURL: 'http://localhost:8091' });
  
  // 1. Register a user
  try {
    await api.post('/auth/register', {
      name: 'Test', email: 'test1@test.com', password: 'pass', branch: 'CS', year: 2024, mobileNo: '123'
    });
  } catch (e) {
    if(e.response && e.response.status !== 500) console.log("Register failed but continuing");
  }

  // 2. Login
  const res = await api.post('/auth/login', { email: 'test1@test.com', password: 'pass' });
  const token = res.data.token;
  console.log("Token:", token);

  // 3. Post an item
  const postRes = await api.post('/items', {
    itemName: 'Lost Wallet',
    itemLocation: 'Cafeteria',
    status: false
  }, { headers: { Authorization: `Bearer ${token}` } });
  
  console.log("Posted Item:", postRes.data);

  // 4. Get items
  const getRes = await api.get('/items/', { headers: { Authorization: `Bearer ${token}` } });
  console.log("All Items:", getRes.data);
}

test().catch(console.error);
