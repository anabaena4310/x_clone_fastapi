import os
from dotenv import load_dotenv
from pydantic import BaseSettings

# .envファイルを読み込む
load_dotenv()

class Settings(BaseSettings):
    # アプリケーションの設定
    APP_NAME: str = "My FastAPI App"
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    # セキュリティ設定
    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey")
    ALGORITHM: str = "HS256"  # JWTトークンに使用されるアルゴリズム

    # データベース設定
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./test.db")

    # その他の設定
    ALLOWED_HOSTS: list[str] = os.getenv("ALLOWED_HOSTS", "*").split(",")

    class Config:
        case_sensitive = True

# 設定オブジェクトを作成
settings = Settings()
