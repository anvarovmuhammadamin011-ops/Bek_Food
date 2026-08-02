const hotdogImg = '/food/hotdog.svg';
const burgerImg = '/food/burger.svg';

const foodList = [
  { id: 1, name: 'Hot-dog oddiy', price: 12000, image: '/food/hotdog.svg', categoryId: 1, isPopular: true, restaurantId: 1, spiceLevel: 0, ingredients: ['Sosiska', 'Bulochka'] },
  { id: 2, name: 'Hot-dog 2x (Double)', price: 15000, image: '/food/hotdog-double.svg', categoryId: 1, isPopular: true, restaurantId: 1, spiceLevel: 0, ingredients: ['2x Sosiska', 'Bulochka'] },
  { id: 3, name: "Hot-dog go'shtli", price: 20000, image: '/food/hotdog-meat.svg', categoryId: 1, restaurantId: 1, spiceLevel: 1, ingredients: ["Go'sht", 'Bulochka'] },
  { id: 4, name: 'Hot-dog qazili', price: 33000, image: '/food/hotdog-qazi.svg', categoryId: 1, restaurantId: 1, spiceLevel: 1, ingredients: ['Qazi', 'Bulochka'] },
  { id: 5, name: 'Premium Qari Xaggi', price: 25000, image: '/food/hotdog-premium.svg', categoryId: 1, restaurantId: 1, spiceLevel: 1, ingredients: ['Maxsus retsept'] },
  { id: 6, name: 'Lavash', price: 33000, image: '/food/lavash.svg', categoryId: 2, isPopular: true, restaurantId: 1, spiceLevel: 1, ingredients: ['Lavash', "Go'sht", 'Sabzavotlar', 'Sous'] },
  { id: 7, name: 'Lavash 2x (Double)', price: 40000, image: '/food/lavash-double.svg', categoryId: 2, restaurantId: 1, spiceLevel: 1, ingredients: ['Lavash', "2x go'sht", 'Sabzavotlar', 'Sous'] },
  { id: 8, name: 'Lavash sirli', price: 38000, image: '/food/lavash-cheese.svg', categoryId: 2, restaurantId: 1, spiceLevel: 1, ingredients: ['Lavash', 'Pishloq', "Go'sht", 'Sous'] },
  { id: 9, name: 'Lavash tandir', price: 35000, image: '/food/lavash-tandoor.svg', categoryId: 2, restaurantId: 1, spiceLevel: 1, ingredients: ['Tandir lavash', "Go'sht", 'Sabzavotlar'] },
  { id: 10, name: 'Gamburger', price: 35000, image: '/food/burger.svg', categoryId: 3, isPopular: true, restaurantId: 1, spiceLevel: 1, ingredients: ['Bulochka', 'Kotlet', 'Sabzavotlar'] },
  { id: 11, name: 'Cheeseburger', price: 38000, image: '/food/cheeseburger.svg', categoryId: 3, restaurantId: 1, spiceLevel: 1, ingredients: ['Bulochka', 'Kotlet', 'Pishloq', 'Sabzavotlar'] },
  { id: 12, name: 'Double Burger', price: 50000, image: '/food/burger-double.svg', categoryId: 3, restaurantId: 1, spiceLevel: 1, ingredients: ['Bulochka', '2x kotlet', 'Sabzavotlar'] },
  { id: 13, name: 'Double Cheeseburger', price: 56000, image: '/food/cheeseburger-double.svg', categoryId: 3, restaurantId: 1, spiceLevel: 1, ingredients: ['Bulochka', '2x kotlet', '2x pishloq', 'Sabzavotlar'] },
  { id: 14, name: 'Nonburger', price: 35000, image: '/food/nonburger.svg', categoryId: 4, restaurantId: 1, spiceLevel: 1, ingredients: ['Non', "Go'sht", 'Sabzavotlar', 'Sous'] },
  { id: 15, name: 'Doner kichik', price: 25000, image: '/food/doner.svg', categoryId: 4, isPopular: true, restaurantId: 1, spiceLevel: 1, ingredients: ['Lavash', "Go'sht", 'Sabzavotlar', 'Sous'] },
  { id: 16, name: 'Doner katta', price: 30000, image: '/food/doner-big.svg', categoryId: 4, restaurantId: 1, spiceLevel: 1, ingredients: ['Lavash', "Ko'p go'sht", 'Sabzavotlar', 'Sous'] },
  { id: 17, name: 'Doner kichik sirli', price: 28000, image: '/food/doner-cheese.svg', categoryId: 4, restaurantId: 1, spiceLevel: 1, ingredients: ['Lavash', "Go'sht", 'Pishloq', 'Sous'] },
  { id: 18, name: 'Doner katta sirli', price: 33000, image: '/food/doner-big-cheese.svg', categoryId: 4, restaurantId: 1, spiceLevel: 1, ingredients: ['Lavash', "Ko'p go'sht", 'Pishloq', 'Sous'] },
  { id: 19, name: 'Fri', price: 15000, image: '/food/fries.svg', categoryId: 5, isPopular: true, restaurantId: 1, spiceLevel: 0, ingredients: ['Kartoshka', "Yog'", 'Tuz'] },
  { id: 20, name: 'Pitsa Peperoni 30 sm', price: 65000, image: '/food/pizza-pep30.svg', categoryId: 6, isPopular: true, restaurantId: 1, spiceLevel: 1, ingredients: ['Xamir', 'Peperoni', 'Pishloq'] },
  { id: 21, name: 'Pitsa Peperoni 35 sm', price: 80000, image: '/food/pizza-pep35.svg', categoryId: 6, restaurantId: 1, spiceLevel: 1, ingredients: ['Xamir', 'Peperoni', 'Pishloq'] },
  { id: 22, name: 'Pitsa Peperoni 40 sm', price: 95000, image: '/food/pizza-pep40.svg', categoryId: 6, restaurantId: 1, spiceLevel: 1, ingredients: ['Xamir', 'Peperoni', 'Pishloq'] },
  { id: 23, name: "Pitsa go'shtli 30 sm", price: 70000, image: '/food/pizza-meat30.svg', categoryId: 6, restaurantId: 1, spiceLevel: 1, ingredients: ['Xamir', "Go'sht", 'Pishloq'] },
  { id: 24, name: "Pitsa go'shtli 35 sm", price: 90000, image: '/food/pizza-meat35.svg', categoryId: 6, restaurantId: 1, spiceLevel: 1, ingredients: ['Xamir', "Go'sht", 'Pishloq'] },
  { id: 25, name: "Pitsa go'shtli 40 sm", price: 110000, image: '/food/pizza-meat40.svg', categoryId: 6, restaurantId: 1, spiceLevel: 1, ingredients: ['Xamir', "Go'sht", 'Pishloq'] },
  { id: 26, name: 'Pitsa assorti 30 sm', price: 75000, image: '/food/pizza-assorti30.svg', categoryId: 6, restaurantId: 1, spiceLevel: 1, ingredients: ['Xamir', 'Assorti', 'Pishloq'] },
  { id: 27, name: 'Pitsa assorti 35 sm', price: 95000, image: '/food/pizza-assorti35.svg', categoryId: 6, restaurantId: 1, spiceLevel: 1, ingredients: ['Xamir', 'Assorti', 'Pishloq'] },
  { id: 28, name: 'Pitsa assorti 40 sm', price: 115000, image: '/food/pizza-assorti40.svg', categoryId: 6, restaurantId: 1, spiceLevel: 1, ingredients: ['Xamir', 'Assorti', 'Pishloq'] },
  { id: 29, name: 'Coca-Cola 0.5 L', price: 8000, image: '/food/cola.svg', categoryId: 7, restaurantId: 1, spiceLevel: 0, ingredients: ['Gazli ichimlik'] },
  { id: 30, name: 'Coca-Cola 1 L', price: 15000, image: '/food/cola-1.svg', categoryId: 7, restaurantId: 1, spiceLevel: 0, ingredients: ['Gazli ichimlik'] },
  { id: 31, name: 'Sous ketchup', price: 2000, image: '/food/sauce.svg', categoryId: 8, restaurantId: 1, spiceLevel: 0, ingredients: ['Ketchup'] },
  { id: 32, name: 'Sous sarimsoqli', price: 3000, image: '/food/sauce-garlic.svg', categoryId: 8, restaurantId: 1, spiceLevel: 0, ingredients: ['Smetana', 'Sarimsoq'] },
];

