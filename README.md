# BookNest - Bookkeeping Service
 **BookNest** is a comprehensive bookkeeping service that allows users to manage books, libraries, and borrowing transactions. It provides APIs for authors, borrowers, and librarians to interact with the system seamlessly.

## Introduction
BookNest is a RESTful API built with Node.js, Express, and PostgreSQL. It allows users to:
* Register and log in as authors or borrowers.
* Manage books and libraries.
* Borrow and return books.also delete what they've created.
* Upload book cover images using **Cloudinary**.
* Receive responses in multiple languages (English and Hindi).

## Features
* **User Management:**
  - Register as an author or borrower.
  - Log in and receive a JWT token for authentication.
* **Book Management:**
  - Create, update, delete, and retrieve books.
  - Upload book cover images.
* **Library Management:**
  - Create, update, delete, and retrieve libraries.
  - Manage library inventory (add/remove books).
* **Borrowing System:**
  - Borrow and return books with a charge.
* **Multilingual Support:**
  - Error and success messages in English and Hindi.
* **Rate Limiting:**
  - Prevent abuse of login and registration endpoints.
* **Input Validation:**
  - Validate API requests using Joi.


## API Responses
### Base URL  
  ```
  http://localhost:3000/api
  ```
### Authentication
All endpoints (except `/users/register` and `/users/login`) require a valid JWT token in the Authorization header:
  ```
  Authorization: Bearer <token>
  ```


#### Register a User -
- Endpoint: `POST /users/register`
- Request Body:
  ```
  {
    "name": "John Doe",
    "email": "john.doe@example.com",
    "password": "password123",
    "role": "author" // Optional, defaults to "borrower"
  }
  ```

#### Login User - 
- Endpoint: `POST /users/login`
- Request Body:
  ```
  {
    "email": "john.doe@example.com",
    "password": "password123",
  }
  ```

#### Create a Library - 
- Endpoint: `POST /libraries`
- Request Body:
  ```
  {
    "name": "Central Library",
    "location": "New York"
  }
  ```

#### Create a Book - 
- Endpoint: `POST /books`
- Request Body:
  ```
    {
      "title": "The Great Gatsby",
      "description": "A classic novel by F. Scott Fitzgerald.",
      "authorId": 1,
      "image": "http://image.com"  (Use formData)
      "libraryId": 1
    }
  ```

#### Add book to invenntory - 
- Endpoint: `POST /api/libraries/:libraryId/inventory`
- Request Body:
  ```
  {
    "bookId": 3
  }
  ```

#### Borrow a Book - 
- Endpoint: `POST /borrow`
- Request Body:
  ```
  {
    "bookId": 1,
    "userId": 2,
    "charge": 5.99
  }
  ```

## ENDPOINTS
 
#### **Users Endpoint -**

| HTTP Verbs | Endpoints           | Action                            |
| ---------- | ------------------- | --------------------------------- |
| POST       | /api/users/register | To register a new user            |
| POST       | /api/user/login     | To login an existing user account |

#### **Library Endpoint -**
| HTTP Verbs | Endpoints          | Action                  |
| ---------- | ------------------ | ----------------------- |
| GET        | /api/libraries     | To get all libraries    |
| GET        | /api/libraries/:id | To get library by id    |
| POST       | /api/libraries     | To create new library   |
| PUT        | /api/libraries/:id | To update library by id |
| DELETE     | /api/libraries/:id | To delete library by id |

#### **Inventory Endpoint -**
| HTTP Verbs | Endpoints                            | Action                        |
| ---------- | ------------------------------------ | ----------------------------- |
| POST       | /api/libraries/:id/inventory         | To add book to inventory      |
| GET        | /api/libraries/:id/inventory         | To get library inventory      |
| DELETE     | /api/libraries/:id/inventory/:bookId | To delete book from inventory |

#### **Books Endpoint -**
| HTTP Verbs | Endpoints      | Action                                              |
| ---------- | -------------- | --------------------------------------------------- |
| GET        | /api/books     | To get all books                                    |
| GET        | /api/books/:id | To get book by id                                   |
| POST       | /api/books     | To create new books (Use formData for image upload) |
| PUT        | /api/books/:id | To update book by id                                |
| DELETE     | /api/books/:id | To delete book by id                                |

#### **Borrow Endpoint -**
| HTTP Verbs | Endpoints       | Action                  |
| ---------- | --------------- | ----------------------- |
| POST       | /api/borrow     | To borrow a book        |
| PUT        | /api/return/:id | To return borrowed book |


## Setup Instructions
### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL
- Cloudinary account (for image uploads)

### Steps
1. **Clone the Repository:**
  ```
  git clone https://github.com/your-username/BookNest.git
  cd BookNest
  ```

2. **Install Dependencies:**
  ```
  npm install --force
  ```

3. **Set Up Environment Variables:**
Create a `.env` file in the root directory and add the following variables:
  ```
  PORT=3000
  DATABASE_URL="postgresql://user:password@localhost:5432/booknest"
  JWT_SECRET="your_jwt_secret"
  CLOUDINARY_CLOUD_NAME="your_cloud_name"
  CLOUDINARY_API_KEY="your_api_key"
  CLOUDINARY_API_SECRET="your_api_secret"
  ```

4. **Run Migrations:**
  ```
  npx prisma migrate dev
  ```

5. **Start the Server:**
  ```
  npm run dev
  ```

6. **Access the API:** The API will be running at `http://localhost:3000/api`.



### Technologies Used
- **Backend:** Node.js, Express
- **Database:** PostgreSQL, Prisma
- **Authentication:** JWT
- **Image Upload:** Cloudinary
- **Validation:** Joi
- **Rate Limiting:** express-rate-limit
- **Multilingual Support:** Custom translation utility

