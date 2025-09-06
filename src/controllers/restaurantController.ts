import { Request, Response } from 'express';
import { db } from '../config/database';
import { restaurants, tags, restaurantTags } from '../models/schema';
import { eq, and, ilike, desc, asc, sql, inArray } from 'drizzle-orm';

export interface RestaurantQuery {
  search?: string;
  tags?: string | string[];
  sortBy?: 'rating' | 'reviewCount' | 'deliveryTime' | 'deliveryFee' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: string;
  limit?: string;
}

export const getRestaurants = async (req: Request<{}, {}, {}, RestaurantQuery>, res: Response): Promise<Response | void> => {
  try {
    const {
      search,
      tags: tagFilter,
      sortBy = 'rating',
      sortOrder = 'desc',
      page = '1',
      limit = '20'
    } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Build where conditions
    const conditions = [];
    conditions.push(eq(restaurants.isActive, true));
    
    if (search) {
      conditions.push(ilike(restaurants.name, `%${search}%`));
    }

    // If tag filtering is specified, get restaurants that have those tags
    let restaurantIds: number[] | undefined;
    if (tagFilter) {
      const tagNames = Array.isArray(tagFilter) ? tagFilter : [tagFilter];
      
      // Get restaurant IDs that have all the specified tags
      const taggedRestaurants = await db
        .select({
          restaurantId: restaurantTags.restaurantId,
          tagCount: sql<number>`COUNT(DISTINCT ${restaurantTags.tagId})`
        })
        .from(restaurantTags)
        .innerJoin(tags, eq(restaurantTags.tagId, tags.id))
        .where(inArray(tags.name, tagNames))
        .groupBy(restaurantTags.restaurantId)
        .having(sql`COUNT(DISTINCT ${restaurantTags.tagId}) = ${tagNames.length}`);

      restaurantIds = taggedRestaurants.map(r => r.restaurantId);
      
      if (restaurantIds.length === 0) {
        // No restaurants match the tag criteria
        return res.json({
          success: true,
          data: [],
          pagination: {
            page: pageNum,
            limit: limitNum,
            total: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPrevPage: pageNum > 1
          },
          filters: { search, tags: tagFilter, sortBy, sortOrder }
        });
      }
      
      conditions.push(inArray(restaurants.id, restaurantIds));
    }

    // Build order by clause
    let orderByClause;
    if (sortBy === 'rating') {
      orderByClause = sortOrder === 'desc' ? desc(restaurants.rating) : asc(restaurants.rating);
    } else if (sortBy === 'reviewCount') {
      orderByClause = sortOrder === 'desc' ? desc(restaurants.reviewCount) : asc(restaurants.reviewCount);
    } else if (sortBy === 'deliveryTime') {
      orderByClause = sortOrder === 'desc' ? desc(restaurants.deliveryTime) : asc(restaurants.deliveryTime);
    } else if (sortBy === 'deliveryFee') {
      orderByClause = sortOrder === 'desc' ? desc(restaurants.deliveryFee) : asc(restaurants.deliveryFee);
    } else if (sortBy === 'name') {
      orderByClause = sortOrder === 'desc' ? desc(restaurants.name) : asc(restaurants.name);
    } else {
      orderByClause = desc(restaurants.rating); // default
    }

    // Build and execute main query with aggregated tags
    const result = await db
      .select({
        id: restaurants.id,
        name: restaurants.name,
        slug: restaurants.slug,
        description: restaurants.description,
        image: restaurants.image,
        rating: restaurants.rating,
        reviewCount: restaurants.reviewCount,
        deliveryTime: restaurants.deliveryTime,
        deliveryFee: restaurants.deliveryFee,
        minimumOrder: restaurants.minimumOrder,
        isActive: restaurants.isActive,
        isOpen: restaurants.isOpen,
        address: restaurants.address,
        phone: restaurants.phone,
        email: restaurants.email,
        openingTime: restaurants.openingTime,
        closingTime: restaurants.closingTime,
        createdAt: restaurants.createdAt,
        updatedAt: restaurants.updatedAt,
        tags: sql<string[]>`COALESCE(
          ARRAY_AGG(DISTINCT ${tags.name}) FILTER (WHERE ${tags.name} IS NOT NULL),
          ARRAY[]::varchar[]
        )`
      })
      .from(restaurants)
      .leftJoin(restaurantTags, eq(restaurants.id, restaurantTags.restaurantId))
      .leftJoin(tags, eq(restaurantTags.tagId, tags.id))
      .where(and(...conditions))
      .groupBy(
        restaurants.id,
        restaurants.name,
        restaurants.slug,
        restaurants.description,
        restaurants.image,
        restaurants.rating,
        restaurants.reviewCount,
        restaurants.deliveryTime,
        restaurants.deliveryFee,
        restaurants.minimumOrder,
        restaurants.isActive,
        restaurants.isOpen,
        restaurants.address,
        restaurants.phone,
        restaurants.email,
        restaurants.openingTime,
        restaurants.closingTime,
        restaurants.createdAt,
        restaurants.updatedAt
      )
      .orderBy(orderByClause)
      .limit(limitNum)
      .offset(offset);

    // Get total count for pagination
    const countQuery = await db
      .select({ count: sql<number>`COUNT(DISTINCT ${restaurants.id})` })
      .from(restaurants)
      .where(and(...conditions));

    const total = countQuery[0].count;
    const totalPages = Math.ceil(total / limitNum);

    return res.json({
      success: true,
      data: result,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      },
      filters: {
        search,
        tags: tagFilter,
        sortBy,
        sortOrder
      }
    });

  } catch (error) {
    console.error('Error fetching restaurants:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch restaurants'
    });
  }
};

