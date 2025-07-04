# 🖼️ Interactive Gallery API (Backend)

Welcome to the backend service for **The Interactive Gallery** — a Full-Stack image browsing app that allows users to explore Unsplash images, save their favorites, comment, and like them. Built to demonstrate robust backend architecture with a clean and developer-friendly API.

---

## 🚀 Features

✨ Fetch public images from the Unsplash API  
📝 Save images to the database for interaction  
💬 Add comments to saved images  
❤️ Like/unlike saved images  
🔐 User authentication using token-based system  
🔎 Search & tag filtering  
📦 Pagination & infinite scroll-ready

---

## 🧰 Tech Stack

| Layer     | Tech                  |
| --------- | --------------------- |
| Language  | TypeScript            |
| Server    | Node.js + Express.js  |
| ORM       | Prisma                |
| Database  | PostgreSQL (via Neon) |
| Auth      | Token-based (UUID)    |
| Dev Tools | ts-node-dev, Postman  |

---

## 🗂️ Folder Structure

```
backend/
├── prisma/ # Prisma schema and migration logic
│ └── schema.prisma
├── src/
│ ├── routes/ # Express route handlers
│ │ ├── images.ts
│ │ ├── comments.ts
│ │ └── auth.ts
│ ├── lib/
│ │ └── prisma.ts # Prisma client instance
│ ├── middleware/
│ │ └── auth.ts # Authentication middleware
│ └── index.ts # Entry point
├── .env
├── package.json
└── tsconfig.json
```

## ⚙️ Environment Variables

```
Create a `.env` file in the `backend/` root:
```

DATABASE_URL="your_neon_or_postgres_url"
UNSPLASH_ACCESS_KEY="your_unsplash_api_key"

## 📦 Setup & Installation

# Clone the repo

git clone https://github.com/adenijialiuadeyemi/interactive-gallery.git

# Navigate into the backend folder

cd interactive-gallery/backend

# Install dependencies

npm install

# Setup Prisma and DB

npx prisma db push
npx prisma generate

# Start dev server

npm run dev

## 🧪 API Documentation

🔐 Auth
POST /api/auth
Create or retrieve a user by name. Returns a token.

```
{ "name": "Aliu" }
```

📤 Unsplash
GET /api/images/unsplash
Fetch random public images from Unsplash.

```
Query: ?page=1&limit=12
```

💾 Save Image
POST /api/images
Save a selected Unsplash image to the DB.

```
{
"unsplashId": "123abc",
"title": "Sunset View",
"author": "Jane Doe",
"description": "Stunning sky view",
"tags": ["sunset", "nature"]
}
```

🗂️ Get Saved ImagesGET /api/images/saved
Supports:

- page (number)
- limit (number)
- search (string)
- tag (string)

```
GET /api/images/saved?page=1&limit=6&search=sunset&tag=nature
```

Returns:

```
{
"page": 1,
"limit": 6,
"total": 42,
"hasMore": true,
"images": [...]
}
```

💬 Comments
POST /api/comments
Add a comment to a saved image
Auth required: Authorization: Bearer <token>

```
{
"text": "Beautiful capture!",
"imageId": "clxyz123"
}
```

❤️ Like / Unlike
POST /api/images/like/:id
Toggles like/unlike on a saved image
Auth required: Authorization: Bearer <token>

Returns:

```
{ "message": "Liked" } // or "Unliked"
```

## 🧠 Design Notes

- Unsplash + Local DB hybrid model allows you to browse from Unsplash while enriching saved images with likes/comments.

- Token-based authentication (using UUIDs) avoids passwords for simplicity while simulating secure identity.

- Pagination & Infinite Scroll support via shared backend logic.

- Prisma ORM allows fast and flexible DB querying with type safety.

## 🔗 External Links

-🔌 Unsplash Developer API

- 📚 Prisma ORM Docs

- 🗄️ Neon Postgres

## ✨ Author

Built with ❤️ by Adeniji Aliu Adeyemi
https://github.com/adenijialiuadeymi
