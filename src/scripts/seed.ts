import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import { restaurants, tags, restaurantTags } from '../models/schema';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

const db = drizzle(pool);

const sampleTags = [
  { name: 'Rice', slug: 'rice', icon: 'rice-bowl' },
  { name: 'Chicken', slug: 'chicken', icon: 'chicken' },
  { name: 'Shawarma', slug: 'shawarma', icon: 'shawarma' },
  { name: 'Juice', slug: 'juice', icon: 'juice' },
  { name: 'Goat meat', slug: 'goat-meat', icon: 'goat-meat' },
  { name: 'Fastfood', slug: 'fastfood', icon: 'fastfood' },
  { name: 'Amala', slug: 'amala', icon: 'amala' },
  { name: 'Soup bowl', slug: 'soup-bowl', icon: 'soup' },
  { name: 'Grills', slug: 'grills', icon: 'grill' },
  { name: 'Turkey', slug: 'turkey', icon: 'turkey' },
  { name: 'Grocery', slug: 'grocery', icon: 'grocery' },
  { name: 'Vegetable', slug: 'vegetable', icon: 'vegetable' },
  { name: 'Doughnuts', slug: 'doughnuts', icon: 'donut' },
  { name: 'Smoothies', slug: 'smoothies', icon: 'smoothie' }
];

