import { Router } from 'express';
import { getPopularTags, getTagById, getTags } from '../controllers/tagController';

const router = Router() as Router;

// GET /api/tags - Get all tags
router.get('/', getTags);

// GET /api/tags/popular - Get popular tags (most used)
router.get('/popular', getPopularTags);

// GET /api/tags/:id - Get single tag by ID
router.get('/:id', getTagById);

export default router;