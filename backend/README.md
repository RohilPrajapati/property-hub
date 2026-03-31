# Simple django app with real-state search functionally with Django and Postgres




### Project Structure

```
backend/
├── config/             # Project settings and core configuration
│   ├── settings.py     # Main Django settings
│   ├── urls.py         # Root URL routing
│   └── serializers.py  # Global/Auth serializers
├── property/           # Main Property application
│   ├── commands/       # Custom Management Commands
│   │   ├── seed_agents.py     # Seed script for Agent data
│   │   └── seed_properties.py # Seed script for Property listings
│   ├── migrations/     # Database migration files
│   ├── models.py       # Property and Agent database schemas
│   ├── paginations.py  # Custom CursorPagination logic
│   ├── serializers.py  # Property-specific serialization
│   ├── views.py        # API logic (Search, List, Detail)
│   └── urls.py         # Property app routing
├── media/              # Uploaded property images
├── manage.py           # Django management script
├── pyproject.toml      # Project dependencies (uv/pip)
└── uv.lock             # Deterministic dependency lock file
```

🚀 Getting Started
1. Installation
This project uses uv for lightning-fast dependency management.

```bash
# Install dependencies
uv sync
```

2. Configuration
Create a .env file in the root directory:

```
SECRET_KEY = "<your-secret>"

DB_NAME="real_estate_db"
DB_USER="<user_name>"
DB_PASSWORD="<your_password>"
DB_HOST="127.0.0.1"
DB_PORT="5432"
```
3. Database Setup & Seeding
Prepare your database and populate it with sample data:

```bash
# Run migrations
uv run manage.py migrate
# or
# python manage.py migrate

# Seed dummy data
uv run manage.py seed_agents
# or
# python manage.py seed_agents

uv run manage.py seed_properties
# or
# python  manage.py seed_properties

# create admin user
uv run manage.py createsuperuser

# create normal user
uv run manage.py create_normal_user

```
4. Development
Run the development server:

```bash
uv run manage.py runserver
# or
# python manage.py runserver
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/login/` | Login & get JWT tokens |
| `GET` | `/listings/` | List properties (with filters) |
| `GET` | `/listings/{id}/` | Get specific property details |

for more detail : 
[API Detail README](./API_DETAIL.md) — include all three endpoint with response