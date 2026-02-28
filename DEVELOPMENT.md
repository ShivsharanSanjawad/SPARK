# Development Guide

This guide covers developing The Collegiate Review locally and contributing to the project.

## Setting Up Local Development

### Prerequisites
- Docker & Docker Compose
- Git
- Node.js 18+ (optional, for running frontend without Docker)
- Code editor (VS Code recommended)

### Initial Setup

1. **Clone the repository**
```bash
git clone https://gitlab.com/YOUR_NAMESPACE/collegiate-review.git
cd collegiate-review
git checkout develop  # Development branch
```

2. **Start services**
```bash
docker-compose up -d
```

3. **Verify services**
```bash
docker-compose ps
# All services should show "Up"

# Check logs
docker-compose logs -f frontend
docker-compose logs -f wordpress
```

4. **Access the application**
- Frontend: http://localhost:3000
- WordPress Admin: http://localhost:8080/wp-admin
- API: http://localhost:8080/wp-json

### First Time WordPress Setup

1. Visit http://localhost:8080/wp-admin
2. Complete the setup wizard (user account, settings)
3. Credentials depend on your .env file

### Create Sample Content

1. **Create an "About" Page**
   - WordPress Admin → Pages → Add New
   - Title: "About"
   - Content: Add some text
   - Publish

2. **Add Committee Members**
   - WordPress Admin → Committee Members → Add New
   - Fill in name, role, bio
   - Upload featured image
   - Publish (repeat for several members)

3. **Create Sample Articles**
   - WordPress Admin → Posts → Add New
   - Add title, content, featured image
   - Set category (optional)
   - Publish

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable React components
│   │   ├── NavBar.js
│   │   ├── ArticleCard.js
│   │   ├── CommitteeMembers.js
│   │   └── ContentRenderer.js
│   ├── pages/           # Page components
│   │   ├── HomePage.js
│   │   ├── ArticlesPage.js
│   │   ├── ArticlePage.js
│   │   ├── AboutPage.js
│   │   ├── MagazinePage.js
│   │   ├── ReportsPage.js
│   │   └── PagePage.js
│   ├── services/        # API layer
│   │   └── apiService.js
│   ├── utils/           # Utility functions
│   ├── App.js           # Main app component
│   ├── App.css         # Deprecated (use Tailwind)
│   ├── index.js        # Entry point
│   └── index.css       # Global styles + Tailwind
├── Dockerfile
├── package.json
├── tailwind.config.js
└── postcss.config.js

wordpress/
├── mu-plugins/
│   ├── committee-members.php
│   ├── headless-cors.php
│   └── custom-design-blocks.php
└── plugins/

docker-compose.yml      # Dev config
docker-compose.prod.yml # Production config
.gitlab-ci.yml         # CI/CD pipeline
.env                   # Local environment
.env.example           # Environment template
```

## Frontend Development

### Running Frontend in Development Mode

The default docker-compose setup runs the dev server with hot reload.

```bash
# Access at http://localhost:3000
# Changes auto-reload in browser
```

### Running Without Docker

```bash
cd frontend
npm install
npm start
# Opens at http://localhost:3000
```

### Building for Production

```bash
cd frontend
npm run build
# Creates build/ directory with optimized files
```

### Key Technologies

- **React 18** - UI framework
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Markdown** - Markdown rendering

### Component Structure

All components are in `src/components/` or `src/pages/`.

**Example component pattern:**

```javascript
import React, { useEffect, useState } from 'react';

function MyComponent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data
    loadData();
  }, []);

  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}

export default MyComponent;
```

### Styling with Tailwind

All styling uses Tailwind class names. Avoid creating new CSS unless necessary.

```javascript
// Good - Use Tailwind classes
<div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">

// Bad - Don't create custom CSS
<div className="custom-card">
```

Common utility classes:
- Colors: `bg-primary-600`, `text-slate-900`, `border-red-200`
- Spacing: `p-4`, `m-2`, `gap-6`, `py-12`
- Layout: `flex`, `grid`, `items-center`, `justify-between`
- Responsive: `md:`, `lg:`, `sm:` prefixes
- States: `hover:`, `active:`, `focus:`, `disabled:`

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `src/App.js`
3. Add navigation link in `src/components/NavBar.js`
4. Fetch data using `src/services/apiService.js`

```javascript
// src/pages/MyNewPage.js
import React, { useEffect, useState } from 'react';
import { getSomething } from '../services/apiService';

function MyNewPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getSomething().then(setItems);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Content */}
    </div>
  );
}

export default MyNewPage;
```

### API Integration

All API calls go through `src/services/apiService.js`.

**Available functions:**

```javascript
// Posts
getPosts({ perPage, page, search })
getPostBySlug(slug)
getPostById(id)
getPostsByCategory(categoryId)

// Pages
getAllPages()
getPageBySlug(slug)
getPageById(id)

// Committee
getCommitteeMembers()
getCommitteeMemberById(id)

// Categories
getCategories()

// Content
parseBlocks(content)
formatBlocksToContent(blocks)
```

### Forms and Input

Use `.form-input` and `.form-textarea` classes:

```javascript
<input
  type="text"
  placeholder="Enter text..."
  className="form-input w-full"
