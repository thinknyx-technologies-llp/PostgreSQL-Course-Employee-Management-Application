# Project Setup Guide

This guide will walk you through setting up the complete project with backend, frontend, and database components.

## Prerequisites

- Python 3.x installed on your system
- Node.js and npm
- PostgreSQL with pgAdmin4
- Git (optional, for version control)

## Backend Setup

### 1. Check Python Version
```bash
python --version
```

### 2. Create Virtual Environment
```bash
python -m venv env
```

### 3. Activate Virtual Environment
```bash
# Windows
.\env\Scripts\activate

# macOS/Linux
source env/bin/activate
```

### 4. Install Dependencies
```bash
pip install -r requirements.txt
```

### 5. Navigate to Backend Directory
```bash
cd backend
```

### 6. Create Environment Configuration
Create a `.env` file in the backend directory with the following content:

```env
DB_HOST=localhost
DB_NAME=Thinknyx
DB_USER=postgres
DB_PASSWORD=Thinknyx@123
```

### 7. Run the Backend Server
```bash
python app.py
```

## Frontend Setup

### 1. Install Node.js
1. Go to https://nodejs.org/

### 2. Navigate to Frontend Directory
```bash
cd frontend
```

### 3. Install Dependencies
```bash
npm install
```
This creates a `node_modules` folder in the frontend directory.

### 4. Start the Frontend Server
```bash
npm start
```

The frontend will be accessible at: http://127.0.0.1:3000

## Database Setup

### 1. Create Database Tables

Open pgAdmin4 and connect to your PostgreSQL instance. In the `Thinknyx` database, execute the following SQL commands:

#### Create Department Table
```sql
CREATE TABLE department ( 
    dept_id SERIAL PRIMARY KEY, 
    department_name VARCHAR(100) NOT NULL 
);
```

#### Create Testing Project Table
```sql
CREATE TABLE testing_project ( 
    empid INTEGER PRIMARY KEY, 
    name VARCHAR(100) NOT NULL, 
    dept_id INTEGER NOT NULL, 
    salary NUMERIC(10,2) CHECK (salary >= 0), 
    hire_date DATE NOT NULL, 
    CONSTRAINT fk_department 
      FOREIGN KEY (dept_id) 
      REFERENCES department(dept_id) 
);
```

### 2. Insert Initial Department Data
```sql
INSERT INTO department (dept_id, department_name)
VALUES 
  (1, 'Engineering'),
  (2, 'Architecture');
```

## Running the Complete Application

1. **Start the Database**: Ensure PostgreSQL is running
2. **Start the Backend**: 
   ```bash
   cd backend
   python app.py
   ```
3. **Start the Frontend**:
   ```bash
   cd frontend
   npm start
   ```

## Important Notes

- The departments table must be populated before adding employees, as employees are assigned to departments through foreign key relationships
- Make sure PostgreSQL is running before starting the backend server
- The virtual environment should be activated whenever working on the backend
- Both frontend and backend servers need to be running simultaneously for the full application to work

## Troubleshooting

- **Database Connection Issues**: Verify PostgreSQL is running and credentials in `.env` are correct
- **Frontend Not Loading**: Check if Node.js is properly installed and npm dependencies are installed
- **Backend Errors**: Ensure virtual environment is activated and all Python dependencies are installed

## 📁 Project Structure

```
PostgreSQL-Course-Employee-Management-Application/
├── backend
│   ├── app.py
│   └── requirements.txt
├── env/
|   └── [virtual environment files]
└── frontend
    ├── package-lock.json
    ├── package.json
    ├── public
    │   └── index.html
    └── src
        ├── app.js
        └── index.js
```

---
 
