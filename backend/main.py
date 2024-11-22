import os
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import pytesseract
from PIL import Image
import pandas as pd
import io
import uvicorn
from groq import Groq
import json
import re

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise ValueError("GROQ_API_KEY environment variable is not set")

groq_client = Groq(api_key=api_key)

def clean_text(text):
    """Clean and normalize text for better processing"""
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'[^\w\s.,\-()]', '', text)
    return text.strip()

def extract_text_from_excel(file_content):
    """Extract text from Excel file for processing"""
    df = pd.read_excel(io.BytesIO(file_content))
    return df.to_string(index=False)

@app.post("/upload/")
async def process_file(file: UploadFile = File(...)):
    content = await file.read()
    
    if file.filename.endswith('.pdf'):
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
    
    elif file.filename.endswith(('.png', '.jpg', '.jpeg')):
        image = Image.open(io.BytesIO(content))
        text = pytesseract.image_to_string(image)
    
    elif file.filename.endswith(('.xlsx', '.xls')):
        text = extract_text_from_excel(content)
    
    else:
        return {"error": "Unsupported file type"}
    
    text = clean_text(text)
    
    response = groq_client.chat.completions.create(
        messages=[
            {
                "role": "system", 
                "content": """You are an expert data extraction assistant. 
                Strictly follow these JSON extraction guidelines:
                1. Use camelCase for all keys
                2. Ensure all values are strings
                3. If no data found, use empty strings
                4. Extract data precisely from the given text
                5. If multiple entries exist, create arrays in each section"""
            },
            {
                "role": "user", 
                "content": f"""Extract structured data in this EXACT JSON format:
                {{
                    "invoices": [
                        {{
                            "serialNumber": "",
                            "customerName": "",
                            "productName": "",
                            "qty": "",
                            "tax": "",
                            "totalAmount": "",
                            "date": ""
                        }}
                    ],
                    "products": [
                        {{
                            "productName": "",
                            "category": "",
                            "unitPrice": "",
                            "tax": "",
                            "priceWithTax": "",
                            "stockQuantity": ""
                        }}
                    ],
                    "customers": [
                        {{
                            "customerName": "",
                            "phoneNumber": "",
                            "totalPurchaseAmount": ""
                        }}
                    ]
                }}

                Text to extract from:
                {text}"""
            }
        ],
        model="llama3-70b-8192",
        response_format={"type": "json_object"},
        temperature=0.2, 
        max_tokens=4096
    )
    
    try:
        invoice_json = json.loads(response.choices[0].message.content)
        return {"type": "invoice", "data": invoice_json}
    except json.JSONDecodeError:
        return {"error": "Failed to extract invoice JSON"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)