require('dotenv').config({ path: '../.env' });
const app = require('./app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`\n🩸 BloodSOS API Server running on port ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Client URL:  ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
  console.log(`   API Base:    http://localhost:${PORT}/api\n`);
});
