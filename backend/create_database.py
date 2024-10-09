from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# データベースの設定
DATABASE_URL = "sqlite:///./test.db"  # データベースファイルのパス

# SQLAlchemyのエンジンを作成
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# SQLAlchemyのベースクラスを作成
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
    user_id = Column(Integer, index=True)  # User IDを整数型で定義
    content = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

# フォローモデルの定義
class FollowAction(Base):
    __tablename__ = "follows"
    follower_id = Column(Integer, primary_key=True, index=True)
    followed_id = Column(Integer, primary_key=True, index=True)

# テーブルを作成する関数
def create_database():
    # データベースとテーブルを作成
    Base.metadata.create_all(bind=engine)
    print("Database and tables created successfully.")

if __name__ == "__main__":
    create_database()