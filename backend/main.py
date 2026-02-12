from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import Dict
from datetime import datetime
import uuid
from jose import jwt
from passlib.context import CryptContext
from utils.pdf_reader import extract_text_from_pdf
from utils.ai_generator import generate_from_text


# -------------------- CONFIG --------------------
SECRET_KEY = "supersecretkey123456789"
ALGORITHM = "HS256"

pwd_context = CryptContext(
    schemes=["pbkdf2_sha256"],  # ✅ Stable on Windows
    deprecated="auto"
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

app = FastAPI(title="Community NLP Assessment Platform")

# -------------------- CORS --------------------
app = FastAPI(title="Community NLP Assessment Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # For hackathon demo
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- In-Memory Databases --------------------
users_db = {}
rooms_db = {}
tests_db = {}
submissions_db = []

# -------------------- Models --------------------

class RegisterRequest(BaseModel):
    email: str
    password: str
    role: str  # teacher or student


class LoginRequest(BaseModel):
    email: str
    password: str


class CreateRoomRequest(BaseModel):
    subject: str
    unit: str


class SubmitTestRequest(BaseModel):
    room_code: str
    answers: Dict


# -------------------- Auth Utils --------------------

def hash_password(password: str):
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str):
    return pwd_context.verify(password, hashed)


def create_token(email: str, role: str):
    return jwt.encode(
        {"sub": email, "role": role},
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )


def teacher_only(user=Depends(get_current_user)):
    if user["role"] != "teacher":
        raise HTTPException(
            status_code=403,
            detail="Teacher access only"
        )
    return user


# -------------------- Routes --------------------

@app.get("/")
def root():
    return {"status": "ok"}


# -------- AUTH --------

@app.post("/auth/register")
def register(data: RegisterRequest):
    if data.email in users_db:
        raise HTTPException(status_code=400, detail="User already exists")

    users_db[data.email] = {
        "password": hash_password(data.password),
        "role": data.role
    }

    return {"message": "User registered successfully"}


@app.post("/auth/login")
def login(data: LoginRequest):
    user = users_db.get(data.email)

    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_token(data.email, user["role"])

    return {
        "access_token": token,
        "role": user["role"]
    }


# -------- ROOM --------

@app.post("/rooms/create")
def create_room(
    data: CreateRoomRequest,
    user=Depends(teacher_only)
):
    room_code = str(uuid.uuid4())[:6]

    rooms_db[room_code] = {
        "teacher": user["sub"],
        "subject": data.subject,
        "unit": data.unit,
        "created_at": datetime.utcnow()
    }

    return {"room_code": room_code}


@app.post("/rooms/join")
def join_room(room_code: str):
    if room_code not in rooms_db:
        raise HTTPException(status_code=404, detail="Invalid room code")

    return {"message": "Joined successfully"}


# -------- TEST --------

@app.post("/tests/submit")
def submit_test(
    data: SubmitTestRequest,
    user=Depends(get_current_user)
):
    submissions_db.append({
        "room_code": data.room_code,
        "student": user["sub"],
        "answers": data.answers,
        "submitted_at": datetime.utcnow()
    })

    return {"message": "Test submitted successfully"}


# -------- ANALYTICS --------

@app.get("/analytics/{room_code}")
def analytics(
    room_code: str,
    user=Depends(teacher_only)
):
    room_submissions = [
        s for s in submissions_db if s["room_code"] == room_code
    ]

    return {
        "room_code": room_code,
        "total_submissions": len(room_submissions),
        "submissions": room_submissions
    }

#-------------pdf to text---------------
@app.post("/tests/generate")
async def generate_test(
    room_code: str,
    duration_minutes: int,
    file: UploadFile = File(...),
    user=Depends(teacher_only)
):
    if room_code not in rooms_db:
        raise HTTPException(status_code=404, detail="Room not found")

    content = await file.read()
    text = extract_text_from_pdf(content)

    if not text.strip():
        raise HTTPException(status_code=400, detail="No text found in PDF")

    questions = generate_from_text(text)

    tests_db[room_code] = {
        "questions": questions,
        "duration": duration_minutes,
        "created_at": datetime.utcnow()
    }

    return {
        "room_code": room_code,
        "questions": questions
    }

@app.get("/tests/{room_code}")
def get_test(room_code: str):
    if room_code not in tests_db:
        raise HTTPException(status_code=404, detail="Test not found")

    return tests_db[room_code]
