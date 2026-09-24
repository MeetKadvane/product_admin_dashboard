# Product Admin Dashboard

A responsive Product Admin Dashboard built with Next.js, React, Tailwind CSS, Axios, and DummyJSON.

The application allows users to authenticate, browse products, search and filter products, sort results, view product details, and perform add, edit, and delete operations.

## Features

- User authentication with DummyJSON
- Protected product routes
- Logout functionality
- Responsive product table for desktop
- Mobile-friendly product cards
- Product search with debounce
- Category filtering
- Sorting by price, rating, and title
- Pagination with configurable page size
- Product details and reviews
- Add product
- Edit product
- Delete product with confirmation
- Form validation
- Loading, error, empty, and retry states
- URL-based search, filter, sort, pagination, and page-size state
- Request cancellation to prevent stale search results
- Client-side session state for product mutations

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Axios
- DummyJSON
- JavaScript

## API

The project uses the DummyJSON Products API.

Main endpoints used:

- `POST /auth/login`
- `GET /products`
- `GET /products/search`
- `GET /products/categories`
- `GET /products/category/{category}`
- `GET /products/{id}`
- `POST /products/add`
- `PUT /products/{id}`
- `DELETE /products/{id}`

## Login Credentials

For the DummyJSON demo account:

- Username: `emilys`
- Password: `emilyspass`

## Getting Started

### 1. Clone the repository

```bash
git clone <(https://github.com/MeetKadvane/product_admin_dashboard)>