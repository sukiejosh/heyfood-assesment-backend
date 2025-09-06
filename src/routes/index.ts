import { Router } from 'express';
import restaurantRoutes from './restaurants';
import tagRoutes from './tags';

const router = Router() as Router;

// API Routes
router.use('/restaurants', restaurantRoutes);
router.use('/tags', tagRoutes);

// API info endpoint
router.get('/', (_, res) => {
  res.json({
    message: 'HeyFood API v1.0',
    version: '1.0.0',
    endpoints: {
      restaurants: '/api/restaurants',
      tags: '/api/tags',
      health: '/health'
    },
    documentation: {
      restaurants: {
        'GET /api/restaurants': 'Get restaurants with optional filters',
        'GET /api/restaurants/:id': 'Get specific restaurant',
        'Query parameters': {
          search: 'Search by restaurant name',
          tags: 'Filter by food tags (comma-separated or array)',
          sortBy: 'Sort by: rating, reviewCount, deliveryTime, deliveryFee, name',
          sortOrder: 'asc or desc (default: desc)',
          page: 'Page number (default: 1)',
          limit: 'Items per page (default: 20)'
        }
      },
      tags: {
        'GET /api/tags': 'Get all tags with restaurant counts',
        'GET /api/tags/popular': 'Get top 10 popular tags',
        'GET /api/tags/:id': 'Get specific tag'
      }
    }
  });
});

export default router;