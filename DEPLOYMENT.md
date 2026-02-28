# Deployment Guide

This guide covers deploying The Collegiate Review to various environments.

## Table of Contents
1. [Local Development](#local-development)
2. [Staging Deployment](#staging-deployment)
3. [Production Deployment](#production-deployment)
4. [GitLab CI/CD](#gitlab-cicd)
5. [Cloud Platforms](#cloud-platforms)
6. [Maintenance](#maintenance)

## Local Development

### Quick Start
```bash
# Clone repository
git clone <repository-url>
cd collegiate-review

# Start services
docker-compose up -d

# Verify services
docker-compose ps
```

### Access Points
- Frontend: http://localhost:3000
- WordPress Admin: http://localhost:8080/wp-admin
- MySQL: localhost:3306

### Initial Setup
1. Visit WordPress admin
2. Complete initial setup
3. Add "About" page
4. Add committee members
5. Create sample posts

## Staging Deployment

### Prerequisites
- Linux server with Docker/Docker Compose
- SSL certificate (self-signed or Let's Encrypt)
- Domain name or IP address

### Deployment Steps

1. **Prepare Server**
```bash
# SSH into server
ssh user@staging-server.com

# Clone repository
git clone <repository-url>
cd collegiate-review

# Create .env file
cat > .env << EOF
REACT_APP_WP_BASE_URL=https://staging.yourdomain.com
REACT_APP_ENVIRONMENT=staging
WORDPRESS_DB_PASSWORD=staging_db_password_123
WORDPRESS_DB_ROOT_PASSWORD=staging_root_password_456
WORDPRESS_URL=https://staging.yourdomain.com
EOF
```

2. **Update Docker Compose (if using Traefik)**
```bash
# Use production compose file
cp docker-compose.prod.yml docker-compose.yml

# Start services
docker-compose up -d
```

3. **Verify Deployment**
```bash
# Check service status
docker-compose ps

# View logs
docker-compose logs wordpress
docker-compose logs frontend

# Test endpoints
curl https://staging.yourdomain.com
curl https://staging.yourdomain.com/wp-json/wp/v2/posts
```

4. **WordPress Setup**
- Visit https://staging.yourdomain.com/wp-admin
- Complete initial setup
- Install Yoast SEO and other plugins
- Add content

## Production Deployment

### Prerequisites
- Production server (AWS EC2, DigitalOcean, Linode, etc.)
- Domain name with DNS configured
- SSL certificate (Let's Encrypt via Traefik)
- Database backups enabled

### Deployment Steps

1. **Server Preparation**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose

# Enable Docker service
sudo systemctl enable docker

# Add user to docker group
sudo usermod -aG docker $USER

# Log out and back in
exit
```

2. **Configure Application**
```bash
# SSH into production server
ssh user@prod-server.com

# Clone repository
git clone <repository-url>
cd collegiate-review

# Create production .env
cat > .env << 'EOF'
REACT_APP_WP_BASE_URL=https://yourdomain.com
REACT_APP_ENVIRONMENT=production

WORDPRESS_DB_PASSWORD=$(openssl rand -base64 32)
WORDPRESS_DB_ROOT_PASSWORD=$(openssl rand -base64 32)
WORDPRESS_URL=https://yourdomain.com
FRONTEND_URL=https://app.yourdomain.com

WP_ADMIN_USER=admin
WP_ADMIN_EMAIL=admin@yourdomain.com
WP_ADMIN_PASSWORD=$(openssl rand -base64 16)

LETSENCRYPT_EMAIL=admin@yourdomain.com
TZ=UTC
EOF

# Secure environment file
chmod 600 .env
```

3. **DNS Configuration**
```
# Point your domain to server IP in your DNS provider
yourdomain.com          -> 1.2.3.4
app.yourdomain.com      -> 1.2.3.4
wp.yourdomain.com       -> 1.2.3.4
```

4. **Start Services**
```bash
# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to initialize
sleep 30

# Check status
docker-compose ps
```

5. **Verify Installation**
```bash
# Check WordPress
curl -I https://yourdomain.com/wp-admin

# Check API
curl https://yourdomain.com/wp-json/wp/v2/posts

# Check Frontend
curl -I https://app.yourdomain.com
```

6. **WordPress Configuration**
```bash
# Access WordPress admin
# https://app.yourdomain.com/wp-admin
# OR
# https://yourdomain.com/wp-admin

# Setup admin account (auto-configured if WP_ADMIN_PASSWORD set)
# Add content as needed
```

## GitLab CI/CD

### Setup CI/CD Pipeline

1. **Create .gitlab-ci.yml**
```yaml
# Already provided in repository
# Located at: .gitlab-ci.yml
```

2. **Configure GitLab Variables**
```
Settings → CI/CD → Variables

STAGING_URL: https://staging.yourdomain.com
PRODUCTION_URL: https://yourdomain.com
FRONTEND_URL: https://app.yourdomain.com
WP_ADMIN_USER: admin
WP_ADMIN_EMAIL: admin@yourdomain.com
WP_ADMIN_PASSWORD: SECURE_PASSWORD_HERE

LETSENCRYPT_EMAIL: admin@yourdomain.com

CI_REGISTRY_USER: username
CI_REGISTRY_PASSWORD: token
```

3. **GitLab Runner Setup**

Option A: Use GitLab Shared Runner
- Already available with free GitLab account
- Automatically runs pipeline on push

Option B: Install Self-Hosted Runner
```bash
# SSH into runner server
ssh runner@runner-server.com

# Install GitLab Runner
curl -L https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh | sudo bash
sudo apt-get install gitlab-runner

# Register runner
sudo gitlab-runner register \
  --url https://gitlab.com/ \
  --registration-token <YOUR_TOKEN> \
  --executor docker \
  --docker-image alpine:latest \
  --description "Docker Runner"

# Start runner
sudo systemctl start gitlab-runner
```

4. **Trigger Deployments**

Automatic on push:
```bash
git push origin main  # Auto-deploys to staging if tests pass
```

Manual deployment:
- Go to CI/CD → Pipelines
- Click on pipeline
- Click "Deploy" button on desired stage

## Cloud Platforms

### AWS Deployment

1. **Create EC2 Instance**
```
- Instance Type: t3.medium or larger
- OS: Ubuntu 22.04 LTS
- Storage: 30GB
- Security Group: Allow 80, 443, 22
```

2. **Use AWS RDS for Database**
```
- Engine: MySQL 8.0
- Instance: db.t3.micro
- Storage: 20GB-100GB
- Backup: 7+ days retention
```

3. **Update docker-compose**
```yaml
services:
  db:
    # Remove container db
    # Use RDS endpoint instead
    image: null  # Use external RDS
```

### DigitalOcean Deployment

1. **Create Droplet**
- Image: Ubuntu 22.04
- Droplet: $5-10/month (basic)
- Region: Closest to users

2. **Docker Marketplace App**
- Use pre-configured Docker Droplet
- Reduces setup time

### Heroku Deployment

```bash
# Install Heroku CLI
# Create Heroku app
heroku create collegiate-review

# Add buildpacks
heroku buildpacks:add heroku/ruby
heroku buildpacks:add heroku/nodejs

# Deploy
git push heroku main

# Set environment variables
heroku config:set REACT_APP_WP_BASE_URL=...
```

## Maintenance

### Regular Backups

```bash
# Daily database backup
0 2 * * * docker-compose exec db mysqldump -u wordpress -p$WORDPRESS_DB_PASSWORD wordpress > /backups/collegiate-review-$(date +\%Y\%m\%d).sql

# Upload to S3
aws s3 cp /backups/ s3://collegiate-review-backups/ --recursive
```

### Monitoring

Set up monitoring for:
- CPU usage
- Memory usage
- Disk space
- Database performance
- Response times

Tools:
- Prometheus + Grafana
- DataDog
- New Relic
- CloudWatch (AWS)

### Updates

```bash
# Update Docker images
docker-compose pull

# Update WordPress plugins (in admin)
# Update Node packages (rebuild frontend)
npm update

# Rebuild and restart
docker-compose up -d --build
```

### Troubleshooting

#### High Memory Usage
```bash
# Check running processes
docker stats

# Limit container memory
# docker-compose.yml:
# services:
#   wordpress:
#     mem_limit: 1g
```

#### Database Performance
```bash
# Check slow queries
docker-compose exec db mysql -u wordpress -p << EOF
SHOW PROCESSLIST;
SHOW ENGINE INNODB STATUS;
EOF
```

#### SSL Issues
```bash
# Check certificate
docker exec collegiate-review-traefik cat /letsencrypt/acme.json

# Force renewal
docker restart collegiate-review-traefik
```

## Scaling Considerations

### Load Balancing
- Use Nginx/Traefik to distribute traffic
- Multiple App instances behind load balancer

### Database Replication
- Add read replicas for high traffic
- Use primary-replica setup

### Caching
- Redis for object caching
- WordPress cache plugins
- CDN for static assets

### Performance Optimization
```bash
# Database optimization
OPTIMIZE TABLE wordpress.wp_posts;
OPTIMIZE TABLE wordpress.wp_postmeta;

# Index analysis
ANALYZE TABLE wordpress.wp_posts;
```

## Security Checklist

- [x] Change default passwords
- [x] Enable SSL/HTTPS
- [x] Configure firewall rules
- [x] Enable database backups
- [x] Set up monitoring/alerts
- [x] Regular security patches
- [x] Enable WordPress 2FA
- [x] Restrict admin area IP
- [x] Use strong database passwords
- [x] Regular security audits

## Support

For deployment issues:
1. Check logs: `docker-compose logs -f`
2. Verify environment variables: `docker-compose config`
3. Check service health: `docker-compose ps`
4. Contact support: include error logs and configuration (without passwords)
