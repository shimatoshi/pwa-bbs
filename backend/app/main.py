from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import JWTError, jwt

from . import models, schemas, crud, auth, database
from .database import engine, get_db

# データベーステーブルの作成
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="PWA Bulletin Board API", version="0.1.0")

# CORSの設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 開発用。本番では適切に制限すること
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Dependencies ---
async def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

# --- Auth ---
@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

# --- Categories ---
@app.get("/categories/", response_model=list[schemas.Category])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    categories = crud.get_categories(db, skip=skip, limit=limit)
    return categories

# --- Threads ---
@app.get("/threads/", response_model=list[schemas.Thread])
def read_threads(category_id: int = None, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    threads = crud.get_threads(db, category_id=category_id, skip=skip, limit=limit)
    return threads

@app.get("/threads/{thread_id}", response_model=schemas.Thread)
def read_thread(thread_id: int, db: Session = Depends(get_db)):
    db_thread = crud.get_thread(db, thread_id=thread_id)
    if db_thread is None:
        raise HTTPException(status_code=404, detail="Thread not found")
    return db_thread

@app.post("/threads/", response_model=schemas.Thread)
def create_thread(thread: schemas.ThreadCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # カテゴリが読み取り専用かチェック
    category = db.query(models.Category).filter(models.Category.id == thread.category_id).first()
    if category and category.is_readonly and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="This category is read-only")
    return crud.create_thread(db=db, thread=thread, author_id=current_user.id)

# --- Posts ---
@app.get("/threads/{thread_id}/posts/", response_model=list[schemas.Post])
def read_posts(thread_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    posts = crud.get_posts(db, thread_id=thread_id, skip=skip, limit=limit)
    return posts

@app.post("/posts/", response_model=schemas.Post)
def create_post(post: schemas.PostCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    # カテゴリが読み取り専用かチェック
    thread = db.query(models.Thread).filter(models.Thread.id == post.thread_id).first()
    if thread and thread.category.is_readonly and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="This category is read-only")
    return crud.create_post(db=db, post=post, author_id=current_user.id)

# --- Notifications ---
@app.get("/notifications/", response_model=list[schemas.Notification])
def read_notifications(skip: int = 0, limit: int = 50, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    notifications = crud.get_notifications(db, user_id=current_user.id, skip=skip, limit=limit)
    return notifications

@app.put("/notifications/{notification_id}", response_model=schemas.Notification)
def update_notification(notification_id: int, notification: schemas.NotificationUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_notification = crud.mark_notification_as_read(db, notification_id=notification_id, user_id=current_user.id)
    if db_notification is None:
        raise HTTPException(status_code=404, detail="Notification not found")
    return db_notification

@app.get("/")
async def root():
    return {"message": "PWA Bulletin Board API is running"}

if __name__ == "__main__":
    import uvicorn
    print("Starting Uvicorn server on http://0.0.0.0:8888")
    uvicorn.run(app, host="0.0.0.0", port=8888)
