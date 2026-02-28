# SPARK

A headless WordPress CMS with a React frontend, featuring committee member management, custom design blocks, and Docker-based deployment.

## Tech Stack

- **Frontend** — React 18, React Router v6, Tailwind CSS 3.3, Axios
- **Backend** — WordPress 6.5 (headless), PHP 8.2, MySQL 8.0
- **DevOps** — Docker & Docker Compose

## Quick Start

### Prerequisites

- Docker Desktop
- Git

### Setup

```bash
# 1. Clone & enter the project
git clone <your-repo-url>
cd SPARK

# 2. Copy and configure environment variables
cp .env.example .env
# Edit .env and set your own passwords

# 3. Start everything
docker-compose up -d

# 4. Verify
docker-compose ps
```

### Access

| Service          | URL                                  |
| ---------------- | ------------------------------------ |
| Frontend         | http://localhost:3000                |
| WordPress Admin  | http://localhost:8080/wp-admin       |
| REST API         | http://localhost:8080/wp-json        |

### First Time WordPress Setup

1. Visit http://localhost:8080/wp-admin and complete the setup wizard
2. Create an "About" page and publish it
3. Add committee members via the "Committee Members" menu
4. Create posts with featured images — they appear on the frontend automatically

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── components/     # NavBar, ArticleCard, CommitteeMembers, ContentRenderer, etc.
│   │   ├── pages/          # HomePage, ArticlesPage, ArticlePage, AboutPage, MagazinePage, etc.
│   │   ├── services/       # apiService.js — centralised API layer
│   │   ├── context/        # SiteContext for global settings
│   │   ├── hooks/          # useAnimations
│   │   ├── utils/          # media helpers
│   │   ├── App.js
│   │   └── index.css       # Tailwind + custom styles
│   ├── Dockerfile
│   └── package.json
├── wordpress/
│   └── mu-plugins/         # committee-members, headless-cors, custom-design-blocks, site-settings, custom-menus
├── docker-compose.yml      # Development
├── docker-compose.prod.yml # Production
├── .env.example
└── README.md
```

## API Endpoints

| Endpoint                       | Description          |
| ------------------------------ | -------------------- |
| `GET /wp/v2/posts`             | All posts            |
| `GET /wp/v2/posts?search=...`  | Search posts         |
| `GET /wp/v2/pages`             | All pages            |
| `GET /wp/v2/committee-member`  | All committee members|
| `GET /wp/v2/categories`        | All categories       |

All endpoints support `?_embed` for nested data.

## Environment Variables

See `.env.example` for all available variables. Key ones:

| Variable                       | Purpose                        |
| ------------------------------ | ------------------------------ |
| `REACT_APP_WP_BASE_URL`       | WordPress URL for the frontend |
| `WORDPRESS_DB_PASSWORD`        | Database password               |
| `WORDPRESS_DB_ROOT_PASSWORD`   | Database root password          |
| `WORDPRESS_ADMIN_PASSWORD`     | WP admin password               |

> **Important:** Change all default passwords before any non-local deployment.

## Common Commands

```bash
# Rebuild frontend after code changes
docker-compose up -d --build frontend

# View logs
docker-compose logs -f frontend
docker-compose logs -f wordpress

# Database backup
docker-compose exec db mysqldump -u wordpress -p wordpress > backup.sql

# Database restore
docker-compose exec -T db mysql -u wordpress -p wordpress < backup.sql

# Stop everything
docker-compose down
```

## Troubleshooting

- **Port conflict** — Stop the conflicting container with `docker stop <id>`, or change ports in `docker-compose.yml`.
- **WordPress not starting** — Run `docker-compose logs wordpress` and check for DB connection errors.
- **Committee members missing** — Verify `wordpress/mu-plugins/committee-members.php` exists as a volume mount, then test the API at `/wp-json/wp/v2/committee-member`.
- **Frontend build failing** — Run `docker-compose build --no-cache frontend` for a clean rebuild.
- **CORS errors** — Check `wordpress/mu-plugins/headless-cors.php` and ensure `REACT_APP_WP_BASE_URL` is correct.

## License

Proprietary — SPARK © 2024–2026