const sampleRestaurants = [
  {
    name: 'Hexagon Rice Samonda',
    slug: 'hexagon-rice-samonda',
    description: 'Best rice dishes in town with authentic Nigerian flavors',
    image: '/api/placeholder/300/200',
    rating: '4.3',
    reviewCount: 4862,
    deliveryTime: '20-30 mins',
    deliveryFee: '500.00',
    minimumOrder: '2000.00',
    address: 'Samonda, Ibadan, Oyo State',
    phone: '+2348123456789',
    email: 'info@hexagonrice.com',
    openingTime: '08:00',
    closingTime: '22:00',
    tags: ['Rice', 'Chicken', 'Turkey']
  },
  {
    name: 'LPD ofada rice',
    slug: 'lpd-ofada-rice',
    description: 'Authentic Ofada rice with local sauces',
    image: '/api/placeholder/300/200',
    rating: '4.3',
    reviewCount: 2,
    deliveryTime: '25-35 mins',
    deliveryFee: '600.00',
    minimumOrder: '1500.00',
    address: 'UI Area, Ibadan, Oyo State',
    phone: '+2348987654321',
    email: 'contact@lpdofada.com',
    openingTime: '09:00',
    closingTime: '21:00',
    tags: ['Rice', 'Grocery']
  },
  {
    name: 'Richbites',
    slug: 'richbites',
    description: 'Grills and shawarma specialists',
    image: '/api/placeholder/300/200',
    rating: '4.4',
    reviewCount: 776,
    deliveryTime: '15-25 mins',
    deliveryFee: '400.00',
    minimumOrder: '1800.00',
    address: 'Bodija, Ibadan, Oyo State',
    phone: '+2347012345678',
    email: 'hello@richbites.ng',
    openingTime: '10:00',
    closingTime: '23:00',
    tags: ['Grills', 'Shawarma']
  },
  {
    name: 'Richmix',
    slug: 'richmix',
    description: 'Mixed rice dishes with various proteins',
    image: '/api/placeholder/300/200',
    rating: '5.0',
    reviewCount: 0,
    deliveryTime: '20-30 mins',
    deliveryFee: '500.00',
    minimumOrder: '2500.00',
    address: 'Challenge, Ibadan, Oyo State',
    phone: '+2348555666777',
    email: 'orders@richmix.com',
    openingTime: '08:30',
    closingTime: '21:30',
    tags: ['Rice']
  },
  {
    name: 'Rich Table',
    slug: 'rich-table',
    description: 'Fine dining with premium rice dishes',
    image: '/api/placeholder/300/200',
    rating: '5.0',
    reviewCount: 0,
    deliveryTime: '30-40 mins',
    deliveryFee: '800.00',
    minimumOrder: '3000.00',
    address: 'Jericho, Ibadan, Oyo State',
    phone: '+2349876543210',
    email: 'info@richtable.ng',
    openingTime: '11:00',
    closingTime: '22:00',
    tags: ['Rice']
  },
  {
    name: 'Campus Rice',
    slug: 'campus-rice',
    description: 'Student-friendly rice meals at affordable prices',
    image: '/api/placeholder/300/200',
    rating: '4.1',
    reviewCount: 156,
    deliveryTime: '15-25 mins',
    deliveryFee: '300.00',
    minimumOrder: '1200.00',
    address: 'UI Campus, Ibadan, Oyo State',
    phone: '+2347123456789',
    email: 'hello@campusrice.com',
    openingTime: '07:00',
    closingTime: '20:00',
    tags: ['Rice', 'Fastfood']
  },
  {
    name: 'Mama Cass Kitchen',
    slug: 'mama-cass-kitchen',
    description: 'Traditional Nigerian meals with modern touch',
    image: '/api/placeholder/300/200',
    rating: '4.6',
    reviewCount: 892,
    deliveryTime: '25-35 mins',
    deliveryFee: '600.00',
    minimumOrder: '2200.00',
    address: 'Ring Road, Ibadan, Oyo State',
    phone: '+2348456789123',
    email: 'orders@mamacass.ng',
    openingTime: '08:00',
    closingTime: '21:00',
    tags: ['Amala', 'Soup bowl', 'Goat meat']
  },
  {
    name: 'Grill Master',
    slug: 'grill-master',
    description: 'Expert grilling and barbecue specialists',
    image: '/api/placeholder/300/200',
    rating: '4.5',
    reviewCount: 634,
    deliveryTime: '20-30 mins',
    deliveryFee: '500.00',
    minimumOrder: '2000.00',
    address: 'Dugbe, Ibadan, Oyo State',
    phone: '+2349012345678',
    email: 'info@grillmaster.com',
    openingTime: '12:00',
    closingTime: '23:30',
    tags: ['Grills', 'Chicken', 'Turkey']
  },
  {
    name: 'Juice Paradise',
    slug: 'juice-paradise',
    description: 'Fresh juices and smoothies all day',
    image: '/api/placeholder/300/200',
    rating: '4.2',
    reviewCount: 425,
    deliveryTime: '10-20 mins',
    deliveryFee: '300.00',
    minimumOrder: '800.00',
    address: 'Cocoa House, Ibadan, Oyo State',
    phone: '+2347789456123',
    email: 'fresh@juiceparadise.ng',
    openingTime: '06:00',
    closingTime: '20:00',
    tags: ['Juice', 'Smoothies']
  },
  {
    name: 'Sweet Treats',
    slug: 'sweet-treats',
    description: 'Delicious doughnuts and pastries',
    image: '/api/placeholder/300/200',
    rating: '4.0',
    reviewCount: 289,
    deliveryTime: '15-25 mins',
    deliveryFee: '400.00',
    minimumOrder: '1000.00',
    address: 'Polytechnic Area, Ibadan, Oyo State',
    phone: '+2348321654987',
    email: 'sweet@treats.ng',
    openingTime: '07:30',
    closingTime: '19:00',
    tags: ['Doughnuts', 'Fastfood']
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await db.delete(restaurantTags);
    await db.delete(restaurants);
    await db.delete(tags);

    // Insert tags
    console.log('🏷️ Inserting tags...');
    const insertedTags = await db.insert(tags).values(sampleTags).returning();
    console.log(`✅ Inserted ${insertedTags.length} tags`);

    // Create tag lookup map
    const tagMap = new Map();
    insertedTags.forEach(tag => {
      tagMap.set(tag.name, tag.id);
    });

    // Insert restaurants
    console.log('🏪 Inserting restaurants...');
    for (const restaurantData of sampleRestaurants) {
      const { tags: restaurantTagNames, ...restaurantInfo } = restaurantData;
      
      // Insert restaurant
      const [insertedRestaurant] = await db.insert(restaurants).values(restaurantInfo).returning();
      console.log(`✅ Inserted restaurant: ${insertedRestaurant.name}`);

      // Insert restaurant-tag relationships
      for (const tagName of restaurantTagNames) {
        const tagId = tagMap.get(tagName);
        if (tagId) {
          await db.insert(restaurantTags).values({
            restaurantId: insertedRestaurant.id,
            tagId: tagId
          });
        }
      }
    }

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Seeded ${insertedTags.length} tags and ${sampleRestaurants.length} restaurants`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seedDatabase();