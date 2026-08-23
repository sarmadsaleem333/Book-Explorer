# Book Explorer

Book Explorer is a full-stack book discovery application. It searches Open Library for books and enriches the results with ratings from Google Books through a Node.js and Express backend.

The React frontend communicates only with the backend. API keys are never exposed to the browser.

## Features

- Search by title, author, or keyword
- Book covers, authors, descriptions, publishers, and publication years
- Google Books ratings and rating counts when available
- ISBN-based and title/author-based Google Books matching
- Responsive book grid
- Numbered pagination
- Book details view
- Loading, empty, and error states
- URL search state for shareable searches

## Project Structure

```text
Book Explorer/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── book.controller.js
│   │   ├── routes/
│   │   │   └── book.routes.js
│   │   ├── services/
│   │   │   ├── book.service.js
│   │   │   ├── googleBooks.service.js
│   │   │   └── openLibrary.service.js
│   │   ├── utils/
│   │   │   └── normalizeBook.js
│   │   ├── app.js
│   │   └── server.js
│   ├── .env
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── books.js
│   │   ├── components/
│   │   │   ├── BookCard.jsx
│   │   │   ├── Cover.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── LoadingGrid.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── Rating.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── pages/
│   │   │   ├── BooksPage.jsx
│   │   │   └── DetailsPage.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## How It Works

```text
React frontend
    ↓
GET /api/books?q=the hobbit&page=1&limit=12
    ↓
Express route and controller
    ↓
Open Library book search
    ↓
Google Books rating lookup
    ↓
Data normalization
    ↓
JSON response to React
```

Open Library supplies the main book results. For each result, the backend selects a valid ISBN-13 when possible and searches Google Books. If the ISBN result does not have a rating, the backend searches by title and author and checks multiple candidate volumes.

The backend reads ratings from:

```js
book.volumeInfo.averageRating;
book.volumeInfo.ratingsCount;
```

When Google Books has no rating, the response correctly contains:

```json
{
  "rating": null,
  "ratingsCount": 0
}
```

No ratings are hardcoded or generated.

## Requirements

- Node.js 18 or newer
- A Google Books API key
- Internet access for the external APIs

MongoDB is not required. The application uses live API data and does not store books in a database.

## Backend Setup

Open a terminal in the project root:

```powershell
cd backend
npm install
```

Create `backend/.env` from the example file:

```powershell
Copy-Item .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
GOOGLE_BOOKS_API_KEY=your_google_books_api_key
OPEN_LIBRARY_USER_AGENT=BookExplorer/1.0 (your-email@example.com)
```

The Google Books API must be enabled in the Google Cloud project that owns the key.

Start the backend:

```powershell
npm.cmd start
```

For automatic restart during development:

```powershell
npm.cmd run dev
```

The backend runs at:

```text
http://localhost:5000
```

## Frontend Setup

Open a second terminal in the project root:

```powershell
cd frontend
npm install
```

Start the Vite development server:

```powershell
npm.cmd run dev
```

The frontend runs at:

```text
http://localhost:5173
```

Open this URL in a browser:

```text
http://localhost:5173/books?q=the+hobbit&page=1
```

## Production Build

To create a production frontend build:

```powershell
cd frontend
npm.cmd run build
```

To preview that build:

```powershell
npm.cmd run preview
```

## API Endpoints

Health check:

```text
GET http://localhost:5000/api/health
```

Book search:

```text
GET http://localhost:5000/api/books?q=the+hobbit&page=1&limit=12
```

Example PowerShell request:

```powershell
Invoke-RestMethod "http://localhost:5000/api/books?q=the+hobbit&page=1&limit=12" |
  ConvertTo-Json -Depth 10
```

Example browser URL:

```text
http://localhost:5000/api/books?q=harry+potter&page=1&limit=12
```

## External APIs

Open Library search:

```text
https://openlibrary.org/search.json?q=the+hobbit
```

Google Books search:

```text
https://www.googleapis.com/books/v1/volumes?q=the+hobbit&maxResults=40&key=YOUR_API_KEY
```

The frontend does not call either external API directly. Only the backend communicates with them.

## Important Security Notes

- Keep the real Google Books key in `backend/.env` only.
- Do not place the key in React files.
- Do not commit `.env` to Git.
- Regenerate the key if it has been shared publicly.
