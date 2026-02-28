# The Collegiate Review - Modern Headless CMS Platform

A modern, production-ready headless WordPress CMS with a React frontend, featuring custom design blocks, committee member management, and GitLab CI/CD deployment.

## Features

✅ **Modern React Frontend** - Built with React 18, React Router, and Tailwind CSS
✅ **Headless WordPress Backend** - Clean REST API with custom extensions
✅ **Custom Design Blocks** - Enhanced content creation with highlight, alert, CTA, and gallery blocks
✅ **Committee Member Management** - Dynamic team roster managed from WordPress admin
✅ **Responsive Design** - Mobile-first approach with Tailwind CSS
✅ **GitLab CI/CD** - Automated build, test, and deployment pipeline
✅ **Docker Containerization** - Easy development and production deployment
✅ **Content Rendering** - Advanced block parsing and custom component rendering

## Tech Stack

### Frontend
- React 18.2.0
- React Router v6
- Tailwind CSS 3.3
- Axios for API requests
- React Markdown for content rendering

### Backend
- WordPress 6.5.5
- PHP 8.2
- MySQL 8.0
- Custom Must-Use Plugins (Committee Members, CORS, Design Blocks)

### DevOps
- Docker & Docker Compose
- GitLab CI/CD
- Traefik Reverse Proxy (Production)

## Quick Start

### Prerequisites
- Docker Desktop installed
- Docker Compose installed
- Git installed

### Local Development

1. **Clone the repository**
```bash
git clone https://gitlab.com/YOUR_NAMESPACE/collegiate-review.git
cd collegiate-review
```

2. **Create environment file** (optional, defaults are provided)
```bash
cp .env.example .env
```

3. **Start the application**
```bash
docker-compose up -d
```

4. **Check status**
```bash
docker-compose ps
```

5. **Access the application**
- Frontend: http://localhost:3000
- WordPress Admin: http://localhost:8080/wp-admin (auto-initialized)
- API Documentation: http://localhost:8080/wp-json
- Database: localhost:3306

### First Time Setup

1. Add an "About" page in WordPress:
   - Go to http://localhost:8080/wp-admin
   - Create a new page titled "About"
   - Publish it
   - It will appear on the frontend at /about

2. Add Committee Members:
   - Go to http://localhost:8080/wp-admin
   - Find "Committee Members" in the menu
   - Add new members with photos and roles
   - They'll appear on the About page

3. Create Articles:
   - Go to http://localhost:8080/wp-admin
   - Create new posts with featured images
   - They'll appear on the frontend

## Project Structure

```
.
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NavBar.js              # Navigation with dynamic pages
│   │   │   ├── ArticleCard.js         # Reusable article card
│   │   │   ├── CommitteeMembers.js    # Committee display
│   │   │   ├── ContentRenderer.js     # Block content rendering
│   │   │   └── ...
│   │   ├── pages/
│   │   │   ├── HomePage.js            # Landing page
│   │   │   ├── ArticlesPage.js        # Articles listing
│   │   │   ├── ArticlePage.js         # Single article
│   │   │   ├── AboutPage.js           # About + committee
│   │   │   ├── MagazinePage.js
│   │   │   ├── ReportsPage.js
│   │   │   └── PagePage.js            # Dynamic pages
│   │   ├── services/
│   │   │   └── apiService.js          # API integration layer
│   │   ├── utils/
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css                  # Tailwind + custom styles
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── wordpress/
│   ├── mu-plugins/
│   │   ├── committee-members.php      # Committee CPT
│   │   ├── headless-cors.php          # CORS support
│   │   └── custom-design-blocks.php   # Custom blocks
│   └── plugins/
├── docker-compose.yml                  # Development
├── docker-compose.prod.yml             # Production
├── .gitlab-ci.yml                      # CI/CD pipeline
├── .env                                # Local config
├── .env.example                        # Example config
└── README.md
```

## WordPress Custom Features

### Committee Members CPT
- Automatically registered post type
- REST API enabled
- Supports featured images (team photos)
- Fields: Title (name), Excerpt (role), Content (bio)
- Managed from WordPress admin
- Displayed via CommitteeMembers React component

### Custom Design Blocks
Registered in `custom-design-blocks.php`:
1. **Highlight Box** - For important callouts
2. **Alert Box** - Success/error/warning/info notifications
3. **Advanced Gallery** - Responsive image galleries
4. **Call-To-Action** - Button-driven conversions

### REST API Extensions
All committee members include embedded featured images and full metadata via `/wp/v2/committee-member` endpoints.

## Key React Components

### CommitteeMembers
```javascript
import CommitteeMembers from '../components/CommitteeMembers';

<CommitteeMembers />  // Fetches and displays all committee members
```

### ArticleCard
```javascript
import { ArticleCard, ArticleGrid } from '../components/ArticleCard';

<ArticleGrid articles={articles} columns={3} />
```

### ContentRenderer
```javascript
import ContentRenderer from '../components/ContentRenderer';

<ContentRenderer content={post.content?.rendered} />
```

## API Endpoints

### Blog Posts
- `GET /wp/v2/posts` - All posts
- `GET /wp/v2/posts/{id}` - Single post
- `GET /wp/v2/posts?search=query` - Search posts

