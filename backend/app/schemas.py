from pydantic import BaseModel, EmailStr
from typing import List, Tuple
from datetime import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class UrlRequest(BaseModel):
    url: str

class ScanResponse(BaseModel):
    url: str
    top_words: List[Tuple[str, int]]
    scanned_at: datetime

    class Config:
        orm_mode = True