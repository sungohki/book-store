# book-store

This Project is an Exercise of full stack development.
Purpose of the project is Create an "online book store"

# Before handling project

- Install `node_modules` files
  Please run `npm install` on the console window once

- Create `.env` file & Fill out constant data
  - `PORT`
  - `PRIVATE_KEY`
  - `NEW_BOOK_CRITERIA`

# Project Structure

- Root
- branch of "Root"
  - controller
  - service
    - Book
      - viewAll
      - viewDetail
    - Cart
      - addToCart
      - removeCartItem
      - viewCartItems
    - Category
      - viewAll
    - Like
      - toggleLike
    - Order
      - get
        - OrderItems
        - OrderItemDetail
      - orderCartItems
    - User
      - join
      - login
      - pwResetRequest
      - pwReset
  - hook
  - routes
