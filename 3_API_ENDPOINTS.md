# MR DOC — API Endpoint Design

Base URL once hosted: `https://your-app.onrender.com/api`

## Auth
| Method | Route | Access | Description |
|---|---|---|---|
| POST | /api/auth/login | Public | body: { username, password } → returns token + role |
| POST | /api/auth/logout | Logged in | clears session/token |

## Purchase
| Method | Route | Access |
|---|---|---|
| GET | /api/purchases | Admin, Guest |
| POST | /api/purchases | Admin, Guest |
| PUT | /api/purchases/:id | Admin, Guest |
| DELETE | /api/purchases/:id | Admin, Guest |

## Ledger (Loans / Shop Rent / CB Bill)
| Method | Route | Access |
|---|---|---|
| GET | /api/ledger?type=loan | Admin, Guest |
| POST | /api/ledger | Admin, Guest |
| PUT | /api/ledger/:id | Admin, Guest |
| DELETE | /api/ledger/:id | Admin, Guest |

`type` query param filters between `loan`, `shop_rent`, `cb_bill`.

## Invoice
| Method | Route | Access |
|---|---|---|
| GET | /api/invoices | Admin, Guest |
| POST | /api/invoices | Admin, Guest |
| GET | /api/invoices/:id | Admin, Guest |

(No edit/delete required per your doc — invoices are final once created. Add later if needed.)

## Salary  (admin only)
| Method | Route | Access |
|---|---|---|
| GET | /api/salaries | Admin |
| POST | /api/salaries | Admin |
| PUT | /api/salaries/:id | Admin |

## Shop Value  (admin only)
| Method | Route | Access |
|---|---|---|
| GET | /api/shop-value | Admin |
| POST | /api/shop-value | Admin |
| PUT | /api/shop-value/:id | Admin |
| DELETE | /api/shop-value/:id | Admin |

## Features (admin toggle)
| Method | Route | Access |
|---|---|---|
| GET | /api/features | Admin, Guest (guest needs this to know what's hidden) |
| PUT | /api/features/:name | Admin |

## Response shape (keep consistent across all routes)
```json
{
  "success": true,
  "data": { },
  "message": ""
}
```
On error:
```json
{
  "success": false,
  "message": "reason here"
}
```
