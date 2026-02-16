# 🚀 Quick Start Guide

## Getting Started in 5 Minutes

### Step 1: Prerequisites Check
```bash
node --version    # Should be v14+
npm --version     # Should be v6+
mongod --version  # Should be v4.4+
```

### Step 2: Clone and Install
```bash
# Clone repository
git clone https://github.com/yourusername/school-mis.git
cd school-mis

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 3: Configure Environment
```bash
cd ../backend
cp .env.example .env
# Edit .env with your settings
nano .env
```

Minimum required settings:
```env
MONGODB_URI=mongodb://localhost:27017/school_mis
JWT_SECRET=your_secret_key_here
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### Step 4: Setup Database
```bash
# Create directories
node scripts/createDirectories.js

# Seed database
npm run seed
```

### Step 5: Run Application
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

### Step 6: Login
Open `http://localhost:3000` and login with:
- **Email:** admin@school.com
- **Password:** admin123

🎉 **You're ready!**

---

# 🌐 Deployment Guide

## Deploying to Production

### Option 1: Deploy to Heroku

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Backend Deployment

1. **Create Heroku app**
```bash
cd backend
heroku create school-mis-backend
```

2. **Add MongoDB Atlas**
```bash
heroku addons:create mongolab:sandbox
```

3. **Set environment variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_secret
heroku config:set EMAIL_USER=your_email
heroku config:set EMAIL_PASSWORD=your_password
heroku config:set CLOUDINARY_CLOUD_NAME=your_cloud_name
heroku config:set CLOUDINARY_API_KEY=your_api_key
heroku config:set CLOUDINARY_API_SECRET=your_api_secret
```

4. **Create Procfile**
```bash
echo "web: node server.js" > Procfile
```

5. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

6. **Seed database**
```bash
heroku run npm run seed
```

#### Frontend Deployment

1. **Update API URL**
```javascript
// frontend/src/services/api.js
const API_URL = process.env.REACT_APP_API_URL || 'https://your-backend.herokuapp.com/api';
```

2. **Build**
```bash
cd frontend
npm run build
```

3. **Deploy to Netlify/Vercel**
```bash
# Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=build

# Or Vercel
npm install -g vercel
vercel --prod
```

### Option 2: Deploy to DigitalOcean

#### 1. Create Droplet
- Choose Ubuntu 20.04
- Select plan (minimum 2GB RAM)
- Add SSH key

#### 2. Initial Server Setup
```bash
ssh root@your_server_ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
apt install -y nodejs

# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-5.0.list
apt update
apt install -y mongodb-org
systemctl start mongod
systemctl enable mongod

# Install PM2
npm install -g pm2

# Install Nginx
apt install -y nginx
```

#### 3. Clone and Setup Application
```bash
# Create application directory
mkdir -p /var/www/school-mis
cd /var/www/school-mis

# Clone repository
git clone https://github.com/yourusername/school-mis.git .

# Install backend dependencies
cd backend
npm install --production

# Create .env file
nano .env
# Add production environment variables

# Create directories
node scripts/createDirectories.js

# Seed database
npm run seed
```

#### 4. Configure PM2
```bash
# Start backend
pm2 start server.js --name school-mis-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd
```

#### 5. Configure Nginx
```bash
nano /etc/nginx/sites-available/school-mis
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your_domain.com;

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        root /var/www/school-mis/frontend/build;
        try_files $uri $uri/ /index.html;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/school-mis /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

#### 6. Setup SSL with Let's Encrypt
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d your_domain.com
```

#### 7. Build Frontend
```bash
cd /var/www/school-mis/frontend
npm install
npm run build
```

### Option 3: Deploy to AWS

#### Using AWS Elastic Beanstalk

1. **Install EB CLI**
```bash
pip install awsebcli
```

2. **Initialize EB**
```bash
cd backend
eb init -p node.js school-mis
```

3. **Create environment**
```bash
eb create school-mis-env
```

4. **Set environment variables**
```bash
eb setenv NODE_ENV=production JWT_SECRET=your_secret ...
```

5. **Deploy**
```bash
eb deploy
```

---

# 🔧 Environment Variables Reference

## Required Variables

```env
# Server
NODE_ENV=production              # Environment: development, production
PORT=5000                        # Server port

# Database
MONGODB_URI=mongodb://...        # MongoDB connection string

# Authentication
JWT_SECRET=your_secret_key       # JWT secret (min 32 characters)
JWT_EXPIRE=30d                   # Token expiration

# Email
EMAIL_HOST=smtp.gmail.com        # SMTP host
EMAIL_PORT=587                   # SMTP port
EMAIL_USER=your@email.com        # Email username
EMAIL_PASSWORD=your_password     # Email password

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=name       # Cloud name
CLOUDINARY_API_KEY=key           # API key
CLOUDINARY_API_SECRET=secret     # API secret

# Frontend
FRONTEND_URL=http://localhost:3000  # Frontend URL
```

## Optional Variables

```env
# Logging
LOG_LEVEL=info                   # Log level: error, warn, info, debug

# Rate Limiting
RATE_LIMIT_MAX=100              # Max requests per window
RATE_LIMIT_WINDOW=15            # Window in minutes

# File Upload
MAX_FILE_SIZE=5                 # Max file size in MB
```

---

# 🐛 Troubleshooting Guide

## Common Issues and Solutions

### Issue 1: MongoDB Connection Error

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB
sudo systemctl start mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log
```

