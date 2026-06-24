const axios = require('axios');

const test = async () => {
  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'student@example.com',
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('Got token:', token);

    const putRes = await axios.put('http://localhost:5000/api/dashboard/settings', {
      name: 'John Doe Updated',
      bio: 'New bio',
      avatar: 'http://some-url.com',
      preferences: { email: true, sms: true, publicProfile: true }
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('PUT success:', putRes.data);
  } catch (err) {
    console.error('Error:', err.response ? err.response.data : err.message);
  }
};

test();
