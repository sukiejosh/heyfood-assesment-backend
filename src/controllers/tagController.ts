import { desc, eq, sql } from 'drizzle-orm';
import { Request, Response } from 'express';
import { db } from '../config/database';
import { restaurantTags, restaurants, tags } from '../models/schema';

export const getTags = async (_: Request, res: Response): Promise<Response> => {
  try {
    // Get all tags with restaurant count
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        icon: tags.icon,
        restaurantCount: sql<number>`COUNT(DISTINCT ${restaurantTags.restaurantId})`,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
      })
      .from(tags)
      .leftJoin(restaurantTags, eq(tags.id, restaurantTags.tagId))
      .leftJoin(restaurants, eq(restaurantTags.restaurantId, restaurants.id))
      .where(eq(restaurants.isActive, true))
      .groupBy(tags.id, tags.name, tags.slug, tags.icon, tags.createdAt, tags.updatedAt)
      .orderBy(desc(sql`COUNT(DISTINCT ${restaurantTags.restaurantId})`), tags.name);

    return res.json({
      success: true,
      data: result,
      total: result.length
    });

  } catch (error) {
    console.error('Error fetching tags:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch tags'
    });
  }
};

export const getTagById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const tagId = parseInt(id);

    if (isNaN(tagId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid tag ID'
      });
    }

    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        icon: tags.icon,
        restaurantCount: sql<number>`COUNT(DISTINCT ${restaurantTags.restaurantId})`,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
      })
      .from(tags)
      .leftJoin(restaurantTags, eq(tags.id, restaurantTags.tagId))
      .leftJoin(restaurants, eq(restaurantTags.restaurantId, restaurants.id))
      .where(eq(tags.id, tagId))
      .groupBy(tags.id, tags.name, tags.slug, tags.icon, tags.createdAt, tags.updatedAt);

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Tag not found'
      });
    }

    return res.json({
      success: true,
      data: result[0]
    });

  } catch (error) {
    console.error('Error fetching tag:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch tag'
    });
  }
};

export const getPopularTags = async (_: Request, res: Response): Promise<Response> => {
  try {
    const result = await db
      .select({
        id: tags.id,
        name: tags.name,
        slug: tags.slug,
        icon: tags.icon,
        restaurantCount: sql<number>`COUNT(DISTINCT ${restaurantTags.restaurantId})`,
        createdAt: tags.createdAt,
        updatedAt: tags.updatedAt,
      })
      .from(tags)
      .leftJoin(restaurantTags, eq(tags.id, restaurantTags.tagId))
      .leftJoin(restaurants, eq(restaurantTags.restaurantId, restaurants.id))
      .where(eq(restaurants.isActive, true))
      .groupBy(tags.id, tags.name, tags.slug, tags.icon, tags.createdAt, tags.updatedAt)
      .having(sql`COUNT(DISTINCT ${restaurantTags.restaurantId}) > 0`)
      .orderBy(desc(sql`COUNT(DISTINCT ${restaurantTags.restaurantId})`), tags.name)
      .limit(10);

    return res.json({
      success: true,
      data: result,
      total: result.length
    });

  } catch (error) {
    console.error('Error fetching popular tags:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch popular tags'
    });
  }
};