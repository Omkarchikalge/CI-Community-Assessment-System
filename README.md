# PDF Quiz & Flashcard Generator (Hackathon Ready)

Quick start:

1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\\Scripts\\activate on Windows
pip install -r requirements.txt
export OPENAI_API_KEY="your_key_here"
uvicorn main:app --host 0.0.0.0 --port 10000
```

2. Frontend
```bash
cd frontend
npm install
npm run dev
```

Connect frontend to backend API by setting VITE_API_URL to your backend URL when deploying.
