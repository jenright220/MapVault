# MapVault Deployment & Maintenance Guide

## 🚀 Deployment Overview

Your MapVault application is deployed on DigitalOcean with the following stack:
- **Domain**: https://jenright.dev/mapvault
- **Server**: Ubuntu 24.04 LTS
- **Frontend**: Next.js 15.4.6 with TypeScript
- **Database**: SQLite with Prisma ORM
- **Process Manager**: PM2
- **Web Server**: Nginx with SSL (Let's Encrypt)
- **Auto-deployment**: Git-based deployment script

## 🔧 Server Management

### Starting/Stopping the Application

```bash
# Check application status
pm2 status

# Start the application
pm2 start mapvault

# Stop the application
pm2 stop mapvault

# Restart the application
pm2 restart mapvault

# View real-time logs
pm2 logs mapvault

# View last 50 log lines
pm2 logs mapvault --lines 50

# Monitor CPU/Memory usage
pm2 monit
```

### Nginx Management

```bash
# Check Nginx status
sudo systemctl status nginx

# Start Nginx
sudo systemctl start nginx

# Stop Nginx
sudo systemctl stop nginx

# Restart Nginx
sudo systemctl restart nginx

# Reload Nginx configuration (without downtime)
sudo systemctl reload nginx

# Test Nginx configuration
sudo nginx -t
```

## 📦 Deployment Workflow

### 1. Development & Local Testing

```bash
# On your local machine
cd /path/to/MapVault

# Make your changes
# ... code changes ...

# Test locally
npm run dev

# Build to ensure no errors
npm run build
```

### 2. Push Changes to GitHub

```bash
# Commit and push your changes
git add .
git commit -m "Your commit message"
git push origin main
```

### 3. Deploy to Production

```bash
# SSH into your server
ssh root@jenright-server

# Navigate to project directory
cd /var/www/MapVault

# Run the deployment script
./deploy.sh
```

### Manual Deployment Steps (if script fails)

```bash
# Pull latest changes
git pull origin main

# Install/update dependencies
npm install

# Run database migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Build the application
npm run build

# Restart PM2
pm2 restart mapvault

# Check status
pm2 status
```

## 🗄️ Database Management

### Database Operations

```bash
# Check database status
ls -la prisma/dev.db

# Run new migrations
npx prisma migrate dev --name describe_your_change

# Apply migrations in production
npx prisma migrate deploy

# View database in browser (development only)
npx prisma studio

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Seed database with initial data
npx prisma db seed
```

### Database Backup

```bash
# Create backup
cp prisma/dev.db backups/dev-$(date +%Y%m%d-%H%M%S).db

# Restore from backup
cp backups/dev-20250808-120000.db prisma/dev.db
pm2 restart mapvault
```

## 🔒 SSL Certificate Management

### Certificate Status

```bash
# Check certificate expiration
sudo certbot certificates

# Check certificate details
openssl x509 -in /etc/letsencrypt/live/jenright.dev/fullchain.pem -text -noout | grep "Not After"
```

### Manual Certificate Renewal

```bash
# Renew certificate (usually automatic)
sudo certbot renew

# Force renewal
sudo certbot renew --force-renewal

# Test renewal process
sudo certbot renew --dry-run
```

## 📊 Monitoring & Logs

### Application Logs

```bash
# Real-time application logs
pm2 logs mapvault --follow

# Application errors only
pm2 logs mapvault --err

# Clear PM2 logs
pm2 flush mapvault
```

### System Monitoring

```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check running processes
ps aux | grep node

# Check port 3000 usage
sudo netstat -tlnp | grep :3000
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log

# Specific domain logs (if configured)
sudo tail -f /var/log/nginx/jenright.dev.access.log
```

## 🛠️ Troubleshooting

### Common Issues

#### App Not Responding
```bash
# Check if PM2 is running
pm2 status

# Restart if stopped
pm2 restart mapvault

# Check for port conflicts
sudo netstat -tlnp | grep :3000
```

#### 502 Bad Gateway
```bash
# Usually means app is down
pm2 restart mapvault

# Check PM2 logs for errors
pm2 logs mapvault --err
```

#### SSL Certificate Issues
```bash
# Check certificate status
sudo certbot certificates

# Renew if needed
sudo certbot renew --nginx
```

#### Database Connection Issues
```bash
# Check database file exists
ls -la prisma/dev.db

# Check file permissions
chmod 664 prisma/dev.db

# Regenerate Prisma client
npx prisma generate
```

### Emergency Procedures

#### Complete Application Reset
```bash
# Stop application
pm2 stop mapvault

# Backup database
cp prisma/dev.db backups/emergency-backup-$(date +%Y%m%d-%H%M%S).db

# Pull latest code
git pull origin main

# Fresh install
rm -rf node_modules
npm install

# Rebuild
npm run build

# Restart
pm2 restart mapvault
```

#### Rollback Deployment
```bash
# View git history
git log --oneline

# Rollback to previous commit
git reset --hard <previous-commit-hash>

# Rebuild and restart
npm run build
pm2 restart mapvault
```

## 📁 Important File Locations

```
/var/www/MapVault/                 # Application root
├── .env.local                     # Environment variables
├── ecosystem.config.js            # PM2 configuration
├── deploy.sh                      # Deployment script
├── prisma/dev.db                  # SQLite database
└── backups/                       # Database backups (create this)

/etc/nginx/sites-available/jenright.dev    # Nginx configuration
/etc/letsencrypt/live/jenright.dev/        # SSL certificates
/var/log/nginx/                            # Nginx logs
```

## 🔧 Configuration Files

### Environment Variables (.env.local)
```bash
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="[your-secret-key]"
NEXTAUTH_URL="https://jenright.dev/mapvault"
NODE_ENV="production"
```

### PM2 Configuration (ecosystem.config.js)
```javascript
module.exports = {
  apps: [{
    name: 'mapvault',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/MapVault',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
```

## 📋 Maintenance Checklist

### Weekly
- [ ] Check application status: `pm2 status`
- [ ] Review error logs: `pm2 logs mapvault --err`
- [ ] Check disk space: `df -h`
- [ ] Backup database: `cp prisma/dev.db backups/weekly-$(date +%Y%m%d).db`

### Monthly
- [ ] Update system packages: `sudo apt update && sudo apt upgrade`
- [ ] Check SSL certificate expiration: `sudo certbot certificates`
- [ ] Clean old PM2 logs: `pm2 flush mapvault`
- [ ] Remove old database backups (keep last 3 months)

### As Needed
- [ ] Deploy new features using `./deploy.sh`
- [ ] Monitor application performance
- [ ] Update Node.js/npm if required
- [ ] Review and optimize database queries

## 🆘 Emergency Contacts & Resources

### Quick Commands Cheat Sheet
```bash
# Application status
pm2 status && sudo systemctl status nginx

# Restart everything
pm2 restart mapvault && sudo systemctl reload nginx

# View logs
pm2 logs mapvault && sudo tail -f /var/log/nginx/error.log

# Emergency stop
pm2 stop mapvault
```

### Useful Resources
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)

---

**Application URL**: https://jenright.dev/mapvault  
**Server**: jenright-server (137.184.151.220)  
**Last Updated**: August 8, 2025