# MapVault Quick Reference

## 🚀 **Application URL**: https://jenright.dev/mapvault

## ⚡ Quick Commands

### Deploy New Changes
```bash
cd /var/www/MapVault
./deploy.sh
```

### Check Status
```bash
pm2 status
sudo systemctl status nginx
```

### View Logs
```bash
pm2 logs mapvault
sudo tail -f /var/log/nginx/error.log
```

### Restart Application
```bash
pm2 restart mapvault
sudo systemctl reload nginx
```

### Backup Database
```bash
cp prisma/dev.db backups/backup-$(date +%Y%m%d-%H%M%S).db
```

## 🛠️ Emergency Commands

### If Site is Down
```bash
pm2 restart mapvault
sudo systemctl reload nginx
pm2 logs mapvault --err
```

### If SSL Issues
```bash
sudo certbot renew
sudo systemctl reload nginx
```

### Complete Reset (Last Resort)
```bash
pm2 stop mapvault
git pull origin main
npm install
npm run build
pm2 restart mapvault
```

## 📁 Important Locations
- **App**: `/var/www/MapVault/`
- **Database**: `/var/www/MapVault/prisma/dev.db`
- **Nginx Config**: `/etc/nginx/sites-available/jenright.dev`
- **SSL Certificates**: `/etc/letsencrypt/live/jenright.dev/`
- **Environment**: `/var/www/MapVault/.env.local`

## 📞 Workflow
1. **Develop locally** → Test with `npm run dev`
2. **Push to GitHub** → `git push origin main`
3. **Deploy to server** → SSH in and run `./deploy.sh`
4. **Check live site** → https://jenright.dev/mapvault