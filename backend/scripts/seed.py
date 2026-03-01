import sys
import os

# プロジェクトのルートディレクトリをパスに追加
sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from app.database import SessionLocal, engine
from app import models

def seed():
    db = SessionLocal()
    
    # カテゴリの初期データ
    categories = [
        {"name": "全般", "description": "日常的な話題や雑談", "is_readonly": False},
        {"name": "質問・相談", "description": "技術的な質問や生活の相談", "is_readonly": False},
        {"name": "お知らせ", "description": "運営からのお知らせ（読み取り専用）", "is_readonly": True},
        {"name": "日常情報", "description": "天気、交通、ニュースなど（読み取り専用）", "is_readonly": True},
    ]
    
    for cat_data in categories:
        db_category = db.query(models.Category).filter(models.Category.name == cat_data["name"]).first()
        if not db_category:
            db_category = models.Category(**cat_data)
            db.add(db_category)
            print(f"Added category: {cat_data['name']}")
    
    db.commit()
    db.close()

if __name__ == "__main__":
    # テーブル作成（念のため）
    models.Base.metadata.create_all(bind=engine)
    seed()
