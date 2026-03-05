from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from . import models, crud, schemas

def init_db():
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # カテゴリの初期データ
    categories = [
        {"name": "お知らせ", "description": "運営からのお知らせ。読み取り専用です。", "is_readonly": True},
        {"name": "雑談", "description": "自由な雑談スレッド。", "is_readonly": False},
        {"name": "質問", "description": "技術的な質問や相談。", "is_readonly": False},
        {"name": "要望", "description": "アプリへの要望やバグ報告。", "is_readonly": False},
    ]
    
    for cat_data in categories:
        db_cat = db.query(models.Category).filter(models.Category.name == cat_data["name"]).first()
        if not db_cat:
            new_cat = models.Category(**cat_data)
            db.add(new_cat)
            print(f"Created category: {cat_data['name']}")
    
    db.commit()
    db.close()

if __name__ == "__main__":
    init_db()
