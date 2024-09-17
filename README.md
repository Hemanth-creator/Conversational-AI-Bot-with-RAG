# Conversational AI Bot with RAG
VoiceBot is an interactive web application that allows users to interact with a voice assistant to retrieve company information. Built using React for the front end and FastAPI for the back end, the application leverages speech recognition and text-to-speech technologies to provide a seamless user experience.

## Project Overview
This project consists of a front-end React application and a back-end FastAPI server that work together to provide a voice-driven interface for querying company information. The front end uses the Web Speech API for speech recognition and integrates with Eleven Labs' text-to-speech service for audio responses. The back end, built with FastAPI, handles incoming queries, processes them using machine learning models, and returns relevant information.

## Front End
- React: Manages the user interface and handles interactions.
- Material-UI: Provides the UI components.
- Axios: Facilitates HTTP requests to the backend and text-to-speech API.
## Back End
- FastAPI: A modern, fast (high-performance) web framework for building APIs with Python 3.7+.
- LangChain: A framework to work with LLMs (Large Language Models) and integrate with embeddings and document loaders.
- Google Generative AI: Used for generating responses to user queries.
- FAISS: A library for efficient similarity search and clustering of dense vectors.
## Features
- Voice Interaction: Users can start and stop voice recognition to interact with the bot.
- Speech Recognition: Converts spoken words into text using the Web Speech API.
- Text-to-Speech: Converts the bot's text responses into audible speech using Eleven Labs' API.
- Real-time Query Processing: Processes user queries and provides responses in real-time.

https://github.com/user-attachments/assets/0a934ba4-a272-4596-bd1e-1380695ae096

