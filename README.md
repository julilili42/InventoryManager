# Inventory Management Tool with Rust REST API and React TypeScript Frontend

Inventory Manager is a web-based application designed to simplify inventory management by linking articles, customers, and orders. It provides a clear and structured interface for tracking stock levels, 
managing customer data, and generating PDF invoices. 

Key features are:

* Article & Customer Management – Create, view, delete and import articles and customer records.
* Order Processing – Generate and manage orders with automated PDF invoice generation (via [headless chromium](https://github.com/rust-headless-chrome/rust-headless-chrome)).
* Modern Tech Stack – Built with Rust (REST API), SQLite (Database), React & TypeScript (Frontend).
* API documentation with [Swagger UI](https://swagger.io/tools/swagger-ui/)
  
## Technologies Used
- Frontend: React, TypeScript, shadcn Library
- Backend: Rust, Axum (REST API)
- Database: SQLite

## Preview
### Article and Customers
![output](https://github.com/user-attachments/assets/71478ac1-54ac-4c2a-bbb3-d66764ae643e)

### Orders
![order-ezgif com-speed](https://github.com/user-attachments/assets/2ff2b8a1-cc0b-438c-b78c-749f0d97f9db)


## Installation and Running the Application

### Frontend
```bash
cd frontend
npm install
npm run dev 
```

### Backend
```bash
cd backend
cargo build
cargo run
```

The application should now be running in your browser.
