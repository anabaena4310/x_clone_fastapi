![ChatBot-Google-Chrome-2024-10-11-11-11-28](https://github.com/user-attachments/assets/7a152e46-bc6f-4b7c-a017-10d7cd6ec4db)
 ```markdown

# FastAPI SNS Timeline Clone

This project is a clone of an SNS timeline page (similar to X's timeline), built with FastAPI for the backend and React/TypeScript for the frontend. It includes features such as user registration, login, post creation, and following functionality.

## Features
- User Registration & Login
- Timeline Display
- Post Creation
- Follow/Unfollow Users
- Static file serving (CSS, JS, images)

## Tech Stack
- Backend: FastAPI (Python)
- Frontend: React (TypeScript)
- Database: SQLite (or replaceable with PostgreSQL)
- Static File Management: FastAPI `StaticFiles`

## Prerequisites
- Python 3.10+
- Node.js 16+
- Git

## Project Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup (FastAPI)

#### Create a virtual environment and install dependencies:
```bash
python -m venv xclone_Project_venv
source xclone_Project_venv/bin/activate   # On Windows: xclone_Project_venv\Scripts\activate
pip install -r requirements.txt
```

#### Run the FastAPI server:
```bash
uvicorn backend.app.main:app --reload
```
By default, the server will run at `http://127.0.0.1:8000`.

### 3. Frontend Setup (React/TypeScript)

#### Install Node.js dependencies:
```bash
cd frontend
npm install
```

#### Start the frontend development server:
```bash
npm run dev
```
By default, the frontend will run at `http://127.0.0.1:3000`.

### 4. Static Files

Static files such as CSS, JavaScript, and images are located in the `backend/app/static/` directory. FastAPI is set to serve static files from this directory.

### 5. Database Setup

There is a `create_database.py` script in the project root directory. Run this script to create an initial SQLite database (`test.db`).

```bash
python create_database.py
```

### 6. Build the Frontend

To build the frontend production files:
```bash
npm run build
```
This will generate optimized files in the `frontend/build/static/` directory, which are served by FastAPI.

## API Endpoints

- `POST /register`: Register a new user.
- `POST /login`: Log in a user and retrieve a token.
- `POST /posts`: Create a new post.
- `GET /timeline`: Get the timeline with posts from followed users.

## Directory Structure

```
xclone_project/
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── static/
│   │   │   ├── css/
│   │   │   └── js/
│   │   ├── config.py
│   │   └── main.py
├── xclone_Project_venv/
├── create_database.py
├── requirements.txt
├── test.db
├── frontend/
│   ├── build/
│   │   └── static/
│   │       ├── css/
│   │       └── js/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── XClone.tsx
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── index.tsx
│   ├── package-lock.json
│   ├── package.json
│   └── tsconfig.json
├── README.md
```

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/my-new-feature`)
5. Create a new Pull Request

## License
This project is licensed under the MIT License.
```

