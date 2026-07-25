import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create admin
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@bekfood.uz' },
    update: {},
    create: { email: 'admin@bekfood.uz', password: adminPassword, name: 'Admin', role: 'ADMIN', phone: '+998901234567' },
  });

  // Create driver user
  const driverPassword = await bcrypt.hash('driver123', 12);
  const driverUser = await prisma.user.upsert({
    where: { email: 'driver@bekfood.uz' },
    update: {},
    create: { email: 'driver@bekfood.uz', password: driverPassword, name: 'Sardor Rakhimov', role: 'DRIVER', phone: '+998901234567' },
  });

  // Create driver profile
  await prisma.driver.upsert({
    where: { userId: driverUser.id },
    update: {},
    create: { userId: driverUser.id, vehicleType: 'Motorcycle', vehiclePlate: '01 A 123 45', status: 'ONLINE', rating: 4.9, totalDeliveries: 847 },
  });

  // Create customer
  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@bekfood.uz' },
    update: {},
    create: { email: 'customer@bekfood.uz', password: customerPassword, name: 'Azizbek Toshmatov', role: 'CUSTOMER', phone: '+998912345678' },
  });

  // Create categories
  const categories = [
    { name: 'Burgers', icon: '🍔', sortOrder: 0 },
    { name: 'Pizza', icon: '🍕', sortOrder: 1 },
    { name: 'Chicken', icon: '🍗', sortOrder: 2 },
    { name: 'Hot Dogs', icon: '🌭', sortOrder: 3 },
    { name: 'Lavash', icon: '🌯', sortOrder: 4 },
    { name: 'Fries', icon: '🍟', sortOrder: 5 },
    { name: 'Drinks', icon: '🥤', sortOrder: 6 },
    { name: 'Desserts', icon: '🍰', sortOrder: 7 },
    { name: 'Combos', icon: '🍽', sortOrder: 8 },
  ];

  const createdCategories = [];
  for (const cat of categories) {
    const c = await prisma.category.upsert({
      where: { id: cat.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: { id: cat.name.toLowerCase().replace(/\s+/g, '-'), ...cat },
    });
    createdCategories.push(c);
  }

  // Create products
  const products = [
    { name: 'Mini Slider', description: '2 bite-sized beef sliders', price: 18000, discountPrice: 15000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', calories: 320, ingredients: ['Beef', 'Mini Bun', 'Lettuce', 'Sauce'], spiceLevel: 1, prepTime: 5, isPopular: true, isRecommended: true, categoryIndex: 0 },
    { name: 'Cheese Slider', description: 'Mini cheeseburger with pickles', price: 20000, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', calories: 350, ingredients: ['Beef', 'Cheese', 'Pickle', 'Mini Bun'], spiceLevel: 0, prepTime: 5, isPopular: true, categoryIndex: 0 },
    { name: 'Pizza Slice', description: 'Single slice pepperoni', price: 12000, discountPrice: 10000, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', calories: 280, ingredients: ['Dough', 'Tomato', 'Mozzarella', 'Pepperoni'], spiceLevel: 1, prepTime: 8, isPopular: true, isRecommended: true, categoryIndex: 1 },
    { name: 'Mini Margherita', description: '4-inch personal pizza', price: 15000, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400', calories: 310, ingredients: ['Dough', 'Tomato', 'Mozzarella', 'Basil'], spiceLevel: 0, prepTime: 10, isRecommended: true, categoryIndex: 1 },
    { name: '5pc Chicken Bites', description: '5 pieces crispy chicken nuggets', price: 16000, discountPrice: 13000, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', calories: 290, ingredients: ['Chicken', 'Breading', 'Spices'], spiceLevel: 2, prepTime: 6, isPopular: true, isRecommended: true, categoryIndex: 2 },
    { name: 'Wings 4pc', description: '4 spicy chicken wings', price: 22000, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', calories: 380, ingredients: ['Chicken Wings', 'Hot Sauce', 'Spices'], spiceLevel: 3, prepTime: 8, isPopular: true, categoryIndex: 2 },
    { name: 'Mini Lavash', description: 'Small chicken wrap with veggies', price: 14000, discountPrice: 12000, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400', calories: 260, ingredients: ['Lavash', 'Chicken', 'Tomato', 'Sauce'], spiceLevel: 1, prepTime: 5, isPopular: true, isRecommended: true, categoryIndex: 4 },
    { name: 'Mini Ice Cream', description: 'Single scoop vanilla/chocolate', price: 8000, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400', calories: 180, ingredients: ['Milk', 'Sugar', 'Cream'], spiceLevel: 0, prepTime: 2, isPopular: true, isRecommended: true, categoryIndex: 7 },
    { name: 'Mini Hot Dog', description: 'Bite-sized hot dog with mustard', price: 10000, discountPrice: 8000, image: 'https://images.unsplash.com/photo-1612392062120-e5a0e2e4f5b4?w=400', calories: 220, ingredients: ['Sausage', 'Mini Bun', 'Mustard'], spiceLevel: 0, prepTime: 4, isRecommended: true, categoryIndex: 3 },
    { name: 'Small Lemonade', description: '250ml fresh lemonade', price: 6000, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', calories: 80, ingredients: ['Lemon', 'Sugar', 'Water'], spiceLevel: 0, prepTime: 2, isPopular: true, isRecommended: true, categoryIndex: 6 },
    { name: 'Small Fries', description: 'Crispy mini portion fries', price: 8000, discountPrice: 6000, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', calories: 200, ingredients: ['Potato', 'Salt', 'Oil'], spiceLevel: 0, prepTime: 3, isPopular: true, isRecommended: true, categoryIndex: 5 },
    { name: 'Falafel Wrap', description: '3 mini falafel in lavash', price: 12000, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400', calories: 240, ingredients: ['Lavash', 'Falafel', 'Tahini', 'Lettuce'], spiceLevel: 1, prepTime: 6, isRecommended: true, categoryIndex: 4 },
  ];

  for (const p of products) {
    const { categoryIndex, ...productData } = p;
    await prisma.product.upsert({
      where: { id: p.name.toLowerCase().replace(/\s+/g, '-') },
      update: {},
      create: { id: p.name.toLowerCase().replace(/\s+/g, '-'), ...productData, categoryId: createdCategories[categoryIndex].id },
    });
  }

  // Create promotions
  await prisma.promotion.upsert({
    where: { code: 'SNACK50' },
    update: {},
    create: { code: 'SNACK50', description: '50% off on all items', discount: 50, promoType: 'PERCENT', minOrder: 20000, usageLimit: 100, isActive: true, startDate: new Date(), endDate: new Date('2026-12-31') },
  });

  await prisma.promotion.upsert({
    where: { code: 'FIRSTBITE' },
    update: {},
    create: { code: 'FIRSTBITE', description: '30% off first order', discount: 30, promoType: 'PERCENT', minOrder: 15000, usageLimit: 1, isActive: true, startDate: new Date(), endDate: new Date('2026-12-31') },
  });

  // Create addresses for customer
  await prisma.address.create({
    data: { userId: customer.id, label: 'Home', fullAddress: 'Tashkent, Mirzo Ulugbek district, Street 5, House 12', latitude: 41.3111, longitude: 69.2797, isDefault: true },
  });

  console.log('Database seeded successfully!');
  console.log('─────────────────────────────');
  console.log('Admin:     admin@bekfood.uz / admin123');
  console.log('Driver:    driver@bekfood.uz / driver123');
  console.log('Customer:  customer@bekfood.uz / customer123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
