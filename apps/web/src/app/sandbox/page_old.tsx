"use client";

import { Tldraw } from "tldraw";
import { useSearchParams } from "next/navigation";
import { Suspense, useState, useRef, useEffect, useCallback } from 'react';
import 'tldraw/tldraw.css';

// Extend the Window interface to inc              {isListening ? (
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <title>Recording Active</title>
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a2 2 0 114 0v4a2 2 0 11-4 0V7z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <title>Start Recording</title>
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              )}tSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    start(): void;
    stop(): void;
    onresult: (event: SpeechRecognitionEvent) => void;
    onend: () => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
  }

  interface SpeechRecognitionEvent {
    resultIndex: number;
    results: {
      [key: number]: {
        [key: number]: {
          transcript: string;
        };
      };
    };
  }

  interface SpeechRecognitionErrorEvent {
    error: string;
  }
}

interface VoiceMessage {
  id: string;
  content: string;
  type: 'user' | 'ai';
  timestamp: Date;
}

function VoicePanel() {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [messages, setMessages] = useState<VoiceMessage[]>([
    {
      id: '1',
      content: "Hello! I'm your AI voice assistant. I'm here to help you with your system design. Click the microphone and start speaking!",
      type: 'ai',
      timestamp: new Date()
    }
  ]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const speakResponse = useCallback((text: string) => {
    if (synthRef.current) {
      // Cancel any ongoing speech
      synthRef.current.cancel();
      
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      synthRef.current.speak(utterance);
    }
  }, []);

  const handleVoiceInput = useCallback(async (input: string) => {
    // Add user message
    const userMessage: VoiceMessage = {
      id: Date.now().toString(),
      content: input,
      type: 'user',
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setTranscript("");

    // Generate AI response (replace with actual AI integration later)
    const aiResponses = [
      "That's an excellent system design question! Let's break this down step by step. First, we should consider the scale and requirements.",
      "Great thinking! For this type of system, we need to focus on scalability, reliability, and performance. What's your expected user base?",
      "Interesting approach! Have you considered the data consistency requirements? For distributed systems, we often need to think about CAP theorem.",
      "Nice work on the architecture! Let's also think about caching strategies. Redis or Memcached could be good options here.",
      "That's a solid foundation! Now let's consider the database design. Should we go with SQL or NoSQL for this use case?",
      "Good question about load balancing! We should consider both horizontal and vertical scaling approaches for this system.",
      "Excellent point about microservices! Event-driven architecture could be really beneficial for this type of system.",
      "Smart thinking about the API design! RESTful APIs with proper versioning would work well here."
    ];
    
    const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
    
    // Add AI response
    const aiMessage: VoiceMessage = {
      id: (Date.now() + 1).toString(),
      content: randomResponse,
      type: 'ai',
      timestamp: new Date()
    };
    
    setTimeout(() => {
      setMessages(prev => [...prev, aiMessage]);
      speakResponse(randomResponse);
    }, 500);
  }, [speakResponse]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      setTranscript("");
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting speech recognition:', error);
        setIsListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  useEffect(() => {
    // Initialize Speech Recognition and Synthesis
    if (typeof window !== 'undefined') {
      // Check for Speech Recognition support
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.resultIndex;
          const transcriptText = event.results[current][0].transcript;
          setTranscript(transcriptText);
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          if (transcript.trim()) {
            handleVoiceInput(transcript);
          }
        };

        recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
        };
      }

      // Initialize Speech Synthesis
      synthRef.current = window.speechSynthesis;
      setIsInitialized(true);
    }
  }, [transcript, handleVoiceInput]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="h-full flex items-center justify-center bg-white border-l border-gray-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-sm text-gray-600">Initializing voice assistant...</p>
        </div>
      </div>
    );
  }

  const hasVoiceSupport = recognitionRef.current && synthRef.current;

  return (
    <div className="h-full flex flex-col bg-white border-l border-gray-200">
      {/* Voice Header */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-gray-900 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <title>Microphone Icon</title>
            <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
          </svg>
          AI Voice Assistant
        </h3>
        <p className="text-sm text-gray-500">Speak with your system design companion</p>
      </div>

      {hasVoiceSupport ? (
        <>
          {/* Voice Controls */}
          <div className="p-6 flex flex-col items-center space-y-4 border-b border-gray-200">
            {/* Microphone Button */}
            <button
              type="button"
              onClick={isListening ? stopListening : startListening}
              disabled={isSpeaking}
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                isListening 
                  ? 'bg-red-500 hover:bg-red-600 animate-pulse shadow-lg' 
                  : 'bg-blue-600 hover:bg-blue-700 shadow-md'
              } ${isSpeaking ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isListening ? (
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a2 2 0 114 0v4a2 2 0 11-4 0V7z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Status */}
            <div className="text-center">
              {isListening && (
                <div className="flex flex-col items-center">
                  <p className="text-sm font-medium text-red-600">🎤 Listening...</p>
                  {transcript && (
                    <p className="text-xs text-gray-600 mt-1 max-w-40 truncate">"{transcript}"</p>
                  )}
                </div>
              )}
              {isSpeaking && (
                <p className="text-sm font-medium text-blue-600">🔊 AI Speaking...</p>
              )}
              {!isListening && !isSpeaking && (
                <p className="text-sm text-gray-600">Click to speak</p>
              )}
            </div>

            {/* Stop Speaking Button */}
            {isSpeaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
              >
                Stop Speaking
              </button>
            )}
          </div>

          {/* Conversation History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">
                      {message.type === 'user' ? '🗣️' : '🤖'}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 opacity-70`}>
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Instructions */}
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs text-gray-600 space-y-1">
              <p>💡 <strong>Tips:</strong></p>
              <p>• Speak clearly for better recognition</p>
              <p>• Ask about system design patterns</p>
              <p>• Request architecture guidance</p>
              <p>• Discuss scalability solutions</p>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
            <p className="text-sm text-gray-600 mb-2">Voice features not supported</p>
            <p className="text-xs text-gray-500">
              Your browser doesn't support speech recognition or synthesis.
              Try using Chrome or Edge for the best experience.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function SandboxContent() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get('interview');
  const interviewTitle = searchParams.get('title') || 'System Design Interview';
  const [isVoicePanelOpen, setIsVoicePanelOpen] = useState(true);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-50">
      {/* Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{interviewTitle}</h1>
          <p className="text-sm text-gray-500">Interview ID: {interviewId || 'demo'}</p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setIsVoicePanelOpen(!isVoicePanelOpen)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            <span>{isVoicePanelOpen ? 'Hide Voice Assistant' : 'Show Voice Assistant'}</span>
          </button>
          <button 
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Save Progress
          </button>
          <button 
            type="button"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
          >
            Submit Solution
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="h-[calc(100vh-4rem)] flex">
        {/* Drawing Canvas */}
        <div className={`${isVoicePanelOpen ? 'flex-1' : 'w-full'} transition-all duration-300`}>
          <Tldraw
            onMount={(editor) => {
              // Enable grid view by default for system design
              editor.updateInstanceState({ isGridMode: true });
              
              // Set a reasonable zoom level
              editor.zoomToFit();
            }}
          />
        </div>

        {/* Voice Panel */}
        {isVoicePanelOpen && (
          <div className="w-80 transition-all duration-300">
            <VoicePanel />
          </div>
        )}
      </div>
    </div>
  );
}

export default function SandboxPage() {
  return (
    <Suspense fallback={
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-900">Loading sandbox...</div>
        </div>
      </div>
    }>
      <SandboxContent />
    </Suspense>
  );
}
