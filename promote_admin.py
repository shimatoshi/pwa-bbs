from backend.app.database import SessionLocal
from backend.app.models import User

db = SessionLocal()
user = db.query(User).filter(User.id == 3).first()
if user:
    user.is_admin = True
    db.commit()
    print(f"User {user.username} is now an admin.")
else:
    print("User not found.")
db.close()
