from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import List
from datetime import datetime
from fastapi.security import OAuth2PasswordBearer
import uvicorn

app = FastAPI()

# OAuth2 setup (for user authentication)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# In-memory "database" (replace with a proper database)
users_db = {}
posts_db = []
followers_db = {}

# Models
class User(BaseModel):
    username: str
    password: str

class Post(BaseModel):
    user_id: str
    content: str
    timestamp: datetime
    likes: int = 0

class FollowAction(BaseModel):
    follower_id: str
    followed_id: str

def main():
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)

# API Endpoints

# User Registration
@app.post("/register/")
async def register_user(user: User):
    if user.username in users_db:
        raise HTTPException(status_code=400, detail="User already registered")
    users_db[user.username] = user.password
    return {"message": "User registered successfully"}

# User Login
@app.post("/login/")
async def login_user(user: User):
    if users_db.get(user.username) != user.password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    # Normally you would return a token here
    return {"message": "Login successful"}

# Create Post
@app.post("/posts/")
async def create_post(post: Post, token: str = Depends(oauth2_scheme)):
    posts_db.append(post)
    return {"message": "Post created successfully", "post": post}

# Get All Posts
@app.get("/posts/", response_model=List[Post])
async def get_posts():
    return posts_db

# Follow User
@app.post("/follow/")
async def follow_user(follow: FollowAction):
    if follow.follower_id not in followers_db:
        followers_db[follow.follower_id] = []
    followers_db[follow.follower_id].append(follow.followed_id)
    return {"message": "Now following the user"}

# Get Following List
@app.get("/followers/{username}")
async def get_following(username: str):
    return {"following": followers_db.get(username, [])}


if __name__ == "__main__":
    main()
