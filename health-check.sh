#!/bin/bash

# MapVault Health Check Script
# Run this script to check the health of your application

echo "🏥 MapVault Health Check"
echo "======================="
echo ""

# Check if script is run from correct directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the MapVault directory (/var/www/MapVault)"
    exit 1
fi

# Function to check service status
check_service() {
    local service=$1
    local name=$2
    
    if systemctl is-active --quiet $service; then
        echo "✅ $name is running"
        return 0
    else
        echo "❌ $name is not running"
        return 1
    fi
}

# Function to check PM2 process
check_pm2() {
    if pm2 describe mapvault > /dev/null 2>&1; then
        local status=$(pm2 describe mapvault | grep -o 'status.*online\|status.*stopped\|status.*errored' | head -1)
        if [[ $status == *"online"* ]]; then
            echo "✅ MapVault PM2 process is online"
            return 0
        else
            echo "❌ MapVault PM2 process is not online (status: $status)"
            return 1
        fi
    else
        echo "❌ MapVault PM2 process not found"
        return 1
    fi
}

# Function to check HTTP response
check_http() {
    local url=$1
    local expected_code=$2
    local name=$3
    
    local response=$(curl -s -o /dev/null -w "%{http_code}" "$url" 2>/dev/null)
    
    if [ "$response" = "$expected_code" ]; then
        echo "✅ $name responds correctly ($response)"
        return 0
    else
        echo "❌ $name response error (got: $response, expected: $expected_code)"
        return 1
    fi
}

# Function to check file exists
check_file() {
    local file=$1
    local name=$2
    
    if [ -f "$file" ]; then
        echo "✅ $name exists"
        return 0
    else
        echo "❌ $name not found"
        return 1
    fi
}

# Function to check SSL certificate
check_ssl() {
    local domain=$1
    
    local expiry=$(echo | openssl s_client -servername $domain -connect $domain:443 2>/dev/null | \
                   openssl x509 -noout -dates 2>/dev/null | \
                   grep notAfter | cut -d= -f2)
    
    if [ -n "$expiry" ]; then
        local expiry_epoch=$(date -d "$expiry" +%s 2>/dev/null)
        local current_epoch=$(date +%s)
        local days_left=$(( (expiry_epoch - current_epoch) / 86400 ))
        
        if [ $days_left -gt 30 ]; then
            echo "✅ SSL certificate valid ($days_left days remaining)"
            return 0
        elif [ $days_left -gt 0 ]; then
            echo "⚠️  SSL certificate expires soon ($days_left days remaining)"
            return 1
        else
            echo "❌ SSL certificate expired"
            return 1
        fi
    else
        echo "❌ Could not check SSL certificate"
        return 1
    fi
}

# Perform health checks
echo "🔍 System Services:"
check_service nginx "Nginx"
check_service ssh "SSH"

echo ""
echo "🔍 Application:"
check_pm2
check_file "prisma/dev.db" "Database"
check_file ".env.local" "Environment file"
check_file "ecosystem.config.js" "PM2 config"

echo ""
echo "🔍 HTTP Responses:"
check_http "http://localhost:3000" "200" "Local app"
check_http "https://jenright.dev" "301" "Domain redirect"
check_http "https://jenright.dev/mapvault" "200" "Public app"

echo ""
echo "🔍 SSL Certificate:"
check_ssl "jenright.dev"

echo ""
echo "🔍 System Resources:"

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -lt 80 ]; then
    echo "✅ Disk usage: ${DISK_USAGE}%"
else
    echo "⚠️  High disk usage: ${DISK_USAGE}%"
fi

# Check memory usage
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.0f", $3/$2 * 100.0}')
if [ $MEMORY_USAGE -lt 80 ]; then
    echo "✅ Memory usage: ${MEMORY_USAGE}%"
else
    echo "⚠️  High memory usage: ${MEMORY_USAGE}%"
fi

# Check load average
LOAD_AVG=$(uptime | awk -F'load average:' '{print $2}' | awk '{print $1}' | sed 's/,//')
echo "ℹ️  Load average: $LOAD_AVG"

echo ""
echo "🔍 Recent Logs (last 5 lines):"
echo "PM2 logs:"
pm2 logs mapvault --lines 5 --nostream 2>/dev/null | tail -5

echo ""
echo "Nginx error log:"
sudo tail -5 /var/log/nginx/error.log 2>/dev/null || echo "No recent nginx errors"

echo ""
echo "🏥 Health check completed!"
echo ""

# Optional: Send notification if any checks failed
# You can uncomment and modify this section to send alerts
# if [ $? -ne 0 ]; then
#     echo "⚠️  Some health checks failed. Consider investigating."
# fi