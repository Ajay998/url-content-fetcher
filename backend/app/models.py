from sqlalchemy import Column, Integer, String,  ForeignKey, DateTime, JSON
from .database import Base
from datetime import datetime
from pytz import timezone

india_tz = timezone("Asia/Kolkata")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)


class ScanResult(Base):
    __tablename__ = "scan_results"

    id = Column(Integer, primary_key=True, index=True)
    url = Column(String, nullable=False)
    top_words = Column(JSON, nullable=False)  # Stored as list of dicts or tuples
    scanned_at = Column(DateTime, default=lambda: datetime.now(india_tz))

    user_id = Column(Integer, ForeignKey("users.id"),nullable=True)