# MR DOC — Shop Management Web App

## Folder structure
- `backend/` — Node.js + Express API
- `frontend/` — plain HTML/CSS/JS

## Local setup

1. Install backend dependencies:
   ```
   cd backend
   npm install
   ```

2. Create a MongoDB Atlas free cluster, get your connection string.

3. Copy `.env.example` to `.env` and fill in:
   ```
   MONGO_URI=your_connection_string
   JWT_SECRET=any_long_random_text
   PORT=5000
   ```

4. Seed the Admin/Guest users and default feature flags (run once):
   ```
   npm run seed
   ```

5. Start the server:
   ```
   npm start
   ```

6. Open `http://localhost:5000` in your browser. Login with:
   - Admin / AdminMR2026
   - Guest / Guest123

## Deploying to Render

1. Push this whole folder to a GitHub repo.
2. On Render: New → Web Service → connect your repo.
3. Root directory: `backend`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables (MONGO_URI, JWT_SECRET) in Render's dashboard — never commit `.env`.
7. Once deployed, Express serves the frontend automatically (see `server.js`), so one Render service handles everything.

## Still to add later
- Invoice edit/delete if needed
- Password hashing (currently plain-text match, fine for a small private tool but upgrade later with bcrypt)
