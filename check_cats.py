from backend.app.database import SessionLocal
from backend.app.models import Category

db = SessionLocal()
categories = db.query(Category).all()
for cat in categories:
    print(f"ID: {cat.id}, Name: {cat.name}, ReadOnly: {cat.is_readonly}")
db.close()