export const categories = [
  { id: 1, name: 'Hot-doglar', icon: '🌭' },
  { id: 2, name: 'Lavashlar', icon: '🌯' },
  { id: 3, name: 'Burgerlar', icon: '🍔' },
  { id: 4, name: 'Nonburgerlar & Donar', icon: '🥙' },
  { id: 5, name: 'Frilar', icon: '🍟' },
  { id: 6, name: 'Pitsalar', icon: '🍕' },
  { id: 7, name: 'Ichimliklar', icon: '🥤' },
  { id: 8, name: 'Soslar', icon: '🍶' },
];

export const foods = foodList;

export const restaurants = [
    { id: 1, name: 'BEK FOOD Chinobod', coverImage: '/food/restaurant-cover.svg', logo: '/logo.png', cuisine: 'Hot-dog, Lavash, Burger, Doner', rating: 4.8, deliveryTime: '25-35', distance: 'Chinobod', minOrder: 0, isOpen: true, address: "Chinobod tumani, Oqtepa ko'chasi, 15", phone: '+998901234567', workingHours: '10:00 - 23:00', coordinates: { lat: 41.2995, lng: 69.2401 } },
];

export const banners = [
  { id: 1, image: hotdogImg, title: "Hot-dog oddiy", subtitle: '12 000 so\'mdan boshlab' },
  { id: 2, image: burgerImg, title: 'Gamburger', subtitle: '35 000 so\'mdan boshlab' },
];

export const addresses = [
  { id: 1, label: 'Uy', fullAddress: "Chinobod, Oqtepa ko'chasi, 15", isDefault: true },
  { id: 2, label: 'Ish', fullAddress: "Chinobod, Navoiy ko'chasi, 27", isDefault: false },
];

export const paymentMethods = [
  { id: 'cash', name: 'Naqd pul', icon: 'Banknote' },
  { id: 'card', name: 'Karta orqali', icon: 'CreditCard', comingSoon: true },
];

export const notifications = [
  { id: 1, title: 'Buyurtma qabul qilindi', message: '#1234-sonli buyurtmangiz qabul qilindi', time: new Date().toISOString(), isRead: false, type: 'order' },
  { id: 2, title: 'Aksiya!', message: 'Hot-dog oddiy 20% chegirma bilan', time: new Date(Date.now() - 86400000).toISOString(), isRead: false, type: 'promo' },
];
