export const categories = [
  { id: 1, name: 'Shashliklar', icon: '🥩' },
  { id: 2, name: 'Fastfud', icon: '🍔' },
  { id: 3, name: 'Ichimliklar', icon: '🥤' },
  { id: 4, name: 'Desertlar', icon: '🍰' },
  { id: 5, name: 'Gazaklar', icon: '🥗' },
];

export const foods = [
  { id: 1, name: "Qiyma Shashlik", description: "200g qiyma go'sht, maxsus marinad", price: 25000, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop", categoryId: 1, isPopular: true, calories: 450, ingredients: ["Qiyma go'sht", "Piyoz", "Ziravorlar", "Tuz"], restaurantId: 1, spiceLevel: 1 },
  { id: 2, name: "Jigar Shashlik", description: "Mol jigaridan tayyorlangan shashlik", price: 22000, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop", categoryId: 1, isPopular: true, discountPrice: 18000, calories: 320, ingredients: ["Mol jigari", "Piyoz", "Ziravorlar"], restaurantId: 1, spiceLevel: 0 },
  { id: 3, name: "Tovuq Shashlik", description: "Tovuq go'shtidan shashlik", price: 20000, image: "https://images.unsplash.com/photo-1527477396000-e27163b4be8a?w=400&h=300&fit=crop", categoryId: 1, isPopular: true, calories: 280, ingredients: ["Tovuq go'shti", "Piyoz", "Ziravorlar"], restaurantId: 1, spiceLevel: 1 },
  { id: 4, name: "Lavash", description: "Mol go'shti bilan lavash", price: 28000, image: "https://images.unsplash.com/photo-1659714885921-0e8d6a1bc05e?w=400&h=300&fit=crop", categoryId: 2, isPopular: true, calories: 520, ingredients: ["Non", "Mol go'shti", "Sabzavotlar", "Sous"], restaurantId: 1, spiceLevel: 2 },
  { id: 5, name: "Gamburger", description: "200g kotlet, pishloq, sabzavotlar", price: 32000, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", categoryId: 2, isPopular: false, discountPrice: 26000, calories: 680, ingredients: ["Bulochka", "Mol go'shti", "Pishloq", "Sabzavotlar"], restaurantId: 1, spiceLevel: 1 },
  { id: 6, name: "Hot Dog", description: "Sosiskali hot-dog", price: 15000, image: "https://images.unsplash.com/photo-1619534885941-5d7e2aea1e57?w=400&h=300&fit=crop", categoryId: 2, isPopular: false, calories: 380, ingredients: ["Bulochka", "Sosiska", "Ketchup", "Gorchitsa"], restaurantId: 1, spiceLevel: 0 },
  { id: 7, name: "Coca-Cola", description: "1L", price: 8000, image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=300&fit=crop", categoryId: 3, isPopular: true, calories: 180, ingredients: ["Suv", "Shakar"], restaurantId: 1, spiceLevel: 0 },
  { id: 8, name: "Choy", description: "Ko'k choy / qora choy", price: 3000, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=300&fit=crop", categoryId: 3, isPopular: false, calories: 0, ingredients: ["Choy"], restaurantId: 1, spiceLevel: 0 },
  { id: 9, name: "Kompot", description: "Uydagi kompot", price: 5000, image: "https://images.unsplash.com/photo-1544145945-f90425340c7e?w=400&h=300&fit=crop", categoryId: 3, isPopular: false, calories: 60, ingredients: ["Meva", "Shakar", "Suv"], restaurantId: 1, spiceLevel: 0 },
  { id: 10, name: "Medovik", description: "Asalli tort", price: 18000, image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop", categoryId: 4, isPopular: false, calories: 380, ingredients: ["Un", "Asal", "Smetana", "Shakar"], restaurantId: 1, spiceLevel: 0 },
  { id: 11, name: "Napoleon", description: "Qatlamali tort", price: 18000, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop", categoryId: 4, isPopular: false, calories: 350, ingredients: ["Un", "Sariyog'", "Krem"], restaurantId: 1, spiceLevel: 0 },
  { id: 12, name: "Kartoshka Fri", description: "Katta porsiya", price: 12000, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop", categoryId: 5, isPopular: true, calories: 320, ingredients: ["Kartoshka", "Yog'", "Tuz"], restaurantId: 1, spiceLevel: 0 },
];

export const restaurants = [
  { id: 1, name: 'BEK FOOD Chinobod', coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop', logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100&h=100&fit=crop', cuisine: 'Shashlik & Fastfood', rating: 4.8, deliveryTime: '25-35', distance: 'Chinobod', minOrder: 0, isOpen: true, address: 'Chinobod tumani, Oqtepa ko\'chasi, 15', phone: '+998901234567', workingHours: '10:00 - 23:00', coordinates: { lat: 41.2995, lng: 69.2401 } },
];

export const banners = [
  { id: 1, image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=350&fit=crop', title: 'Qiyma Shashlik', subtitle: 'Maxsus marinad bilan 25 000 so\'mdan' },
  { id: 2, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=350&fit=crop', title: 'Gamburger', subtitle: '200g kotlet bilan 26 000 so\'m' },
];

export const addresses = [
  { id: 1, label: 'Uy', fullAddress: 'Chinobod, Oqtepa ko\'chasi, 15', isDefault: true },
  { id: 2, label: 'Ish', fullAddress: 'Chinobod, Navoiy ko\'chasi, 27', isDefault: false },
];

export const paymentMethods = [
  { id: 'cash', name: 'Naqd pul', icon: 'Banknote' },
  { id: 'card', name: 'Karta orqali', icon: 'CreditCard', comingSoon: true },
];

export const notifications = [
  { id: 1, title: 'Buyurtma qabul qilindi', message: '#1234-sonli buyurtmangiz qabul qilindi', time: new Date().toISOString(), isRead: false, type: 'order' },
  { id: 2, title: 'Aksiya!', message: 'Qiyma shashlik 20% chegirma bilan', time: new Date(Date.now() - 86400000).toISOString(), isRead: false, type: 'promo' },
];
