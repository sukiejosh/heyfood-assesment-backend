# HeyFood Backend API

A robust Node.js + Express + TypeScript backend API for the HeyFood restaurant discovery application using PostgreSQL and Drizzle ORM.

## 🚀 Features

- **Restaurant Management**: Full CRUD operations with advanced filtering
- **Tag System**: Dynamic food category tags with restaurant associations
- **Search & Filter**: Full-text search, multi-tag filtering, flexible sorting, and pagination
- **Database**: PostgreSQL with Drizzle ORM for type-safe queries
- **Performance**: Optimized queries with proper indexing and connection pooling
- **Security**: Helmet middleware, CORS, and input validation

## 🛠 Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js 5.1.0
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with pg driver
- **Security**: Helmet, CORS
- **Development**: Nodemon, ts-node
- **Utilities**: dotenv, morgan (logging)

## 📊 Database Schema

### Core Tables

```sql
restaurants (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  description TEXT,
  image VARCHAR(255),
  rating DECIMAL(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  delivery_time VARCHAR(20),
  delivery_fee DECIMAL(8,2),
  minimum_order DECIMAL(8,2),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(100),
  opening_time TIME,
  closing_time TIME,
  is_active BOOLEAN DEFAULT true,
  is_open BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  slug VARCHAR(60) UNIQUE NOT NULL,
  icon VARCHAR(30),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)

restaurant_tags (
  restaurant_id INTEGER REFERENCES restaurants(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (restaurant_id, tag_id)
)
```

### Database Features
- **Optimized indexes** for search and filtering
- **Foreign key constraints** with cascade deletes
- **Unique constraints** on names and slugs
- **Automatic timestamps** for audit trails

## 🌐 API Endpoints

### Restaurant Endpoints

#### GET `/api/restaurants`
Get restaurants with advanced filtering and pagination.

**Query Parameters:**
- `search` - Full-text search by restaurant name
- `tags` - Filter by food tags (multiple values supported)
- `sortBy` - Sort field: `rating`, `reviewCount`, `deliveryTime`, `deliveryFee`, `name`
- `sortOrder` - Sort direction: `asc` or `desc` (default: `desc`)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)

**Example Responses:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Hexagon Rice Samonda",
      "rating": "4.30",
      "reviewCount": 4862,
      "deliveryTime": "20-30 mins",
      "deliveryFee": "500.00",
      "tags": ["Rice", "Chicken", "Turkey"]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": "10",
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "filters": {
    "sortBy": "rating",
    "sortOrder": "desc"
  }
}
```

#### GET `/api/restaurants/:id`
Get a specific restaurant by ID.

### Tag Endpoints

#### GET `/api/tags`
Get all tags with restaurant counts, sorted by popularity.

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Rice",
      "slug": "rice",
      "icon": "rice-bowl",
      "restaurantCount": "5"
    }
  ],
  "total": 13
}
```

#### GET `/api/tags/popular`
Get the top 10 most popular tags.

#### GET `/api/tags/:id`
Get a specific tag by ID.

### Health Endpoint

#### GET `/health`
Health check endpoint for monitoring.

```json
{
  "status": "OK",
  "message": "HeyFood Backend API is running",
  "timestamp": "2025-09-06T17:30:11.364Z"
}
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18 or higher
- **PostgreSQL** 12 or higher
- **pnpm** package manager

### Installation

1. **Navigate to backend directory:**
```bash
cd heyfood-backend
```

2. **Install dependencies:**
```bash
pnpm install
```

3. **Environment configuration:**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=5001
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/heyfood_db
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=heyfood_db
```

4. **Database setup:**
```bash
# Create database (if not exists)
createdb heyfood_db

# Run database migrations
pnpm db:migrate

# Seed with sample data
pnpm db:seed
```

5. **Start development server:**
```bash
pnpm dev
```

The API will be available at `http://localhost:5001`

### Production Deployment

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 📁 Project Structure

