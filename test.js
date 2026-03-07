const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', {
      name: "Test User",
      email: "test8@demo.com",
      password: "password123",
      role: "student",
      department: "CS",
      enrollmentNumber: "123",
      phone: "1234567890"
    });
    console.log("Success:", res.data);
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
  }
}

test();
