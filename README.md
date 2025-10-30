# 🏠 Roomio - Marketplace Kos & Kontrakan Jember

<div align="center">

![Roomio Logo](https://via.placeholder.com/200x200/4F46E5/FFFFFF?text=Roomio)

**Platform Hyperlocal untuk Sewa Kos & Kontrakan di Jember**

[![React](https://img.shields.io/badge/React-18.3.1-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite)](https://vitejs.dev/)

</div>

---

## 📖 Tentang Proyek

**Roomio** adalah platform marketplace kos dan kontrakan yang dirancang khusus untuk area Jember, dikembangkan sebagai proyek akhir semester 3 Manajemen Informatika. Platform ini menyediakan solusi lengkap untuk pencari hunian (mahasiswa, pekerja, korporat) dan pemilik properti dengan fitur-fitur modern dan user-friendly.

### 🎯 Fitur Utama

#### Untuk Pencari Hunian
- 🔍 **Smart Search** - Pencarian cepat dengan filter advanced (harga, tipe, fasilitas, lokasi)
- 📍 **Hyperlocal Targeting** - Fokus pada area-area strategis di Jember
- 🏘️ **Detail Listing Lengkap** - Foto, fasilitas, aturan, harga per bulan/tahun
- ⭐ **Sistem Review & Rating** - Review dari penghuni sebelumnya
- 🤝 **Roommate Matching** - Temukan teman sekamar yang cocok
- 📱 **Fully Responsive** - Optimized untuk desktop, tablet, dan mobile
- ✅ **Verified Properties** - Badge verifikasi untuk properti terpercaya

#### Untuk Pemilik Properti
- 📝 **Manajemen Listing** - Pasang dan kelola listing dengan mudah
- 📊 **Dashboard Properti** - Monitor performa listing
- 📄 **Kontrak Digital** - Template kontrak dan peraturan standar
- 🔔 **Notifikasi Real-time** - Update booking dan pesan

#### Fitur Teknis
- 🗺️ **Google Maps Integration** - Lokasi akurat dengan peta interaktif
- 💬 **Sistem Messaging** - Komunikasi langsung dengan pemilik
- ❤️ **Wishlist/Favorit** - Simpan listing favorit
- 🎨 **Modern UI/UX** - Design clean, homey dengan sidebar collapsible
- 🌓 **Dark Mode Support** - Mode gelap untuk kenyamanan mata

---

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI Library
- **TypeScript 5.6** - Type-safe JavaScript
- **Vite 6.0** - Build tool & dev server
- **Tailwind CSS 4.0** - Utility-first CSS framework

### UI Components
- **shadcn/ui** - Re-usable component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Beautiful icon set

### State Management
- React Hooks (useState, useEffect)

### Utilities
- **clsx** - Conditional className utility
- **tailwind-merge** - Merge Tailwind classes

---

## 📋 Prerequisites

Sebelum memulai, pastikan Anda telah menginstall:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** >= 9.0.0 (included with Node.js) atau **yarn** >= 1.22.0
- **Git** ([Download](https://git-scm.com/))
- **Code Editor** (Recommended: [VS Code](https://code.visualstudio.com/))

### VS Code Extensions (Recommended)

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## 🚀 Installation & Setup

### 1. Clone Repository

```bash
git clone https://github.com/username/roomio.git
cd roomio
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Or using yarn:
```bash
yarn install
```

### 3. Environment Setup (Optional)

Jika Anda ingin menggunakan API eksternal atau Google Maps, buat file `.env`:

```bash
cp .env.example .env
```

Edit `.env` dan tambahkan API keys:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
VITE_API_BASE_URL=http://localhost:3000
```

### 4. Start Development Server

```bash
npm run dev
```

atau

```bash
yarn dev
```

Aplikasi akan berjalan di `http://localhost:5173/` (default Vite port)

---

## 📁 Project Structure

```
roomio/
├── components/              # React components
│   ├── figma/              # Figma-imported components
│   │   └── ImageWithFallback.tsx
│   ├── ui/                 # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── ...
│   ├── FilterDrawer.tsx    # Filter component
│   ├── HomePage.tsx        # Main homepage
│   ├── ListingCard.tsx     # Property listing card
│   ├── SearchBar.tsx       # Search component
│   └── Sidebar.tsx         # Navigation sidebar
├── lib/                    # Utility functions & data
│   └── mock-data.ts       # Mock data untuk development
├── styles/                 # Global styles
│   └── globals.css        # Tailwind & custom CSS
├── App.tsx                # Main app component
├── main.tsx              # Entry point
├── index.html            # HTML template
├── vite.config.ts        # Vite configuration
├── tsconfig.json         # TypeScript configuration
├── postcss.config.js     # PostCSS configuration
├── package.json          # Dependencies & scripts
└── README.md            # Documentation (this file)
```

---

## 🎨 Design System

### Color Palette

#### Light Mode
- **Primary**: `#030213` - Dark blue for primary actions
- **Secondary**: `#ececf0` - Light gray for backgrounds
- **Accent**: Blue to Purple gradient (`from-blue-500 to-purple-600`)
- **Background**: `#ffffff`
- **Foreground**: `oklch(0.145 0 0)`

#### Dark Mode
- **Background**: `oklch(0.145 0 0)`
- **Foreground**: `oklch(0.985 0 0)`
- **Accent**: `oklch(0.269 0 0)`

### Typography
- **Base Font Size**: 16px
- **Headings**: Medium weight (500)
- **Body Text**: Normal weight (400)
- **Line Height**: 1.5

### Spacing
- **Border Radius**: 0.625rem (10px)
- **Padding**: Responsive (3-6 units)

---

## 📜 Available Scripts

### Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Linting & Formatting

```bash
# Run ESLint
npm run lint

# Fix ESLint errors
npm run lint:fix
```

### Type Checking

```bash
# TypeScript type check
npm run type-check
```

---

## 🗂️ Mock Data

Proyek ini menggunakan mock data untuk development yang terletak di `/lib/mock-data.ts`. Data mencakup:

- **6 Sample Listings** - Properti di berbagai area Jember
- **Property Types** - Kos Putra, Kos Putri, Kontrakan, Apartemen
- **Facilities** - WiFi, AC, Kamar Mandi Dalam, dll.
- **Areas** - Sumbersari, Patrang, Kaliwates, Mangli, Tegal Boto, Tegalbesar

### Struktur Data Listing

```typescript
interface Listing {
  id: string;
  title: string;
  type: 'kos-putra' | 'kos-putri' | 'kontrakan' | 'apartemen';
  area: string;
  address: string;
  priceMonth: number;
  priceYear?: number;
  images: string[];
  facilities: string[];
  availableRooms: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  badges: string[];
}
```

---

## 🎯 Component Guidelines

### Sidebar Component
- **Collapsible**: Dapat di-collapse di desktop
- **Mobile-friendly**: Slide-in menu di mobile
- **Tooltip Support**: Tooltip saat sidebar collapsed
- **Active State**: Visual indicator untuk page aktif

### ListingCard Component
- **Image Gallery**: Swipe/click untuk lihat foto
- **Favorite Toggle**: Heart icon untuk wishlist
- **Verified Badge**: Shield icon untuk properti verified
- **Responsive Pricing**: Format currency Indonesia

### FilterDrawer Component
- **Price Range Slider**: Rp 0 - Rp 5.000.000
- **Property Type Filter**: Multi-select
- **Facilities Checklist**: Scrollable list
- **Minimum Stay**: Radio button options

---

## 🚀 Deployment

### Build untuk Production

```bash
npm run build
```

Build output akan berada di folder `dist/`

### Deploy ke Vercel (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login ke Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel --prod
```

### Deploy ke Netlify

1. Build project:
```bash
npm run build
```

2. Drag & drop folder `dist/` ke [Netlify Drop](https://app.netlify.com/drop)

### Deploy ke GitHub Pages

1. Install gh-pages:
```bash
npm install --save-dev gh-pages
```

2. Add to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

---

## 🔧 Configuration Files

### vite.config.ts
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

### tsconfig.json
Configured for strict type checking with path aliases.

### postcss.config.js
Configured for Tailwind CSS 4.0 with @tailwindcss/postcss.

---

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 5173
npx kill-port 5173

# Or use different port
npm run dev -- --port 3000
```

### Module not found errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors
```bash
# Restart TypeScript server in VS Code
Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### Tailwind CSS not working
```bash
# Rebuild and restart dev server
npm run build
npm run dev
```

---

## 📱 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Android)

---

## 🤝 Contributing

Contributions are welcome! Untuk kontribusi:

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### Commit Message Convention

```
feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, missing semi colons, etc
refactor: code refactoring
test: adding tests
chore: updating build tasks, etc
```

---

## 📝 Future Development

- [ ] Backend Integration dengan Node.js/Express
- [ ] Database Integration (PostgreSQL/MongoDB)
- [ ] Real-time Messaging dengan Socket.io
- [ ] Payment Gateway Integration
- [ ] Email Notifications
- [ ] Advanced Search dengan Elasticsearch
- [ ] Mobile App dengan React Native
- [ ] Progressive Web App (PWA)
- [ ] Multi-language Support (ID/EN)
- [ ] Analytics Dashboard

---

## 👥 Team

**Proyek Akhir Semester 3**  
Manajemen Informatika  
[Nama Institusi]

**Developer**: [Nama Anda]  
**Email**: [email@example.com]  
**GitHub**: [@username](https://github.com/username)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - The library for web and native user interfaces
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible components
- [Lucide Icons](https://lucide.dev/) - Beautiful & consistent icons
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

---

## 📞 Support

Jika ada pertanyaan atau issues:

- 📧 Email: [email@example.com]
- 💬 GitHub Issues: [Create Issue](https://github.com/username/roomio/issues)
- 📱 WhatsApp: [+62xxx]

---

<div align="center">

**Made with ❤️ in Jember**

[⬆ Back to Top](#-roomio---marketplace-kos--kontrakan-jember)

</div>
