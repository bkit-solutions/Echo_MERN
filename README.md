## echo_mern 🛒⚙️

A Full-Stack MERN E-Commerce Platform with Admin Panel

echo_mern is a production-grade Single Page Application (SPA) built using the MERN stack, providing complete e-commerce functionality for users along with a powerful Admin Dashboard for managing products, orders, and users.

Built with scalability, clean UI, and real-world workflows in mind.

---

## 🔑 Key Features

- **🌐 Responsive Design**: Ensures a great user experience across devices.
- **🗂️ Admin Panel**: Manage orders, products, and users with ease.
- **🔄 Order Edit**: Update order statuses or details seamlessly.
- **🛠️ Product Management**: Edit or add products directly via the admin panel.
- **➕ Pagination**: Handles large datasets efficiently by organizing them into pages.
- **🔒 Authentication**: Secure user access with refresh and access tokens.
- **📊 State Management**: Powered by Redux Toolkit and AsyncThunk for efficient data handling.
- **⚠️ Error Handling**: User-friendly error alerts through toast notifications.
- **🔐 Password Reset**: Secure password reset via one-time tokens.
- **📧 Email Notifications**: Automatic emails for password resets and order confirmations.
- **🎨 Product Variations**: Supports multiple product options, including colors.
- **🔑 Secure Data**: Encrypted passwords in the backend for enhanced security.

---
## 🚀 Future Updates

- **⚡ Payment Gateway Integration**: Enable secure online payments directly through the platform.

---

## 🛠️ Tech Stack


| **Frontend**            | **Backend**             | **Libraries/Frameworks** |
|--------------------------|-------------------------|---------------------------|
| ![React](https://img.shields.io/badge/-React-61DAFB?logo=react&logoColor=white&style=for-the-badge)<br>React | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white&style=for-the-badge)<br>Node.js | ![Nodemailer](https://img.shields.io/badge/-Nodemailer-green?logo=mail.ru&logoColor=white&style=for-the-badge)<br>Nodemailer |
| ![Redux](https://img.shields.io/badge/-Redux-764ABC?logo=redux&logoColor=white&style=for-the-badge)<br>React-Redux + AsyncThunk | ![Express.js](https://img.shields.io/badge/-Express.js-000000?logo=express&logoColor=white&style=for-the-badge)<br>Express.js | ![Toastify](https://img.shields.io/badge/-Toastify-ff8c00?logo=javascript&logoColor=white&style=for-the-badge)<br>Toastify |
| ![Tailwind CSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?logo=tailwind-css&logoColor=white&style=for-the-badge)<br>Tailwind CSS | ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white&style=for-the-badge)<br>MongoDB | |



---
## 💻 Getting Started

### Prerequisites

Before you begin, ensure that you have the following installed:

1. **Node.js**: [Download Node.js](https://nodejs.org)
2. **MongoDB**: [Download MongoDB](https://www.mongodb.com)
3. **Git**: [Download Git](https://git-scm.com)

### 🚀 Running ShopCart on Your Local Machine

Follow these steps to get ShopCart running on your local machine:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/bkit-solutions/Echo_MERN.git
    ```

2. **Navigate to the project directory**:
    ```bash
    cd Echo_MERN
    ```

3. **Install dependencies for both backend and frontend**:

    - Install backend dependencies:
      ```bash
      cd Backend
      npm install
      ```

    - Install frontend dependencies:
      ```bash
      cd ../Frontend
      npm install
      ```

4. **Set up environment variables**: Create `.env` file in backend with the necessary values.  
   Here's a sample configuration:

    **Backend `.env`:**
    ```bash
    # Backend Environment Variables
    PORT=
    MONGODB_URI=

    
    ...(refer from .env.example file in Backend folder)
    ```


5. **Run the project**:
    - Run the backend server:
      ```bash
      cd Backend
      npm run dev
      ```
    - Run the frontend:
      ```bash
      cd ../Frontend
      npm run dev
      ```
---




## 👤 Contributing

We welcome contributions to make ShopCart even better! Here’s how you can help:

1. **Fork the Repository**: Create your own copy of the repository by clicking the "Fork" button.
2. **Clone the Repository**: Clone your forked repository to your local machine using:
   ```bash
   git clone https://github.com/<your-username>/shopcart.git
   ```
3. **Create a New Branch**: Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make Changes**: Add your changes and commit them with clear messages.
   ```bash
   git commit -m "Add: Your feature description"
   ```
5. **Push to Your Fork**: Push the changes to your forked repository:
   ```bash
   git push origin feature/your-feature-name
   ```
6. **Create a Pull Request**: Submit a pull request to the main repository with a clear description of your changes.

### Guidelines:
- Ensure your code is well-tested and adheres to the project’s coding standards.
- Write clear commit messages.
- Provide detailed descriptions in your pull requests.

---
