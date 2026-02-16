const fs = require('fs');
const path = require('path');

const directories = [
  'logs',
  'uploads',
  'uploads/receipts',
  'uploads/reports',
  'uploads/documents',
  'uploads/photos'
];

console.log('📁 Creating necessary directories...\n');

directories.forEach(dir => {
  const dirPath = path.join(__dirname, '..', dir);
  
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✅ Created: ${dir}`);
  } else {
    console.log(`ℹ️  Already exists: ${dir}`);
  }
});

console.log('\n✨ Directory setup complete!');






