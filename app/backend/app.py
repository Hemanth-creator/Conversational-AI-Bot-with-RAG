from fastapi import FastAPI
from functions import initiate_model , vector_creation,retrive_docs,get_answer
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
import re
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)


def remove_specific_special_characters(text):
    # Remove only *, [, and ] characters
    cleaned_text = re.sub(r'[\*\[\]]', '', text)
    return cleaned_text

@app.get("/ask")
def create_item(question:str):
    model = initiate_model()
    vectorstore = vector_creation()
    documents = retrive_docs(vectorstore,question)
    cleaned_text = get_answer(question,documents,model)
    cleaned_text = remove_specific_special_characters(cleaned_text)
    return cleaned_text

if __name__ == "__main__":
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)