from fastapi import APIRouter
from datetime import datetime

router = APIRouter(prefix="/submissions", tags=["Submissions"])

submissions_db = []

@router.post("/submit")
def submit_test(room_code: str, student_id: str, answers: dict):
    submission = {
        "room_code": room_code,
        "student_id": student_id,
        "answers": answers,
        "submitted_at": datetime.utcnow()
    }
    submissions_db.append(submission)
    return {"message": "Test submitted"}

