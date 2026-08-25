# MR DOC — Software Architecture

## 1. Tech stack
- Frontend: HTML, CSS, JavaScript (vanilla)
- Backend: Node.js + Express
- Database: MongoDB Atlas (free cloud tier)
- Hosting: Render (one Web Service can serve both backend + frontend)

## 2. Folder structure (this is what you push to GitHub)

```
mr-doc-app/
├── backend/
│   ├── server.js                 # entry point, starts Express
│   ├── package.json
│   ├── .env                      # DB_URI, JWT_SECRET (never commit this)
│   ├── .gitignore                # must include node_modules/, .env
│   ├── config/
│   │   └── db.js                 # mongoose connection
│   ├── models/
│   │   ├── User.js
│   │   ├── LedgerEntry.js        # loans / shop rent / CB bill
│   │   ├── Purchase.js
│   │   ├── Invoice.js
│   │   ├── Salary.js
│   │   ├── ShopValue.js
│   │   └── Feature.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── ledgerRoutes.js
│   │   ├── purchaseRoutes.js
│   │   ├── invoiceRoutes.js
│   │   ├── salaryRoutes.js
│   │   ├── shopValueRoutes.js
│   │   └── featureRoutes.js
│   ├── controllers/               # actual logic for each route file above
│   │   └── ...same names as routes...
│   └── middleware/
│       ├── auth.js                # checks logged in
│       └── adminOnly.js           # checks role === admin
│
└── frontend/
    ├── index.html                 # login page
    ├── dashboard.html              # main app (sidebars + header)
    ├── invoice.html                # invoice/billing page
    ├── css/
    │   └── style.css
    ├── js/
    │   ├── api.js                  # fetch() wrapper functions
    │   ├── auth.js
    │   ├── ledger.js
    │   ├── purchase.js
    │   ├── invoice.js
    │   ├── salary.js
    │   └── shopValue.js
    └── assets/
        └── logo.png                # shop logo for invoice header
```

## 3. Module breakdown (from your requirements doc)

| Module | Access | Notes |
|---|---|---|
| Login | Admin, Guest | hardcoded creds go into DB (seeded once), not left in code |
| Left sidebar — Purchase | Admin, Guest | name, date, amount — add/edit/delete |
| Right sidebar — Loans / Shop Rent / CB Bill | Admin, Guest | name, date, amount, deadline date — add/edit/delete |
| Invoice | Admin, Guest | name, mobile, date, material (T-shirt/Shirt/Jeans/Shorts/Other), manual price+count, auto/manual total, discount, final amount, download as JPEG, shop logo in header |
| Salary | Admin only | staff name, date, amount — add/edit |
| Shop Value | Admin only | category name, count, value, total — add/edit/delete |
| Feature toggle | Admin only | turn any module on/off app-wide |
| Logout | Admin, Guest | clears session |

## 4. How a request flows
1. User opens the site (Render serves `frontend/index.html`)
2. User logs in → frontend sends `POST /api/auth/login` → backend checks DB → sends back a token
3. All later requests (add purchase, create invoice, etc.) attach that token
4. Backend middleware checks token is valid, and for admin routes, checks role
5. Backend talks to MongoDB Atlas via Mongoose, sends JSON back
6. Frontend JS updates the page (no page reload — fetch + DOM update)

## 5. Invoice JPEG download (specific note)
Do this fully on the frontend — no backend work needed:
- Build the invoice as a styled `<div>` in `invoice.html`
- Use a small library like `html2canvas` (loaded via CDN) to convert that div into an image
- Trigger a download of that image as `.jpg`

## 6. Feature toggle logic
- One `features` collection in DB: `{ name: "invoice", enabled: true }` etc.
- On app load, frontend fetches `/api/features` and hides sidebar buttons/menu items where `enabled: false`
- Admin gets a small settings screen to flip these
