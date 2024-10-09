from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware  # CORSミドルウェアをインポート
from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
from typing import List

# データベースの設定
DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# SQLAlchemyのベースクラス
Base = declarative_base()

# ユーザーモデルの定義
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)

# 投稿モデルの定義
class Post(Base):
    __tablename__ = "posts"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

# フォローモデルの定義
class FollowAction(Base):
    __tablename__ = "follows"
    follower_id = Column(String, primary_key=True, index=True)
    followed_id = Column(String, primary_key=True, index=True)

# データベースセッションを取得するための依存関数
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# FastAPIアプリケーションのインスタンスを作成
app = FastAPI()

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 許可するオリジンを指定（例: ["http://localhost:3000"]）
    allow_credentials=True,
    allow_methods=["*"],  # 許可するHTTPメソッドを指定
    allow_headers=["*"],  # 許可するヘッダーを指定
)

# ユーザー登録エンドポイント
@app.post("/register/")
async def register_user(user: dict, db: Session = Depends(get_db)):
    username = user.get("username")
    password = user.get("password")

    if not username or not password:
        raise HTTPException(status_code=400, detail="Username and password are required")

    db_user = db.query(User).filter(User.username == username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="User already registered")

    new_user = User(username=username, password=password)
    db.add(new_user)
    db.commit()
    return {"message": "User registered successfully"}

# ユーザーログインエンドポイント
@app.post("/login/")
async def login_user(user: dict, db: Session = Depends(get_db)):
    username = user.get("username")
    password = user.get("password")

    db_user = db.query(User).filter(User.username == username).first()
    if db_user is None or db_user.password != password:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "message": "Login successful",
        "user_id": db_user.id  # 登録済みのユーザーIDを含める
    }

# 投稿作成エンドポイント
@app.post("/posts/")
async def create_post(post: dict, db: Session = Depends(get_db)):
    user_id = post.get("user_id")
    content = post.get("content")

    if not user_id or not content:
        raise HTTPException(status_code=400, detail="User ID and content are required")

    new_post = Post(user_id=user_id, content=content)
    db.add(new_post)
    db.commit()
    return {"message": "Post created successfully", "post": new_post}

# 投稿取得エンドポイント
@app.get("/posts/", response_model=List[dict])
async def get_posts(db: Session = Depends(get_db)):
    posts = db.query(Post).all()
    return [{"id": post.id, "user_id": post.user_id, "content": post.content, "timestamp": post.timestamp} for post in posts]

# フォローエンドポイント
@app.post("/follow/")
async def follow_user(follow: dict, db: Session = Depends(get_db)):
    follower_id = follow.get("follower_id")
    followed_id = follow.get("followed_id")

    if not follower_id or not followed_id:
        raise HTTPException(status_code=400, detail="Follower ID and followed ID are required")

    new_follow = FollowAction(follower_id=follower_id, followed_id=followed_id)
    db.add(new_follow)
    db.commit()
    return {"message": "Now following the user"}

# フォロワーリスト取得エンドポイント
@app.get("/followers/{username}", response_model=List[dict])
async def get_following(username: str, db: Session = Depends(get_db)):
    following = db.query(FollowAction).filter(FollowAction.follower_id == username).all()
    return [{"follower_id": follow.follower_id, "followed_id": follow.followed_id} for follow in following]

# データベースのテーブルを作成
#Base.metadata.create_all(bind=engine)