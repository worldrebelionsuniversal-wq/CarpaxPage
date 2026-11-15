
```
carpaPage
├─ .env
├─ .oxlintrc.json
├─ backend
│  ├─ admin
│  │  ├─ controllers
│  │  │  ├─ adminController.js
│  │  │  └─ authController.js
│  │  ├─ middleware
│  │  │  └─ auth.js
│  │  ├─ models
│  │  │  ├─ productImageModel.js
│  │  │  ├─ productModel.js
│  │  │  └─ userModel.js
│  │  └─ routes
│  │     ├─ adminRoutes.js
│  │     ├─ authRoutes.js
│  │     └─ productsRoutes.js
│  ├─ cliente
│  │  ├─ controllers
│  │  │  └─ productController.js
│  │  ├─ models
│  │  │  └─ productModel.js
│  │  └─ routes
│  │     └─ productRoutes.js
│  └─ login
│     ├─ controllers
│     │  └─ authController.js
│     ├─ middleware
│     │  └─ auth.js
│     ├─ models
│     │  └─ userModel.js
│     └─ routes
│        └─ authRoutes.js
├─ context
│  ├─ AuthContext.jsx
│  └─ CartContext.jsx
├─ database.js
├─ frontend
│  ├─ admin
│  │  ├─ index.html
│  │  └─ src
│  │     ├─ App.css
│  │     ├─ App.jsx
│  │     ├─ AuthContext.jsx
│  │     ├─ components
│  │     │  ├─ AdminHeader.jsx
│  │     │  ├─ AdminLayout.jsx
│  │     │  ├─ AdminRoute.jsx
│  │     │  └─ AdminSidebar.jsx
│  │     ├─ context
│  │     │  └─ AuthContext.jsx
│  │     ├─ index.css
│  │     ├─ main.jsx
│  │     ├─ pages
│  │     │  ├─ AdminDashboard.jsx
│  │     │  ├─ AdminImages.jsx
│  │     │  ├─ AdminProductForm.jsx
│  │     │  └─ AdminProducts.jsx
│  │     ├─ services
│  │     │  └─ adminApi.js
│  │     └─ styles
│  │        ├─ admin.css
│  │        ├─ AdminHeader.css
│  │        └─ AdminSidebar.css
│  ├─ cliente
│  │  ├─ index.html
│  │  ├─ package-lock.json
│  │  └─ src
│  │     ├─ App.css
│  │     ├─ App.jsx
│  │     ├─ components
│  │     │  ├─ CartView.jsx
│  │     │  ├─ Footer.jsx
│  │     │  ├─ Header.jsx
│  │     │  ├─ HomeView.jsx
│  │     │  ├─ ProductDetail.jsx
│  │     │  ├─ ProductList.jsx
│  │     │  └─ SearchView.jsx
│  │     ├─ context
│  │     │  └─ CartContext.jsx
│  │     ├─ hooks
│  │     │  ├─ useCart.js
│  │     │  └─ useProducts.js
│  │     ├─ index.css
│  │     ├─ main.jsx
│  │     ├─ services
│  │     │  └─ api.js
│  │     └─ styles
│  │        ├─ CartView.css
│  │        ├─ Footer.css
│  │        ├─ Header.css
│  │        ├─ HomeView.css
│  │        ├─ ProductDetail.css
│  │        ├─ ProductList.css
│  │        └─ SearchView.css
│  └─ login
│     ├─ index.html
│     └─ src
│        ├─ App.jsx
│        ├─ components
│        │  └─ AdminRoute.jsx
│        ├─ context
│        │  └─ AuthContext.jsx
│        ├─ index.css
│        ├─ main.jsx
│        ├─ pages
│        │  ├─ AdminLogin.jsx
│        │  └─ LoginPage.jsx
│        ├─ services
│        │  └─ authApi.js
│        └─ styles
│           └─ Login.css
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.svg
│  ├─ icons.svg
│  └─ images
│     ├─ carpasArmables
│     │  ├─ 3x2blanca
│     │  ├─ 3x3azul
│     │  │  └─ 1.webp
│     │  ├─ 3x3blanca
│     │  │  └─ 1.webp
│     │  └─ 3x3verde
│     │     └─ 1.webp
│     └─ carpasPlegables
│        ├─ 2x2azul
│        │  └─ 1.webp
│        └─ 3x3roja
│           ├─ 1.webp
│           └─ 2.webp
├─ server.js
└─ vite.config.js

```