# Mission 11 – Bookstore App

This project is a full-stack web application built using ASP.NET Core API and React. It displays a list of books from a SQLite database with pagination, sorting, and styling using Bootstrap.

## Features

* View all books from the database
* Pagination (default 5 books per page)
* Change number of results per page
* Sort books by title (A–Z / Z–A)
* Styled using Bootstrap

## How to Run

### Backend

cd backend/Mission11_Wong.API
dotnet run

Runs on: http://localhost:5000

### Frontend

cd frontend
npm install
npm run dev

Runs on: http://localhost:3000

## Notes

* Make sure the backend is running before starting the frontend
* The database file (Bookstore.sqlite) is included in the backend folder
* API endpoint: /api/books/all
