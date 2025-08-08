#!/bin/bash

# MapVault Backup Script
# Run this script to create backups of your database and important files

echo "🔄 Starting MapVault backup..."

# Create backups directory if it doesn't exist
mkdir -p backups

# Create timestamp
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# Backup database
echo "📀 Backing up database..."
cp prisma/dev.db backups/db-backup-$TIMESTAMP.db

# Backup environment file
echo "⚙️  Backing up environment configuration..."
cp .env.local backups/env-backup-$TIMESTAMP.txt

# Backup PM2 configuration
echo "🔧 Backing up PM2 configuration..."
cp ecosystem.config.js backups/pm2-backup-$TIMESTAMP.js

# Backup Nginx configuration
echo "🌐 Backing up Nginx configuration..."
sudo cp /etc/nginx/sites-available/jenright.dev backups/nginx-backup-$TIMESTAMP.conf

# Create a combined backup archive
echo "📦 Creating archive..."
tar -czf backups/mapvault-full-backup-$TIMESTAMP.tar.gz \
    backups/db-backup-$TIMESTAMP.db \
    backups/env-backup-$TIMESTAMP.txt \
    backups/pm2-backup-$TIMESTAMP.js \
    backups/nginx-backup-$TIMESTAMP.conf

# Show backup size
BACKUP_SIZE=$(du -h backups/mapvault-full-backup-$TIMESTAMP.tar.gz | cut -f1)

echo "✅ Backup completed!"
echo "📁 Archive: backups/mapvault-full-backup-$TIMESTAMP.tar.gz"
echo "📏 Size: $BACKUP_SIZE"
echo ""

# Clean up old backups (keep last 10)
echo "🧹 Cleaning up old backups..."
cd backups
ls -t mapvault-full-backup-*.tar.gz | tail -n +11 | xargs -r rm
ls -t db-backup-*.db | tail -n +11 | xargs -r rm
ls -t env-backup-*.txt | tail -n +11 | xargs -r rm
ls -t pm2-backup-*.js | tail -n +11 | xargs -r rm
ls -t nginx-backup-*.conf | tail -n +11 | xargs -r rm
cd ..

echo "🎉 Backup process completed!"
echo ""
echo "To restore from backup:"
echo "  Database: cp backups/db-backup-$TIMESTAMP.db prisma/dev.db"
echo "  Environment: cp backups/env-backup-$TIMESTAMP.txt .env.local"
echo "  Then restart: pm2 restart mapvault"