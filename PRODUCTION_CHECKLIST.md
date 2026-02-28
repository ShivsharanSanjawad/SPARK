# Production Deployment Checklist

Complete checklist for deploying The Collegiate Review to production via GitLab CI/CD.

## Phase 1: Pre-Deployment Setup (Do These First!)

### Repository Setup
- [ ] Create GitLab repository (Settings: Public or Private as needed)
- [ ] Initialize git in local project: `git init`
- [ ] Add all files: `git add .`
- [ ] Initial commit: `git commit -m "Initial commit: The Collegiate Review v2"`
- [ ] Add GitLab remote: `git remote add origin https://gitlab.com/YOUR_NAMESPACE/collegiate-review.git`
- [ ] Push to GitLab: `git push -u origin main`
- [ ] Create develop branch: `git branch develop && git push -u origin develop`

### GitLab Project Configuration
- [ ] Go to project Settings → CI/CD → Runners
  - [ ] Verify at least 1 runner available (or configure GitLab.com shared runner)
- [ ] Enable CI/CD pipeline in Settings → General → Visibility, CI/CD

### Docker Registry Setup (Choose One)

**Option A: GitLab Container Registry (Recommended)**
- [ ] Enable in Settings → Integrations → Container Registry
- [ ] Already enabled by default
- [ ] Credentials auto-generated per job

**Option B: Docker Hub**
- [ ] Create Docker Hub account if not present
- [ ] Create personal access token in Docker Hub settings
- [ ] Add to GitLab: Settings → CI/CD → Variables
  - [ ] `CI_REGISTRY_USER`: Your Docker Hub username
  - [ ] `CI_REGISTRY_PASSWORD`: Your personal access token
  - [ ] `CI_REGISTRY`: `docker.io`

### Environment Variables (Critical!)

Go to Settings → CI/CD → Variables and add:

**Server & Domain**
- [ ] `STAGING_Host`: Staging server hostname/IP (e.g., `staging.example.com`)
- [ ] `STAGING_URL`: Full URL (e.g., `https://staging.example.com`)
- [ ] `PRODUCTION_HOST`: Production server hostname (e.g., `example.com`)
- [ ] `PRODUCTION_URL`: Full URL (e.g., `https://example.com`)

**Frontend Configuration**
- [ ] `FRONTEND_URL_STAGING`: e.g., `https://staging.example.com`
- [ ] `FRONTEND_URL_PRODUCTION`: e.g., `https://example.com`

**WordPress Admin**
- [ ] `WP_ADMIN_USER`: Admin username (e.g., `admin`)
- [ ] `WP_ADMIN_EMAIL`: Admin email (e.g., `admin@example.com`)
- [ ] `WP_ADMIN_PASSWORD`: Strong password (25+ characters, mixed case, numbers, symbols)

**Database**
- [ ] `DB_PASSWORD`: MySQL root password (strong, 25+ characters)
- [ ] `WP_DB_PASSWORD`: WordPress user password (strong, 25+ characters)

