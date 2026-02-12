from fastapi import APIRouter
from utils.ai_generator import generate_from_text

router = APIRouter(prefix="/tests", tags=["Tests"])

tests_db = {}

@router.post("/create")
def create_test(room_code: str, text: str, duration: int):
    questions = generate_from_text(text)

    tests_db[room_code] = {
        "questions": questions,
        "duration": duration
    }

    return {
        "room_code": room_code,
        "duration": duration,
        "questions": questions
    }