### Issue 2: Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find process using port
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port in .env
PORT=5001
```

### Issue 3: JWT Token Invalid

**Error:** `JsonWebTokenError: invalid token`

**Solution:**
- Clear browser localStorage
- Check JWT_SECRET in .env matches between environments
- Generate new token by logging in again

### Issue 4: Email Not Sending

**Error:** `Error: Invalid login: 535-5.7.8 Username and Password not accepted`

**Solution:**
- Enable "Less secure app access" (Gmail)
- Use App Password instead of regular password
- Check EMAIL_HOST and EMAIL_PORT are correct

### Issue 5: Cloudinary Upload Failed

**Error:** `Error: Upload failed`

**Solution:**
- Verify Cloudinary credentials in .env
- Check file size (max 10MB)
- Ensure file type is allowed
- Check internet connection

### Issue 6: Database Seeding Fails

**Error:** `MongoServerError: E11000 duplicate key error`

**Solution:**
```bash
# Clean database first
npm run clean

# Then seed again
npm run seed
```

### Issue 7: CORS Error

**Error:** `Access-Control-Allow-Origin header is missing`

**Solution:**
```javascript
// backend/server.js
const cors = require('cors');
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Issue 8: Frontend Build Fails

**Error:** `FATAL ERROR: Ineffective mark-compacts near heap limit`

**Solution:**
```bash
# Increase Node memory
NODE_OPTIONS=--max_old_space_size=4096 npm run build
```

### Issue 9: PM2 Process Crashes

**Error:** Process keeps restarting

**Solution:**
```bash
# Check logs
pm2 logs school-mis-backend

# Check error logs
pm2 logs school-mis-backend --err

# Restart with fresh state
pm2 delete school-mis-backend
pm2 start server.js --name school-mis-backend
```

### Issue 10: File Upload Not Working

**Error:** `MulterError: File too large`

**Solution:**
```javascript
// backend/middlewares/upload.js
const upload = multer({
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});
```

---

# 📊 Performance Optimization

## Backend Optimization

### 1. Database Indexing
```javascript
// Add indexes to frequently queried fields
studentSchema.index({ admissionNumber: 1 });
studentSchema.index({ class: 1, section: 1 });
studentSchema.index({ academicYear: 1 });
```

### 2. Query Optimization
```javascript
// Use lean() for read-only queries
const students = await Student.find().lean();

// Select only needed fields
const students = await Student.find()
  .select('firstName lastName email');

// Use pagination
const students = await Student.find()
  .skip((page - 1) * limit)
  .limit(limit);
```

### 3. Caching
```javascript
// Install Redis
npm install redis

// Cache frequently accessed data
const redis = require('redis');
const client = redis.createClient();

// Get from cache or database
const getStudents = async () => {
  const cached = await client.get('students');
  if (cached) return JSON.parse(cached);
  
  const students = await Student.find();
  await client.setex('students', 3600, JSON.stringify(students));
  return students;
};
```

### 4. Compression
```javascript
// Already included in server.js
const compression = require('compression');
app.use(compression());
```

## Frontend Optimization

### 1. Code Splitting
```javascript
// Use React.lazy for route-based code splitting
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Students = React.lazy(() => import('./components/Students'));
```

### 2. Image Optimization
```javascript
// Use lazy loading for images
<img loading="lazy" src={imageUrl} alt="Student" />

// Use WebP format
// Optimize images before upload
```

### 3. Memoization
```javascript
// Use React.memo for expensive components
const StudentCard = React.memo(({ student }) => {
  return <div>{student.name}</div>;
});
```

---

# 🔒 Security Best Practices

## Production Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Validate all inputs
- [ ] Sanitize user data
- [ ] Use parameterized queries
- [ ] Enable CORS properly
- [ ] Keep dependencies updated
- [ ] Use helmet.js
- [ ] Implement CSP headers
- [ ] Enable MongoDB authentication
- [ ] Regular security audits
- [ ] Backup database regularly
- [ ] Monitor logs for suspicious activity

## Security Commands

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

---

# 📈 Monitoring and Logging

## Setup Monitoring

### Using PM2 Monitoring
```bash
# Install PM2 Plus
pm2 plus

# Monitor processes
pm2 monit

# View logs
pm2 logs

# Save logs to file
pm2 logs --json > logs.json
```

### Using Winston (Already Configured)
```javascript
// Logs are automatically saved to:
// - logs/combined.log (all logs)
// - logs/error.log (errors only)

// View logs
tail -f logs/combined.log
tail -f logs/error.log
```

---

# 🔄 Backup and Recovery

## Database Backup

### Manual Backup
```bash
# Backup entire database
mongodump --db school_mis --out /backup/$(date +%Y%m%d)

# Backup specific collection
mongodump --db school_mis --collection students --out /backup/students
```

### Restore Database
```bash
# Restore entire database
mongorestore --db school_mis /backup/20240101/school_mis

# Restore specific collection
mongorestore --db school_mis --collection students /backup/students/students.bson
```

### Automated Backup Script
```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backup/mongodb"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
mongodump --db school_mis --out "$BACKUP_DIR/$DATE"

# Compress
tar -czf "$BACKUP_DIR/$DATE.tar.gz" "$BACKUP_DIR/$DATE"
rm -rf "$BACKUP_DIR/$DATE"

# Keep only last 7 backups
ls -t "$BACKUP_DIR"/*.tar.gz | tail -n +8 | xargs rm -f

echo "Backup completed: $DATE"
```

### Schedule with Cron
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup.sh
```

---

# 📞 Support and Maintenance

## Getting Help

- **Documentation:** Check README.md
- **Issues:** GitHub Issues
- **Email:** support@schoolmis.com
- **Community:** Join Slack channel

## Regular Maintenance Tasks

### Daily
- Monitor error logs
- Check server status
- Review failed login attempts

### Weekly
- Database backup
- Security updates
- Performance review

### Monthly
- Dependency updates
- Security audit
- User feedback review
- Generate usage reports

---

**Need more help? Contact us at support@schoolmis.com**