**SSL/TLS (Let's Encrypt)**
- [ ] `LETSENCRYPT_EMAIL`: Email for SSL certificate alerts

**Server Access** (Mark protected & masked in GitLab!)
- [ ] `DEPLOY_SSH_KEY`: Private SSH key for server access (multiline)
- [ ] `DEPLOY_KNOWN_HOSTS`: Server SSH host key

**Optional: Performance**
- [ ] `WP_MEMORY_LIMIT`: `256M` (WordPress memory)
- [ ] `WP_MAX_MEMORY_LIMIT`: `512M` (WordPress max)

**Mark as Protected** (Settings → CI/CD → Variables):
- [ ] All `_PASSWORD` variables
- [ ] All `_KEY` variables
- [ ] All secrets

**Mark as Masked**:
- [ ] All above variables

### Server Preparation

**On Your Linux Server** (staging.example.com or example.com):

```bash
# SSH into server
ssh root@your-server

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
docker-compose --version  # Should be v2+

# Create project directory
mkdir -p /opt/collegiate-review
cd /opt/collegiate-review

# Create SSH directory for deployment
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# Add your GitLab runner SSH key
# (This is used for deployment from CI/CD)
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

**Check Prerequisites:**
- [ ] Docker installed: `docker --version`
- [ ] Docker Compose v2: `docker-compose --version`
- [ ] Firewall allows port 80 (HTTP): `sudo ufw allow 80`
- [ ] Firewall allows port 443 (HTTPS): `sudo ufw allow 443`
- [ ] DNS A record points to this server IP

## Phase 2: Local Testing

### Verify Production Build Locally

Before deploying to servers, test the complete build locally:

```bash
# Test frontend production build
cd frontend
npm run build
npm test  # If tests exist

# Test Docker build
docker build -t collegiate-review:test .

# Go back to root
cd ..
```

- [ ] Frontend builds without errors
- [ ] No TypeScript/JSX errors
- [ ] All assets generated in `frontend/build/`

### Test Docker Compose Production Locally

```bash
# Run production compose file locally
docker-compose -f docker-compose.prod.yml up -d

# Verify services
docker-compose -f docker-compose.prod.yml ps

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Test endpoints
curl http://localhost/
curl http://localhost/wp-json/wp/v2/posts
```

- [ ] All services health check: `UP`
- [ ] No error logs
- [ ] HTTP endpoints respond

## Phase 3: Staging Deployment

### Deploy to Staging (First Real Deployment!)

1. **Trigger First Deploy**

   Go to GitLab project → CI/CD → Pipelines
   
   - [ ] Wait for `build:frontend` job to complete
   - [ ] Wait for `build:wordpress` job to complete
   - [ ] Wait for `test:frontend` job to complete
   - [ ] Click `deploy:staging` → Click play button to trigger

   ```
   Pipeline Progress:
   [✓] build:frontend      (builds Docker image, pushes to registry)
   [✓] build:wordpress     (builds WordPress image)
   [✓] test:frontend       (validates build)
   [⏳] deploy:staging     (pulls image, ssh's to server, deploys)
   ```

2. **Monitor Deployment**

   - [ ] Watch deploy:staging job logs real-time
   - [ ] Look for `Successfully restarted docker services` message
   - [ ] Deployment typically takes 3-5 minutes

3. **Post-Deployment Verification**

   On staging server:
   ```bash
   ssh root@staging.example.com
   cd /opt/collegiate-review
   docker-compose -f docker-compose.prod.yml ps
   docker-compose -f docker-compose.prod.yml logs -f
   ```

   - [ ] All services show `Status: Up`
   - [ ] No critical errors in logs
   - [ ] WordPress service shows "Apache is running"

4. **Test Staging Website**

   - [ ] Open https://staging.example.com in browser
   - [ ] Should show homepage with articles
   - [ ] Check SSL certificate valid (🔒 in address bar)
   - [ ] Open https://staging.example.com/wp-admin
   - [ ] Admin login works with configured credentials
   - [ ] WordPress dashboard loads correctly

5. **Test WordPress Content**

   - [ ] Add test post in WordPress admin
   - [ ] Check if appears on staging.example.com/articles
   - [ ] Add test committee member
   - [ ] Check if appears on staging.example.com/about
   - [ ] Test search functionality
   - [ ] Test category filtering

### Troubleshoot Staging Issues

If deployment fails:

```bash
# SSH to staging server
ssh root@staging.example.com
cd /opt/collegiate-review

# Check compose file exists
ls -la docker-compose.prod.yml

# Check .env file
cat .env  # First verify it has real values

# Check Docker services
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs wordpress
docker-compose -f docker-compose.prod.yml logs frontend
docker-compose -f docker-compose.prod.yml logs traefik

# Restart specific service
docker-compose -f docker-compose.prod.yml restart wordpress
```

**Common Issues:**

| Issue | Solution |
|-------|----------|
| `Connection refused` | Wait 60 seconds for services to start, wordpress takes time |
| `404 All404FoundError` | Traefik not ready, wait another minute |
| `SSL certificate error` | DNS not propagated, wait 15+ minutes |
| `WordPress shows blank page` | Check database connection: `docker-compose logs wordpress` |
| `Cannot pull image` | Docker registry credentials fail, check CI/CD variables |

## Phase 4: Content Migration (Optional)

If migrating from old site:

### Backup Old Content
```bash
# Export old WordPress database
mysqldump -u olduser -p olddatabase > backup.sql
```

- [ ] Download and backup all media files
- [ ] Export posts/pages from old WordPress

### Import to Staging
- [ ] Upload database dump to staging server
- [ ] Import via WordPress admin or WP-CLI
- [ ] Test all content displays correctly
- [ ] Verify all images load

### Test All Pages
- [ ] [ ] All article links work
- [ ] Page links render correctly
- [ ] Images display
- [ ] Navigation works
- [ ] Search finds content

## Phase 5: Production Deployment

### Pre-Production Checklist
- [ ] Staging deployment tested and working
- [ ] All content migrated (if applicable)
- [ ] Domain DNS configured (A record → production server)
- [ ] SSL certificate working (if using Let's Encrypt)
- [ ] Backup plan in place (database, files)
- [ ] Team notified of deployment time
- [ ] Deployment window scheduled (low-traffic time)

### Deploy to Production

1. **Trigger Production Deploy**

   Go to GitLab project → CI/CD → Pipelines → Latest pipeline
   
   - [ ] Verify build jobs completed successfully
   - [ ] Scroll down to `deploy:production`
   - [ ] Click play button (⏹️) to trigger
   - [ ] Confirm when prompted

2. **Monitor Deployment**

   - [ ] Watch job output in GitLab
   - [ ] Look for success message
   - [ ] Allow 5-10 minutes for completion

3. **Verify Production Website**

   - [ ] Visit https://example.com (your domain)
   - [ ] Homepage loads correctly
   - [ ] Articles display
   - [ ] About page shows committee members
   - [ ] Navigation works
   - [ ] SSL certificate valid
   - [ ] Mobile view responsive

4. **Test Production Functionality**

   - [ ] Admin login: https://example.com/wp-admin
   - [ ] Create test post in admin
   - [ ] Post appears on front-end
   - [ ] Search works
   - [ ] Category filter works
   - [ ] Related articles show

5. **Performance Check**

   Using https://pagespeed.web.dev/:
   - [ ] Desktop score > 80
   - [ ] Mobile score > 70
   - [ ] Core Web Vitals "Good"

## Phase 6: Post-Deployment

### Monitoring

**Weekly Checks:**
- [ ] Visit site and test manually
- [ ] Check WordPress admin dashboard
- [ ] Verify recent posts publish correctly
- [ ] Monitor error logs: `docker-compose logs --tail=50`

**Automated Monitoring (Recommended):**
- [ ] Set up uptime monitoring (Uptime Robot, StatusCake, etc.)
- [ ] Configure error alerts from logs
- [ ] Set up email alerts for critical errors

### Backups

**Set Up Automated Backups:**

```bash
# On production server, create backup script
cat > /opt/collegiate-review/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/collegiate-review/backups/"

mkdir -p $BACKUP_DIR

# Backup database
docker exec collegiate-review-db mysqldump \
  -u wordpress -p$DB_PASSWORD wordpress > \
  $BACKUP_DIR/db_$DATE.sql

# Compress and keep only last 7 days
gzip $BACKUP_DIR/db_$DATE.sql
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +7 -delete
EOF

chmod +x /opt/collegiate-review/backup.sh

# Add to crontab for daily backup at 2 AM
crontab -e
# Add: 0 2 * * * /opt/collegiate-review/backup.sh
```

- [ ] Backup script created
- [ ] Tested backup execution
- [ ] Backups stored securely
- [ ] Backups tested for restoration

### Team Handoff

- [ ] Share access credentials securely
- [ ] Provide team with documentation links:
  - [ ] README.md for overview
  - [ ] DEVELOPMENT.md for developers
  - [ ] DEPLOYMENT.md for ops on manual deployments
- [ ] Schedule team training on WordPress admin
- [ ] Establish content creation workflow
- [ ] Document emergency procedures

## Phase 7: Continuous Operations

### Regular Maintenance Tasks

**Daily:**
- [ ] Monitor error logs
- [ ] Check website is accessible

**Weekly:**
- [ ] Verify posts published correctly
- [ ] Check backup completion
- [ ] Review analytics/traffic (if enabled)

**Monthly:**
- [ ] WordPress updates (via admin)
- [ ] Security check review
- [ ] Performance review
- [ ] Clean up old media/revisions

**Quarterly:**
- [ ] Full system backup and restore test
- [ ] Security audit
- [ ] Performance optimization
- [ ] Dependencies update check

### Future Enhancements

- [ ] Add Google Analytics tracking
- [ ] Set up email notifications for new posts
- [ ] Add social media sharing buttons
- [ ] Implement caching strategy
- [ ] Add API rate limiting
- [ ] Set up log aggregation
- [ ] Implement database replication for HA
- [ ] Add CDN for static assets

## Rollback Procedures

If something goes wrong in production:

### Quick Rollback (Within 24 hours)

```bash
# SSH to production server
ssh root@example.com
cd /opt/collegiate-review

# Stop services
docker-compose -f docker-compose.prod.yml down

# Restore from database backup
BACKUP_FILE=$(ls -t backups/db_*.sql.gz | head -1)
gunzip -c $BACKUP_FILE | docker exec -i collegiate-review-db \
  mysql -u wordpress -p$DB_PASSWORD wordpress

# Start services with previous image
docker-compose -f docker-compose.prod.yml up -d
```

- [ ] Verify website accessible after rollback
- [ ] Check all posts still visible
- [ ] Notify team of rollback

### GitLab Pipeline Rollback

1. Go to GitLab → CI/CD → Pipelines
2. Find previous successful pipeline
3. Manually re-run deploy:production job with previous image
4. Or redeploy from specific git tag/commit

## Success Criteria

Your deployment is successful when:

- ✅ Website loads at production domain
- ✅ SSL certificate valid (🔒 showing)
- ✅ All pages accessible and render correctly
- ✅ WordPress admin logs in
- ✅ Articles/pages/committee members display
- ✅ Search and filtering work
- ✅ No 404 or 500 errors in logs
- ✅ Mobile version responsive
- ✅ Performance scores acceptable
- ✅ Backups functioning
- ✅ Team has access and training
- ✅ Monitoring/alerts configured

## Support & Escalation

### If Deployment Fails

1. Check GitLab CI/CD job logs for specific error
2. SSH to server and check Docker logs
3. Verify all environment variables set correctly
4. Check server resources (disk space, memory)
5. Restore from backup if needed

### Getting Help

- Check DEPLOYMENT.md troubleshooting section
- Review Docker logs: `docker-compose logs`
- Check WordPress error logs in wp-content/
- Search WordPress.org documentation
- Review Traefik documentation for proxy issues

---

**Estimated Total Time:**
- Phase 1 (Setup): 30 minutes
- Phase 2 (Testing): 15 minutes
- Phase 3 (Staging): 20 minutes
- Phase 4 (Content): 30 minutes (optional)
- Phase 5 (Production): 15 minutes
- Phase 6 (Post-Deploy): 30 minutes
- **Total: ~2.5 hours** (without Phase 4)

**Good luck with your production deployment! 🚀**