```
src/
├── config/
│   └── database.ts         # Database connection and configuration
├── controllers/
│   ├── restaurantController.ts  # Restaurant business logic
│   └── tagController.ts         # Tag business logic
├── models/
│   └── schema.ts           # Drizzle ORM schema definitions
├── routes/
│   ├── index.ts           # Main router
│   ├── restaurants.ts     # Restaurant routes
│   └── tags.ts           # Tag routes
├── scripts/
│   ├── migrate.ts        # Database migration script
│   └── seed.ts           # Database seeding script
└── index.ts              # Main application entry point
```

## 📋 Available Scripts

```bash
pnpm dev          # Start development server with hot reload
pnpm build        # Build TypeScript to JavaScript
pnpm start        # Start production server
pnpm db:migrate   # Run database migrations
pnpm db:seed      # Seed database with sample data
pnpm db:studio    # Open Drizzle Studio (database GUI)
```

## 🔍 API Usage Examples

### Get all restaurants
```bash
curl "http://localhost:5001/api/restaurants"
```

### Search restaurants by name
```bash
curl "http://localhost:5001/api/restaurants?search=rice"
```

### Filter by multiple tags
```bash
curl "http://localhost:5001/api/restaurants?tags=Rice&tags=Chicken"
```

### Sort by rating (descending) with pagination
```bash
curl "http://localhost:5001/api/restaurants?sortBy=rating&sortOrder=desc&page=1&limit=10"
```

### Complex filtering (search + tags + sort)
```bash
curl "http://localhost:5001/api/restaurants?search=hexagon&tags=Rice&sortBy=reviewCount&sortOrder=desc"
```

### Get all tags
```bash
curl "http://localhost:5001/api/tags"
```

### Get popular tags
```bash
curl "http://localhost:5001/api/tags/popular"
```

## 🎯 Performance Features

### Database Optimizations
- **Indexes** on frequently queried columns (`name`, `rating`, `tags`)
- **Connection pooling** for efficient database connections
- **Query optimization** with proper JOINs and subqueries
- **Pagination** to limit result set sizes

### API Optimizations
- **CORS configuration** for frontend integration
- **Request logging** with Morgan middleware
- **Error handling** with proper HTTP status codes
- **Input validation** and sanitization

## 🔧 Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `PORT` | Server port | 5001 | No |
| `NODE_ENV` | Environment mode | development | No |
| `DATABASE_URL` | Full PostgreSQL connection string | - | Yes |
| `DB_HOST` | Database host | localhost | Yes |
| `DB_PORT` | Database port | 5432 | Yes |
| `DB_USER` | Database username | - | Yes |
| `DB_PASSWORD` | Database password | - | Yes |
| `DB_NAME` | Database name | - | Yes |

## 🛡 Security Features

- **Helmet**: Security headers protection
- **CORS**: Cross-origin request configuration
- **Input validation**: Request parameter validation
- **Error handling**: Secure error responses
- **Environment variables**: Sensitive data protection

## 🧪 Sample Data

The database includes sample data for:
- **10 restaurants** with realistic Nigerian restaurant data
- **13 food tags** (Rice, Chicken, Shawarma, Juice, etc.)
- **Restaurant-tag associations** for filtering and search

## 🔄 Database Migrations

The application uses Drizzle ORM for database schema management:

```bash
# Generate new migration
pnpm db:generate

# Run migrations
pnpm db:migrate

# View database in GUI
pnpm db:studio
```

## ❗ Error Handling

Comprehensive error handling with:
- **HTTP status codes**: Proper 4xx and 5xx responses
- **Structured responses**: Consistent error format
- **Development logging**: Detailed errors in development
- **Production safety**: Sanitized errors in production

## 🚀 Ready for Production

The backend is production-ready with:
- **TypeScript compilation**: Type-safe JavaScript output
- **Environment configuration**: Flexible deployment options
- **Database migrations**: Version-controlled schema changes
- **Health monitoring**: Built-in health check endpoint
- **Scalable architecture**: Clean separation of concerns

---

Built with ❤️ using Node.js, Express, TypeScript, and PostgreSQL.