/>

<textarea
  className="form-textarea w-full"
  rows="4"
></textarea>
```

## WordPress Development

### Adding Custom Post Types

Create new file in `wordpress/mu-plugins/my-plugin.php`:

```php
<?php
/**
 * Plugin Name: My Custom Post Type
 */

add_action('init', function () {
    register_post_type('my_post_type', array(
        'labels' => array('name' => 'My Posts'),
        'public' => true,
        'show_in_rest' => true,  // Important for REST API
        'supports' => array('title', 'editor', 'thumbnail'),
    ));
});
```

### Adding Custom Blocks

Extend `wordpress/mu-plugins/custom-design-blocks.php`:

```php
$custom_blocks['my-block'] = array(
    'title' => 'My Block',
    'description' => 'Block description',
    'icon' => 'block-icon',
    'keywords' => array('keyword1', 'keyword2'),
);

// Add render function
function render_custom_block_my_block($attributes) {
    return '<div>...</div>';
}
```

### REST API Endpoints

- Create: `POST /wp/v2/{post_type}`
- Read: `GET /wp/v2/{post_type}/{id}`
- Update: `POST /wp/v2/{post_type}/{id}`
- Delete: `DELETE /wp/v2/{post_type}/{id}`

Add `_embed` parameter to include nested data:
```
GET /wp/v2/posts/123?_embed
```

## Testing

### Frontend Build Test

```bash
cd frontend
npm run build

# Check for build errors
# Verify build/ directory created
```

### Manual Testing Checklist

- [ ] Homepage loads
- [ ] Navigation works
- [ ] Articles page filters work
- [ ] Article detail page loads
- [ ] About page shows committee
- [ ] Committee images load
- [ ] Responsive design works (mobile/tablet)
- [ ] No console errors

### API Testing

```bash
# Test endpoints
curl http://localhost:8080/wp-json/wp/v2/posts
curl http://localhost:8080/wp-json/wp/v2/committee-member
curl http://localhost:8080/wp-json/wp/v2/pages
```

## Debugging

### Frontend Debugging

1. **Browser DevTools**
   - Right-click → Inspect
   - Console tab for errors
   - Network tab for API calls
   - React DevTools browser extension

2. **View logs**
   ```bash
   docker-compose logs -f frontend
   ```

3. **Check API calls**
   - Open Browser Console
   - Check Network tab
   - Verify response status and data

### WordPress Debugging

Enable debug mode:

```php
// In WordPress admin, plugins, or .env
WORDPRESS_DEBUG=true
WORDPRESS_DEBUG_LOG=true

// View logs
docker-compose exec wordpress tail -f /var/www/html/wp-content/debug.log
```

### Database Inspection

```bash
# Connect to MySQL
docker-compose exec db mysql -u wordpress -pwordpress

# Common queries
USE wordpress;
SELECT ID, post_title, post_type FROM wp_posts;
SELECT * FROM wp_postmeta WHERE meta_key='_thumbnail_id';
```

## Git Workflow

### Branch Naming

- Feature: `feature/description`
- Bugfix: `bugfix/description`
- Release: `release/version`

```bash
git checkout -b feature/new-feature
# Make changes
git add .
git commit -m "Add new feature"
git push origin feature/new-feature

# Create Merge Request on GitLab
```

### Commit Messages

Use clear, descriptive messages:

```
# Good
"feat: Add committee member filtering by department"
"fix: Correct navbar mobile menu animation"
"docs: Update deployment guide"

# Bad
"fix stuff"
"update"
"changes"
```

## Performance Optimization

### Frontend

- Use React DevTools Profiler
- Code splitting with React.lazy()
- Image optimization (use featured images)
- Memoization for expensive components

### WordPress

- Enable object caching (Redis plugin)
- Image optimization via WordPress plugins
- Database indexing
- Query optimization

## Common Issues

### Port Already in Use

```bash
# Find process using port
sudo lsof -i :3000
sudo lsof -i :8080

# Kill process or use different port
```

### Changes Not Appearing

```bash
# Frontend hot reload might be stuck
docker-compose restart frontend

# Browser cache
Ctrl+Shift+R (hard refresh)

# Docker cache
docker-compose build --no-cache frontend
```

### API Connection Failed

```bash
# Verify WordPress is running
curl http://localhost:8080/wp-json

# Check Docker network
docker-compose exec frontend nslookup wordpress

# View logs
docker-compose logs wordpress
```

### Database Connection Error

```bash
# Verify MySQL is running
docker-compose exec db mysql -u wordpress -pwordpress -e "SELECT 1"

# Check environment variables
docker-compose config | grep WORDPRESS_DB
```

## Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)
- [Docker Compose](https://docs.docker.com/compose/)
- [React Router](https://reactrouter.com/)

## Getting Help

1. Check project README and DEPLOYMENT guide
2. Review error logs: `docker-compose logs -f`
3. Check browser console for JavaScript errors
4. Ask in team chat or create GitLab issue

## Contributing

1. Create feature branch
2. Make changes with clear commits
3. Test locally
4. Push and create Merge Request
5. Wait for CI/CD pipeline to pass
6. Request review from team
7. Merge when approved
