# Quick Start Guide

Get The Collegiate Review running in 5 minutes!

## Prerequisites

- Docker Desktop installed and running
- Git installed
- ~5 minutes of your time

## Step 1: Clone & Setup (1 minute)

```bash
# Clone the repository
git clone https://gitlab.com/YOUR_NAMESPACE/collegiate-review.git
cd collegiate-review

# (Optional) Copy environment file - defaults are already set
# cp .env.example .env
```

## Step 2: Start Services (2 minutes)

```bash
# Start all services
docker-compose up -d

# Verify everything is running
docker-compose ps

# You should see:
# ✓ collegiate-review-db       (Up)
# ✓ collegiate-review-wordpress (Up)
# ✓ collegiate-review-frontend  (Up)
```

**Wait 30-60 seconds for WordPress to initialize**

## Step 3: Access the Application (2 minutes)

### Frontend - The main website
- **URL**: http://localhost:3000
- **Status**: Should show home page with "Featured Articles"

### WordPress Admin - Content management
- **URL**: http://localhost:8080/wp-admin
- **Username**: admin (or from .env)
- **Password**: password123 (or from .env)

### REST API
- **URL**: http://localhost:8080/wp-json/wp/v2/posts

## Step 4: Add Sample Content (Optional)

### Add an "About" Page

1. Go to WordPress Admin (http://localhost:8080/wp-admin)
2. Click "Pages" → "Add New"
3. Title: "About"
4. Content: Add some text
5. Click "Publish"
6. Visit http://localhost:3000/about in frontend

### Add Committee Members

1. Go to WordPress Admin
2. Click "Committee Members" → "Add New"
3. Fill in:
   - **Name** (Title field)
   - **Role** (Excerpt field - e.g., "Editor-in-Chief, Department of History")
   - **Bio** (Content field)
   - **Photo** (Featured Image - click "Set featured image")
4. Click "Publish"
5. Repeat for 3-5 members
6. Visit http://localhost:3000/about to see them display

### Add Articles

1. Go to WordPress Admin
2. Click "Posts" → "Add New"
3. Fill in:
   - **Title**
   - **Content** - Your article text
   - **Featured Image** - Cover image
   - **Category** (optional)
4. Click "Publish"
5. Visit http://localhost:3000/articles - Article appears in list and grid

## Common Operations

### View Logs

```bash
# Frontend logs
docker-compose logs -f frontend

# WordPress logs
docker-compose logs -f wordpress

# Database logs
docker-compose logs -f db
```

### Stop Services

```bash
docker-compose stop
```

### Restart Services

```bash
docker-compose restart
```

### Complete Cleanup (Removes data!)

```bash
docker-compose down -v
```

## Troubleshooting

### Frontend shows "Cannot GET /"

**Solution**: Services still starting. Wait 60 seconds and refresh.

```bash
# Check status
docker-compose ps

# View logs
docker-compose logs frontend
```

### WordPress admin not accessible

**Solution**: Check if WordPress finished initializing

```bash
# View logs
docker-compose logs wordpress

# It should say "Apache is running"
```

### Can't connect to database

**Solution**: Database might be initializing

```bash
# Check if healthy
docker-compose exec db mysqladmin -u wordpress -pwordress ping

# Or restart
docker-compose restart db
```

### Port already in use

**Solution**: Change ports in docker-compose.yml

```yaml
# In docker-compose.yml
frontend:
  ports:
    - "3001:3000"  # Changed from 3000 to 3001

wordpress:
  ports:
    - "8081:80"    # Changed from 8080 to 8081
```

## What's New

### Modern UI
- Beautiful Tailwind CSS design
- Mobile responsive
- Smooth animations
- Dark navigation

### Features
- Dynamic committee member management
- Custom content blocks (highlight, alert, CTA)
- Search functionality on articles
- Category filtering
- Related articles

### Deployment Ready
- Docker Compose files for production
- GitLab CI/CD pipeline included
- SSL/TLS support via Traefik
- Environment-based configuration

## Next Steps

### For Development
1. Read `DEVELOPMENT.md` for setup details
2. Review component structure in `frontend/src/components/`
3. Check API functions in `frontend/src/services/apiService.js`
4. Explore Tailwind utilities in `frontend/src/index.css`

### For Content Creation
1. WordPress docs: https://wordpress.org/support/
2. Creating posts, pages, and custom content
3. Managing committee members
4. Using custom blocks

### For Deployment
1. Read `DEPLOYMENT.md` for full guide
2. Set up GitLab CI/CD variables
3. Configure domain and SSL
4. Deploy to staging/production

## Architecture Overview

```
┌─────────────────────────────────────┐
│   React Frontend (localhost:3000)    │
│   - Modern UI with Tailwind         │
│   - React Router navigation         │
│   - Responsive design               │
└────────────────┬────────────────────┘
                 │ (API calls via Axios)
                 ▼
┌─────────────────────────────────────┐
│  WordPress REST API (port 8080)     │
│  - Headless CMS                     │
│  - Committee Members (Custom)       │
│  - Custom Design Blocks             │
│  - Posts, Pages, Categories         │
└────────────────┬────────────────────┘
                 │ (Database queries)
                 ▼
┌─────────────────────────────────────┐
│   MySQL Database (port 3306)        │
│   - WordPress data                  │
│   - Persistent volumes              │
│   - Automated backups ready         │
└─────────────────────────────────────┘
```

## File Locations

- **Frontend**: `frontend/` directory
- **WordPress**: `wordpress/` directory
- **Plugins**: `wordpress/mu-plugins/` (must-use plugins)
- **Config**: `.env` file
- **Docs**: `README.md`, `DEPLOYMENT.md`, `DEVELOPMENT.md`

## Support

### Documentation
- Main README: `README.md`
- Deployment guide: `DEPLOYMENT.md`
- Development guide: `DEVELOPMENT.md`
- Upgrade summary: `UPGRADE_SUMMARY.md`

### Common Issues
- Check logs: `docker-compose logs -f [service]`
- Check health: `docker-compose ps`
- Restart service: `docker-compose restart [service]`
- View status: `docker-compose status`

### API Testing

```bash
# Get all posts
curl http://localhost:8080/wp-json/wp/v2/posts

# Get committee members
curl http://localhost:8080/wp-json/wp/v2/committee-member

# Get pages
curl http://localhost:8080/wp-json/wp/v2/pages

# Get with embedded data
curl http://localhost:8080/wp-json/wp/v2/posts?_embed
```

## That's It! 🎉

You're ready to:
- 📝 Create content in WordPress
- 🎨 View beautiful frontend design
- 🚀 Deploy to production
- 👥 Manage team members
- 📱 View on mobile devices

**Happy publishing!**
