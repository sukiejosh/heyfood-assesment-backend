import { relations } from 'drizzle-orm';
import { boolean, decimal, integer, pgTable, primaryKey, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

// Tags table - for food categories like "Rice", "Chicken", etc.
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 50 }).notNull().unique(),
  slug: varchar('slug', { length: 50 }).notNull().unique(),
  icon: varchar('icon', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Restaurants table
export const restaurants = pgTable('restaurants', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 100 }).notNull(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  description: text('description'),
  image: varchar('image', { length: 255 }),
  rating: decimal('rating', { precision: 3, scale: 2 }).notNull().default('0'),
  reviewCount: integer('review_count').notNull().default(0),
  deliveryTime: varchar('delivery_time', { length: 50 }),
  deliveryFee: decimal('delivery_fee', { precision: 10, scale: 2 }),
  minimumOrder: decimal('minimum_order', { precision: 10, scale: 2 }),
  isActive: boolean('is_active').notNull().default(true),
  isOpen: boolean('is_open').notNull().default(true),
  address: text('address'),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 100 }),
  openingTime: varchar('opening_time', { length: 10 }),
  closingTime: varchar('closing_time', { length: 10 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const restaurantTags = pgTable('restaurant_tags', {
  restaurantId: integer('restaurant_id').notNull().references(() => restaurants.id, { onDelete: 'cascade' }),
  tagId: integer('tag_id').notNull().references(() => tags.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  pk: primaryKey({ columns: [table.restaurantId, table.tagId] })
}));

// Define relations
export const restaurantRelations = relations(restaurants, ({ many }) => ({
  restaurantTags: many(restaurantTags),
}));

export const tagRelations = relations(tags, ({ many }) => ({
  restaurantTags: many(restaurantTags),
}));

export const restaurantTagRelations = relations(restaurantTags, ({ one }) => ({
  restaurant: one(restaurants, {
    fields: [restaurantTags.restaurantId],
    references: [restaurants.id],
  }),
  tag: one(tags, {
    fields: [restaurantTags.tagId],
    references: [tags.id],
  }),
}));

// Types for TypeScript
export type Restaurant = typeof restaurants.$inferSelect;
export type NewRestaurant = typeof restaurants.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type RestaurantTag = typeof restaurantTags.$inferSelect;
export type NewRestaurantTag = typeof restaurantTags.$inferInsert;