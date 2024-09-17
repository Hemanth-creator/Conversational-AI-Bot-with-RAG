from unittest import result
from langchain_google_genai import ChatGoogleGenerativeAI
import google.generativeai as genai
import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage
from typing import Dict
from langchain_core.runnables import RunnablePassthrough
import re
def initiate_model():
    load_dotenv()
    os.environ["GOOGLE_API_KEY"] ="AIzaSyAwboLsOo7DqqyVOMgySNUGoyjF-cus_NE"
    os.getenv("GOOGLE_API_KEY")
    genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))

    chat = ChatGoogleGenerativeAI(model="gemini-pro",
                                temperature=0.3)
    return chat

def vector_creation():
    if os.path.exists("app\backend\faiss_index"):
        embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
        vectorstore = FAISS.load_local("faiss_index",embeddings,allow_dangerous_deserialization=True)
        return vectorstore
    else:
        loader = PyPDFLoader("app/backend/nexoratech.pdf")
        data = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=0)
        all_splits = text_splitter.split_documents(data)
        embeddings = GoogleGenerativeAIEmbeddings(model = "models/embedding-001")
        vectorstore = FAISS.from_documents(documents=all_splits, embedding=embeddings)
        vectorstore.save_local("faiss_index")
        return vectorstore

def retrive_docs(vectorstore,question):
    retriever = vectorstore.as_retriever(k=4)
    docs = retriever.invoke(question)
    return docs

def get_answer(question,documents,llm):
    question_answering_prompt = ChatPromptTemplate.from_template("as a conversational bot build the conversation and answer the following question:{question} from this content:{context} exactly like a human in maximum of twenty words." )
    document_chain = create_stuff_documents_chain(llm, question_answering_prompt)
    result = document_chain.invoke(
        {
            "context": documents,
            "question":question   
        }
    )
    if "Bot:**" in result:
        cleaned_text = result.split("Bot:**")[1].strip()
    else:
        cleaned_text = result
    cleaned_text = re.sub(r'User:.*', '', cleaned_text, flags=re.DOTALL)
    return cleaned_text


