import os
import json
from openai import OpenAI

# ✅ Read API key from environment
XAI_API_KEY = os.getenv("XAI_API_KEY")

if not XAI_API_KEY:
    raise RuntimeError("XAI_API_KEY is not set. Please set it in environment variables.")

# ✅ Grok / xAI client
client = OpenAI(
    api_key=XAI_API_KEY,
    base_url="https://api.x.ai/v1"
)

MODEL = os.getenv("XAI_MODEL", "grok-2-mini")

SYSTEM_PROMPT = (
    "You are an assistant that creates educational questions and flashcards from text. "
    "Given the input text, generate three lists in JSON: mcqs, short_questions, flashcards. "
    "- mcqs: each item has 'question', 'options' (list), and 'answer' (correct option index). "
    "- short_questions: each item is {'question', 'answer'}. "
    "- flashcards: each item is {'front', 'back'}. "
    "Generate around 10 items per list if possible, concise and clear."
)

def generate_from_text(text: str, max_items: int = 10) -> dict:
    prompt = (
        f"\nINPUT TEXT:\n{text[:12000]}\n\n"
        f"Respond ONLY in valid JSON with keys: mcqs, short_questions, flashcards. "
        f"Generate at most {max_items} items per list."
    )

    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            temperature=0.3
        )

        return json.loads(response.choices[0].message.content)

    except Exception as e:
        return {
            "mcqs": [],
            "short_questions": [],
            "flashcards": [],
            "error": str(e)
        }
