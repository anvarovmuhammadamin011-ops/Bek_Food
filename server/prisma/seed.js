import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create branches
  const branchChinobod = await prisma.branch.upsert({
    where: { id: 'branch-chinobod' },
    update: {},
    create: {
      id: 'branch-chinobod',
      name: 'AJIF — Chinobod',
      address: "Chinobod ko'chasi, Toshkent",
      latitude: 41.3111,
      longitude: 69.2797,
      phone: '+998901234567',
      workingHours: { mon: '09:00-23:00', tue: '09:00-23:00', wed: '09:00-23:00', thu: '09:00-23:00', fri: '09:00-23:00', sat: '10:00-23:00', sun: '10:00-22:00' },
    },
  });

  const branchQoshtepa = await prisma.branch.upsert({
    where: { id: 'branch-qoshtepa' },
    update: {},
    create: {
      id: 'branch-qoshtepa',
      name: 'AJIF — Qo\'shtepa',
      address: "Qo'shtepa ko'chasi, Toshkent",
      latitude: 41.3456,
      longitude: 69.3123,
      phone: '+998907654321',
      workingHours: { mon: '09:00-23:00', tue: '09:00-23:00', wed: '09:00-23:00', thu: '09:00-23:00', fri: '09:00-23:00', sat: '10:00-23:00', sun: '10:00-22:00' },
    },
  });

  // Create admin
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ajif.uz' },
    update: {},
    create: { email: 'admin@ajif.uz', password: adminPassword, name: 'Admin', role: 'ADMIN', phone: '+998901234567' },
  });

  // Create driver user
  const driverPassword = await bcrypt.hash('driver123', 12);
  const driverUser = await prisma.user.upsert({
    where: { email: 'driver@ajif.uz' },
    update: {},
    create: { email: 'driver@ajif.uz', password: driverPassword, name: 'Sardor Rakhimov', role: 'DRIVER', phone: '+998901234567' },
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
    where: { email: 'customer@ajif.uz' },
    update: {},
    create: { email: 'customer@ajif.uz', password: customerPassword, name: 'Azizbek Toshmatov', role: 'CUSTOMER', phone: '+998912345678' },
  });

  // Create categories
  const categories = [
    { name: 'Shashlik', icon: '🍢', sortOrder: 0 },
    { name: 'Burgers', icon: '🍔', sortOrder: 1 },
    { name: 'Pizza', icon: '🍕', sortOrder: 2 },
    { name: 'Chicken', icon: '🍗', sortOrder: 3 },
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

  // Create products (available at both branches — branchId: null = all branches)
  const products = [
    { name: 'Lamb Shashlik', description: 'Classic lamb shashlik, 4 skewers', price: 45000, image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400', calories: 420, ingredients: ['Lamb', 'Onion', 'Spices'], spiceLevel: 2, prepTime: 15, isPopular: true, isRecommended: true, categoryIndex: 0 },
    { name: 'Chicken Shashlik', description: 'Juicy chicken shashlik, 4 skewers', price: 35000, image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400', calories: 350, ingredients: ['Chicken', 'Onion', 'Spices'], spiceLevel: 1, prepTime: 12, isPopular: true, isRecommended: true, categoryIndex: 0 },
    { name: 'Cheeseburger', description: 'Classic beef cheeseburger', price: 22000, discountPrice: 18000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', calories: 320, ingredients: ['Beef', 'Cheese', 'Lettuce', 'Sauce'], spiceLevel: 1, prepTime: 8, isPopular: true, isRecommended: true, categoryIndex: 1 },
    { name: 'Double Burger', description: 'Double patty premium burger', price: 32000, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400', calories: 520, ingredients: ['Beef', 'Cheese', 'Pickles', 'Sauce'], spiceLevel: 1, prepTime: 10, isPopular: true, categoryIndex: 1 },
    { name: 'Pepperoni Pizza', description: 'Classic pepperoni pizza slice', price: 15000, discountPrice: 12000, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400', calories: 280, ingredients: ['Dough', 'Tomato', 'Mozzarella', 'Pepperoni'], spiceLevel: 1, prepTime: 8, isPopular: true, categoryIndex: 2 },
    { name: 'Wings 6pc', description: '6 spicy chicken wings', price: 28000, image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=400', calories: 450, ingredients: ['Chicken Wings', 'Hot Sauce', 'Spices'], spiceLevel: 3, prepTime: 10, isPopular: true, categoryIndex: 3 },
    { name: 'Chicken Lavash', description: 'Grilled chicken lavash wrap', price: 18000, discountPrice: 15000, image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400', calories: 310, ingredients: ['Lavash', 'Chicken', 'Tomato', 'Sauce'], spiceLevel: 1, prepTime: 6, isPopular: true, isRecommended: true, categoryIndex: 4 },
    { name: 'French Fries', description: 'Crispy golden fries', price: 12000, discountPrice: 9000, image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400', calories: 250, ingredients: ['Potato', 'Salt', 'Oil'], spiceLevel: 0, prepTime: 4, isPopular: true, isRecommended: true, categoryIndex: 5 },
    { name: 'Cola 0.5L', description: 'Refreshing cola drink', price: 6000, image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400', calories: 80, ingredients: ['Cola'], spiceLevel: 0, prepTime: 1, isPopular: true, isRecommended: true, categoryIndex: 6 },
    { name: 'Ice Cream', description: 'Single scoop vanilla or chocolate', price: 10000, image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400', calories: 180, ingredients: ['Milk', 'Sugar', 'Cream'], spiceLevel: 0, prepTime: 2, isPopular: true, categoryIndex: 7 },
    { name: 'Family Combo', description: '2x shashlik + fries + drinks for 4', price: 85000, discountPrice: 72000, image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400', calories: 1200, ingredients: ['Lamb', 'Chicken', 'Fries', 'Drinks'], spiceLevel: 1, prepTime: 20, isPopular: true, isRecommended: true, categoryIndex: 8 },
    { name: 'Hot Dog', description: 'Classic beef hot dog', price: 12000, discountPrice: 10000, image: 'https://images.unsplash.com/photo-1612392062120-e5a0e2e4f5b4?w=400', calories: 220, ingredients: ['Sausage', 'Bun', 'Mustard'], spiceLevel: 0, prepTime: 4, isRecommended: true, categoryIndex: 1 },
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
    where: { code: 'SHASHLIK20' },
    update: {},
    create: { code: 'SHASHLIK20', description: '20% off on all shashlik', discount: 20, promoType: 'PERCENT', minOrder: 30000, usageLimit: 100, isActive: true, startDate: new Date(), endDate: new Date('2026-12-31') },
  });

  await prisma.promotion.upsert({
    where: { code: 'FIRSTORDER' },
    update: {},
    create: { code: 'FIRSTORDER', description: '30% off first order', discount: 30, promoType: 'PERCENT', minOrder: 20000, usageLimit: 1, isActive: true, startDate: new Date(), endDate: new Date('2026-12-31') },
  });

  // Create addresses for customer
  await prisma.address.create({
    data: { userId: customer.id, label: 'Home', fullAddress: 'Toshkent, Mirzo Ulug\'bek tumoni, 5-ko\'cha, 12-uy', latitude: 41.3111, longitude: 69.2797, isDefault: true },
  });

  console.log('Database seeded successfully!');
  console.log('─────────────────────────────');
  console.log('Branches: 2 (Chinobod, Qo\'shtepa)');
  console.log('Admin:     admin@ajif.uz / admin123');
  console.log('Driver:    driver@ajif.uz / driver123');
  console.log('Customer:  customer@ajif.uz / customer123');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
