# AJIF — Shashlik & Fastfood

Premium shashlik va fastfood buyurtma ilovasi. 2 ta filial (Chinobod, Qo'shtepa) bilan ishlaydi.

## Stack

- **Frontend**: React 19, Vite 8, React Router 6, Zustand 5, Lucide React
- **Backend**: Express 4, Prisma 6, PostgreSQL, Socket.IO, Redis, Cloudinary
- **Auth**: JWT (httpOnly cookies)

## O'rnatish

### Frontend

```bash
npm install
cp .env.example .env   # VITE_API_URL ni sozlang
npm run dev
```

### Backend

```bash
cd server
npm install
cp .env.example .env   # DATABASE_URL, JWT_SECRET, va boshqalarni to'ldiring
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## .env sozlash

### Frontend (.env)

| O'zgaruvchi | Tavsif | Misol |
|---|---|---|
| `VITE_API_URL` | Backend API manzili | `http://localhost:5000` |

### Backend (server/.env)

| O'zgaruvchi | Tavsif | Misol |
|---|---|---|
| `DATABASE_URL` | PostgreSQL ulanish | `postgresql://user:pass@localhost:5432/ajif` |
| `JWT_SECRET` | JWT kalit | `your-super-secret-jwt-key` |
| `JWT_REFRESH_SECRET` | Refresh token kalit | `your-refresh-secret-key` |
| `REDIS_URL` | Redis ulanish | `redis://localhost:6379` |
| `CORS_ORIGIN` | Frontend manzili | `http://localhost:5173` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary nom | - |
| `CLOUDINARY_API_KEY` | Cloudinary API kalit | - |
| `CLOUDINARY_API_SECRET` | Cloudinary maxfiy kalit | - |

## Filiallar

| Filial | Manzil | Koordinata |
|---|---|---|
| AJIF — Chinobod | Chinobod ko'chasi, Toshkent | 41.3111, 69.2797 |
| AJIF — Qo'shtepa | Qo'shtepa ko'chasi, Toshkent | 41.3456, 69.3123 |

## Test hisoblar

| Role | Email | Parol |
|---|---|---|
| Admin | admin@ajif.uz | admin123 |
| Haydovchi | driver@ajif.uz | driver123 |
| Mijoz | customer@ajif.uz | customer123 |

## Loyiha tuzilishi

```
/
├── src/                    # Frontend (React)
│   ├── components/         # Umumiy komponentlar (Logo, Header, BottomNav, ...)
│   ├── pages/              # Sahifalar (Home, Cart, Checkout, ...)
│   ├── shared/ui/          # Qayta ishlatiladigan UI komponentlar
│   ├── store/              # Zustand store
│   ├── lib/api.js          # API client
│   ├── admin/              # Admin panel
│   ├── driver/             # Haydovchi paneli
│   └── order-manager/      # Buyurtma menejeri paneli
└── server/                 # Backend (Express)
    ├── prisma/             # Prisma schema va seed
    └── src/
        ├── routes/         # API yo'nalishlari
        ├── controllers/    # Controller logikasi
        ├── middleware/      # Auth, error handling
        └── validators/     # Zod validatsiya
```
