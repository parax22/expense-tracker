<!-- # Expense Tracker 💸📊

This application helps you manage your expenses, track recurring payments, and analyze your spending habits with insightful analytics. Built with a modern tech stack, this project is designed to be both user-friendly and developer-friendly.

## Features ✨

- **Expense Management** 💳
  - Add, edit, and delete expenses.
  - Track recurring expenses.
  - Categorize expenses for better organization.

- **Analytics Dashboard** 📈
  - Visualize spending trends with interactive charts.
  - View monthly spending summaries.
  - Track spending by category.

- **User Authentication** 🔐
  - Secure login and registration.
  - JWT-based authentication for API security.

- **Multi-Currency Support** 🌍
  - Track expenses in multiple currencies.
  - Automatic currency conversion based on preferred currency.

- **Responsive Design** 📱
  - Works seamlessly on both desktop and mobile devices.

## Tech Stack 🛠️

### Backend
- **Django** 🐍 - A high-level Python web framework.
- **Django REST Framework** 🌐 - For building RESTful APIs.
- **PostgreSQL** 🐘 - A powerful, open-source relational database.
- **JWT Authentication** 🔑 - Secure token-based authentication.

### Frontend
- **React** ⚛️ - A JavaScript library for building user interfaces.
- **Vite** ⚡ - A fast build tool for modern web development.
- **PrimeReact** 🎨 - A rich set of UI components for React.
- **Chart.js** 📊 - For creating interactive charts and graphs.

## Directory Structure 📂

```
pierod04-expence-tracker/
├── backend/               # Backend Django application
│   ├── manage.py          # Django management script
│   ├── requirements.txt   # Python dependencies
│   ├── api/               # API app with models, views, serializers, etc.
│   └── backend/           # Django project settings and configurations
└── frontend/              # Frontend React application
    ├── src/               # React components, hooks, and services
    ├── public/            # Static assets
    ├── package.json       # Node.js dependencies and scripts
    └── vite.config.js     # Vite configuration
```

## Getting Started 🚀

### Prerequisites

- **Python 3.8+** 🐍
- **Node.js** 🟢
- **PostgreSQL** 🐘

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/pierod04/pierod04-expence-tracker.git
   cd pierod04-expence-tracker
   ```

2. **Set up the backend**

   - Navigate to the `backend` directory:
     ```bash
     cd backend
     ```
   - Install Python dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Set up the database:
     ```bash
     python manage.py migrate
     ```
   - Create a `.env` file based on `.env.example` and fill in the required environment variables.

   - Run the Django development server:
     ```bash
     python manage.py runserver
     ```

3. **Set up the frontend**

   - Navigate to the `frontend` directory:
     ```bash
     cd ../frontend
     ```
   - Install Node.js dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file based on `.env.example` and set the `VITE_API_URL` to your backend URL (e.g., `http://127.0.0.1:8000`).

   - Start the Vite development server:
     ```bash
     npm run dev
     ```

4. **Access the application**
   - Open your browser and navigate to `http://localhost:5173` to access the Expense Tracker.

## API Endpoints 🌐

- **Authentication**
  - `POST /api/user/register/` - Register a new user.
  - `POST /api/token/` - Obtain JWT tokens for authentication.
  - `POST /api/token/refresh/` - Refresh the access token.

- **Expenses**
  - `GET /api/expenses/` - List all expenses.
  - `POST /api/expenses/` - Create a new expense.
  - `PUT /api/expenses/update/<id>/` - Update an existing expense.
  - `DELETE /api/expenses/delete/<id>/` - Delete an expense.

- **Categories**
  - `GET /api/categories/` - List all categories.
  - `POST /api/categories/` - Create a new category.

- **Settings**
  - `GET /api/settings/` - Get user settings.
  - `PUT /api/settings/update/` - Update user settings.

- **Analytics**
  - `GET /api/analytics/` - Get expense analytics.

## Contributing 🤝

Contributions are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to your branch.
4. Submit a pull request.

## Acknowledgments 🙏

- **Django** and **React** communities for their amazing frameworks and libraries.
- **PrimeReact** for providing a rich set of UI components.
- **Chart.js** for making data visualization easy and interactive.
- **ExchangeRateAPI** for providing real-time currency conversion rates. -->
