from fastapi import APIRouter
from routers.submissions import submissions_db

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/room/{room_code}")
def room_analytics(room_code: str):
    room_subs = [s for s in submissions_db if s["room_code"] == room_code]

    return {
        "total_students": len(room_subs),
        "submissions": room_subs
    }