export const getRestaurantById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const restaurantId = parseInt(id);

    if (isNaN(restaurantId)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid restaurant ID'
      });
    }

    const result = await db
      .select({
        id: restaurants.id,
        name: restaurants.name,
        slug: restaurants.slug,
        description: restaurants.description,
        image: restaurants.image,
        rating: restaurants.rating,
        reviewCount: restaurants.reviewCount,
        deliveryTime: restaurants.deliveryTime,
        deliveryFee: restaurants.deliveryFee,
        minimumOrder: restaurants.minimumOrder,
        isActive: restaurants.isActive,
        isOpen: restaurants.isOpen,
        address: restaurants.address,
        phone: restaurants.phone,
        email: restaurants.email,
        openingTime: restaurants.openingTime,
        closingTime: restaurants.closingTime,
        createdAt: restaurants.createdAt,
        updatedAt: restaurants.updatedAt,
        tags: sql<string[]>`COALESCE(
          ARRAY_AGG(DISTINCT ${tags.name}) FILTER (WHERE ${tags.name} IS NOT NULL),
          ARRAY[]::varchar[]
        )`
      })
      .from(restaurants)
      .leftJoin(restaurantTags, eq(restaurants.id, restaurantTags.restaurantId))
      .leftJoin(tags, eq(restaurantTags.tagId, tags.id))
      .where(eq(restaurants.id, restaurantId))
      .groupBy(
        restaurants.id,
        restaurants.name,
        restaurants.slug,
        restaurants.description,
        restaurants.image,
        restaurants.rating,
        restaurants.reviewCount,
        restaurants.deliveryTime,
        restaurants.deliveryFee,
        restaurants.minimumOrder,
        restaurants.isActive,
        restaurants.isOpen,
        restaurants.address,
        restaurants.phone,
        restaurants.email,
        restaurants.openingTime,
        restaurants.closingTime,
        restaurants.createdAt,
        restaurants.updatedAt
      );

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Restaurant not found'
      });
    }

    return res.json({
      success: true,
      data: result[0]
    });

  } catch (error) {
    console.error('Error fetching restaurant:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch restaurant'
    });
  }
};