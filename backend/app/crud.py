from sqlalchemy.orm import Session
from . import models, schemas, auth

# --- User ---
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- Category ---
def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# --- Thread ---
def get_thread(db: Session, thread_id: int):
    return db.query(models.Thread).filter(models.Thread.id == thread_id).first()

def get_threads(db: Session, category_id: int = None, skip: int = 0, limit: int = 20):
    query = db.query(models.Thread)
    if category_id:
        query = query.filter(models.Thread.category_id == category_id)
    return query.order_by(models.Thread.created_at.desc()).offset(skip).limit(limit).all()

def create_thread(db: Session, thread: schemas.ThreadCreate, author_id: int):
    db_thread = models.Thread(**thread.dict(), author_id=author_id)
    db.add(db_thread)
    db.commit()
    db.refresh(db_thread)
    return db_thread

# --- Post ---
def get_posts(db: Session, thread_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Post).filter(models.Post.thread_id == thread_id).order_by(models.Post.created_at.asc()).offset(skip).limit(limit).all()

def create_post(db: Session, post: schemas.PostCreate, author_id: int):
    db_post = models.Post(**post.dict(), author_id=author_id)
    db.add(db_post)
    
    # スレッドの作成者に通知（自分以外の場合）
    thread = db.query(models.Thread).filter(models.Thread.id == post.thread_id).first()
    if thread and thread.author_id != author_id:
        create_notification(db, user_id=thread.author_id, message=f"あなたのスレッド '{thread.title}' に新しい返信がありました。", link=f"/threads/{thread.id}")
    
    # 返信先がある場合、その作成者に通知（自分以外の場合）
    if post.parent_id:
        parent_post = db.query(models.Post).filter(models.Post.id == post.parent_id).first()
        if parent_post and parent_post.author_id != author_id and parent_post.author_id != thread.author_id:
            create_notification(db, user_id=parent_post.author_id, message=f"あなたの投稿に返信がありました。", link=f"/threads/{thread.id}")

    db.commit()
    db.refresh(db_post)
    return db_post

# --- Notification ---
def get_notifications(db: Session, user_id: int, skip: int = 0, limit: int = 50):
    return db.query(models.Notification).filter(models.Notification.user_id == user_id).order_by(models.Notification.created_at.desc()).offset(skip).limit(limit).all()

def create_notification(db: Session, user_id: int, message: str, link: str = None):
    db_notification = models.Notification(user_id=user_id, message=message, link=link)
    db.add(db_notification)
    return db_notification

def mark_notification_as_read(db: Session, notification_id: int, user_id: int):
    db_notification = db.query(models.Notification).filter(models.Notification.id == notification_id, models.Notification.user_id == user_id).first()
    if db_notification:
        db_notification.is_read = True
        db.commit()
        db.refresh(db_notification)
    return db_notification
