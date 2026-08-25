# MR DOC — Database Schema (MongoDB / Mongoose)

Simple beginner-friendly schemas. Each one maps to a file in `backend/models/`.

## User
```js
{
  username: String,        // "Admin" or "Guest"
  password: String,        // store hashed later, plain for now if just starting
  role: String              // "admin" or "guest"
}
```

## LedgerEntry  (covers Loans, Shop Rent, CB Bill — same shape, different "type")
```js
{
  type: String,             // "loan" | "shop_rent" | "cb_bill"
  name: String,
  date: Date,
  amount: Number,
  deadlineDate: Date
}
```
Using one collection with a `type` field is simpler than 3 separate models — one set of add/edit/delete code handles all three sidebar items.

## Purchase
```js
{
  name: String,
  date: Date,
  amount: Number
}
```

## Invoice
```js
{
  customerName: String,
  mobileNumber: String,
  date: Date,
  items: [
    {
      material: String,     // "T-shirt" | "Shirt" | "Jeans" | "Shorts" | "Other"
      price: Number,
      count: Number
    }
  ],
  discount: Number,
  totalAmount: Number,       // sum of (price * count) across items
  finalAmount: Number        // totalAmount - discount
}
```

## Salary  (admin only)
```js
{
  memberName: String,
  date: Date,
  salaryAmount: Number
}
```

## ShopValue  (admin only)
```js
{
  categoryName: String,
  count: Number,
  value: Number,             // value per unit
  totalAmount: Number        // count * value
}
```

## Feature  (admin toggle switch)
```js
{
  name: String,              // "invoice", "salary", "shopValue", "purchase", etc.
  enabled: Boolean
}
```

## Seeding admin/guest users
Don't hardcode "Admin/AdminMR2026" inside the code. Instead, write a one-time seed script (`backend/config/seed.js`) that inserts these two users into the DB when you first set up. Run it once, then never again.
