import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});

  const branch = await prisma.branch.upsert({
    where: { id: 'branch-chinobod' },
    update: {},
    create: {
      id: 'branch-chinobod',
      name: 'BEK FOOD — Chinobod',
      address: "Chinobod, Toshkent",
      latitude: 41.3111,
      longitude: 69.2797,
      phone: '+998901234567',
      workingHours: { mon: '09:00-23:00', tue: '09:00-23:00', wed: '09:00-23:00', thu: '09:00-23:00', fri: '09:00-23:00', sat: '10:00-23:00', sun: '10:00-22:00' },
    },
  });

  const adminPassword = await bcrypt.hash('admin123', 12);
  await prisma.user.upsert({
    where: { email: 'admin@bekfood.uz' },
    update: {},
    create: { email: 'admin@bekfood.uz', password: adminPassword, name: 'Admin', role: 'ADMIN', phone: '+998901234567' },
  });

  const driverPassword = await bcrypt.hash('driver123', 12);
  const driverUser = await prisma.user.upsert({
    where: { email: 'driver@bekfood.uz' },
    update: {},
    create: { email: 'driver@bekfood.uz', password: driverPassword, name: 'Sardor Rakhimov', role: 'DRIVER', phone: '+998901234568' },
  });

  await prisma.driver.upsert({
    where: { userId: driverUser.id },
    update: {},
    create: { userId: driverUser.id, vehicleType: 'Motorcycle', vehiclePlate: '01 A 123 45', status: 'ONLINE', rating: 4.9, totalDeliveries: 847 },
  });

  const customerPassword = await bcrypt.hash('customer123', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@bekfood.uz' },
    update: {},
    create: { email: 'customer@bekfood.uz', password: customerPassword, name: 'Azizbek Toshmatov', role: 'CUSTOMER', phone: '+998912345678' },
  });

  const categoriesData = [
    { name: 'Hot-doglar', icon: '🌭', sortOrder: 0 },
    { name: 'Lavashlar', icon: '🌯', sortOrder: 1 },
    { name: 'Burgerlar', icon: '🍔', sortOrder: 2 },
    { name: 'Nonburgerlar & Donar', icon: '🥙', sortOrder: 3 },
    { name: 'Frilar', icon: '🍟', sortOrder: 4 },
    { name: 'Pitsalar', icon: '🍕', sortOrder: 5 },
  ];

  const createdCategories = [];
  for (const cat of categoriesData) {
    const c = await prisma.category.create({
      data: { name: cat.name, icon: cat.icon, sortOrder: cat.sortOrder },
    });
    createdCategories.push(c);
  }

  const images = [
    'https://images.unsplash.com/photo-1612392062120-e5a0e2e4f5b4?w=400',
    'https://images.unsplash.com/photo-1659714885921-0e8d6a1bc05e?w=400',
    'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  ];

  const products = [
    { name: 'Hot-dog oddiy', price: 12000, categoryIndex: 0, isPopular: true },
    { name: 'Hot-dog 2x (Double)', price: 15000, categoryIndex: 0, isPopular: true },
    { name: "Hot-dog go'shtli", price: 20000, categoryIndex: 0 },
    { name: 'Hot-dog qazili', price: 33000, categoryIndex: 0 },
    { name: 'Premium Qari Xaggi', price: 25000, categoryIndex: 0 },
    { name: 'Lavash', price: 33000, categoryIndex: 1, isPopular: true },
    { name: 'Lavash 2x (Double)', price: 40000, categoryIndex: 1 },
    { name: 'Lavash sirli', price: 38000, categoryIndex: 1 },
    { name: 'Lavash tandir', price: 35000, categoryIndex: 1 },
    { name: 'Gamburger', price: 35000, categoryIndex: 2, isPopular: true },
    { name: 'Cheeseburger', price: 38000, categoryIndex: 2, isRecommended: true },
    { name: 'Double Burger', price: 50000, categoryIndex: 2 },
    { name: 'Double Cheeseburger', price: 56000, categoryIndex: 2 },
    { name: 'Nonburger', price: 35000, categoryIndex: 3 },
    { name: 'Doner kichik', price: 25000, categoryIndex: 3, isPopular: true },
    { name: 'Doner katta', price: 30000, categoryIndex: 3 },
    { name: 'Doner kichik sirli', price: 28000, categoryIndex: 3 },
    { name: 'Doner katta sirli', price: 33000, categoryIndex: 3 },
    { name: 'Fri', price: 15000, categoryIndex: 4, isPopular: true },
    { name: 'Pitsa Peperoni 30 sm', price: 65000, categoryIndex: 5, isPopular: true },
    { name: 'Pitsa Peperoni 35 sm', price: 80000, categoryIndex: 5 },
    { name: 'Pitsa Peperoni 40 sm', price: 95000, categoryIndex: 5 },
    { name: "Pitsa go'shtli 30 sm", price: 70000, categoryIndex: 5 },
    { name: "Pitsa go'shtli 35 sm", price: 90000, categoryIndex: 5 },
    { name: "Pitsa go'shtli 40 sm", price: 110000, categoryIndex: 5 },
    { name: 'Pitsa assorti 30 sm', price: 75000, categoryIndex: 5 },
    { name: 'Pitsa assorti 35 sm', price: 95000, categoryIndex: 5 },
    { name: 'Pitsa assorti 40 sm', price: 115000, categoryIndex: 5 },
  ];

  for (const p of products) {
    const { categoryIndex, ...productData } = p;
    await prisma.product.create({
      data: {
        ...productData,
        image: images[categoryIndex],
        categoryId: createdCategories[categoryIndex].id,
      },
    });
  }

  await prisma.promotion.upsert({
    where: { code: 'BEK20' },
    update: {},
    create: { code: 'BEK20', description: 'Barcha mahsulotlarga 20% chegirma', discount: 20, promoType: 'PERCENT', minOrder: 30000, usageLimit: 100, isActive: true, startDate: new Date(), endDate: new Date('2026-12-31') },
  });

  await prisma.address.create({
    data: { userId: customer.id, label: 'Uy', fullAddress: "Chinobod, Oqtepa ko'chasi, 15", latitude: 41.3111, longitude: 69.2797, isDefault: true },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
