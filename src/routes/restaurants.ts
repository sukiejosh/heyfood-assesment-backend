import { Router } from 'express';
import { getRestaurantById, getRestaurants } from '../controllers/restaurantController';

const router = Router() as Router;

// GET /api/restaurants - Get all restaurants with filtering, sorting, and pagination
router.get('/', getRestaurants);

// GET /api/restaurants/:id - Get single restaurant by ID
router.get('/:id', getRestaurantById);

export default router;