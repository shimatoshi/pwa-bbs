from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import List, Optional

# --- User ---
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool

    class Config:
        from_attributes = True

# --- Auth ---
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- Category ---
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_readonly: bool = False

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True

# --- Post ---
class PostBase(BaseModel):
    content: str
    parent_id: Optional[int] = None

class PostCreate(PostBase):
    thread_id: int

class Post(PostBase):
    id: int
    created_at: datetime
    author_id: int
    thread_id: int

    class Config:
        from_attributes = True

# --- Thread ---
class ThreadBase(BaseModel):
    title: str
    category_id: int

class ThreadCreate(ThreadBase):
    pass

class Thread(ThreadBase):
    id: int
    created_at: datetime
    author_id: int
    posts: List[Post] = []
    category: Optional[Category] = None

    class Config:
        from_attributes = True

# --- Notification ---
class NotificationBase(BaseModel):
    message: str
    link: Optional[str] = None

class Notification(NotificationBase):
    id: int
    user_id: int
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True

class NotificationUpdate(BaseModel):
    is_read: bool
