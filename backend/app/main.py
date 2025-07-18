from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from .models import Base, User, ScanResult
from .schemas import UserCreate, UserLogin, Token, UrlRequest, ScanResponse
from .auth import get_password_hash, verify_password, create_access_token
from .config import SECRET_KEY
from fastapi.middleware.cors import CORSMiddleware

from datetime import datetime
import requests
from bs4 import BeautifulSoup
import re
from collections import Counter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
Base.metadata.create_all(bind=engine)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/register", response_model=Token)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(email=user.email, password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": new_user.email})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/login", response_model=Token)
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}



STOP_WORDS = set([
    'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and',
    'any', 'are', 'aren’t', 'as', 'at', 'be', 'because', 'been', 'before', 'being',
    'below', 'between', 'both', 'but', 'by', 'can’t', 'cannot', 'could', 'couldn’t',
    'did', 'didn’t', 'do', 'does', 'doesn’t', 'doing', 'don’t', 'down', 'during',
    'each', 'few', 'for', 'from', 'further', 'had', 'hadn’t', 'has', 'hasn’t',
    'have', 'haven’t', 'having', 'he', 'he’d', 'he’ll', 'he’s', 'her', 'here',
    'here’s', 'hers', 'herself', 'him', 'himself', 'his', 'how', 'how’s', 'i',
    'i’d', 'i’ll', 'i’m', 'i’ve', 'if', 'in', 'into', 'is', 'isn’t', 'it', 'it’s',
    'its', 'itself', 'let’s', 'me', 'more', 'most', 'mustn’t', 'my', 'myself',
    'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought',
    'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shan’t', 'she',
    'she’d', 'she’ll', 'she’s', 'should', 'shouldn’t', 'so', 'some', 'such', 'than',
    'that', 'that’s', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
    'there', 'there’s', 'these', 'they', 'they’d', 'they’ll', 'they’re', 'they’ve',
    'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was',
    'wasn’t', 'we', 'we’d', 'we’ll', 'we’re', 'we’ve', 'were', 'weren’t', 'what',
    'what’s', 'when', 'when’s', 'where', 'where’s', 'which', 'while', 'who',
    'who’s', 'whom', 'why', 'why’s', 'with', 'won’t', 'would', 'wouldn’t', 'you',
    'you’d', 'you’ll', 'you’re', 'you’ve', 'your', 'yours', 'yourself', 'yourselves',
    'none', 'null'
])



@app.post("/analyze-url", response_model=ScanResponse)
def analyze_url(
    data: UrlRequest,
    db: Session = Depends(get_db)
):
    try:
        response = requests.get(data.url, timeout=10)
        soup = BeautifulSoup(response.content, "html.parser")

        for tag in soup(["script", "style", "meta"]):
            tag.decompose()

        text = soup.get_text(separator=' ')
        words = re.findall(r'\b\w+\b', text.lower())
        filtered = [w for w in words if w not in STOP_WORDS and len(w) > 1]
        top_words = Counter(filtered).most_common(5)

        # Option 1: Save without user_id (if your model allows it)
        scan = ScanResult(
            url=data.url,
            top_words=top_words,
            user_id=None  # or skip this field if nullable
        )
        db.add(scan)
        db.commit()
        db.refresh(scan)

        return {
            "url": scan.url,
            "top_words": scan.top_words,
            "scanned_at": scan.scanned_at
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))