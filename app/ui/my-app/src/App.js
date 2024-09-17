import React, { useState,useRef  } from 'react';
import './App.css';
import KeyboardVoiceOutlinedIcon from '@mui/icons-material/KeyboardVoiceOutlined';
import axios from 'axios';
function App() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setresult] = useState(''); // For displayed sentence
  const [finalText,setfinaltext] = useState("")
  const [audioSrc, setAudioSrc] = useState('');
  const transcriptRef = useRef('');
  const resultRef = useRef('');
  // Initialize the SpeechRecognition API
  const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechRecognition = recognition ? new recognition() : null;

  if (speechRecognition) {
    speechRecognition.continuous = false;
    speechRecognition.interimResults = false;

    speechRecognition.onresult = async (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('');
      setTranscript(currentTranscript);
      setIsLoading(true);

      try {
        // Fetch the result from the localhost API
        const response = await axios.get(`http://localhost:8000/ask`, {
          params: {
            question: currentTranscript
          }
        });
        console.log(response)
        const newResult = response.data.result || response.data; // Adjust based on your API response structure
        setresult(newResult);

        // Play the audio for the fetched result
        await fetchAndPlayAudio(newResult);
      } catch (error) {
        console.error('Error fetching result from API:', error);
      } finally {
        setIsLoading(false); // Stop the loading animation
      }
    };

    speechRecognition.onerror = (event) => {
      console.error("Speech recognition error", event.error);
      stopListening(); // Stop listening on error
    };

    // Automatically stop listening when the user stops speaking
    speechRecognition.onend = () => {
      setIsListening(false);
    };
  }

  const startListening = () => {
    if (speechRecognition) {
      setTranscript(''); 
      setresult(''); 
      transcriptRef.current = ''; 
      resultRef.current = ''; 
      setAudioSrc(''); 
      setIsListening(true);
      speechRecognition.start();
    }
  };

  const stopListening = () => {
    if (speechRecognition) {
      setIsListening(false);
      speechRecognition.stop();
    }
  };

  const fetchAndPlayAudio = async (text) => {
    try {
      const response = await axios.post('https://api.elevenlabs.io/v1/text-to-speech/FGY2WhTYpPnrIDTdsKH5', {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }, {
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': 'sk_691174f9a65fa9b08c8b235847c12332faadca3624792a9a'
        },
        responseType: 'blob' // Ensure that the response is in blob format for audio
      });

      // Create a URL for the audio blob
      const audioUrl = URL.createObjectURL(response.data);
        setAudioSrc(audioUrl);
    } catch (error) {
      console.error('Error fetching or playing audio:', error);
    }
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1 className="title">VoiceBot: Company Info Assistant</h1>
        {!isListening && (
          <button className="start-button" onClick={startListening}>
            < KeyboardVoiceOutlinedIcon fontSize="large" />
          </button>
        )}
        {isListening && (
          <div>
          <div className="listening-animation">
            <div className="circle circle1"></div>
            <div className="circle circle2"></div>
            <div className="circle circle3"></div>
          </div>
          <div >
            <p>listening...</p>
            </div>
            </div>
          
        )}
        {transcript && (
          <p className="transcript"> <strong>USER:</strong> {transcript}</p>
        )}
        

        {isLoading && (
          <div className="loading-dots">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </div>
        )}
          {result && audioSrc &&(
            <div className="response">
            <p><strong>RESPONSE:    </strong>{result}</p>
            <audio src={audioSrc} controls autoPlay />
          </div>)
          }
          
      </header>
    </div>
  );
}

export default App;
