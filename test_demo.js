

async function testDemo() {
  try {
    const res = await axios.post('http://localhost:3000/api/auth/demo');
    console.log('Success:', res.data);
  } catch (err) {
    console.error('Error Status:', err.response?.status);
    console.error('Error Data:', err.response?.data);
  }
}

testDemo();
