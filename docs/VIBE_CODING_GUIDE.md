# Panduan Vibe Coding — Shoesmu Admin Dashboard

Dokumen ini menjelaskan arsitektur yang telah disiapkan dan langkah-langkah untuk melakukan **Vibe Coding** berbasis Screenshot Figma & Figma MCP.

---

## 1. Arsitektur & Struktur Folder

```text
shoesmu/
├── docs/                             # Dokumen PRD, Design Tokens, & Panduan
│   ├── prompt/
│   │   ├── prd-shoesmu-admin-dashboard.md
│   │   └── DESIGN-nike.md
│   ├── 1.Color Mode/Light Mode.tokens.json
│   ├── 2.Typography/Mode 1.tokens.json
│   ├── Semantic/Mode 1.tokens.json
│   └── VIBE_CODING_GUIDE.md          # Panduan ini
├── public/                           # Static assets & favicon
├── src/
│   ├── assets/                       # Images, logos, icons
│   ├── components/
│   │   ├── common/                   # Reusable UI Primitives
│   │   │   ├── Button.jsx            # Pill buttons (primary, secondary, icon-circular)
│   │   │   ├── Badge.jsx             # Status pills (success, warning, error, info, sale)
│   │   │   ├── StatusBadge.jsx       # Specialized order & stock status badge
│   │   │   ├── SearchPill.jsx        # Nike-style search pill (40px)
│   │   │   ├── FilterChip.jsx        # Toggle filter chip
│   │   │   ├── Card.jsx              # Flat surface card with hairline border
│   │   │   ├── KpiCard.jsx           # Metric card with delta and permission masking
│   │   │   ├── DataTable.jsx         # Flat responsive data table
│   │   │   ├── Modal.jsx             # Flat modal dialog
│   │   │   └── Dropdown.jsx          # Clean menu dropdown
│   │   └── navigation/
│   │       ├── Sidebar.jsx           # Vertical nav with ink active pill
│   │       ├── TopBar.jsx            # Global search, notifications, & role switcher
│   │       └── Breadcrumb.jsx        # Navigation breadcrumb
│   ├── config/
│   │   ├── constants.js              # Brands, order statuses, formatters
│   │   ├── navigation.js             # Nav menu items & roles
│   │   └── tokens.js                 # Exported design token constants
│   ├── context/
│   │   └── AuthContext.jsx           # Role state (Super Admin vs Staff)
│   ├── data/
│   │   └── mockData.js               # Database mock lengkap (KPIs, Charts, Orders, Products, etc.)
│   ├── hooks/                        # useDashboard, useProducts, useOrders, useInventory
│   ├── layouts/
│   │   ├── AdminLayout.jsx           # Shell konsol admin (Sidebar + TopBar + Outlet)
│   │   └── AuthLayout.jsx            # Shell halaman login
│   ├── pages/                        # Scaffolds halaman yang siap di-vibe-code
│   │   ├── DashboardPage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductDetailPage.jsx
│   │   ├── ProductCreatePage.jsx
│   │   ├── CategoriesPage.jsx
│   │   ├── OrdersPage.jsx
│   │   ├── OrderDetailPage.jsx
│   │   ├── CustomersPage.jsx
│   │   ├── CustomerDetailPage.jsx
│   │   ├── InventoryPage.jsx
│   │   ├── PromotionsPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── LoginPage.jsx
│   │   └── NotFoundPage.jsx
│   ├── routes/
│   │   └── AppRoutes.jsx             # React Router routing
│   ├── services/
│   │   └── api.js                    # Mock API layer dengan async & localStorage persistence
│   ├── index.css                     # Tailwind setup, custom utilities & tokens
│   ├── App.jsx
│   └── main.jsx
├── index.html                        # Root HTML dengan Google Fonts (Plus Jakarta Sans & Bebas Neue)
├── package.json                      # Dependencies: React 18, Tailwind, Lucide, Recharts
├── tailwind.config.js                # Mapping seluruh token Figma & DESIGN-nike.md
└── vite.config.js                    # Vite setup dengan path alias `@/`
```

---

## 2. Cara Kerja Design Tokens di Tailwind

Semua token dari Figma (`Light Mode.tokens.json`, `Mode 1.tokens.json`) dan `DESIGN-nike.md` sudah terdaftar di [tailwind.config.js](file:///c:/Users/Lenovo/Documents/shoesmu/tailwind.config.js):

| Token Kategori | Class Tailwind | Keterangan |
|---|---|---|
| **Warna Utama** | `bg-ink`, `text-ink` | `#111111` (Black anchor khas Nike) |
| **Surface** | `bg-canvas`, `bg-soft-cloud` | `#FFFFFF` dan `#F5F5F5` (Gray backdrop) |
| **Hairline Border** | `border-hairline`, `border-gray-200` | `#CACACB` / `#E9EAEB` (1px flat divider) |
| **Pill Radius** | `rounded-full` / `rounded-lg` | Radius kapsul 30px / 9999px |
| **Flat Container** | `rounded-none`, `shadow-none` | Prinsip tanpa drop shadow |
| **Semantic Success** | `bg-success-50`, `text-success-700` | `#079455` (In-stock, Delivered) |
| **Semantic Warning** | `bg-warning-50`, `text-warning-700` | `#DC6903` (Low-stock, Pending) |
| **Semantic Sale/Error**| `bg-error-50`, `text-sale` | `#D30005` / `#D92D21` (Discounts, Out of stock) |
| **Typography Display**| `font-display`, `text-display1` | Plus Jakarta Sans / Bebas Neue |

---

## 3. Alur Melakukan Vibe Coding Per Layar

1. **Pilih Halaman Target** (contoh: Dashboard, Products, Orders, dsb).
2. **Kirim Screenshot Figma atau Data MCP Figma** ke chat.
3. **Beri instruksi**:
   > *"Tolong sesuaikan `src/pages/DashboardPage.jsx` (atau komponen tertentu) agar persis 100% seperti screenshot Figma ini."*
4. AI akan langsung memodifikasi file terkait, menyesuaikan padding, visual hierarchy, alignment, dan styling menggunakan komponen yang sudah siap (`KpiCard`, `Card`, `SearchPill`, `Button`, `DataTable`, `StatusBadge`).
5. Perubahan dapat langsung dilihat secara live!