### WordPress Pages
- `GET /wp/v2/pages` - All pages
- `GET /wp/v2/pages/{id}` - Single page

### Committee Members (Custom)
- `GET /wp/v2/committee-member` - All members
- `GET /wp/v2/committee-member/{id}` - Single member

### Categories
- `GET /wp/v2/categories` - All categories

All endpoints support `_embed` parameter for nested data.

## Environment Variables

### Development (.env)
```env
REACT_APP_WP_BASE_URL=http://localhost:8080
REACT_APP_ENVIRONMENT=development

WORDPRESS_DB_HOST=db
WORDPRESS_DB_NAME=wordpress
WORDPRESS_DB_USER=wordpress
WORDPRESS_DB_PASSWORD=wordpress
WORDPRESS_DB_ROOT_PASSWORD=rootpassword
WORDPRESS_DEBUG=true
```

### Production
```env
REACT_APP_WP_BASE_URL=https://yourdomain.com
REACT_APP_ENVIRONMENT=production

WORDPRESS_DB_PASSWORD=SECURE_PASSWORD_HERE
WORDPRESS_DB_ROOT_PASSWORD=SECURE_ROOT_PASSWORD
WORDPRESS_DEBUG=false

WORDPRESS_URL=https://yourdomain.com
FRONTEND_URL=https://app.yourdomain.com
WP_ADMIN_USER=admin
WP_ADMIN_EMAIL=admin@yourdomain.com
WP_ADMIN_PASSWORD=SECURE_PASSWORD
LETSENCRYPT_EMAIL=admin@yourdomain.com
```

## GitLab CI/CD Deployment

### Setup

1. Push code to GitLab
2. Set environment variables in GitLab:
   - Go to Settings → CI/CD → Variables
   - Add production credentials
3. Pipeline automatically:
   - Builds Docker images
   - Pushes to registry
   - Tests frontend build
   - Deploys to staging/production (manual trigger)

### Pipeline Stages
- **build** - Build and push Docker images
- **test** - Test frontend build
- **deploy:staging** - Deploy to staging (manual)
- **deploy:production** - Deploy to production (manual)

### Local GitLab Runner

To test CI/CD locally:
```bash
docker run -d --name gitlab-runner \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v gitlab-runner-config:/etc/gitlab-runner \
  gitlab/gitlab-runner:latest

docker exec gitlab-runner gitlab-runner register
```

## Database

### Connection
- Host: localhost or db (Docker)
- Port: 3306
- Database: wordpress
- User: wordpress
- Password: wordpress (development)

### Backup
```bash
docker-compose exec db mysqldump -u wordpress -pwordpress wordpress > backup.sql
``` 

### Restore
```bash
docker-compose exec -T db mysql -u wordpress -pwordpress wordpress < backup.sql
```

## Troubleshooting

### Port Already in Use
```bash
# Find and stop container
docker ps
docker stop <container-id>

# Or use different ports in docker-compose.yml
```

### WordPress Not Initializing
```bash
# Check logs
docker-compose logs wordpress

# Restart WordPress
docker-compose restart wordpress
```

### Committee Members Not Showing
1. Verify plugin is active: Check `/wordpress/mu-plugins/`
2. Add members in WordPress admin
3. Test API: `http://localhost:8080/wp-json/wp/v2/committee-member`

### Frontend Not Building
```bash
# Rebuild frontend
docker-compose build --no-cache frontend

# Check logs
docker-compose logs frontend
```

### API Connection Issues
- Verify `REACT_APP_WP_BASE_URL` matches WordPress URL
- Check CORS headers in `headless-cors.php`
- Test endpoint directly: `http://localhost:8080/wp-json/wp/v2/posts`

## Performance Tips

- Use featured images (lazy-loaded)
- Limit posts per page
- Enable WordPress caching plugins
- Use CDN for static assets (production)
- Monitor database queries

## Security Best Practices

1. **Change default credentials** before production
2. **Use strong passwords** for WordPress admin
3. **Enable SSL/HTTPS** (automatic with Traefik)
4. **Regular backups** of database and uploads
5. **Update Docker images** regularly
6. **Use secrets** for sensitive environment variables
7. **Limit REST API** access if needed

## Common Customizations

### Add New Page
1. Create page component in `src/pages/`
2. Add route in `App.js`
3. Create in WordPress admin with matching slug
4. Add to navigation in `NavBar.js`

### Add New Committee Member Field
1. Create ACF custom field in WordPress
2. Extend `committee-members.php` REST endpoint
3. Update CommitteeMembers component to display field

### Customize Styling
- Edit `src/index.css` for global styles
- Edit `tailwind.config.js` for theme
- Component-specific styles inline with Tailwind classes

## Maintenance Schedule

- **Weekly** - Monitor error logs
- **Monthly** - Update WordPress plugins
- **Quarterly** - Update Node.js dependencies
- **Semi-annually** - Full system review and updates

## Support & Documentation

- WordPress REST API: https://developer.wordpress.org/rest-api/
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com
- Docker Docs: https://docs.docker.com

## License

Proprietary - The Collegiate Review © 2024-2026

## Contributors

- Development Team
- Editorial Team
- Technical Support

