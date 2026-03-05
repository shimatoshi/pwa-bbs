from backend.app.database import SessionLocal
from backend.app.models import User

db = SessionLocal()
users = db.query(User).all()
for user in users:
    print(f"ID: {user.id}, Username: {user.username}, Admin: {user.is_admin}")
db.close()
