from fastapi import APIRouter
import uuid

router = APIRouter(prefix="/rooms", tags=["Rooms"])

rooms_db = {}

@router.post("/create")
def create_room(teacher_id: str, subject: str, unit: str):
    room_code = str(uuid.uuid4())[:6]
    rooms_db[room_code] = {
        "teacher_id": teacher_id,
        "subject": subject,
        "unit": unit
    }
    return {"room_code": room_code}

@router.post("/join")
def join_room(room_code: str, student_id: str):
    if room_code not in rooms_db:
        return {"error": "Invalid room code"}
    return {"message": "Joined room successfully"}
