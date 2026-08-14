import type { GroceryCategory } from '@/types'

export interface CommonItem {
  name: string
  category: GroceryCategory
  defaultQty: string | null
}

/**
 * Curated list of common grocery items grouped by aisle / category.
 * Ordered roughly by purchase frequency.
 */
export const COMMON_ITEMS: Record<GroceryCategory, CommonItem[]> = {
  produce: [
    { name: 'Bananas',        category: 'produce', defaultQty: '1 bunch' },
    { name: 'Avocados',       category: 'produce', defaultQty: '3' },
    { name: 'Tomatoes',       category: 'produce', defaultQty: '4' },
    { name: 'Onions',         category: 'produce', defaultQty: '3' },
    { name: 'Garlic',         category: 'produce', defaultQty: '1 head' },
    { name: 'Potatoes',       category: 'produce', defaultQty: '5 lbs' },
    { name: 'Sweet Potatoes', category: 'produce', defaultQty: '3' },
    { name: 'Bell Peppers',   category: 'produce', defaultQty: '3' },
    { name: 'Broccoli',       category: 'produce', defaultQty: '1 head' },
    { name: 'Spinach',        category: 'produce', defaultQty: '1 bag' },
    { name: 'Carrots',        category: 'produce', defaultQty: '1 bag' },
    { name: 'Cucumber',       category: 'produce', defaultQty: '2' },
    { name: 'Lemons',         category: 'produce', defaultQty: '3' },
    { name: 'Limes',          category: 'produce', defaultQty: '3' },
    { name: 'Apples',         category: 'produce', defaultQty: '6' },
    { name: 'Berries',        category: 'produce', defaultQty: '1 pint' },
    { name: 'Lettuce',        category: 'produce', defaultQty: '1 head' },
    { name: 'Green Onions',   category: 'produce', defaultQty: '1 bunch' },
    { name: 'Mushrooms',      category: 'produce', defaultQty: '8 oz' },
    { name: 'Ginger',         category: 'produce', defaultQty: '1 knob' },
    { name: 'Cilantro',       category: 'produce', defaultQty: '1 bunch' },
    { name: 'Jalapeños',      category: 'produce', defaultQty: '3' },
    { name: 'Corn',           category: 'produce', defaultQty: '4 ears' },
    { name: 'Zucchini',       category: 'produce', defaultQty: '2' },
  ],

  dairy: [
    { name: 'Milk',             category: 'dairy', defaultQty: '1 gal' },
    { name: 'Eggs',             category: 'dairy', defaultQty: '1 dozen' },
    { name: 'Butter',           category: 'dairy', defaultQty: '1 lb' },
    { name: 'Cheddar Cheese',   category: 'dairy', defaultQty: '8 oz' },
    { name: 'Mozzarella',       category: 'dairy', defaultQty: '8 oz' },
    { name: 'Parmesan',         category: 'dairy', defaultQty: '4 oz' },
    { name: 'Cream Cheese',     category: 'dairy', defaultQty: '8 oz' },
    { name: 'Greek Yogurt',     category: 'dairy', defaultQty: '32 oz' },
    { name: 'Sour Cream',       category: 'dairy', defaultQty: '16 oz' },
    { name: 'Heavy Cream',      category: 'dairy', defaultQty: '1 pint' },
    { name: 'Oat Milk',         category: 'dairy', defaultQty: '1 qt' },
    { name: 'Almond Milk',      category: 'dairy', defaultQty: '1 qt' },
  ],

  meat: [
    { name: 'Chicken Breast',   category: 'meat', defaultQty: '2 lbs' },
    { name: 'Chicken Thighs',   category: 'meat', defaultQty: '2 lbs' },
    { name: 'Ground Beef',      category: 'meat', defaultQty: '1 lb' },
    { name: 'Ground Turkey',    category: 'meat', defaultQty: '1 lb' },
    { name: 'Salmon',           category: 'meat', defaultQty: '1 lb' },
    { name: 'Shrimp',           category: 'meat', defaultQty: '1 lb' },
    { name: 'Bacon',            category: 'meat', defaultQty: '12 oz' },
    { name: 'Sausage',          category: 'meat', defaultQty: '1 lb' },
    { name: 'Pork Chops',       category: 'meat', defaultQty: '4' },
    { name: 'Steak',            category: 'meat', defaultQty: '2' },
    { name: 'Tofu',             category: 'meat', defaultQty: '14 oz' },
    { name: 'Deli Turkey',      category: 'meat', defaultQty: '8 oz' },
  ],

  pantry: [
    { name: 'Rice',              category: 'pantry', defaultQty: '2 lbs' },
    { name: 'Pasta',             category: 'pantry', defaultQty: '1 lb' },
    { name: 'Olive Oil',         category: 'pantry', defaultQty: '1 bottle' },
    { name: 'Salt',              category: 'pantry', defaultQty: null },
    { name: 'Black Pepper',      category: 'pantry', defaultQty: null },
    { name: 'Soy Sauce',         category: 'pantry', defaultQty: '1 bottle' },
    { name: 'Canned Tomatoes',   category: 'pantry', defaultQty: '28 oz' },
    { name: 'Chicken Broth',     category: 'pantry', defaultQty: '32 oz' },
    { name: 'Canned Beans',      category: 'pantry', defaultQty: '15 oz' },
    { name: 'Flour',             category: 'pantry', defaultQty: '5 lbs' },
    { name: 'Sugar',             category: 'pantry', defaultQty: '2 lbs' },
    { name: 'Honey',             category: 'pantry', defaultQty: '12 oz' },
    { name: 'Peanut Butter',     category: 'pantry', defaultQty: '16 oz' },
    { name: 'Bread Crumbs',      category: 'pantry', defaultQty: '15 oz' },
    { name: 'Coconut Milk',      category: 'pantry', defaultQty: '13.5 oz' },
    { name: 'Tortillas',         category: 'pantry', defaultQty: '10 ct' },
    { name: 'Hot Sauce',         category: 'pantry', defaultQty: '1 bottle' },
    { name: 'Vinegar',           category: 'pantry', defaultQty: '1 bottle' },
    { name: 'Oats',              category: 'pantry', defaultQty: '18 oz' },
    { name: 'Nuts (Mixed)',      category: 'pantry', defaultQty: '8 oz' },
  ],

  frozen: [
    { name: 'Frozen Berries',      category: 'frozen', defaultQty: '16 oz' },
    { name: 'Frozen Vegetables',   category: 'frozen', defaultQty: '16 oz' },
    { name: 'Frozen Pizza',        category: 'frozen', defaultQty: '1' },
    { name: 'Ice Cream',           category: 'frozen', defaultQty: '1 pint' },
    { name: 'Frozen Chicken',      category: 'frozen', defaultQty: '2 lbs' },
    { name: 'Frozen Shrimp',       category: 'frozen', defaultQty: '1 lb' },
    { name: 'Frozen Fries',        category: 'frozen', defaultQty: '28 oz' },
    { name: 'Frozen Waffles',      category: 'frozen', defaultQty: '10 ct' },
  ],

  bakery: [
    { name: 'Bread',              category: 'bakery', defaultQty: '1 loaf' },
    { name: 'Bagels',             category: 'bakery', defaultQty: '6' },
    { name: 'English Muffins',    category: 'bakery', defaultQty: '6' },
    { name: 'Buns (Hamburger)',   category: 'bakery', defaultQty: '8' },
    { name: 'Croissants',         category: 'bakery', defaultQty: '4' },
    { name: 'Pita Bread',         category: 'bakery', defaultQty: '6' },
  ],

  beverages: [
    { name: 'Water (Case)',      category: 'beverages', defaultQty: '24 pk' },
    { name: 'Coffee',            category: 'beverages', defaultQty: '12 oz' },
    { name: 'Tea',               category: 'beverages', defaultQty: '20 ct' },
    { name: 'Orange Juice',      category: 'beverages', defaultQty: '52 oz' },
    { name: 'Sparkling Water',   category: 'beverages', defaultQty: '8 pk' },
    { name: 'Soda',              category: 'beverages', defaultQty: '12 pk' },
  ],

  other: [
    { name: 'Paper Towels',     category: 'other', defaultQty: '6 roll' },
    { name: 'Dish Soap',        category: 'other', defaultQty: '1' },
    { name: 'Trash Bags',       category: 'other', defaultQty: '1 box' },
    { name: 'Aluminum Foil',    category: 'other', defaultQty: '1 roll' },
    { name: 'Plastic Wrap',     category: 'other', defaultQty: '1 roll' },
    { name: 'Ziplock Bags',     category: 'other', defaultQty: '1 box' },
    { name: 'Sponges',          category: 'other', defaultQty: '3 pk' },
  ],
}

/** Flat array of all common items for search */
export const ALL_COMMON_ITEMS: CommonItem[] = Object.values(COMMON_ITEMS).flat()
