import React, { useState, useRef, useEffect } from 'react';
    import styled, { keyframes } from 'styled-components';

    const fadeIn = keyframes`
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    `;

    const ConversationContainer = styled.div`
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
      width: 95%;
      max-width: 1200px;
      display: flex;
      height: 90vh;
      animation: ${fadeIn} 0.3s ease-in-out;
    `;

    const ConversationArea = styled.div`
      flex: 2;
      padding-right: 20px;
      overflow-y: auto;
      max-height: 100%;
      display: flex;
      flex-direction: column;
    `;

    const TranslationArea = styled.div`
      flex: 1;
      background-color: #f9f9f9;
      border-left: 1px solid #eee;
      padding: 20px;
      max-height: 100%;
      overflow-y: auto;
    `;

    const SectionLabel = styled.h3`
      margin-top: 0;
      margin-bottom: 10px;
      color: #333;
    `;

    const Question = styled.p`
      font-size: 1.2rem;
      margin-bottom: 10px;
      color: #333;
    `;

    const Input = styled.textarea`
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
      width: calc(100% - 22px);
      transition: border-color 0.3s ease;
      font-family: sans-serif;
      resize: vertical;
      min-height: 80px;
      &:focus {
        border-color: #007bff;
      }
    `;

    const Button = styled.button`
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-right: 5px;
      &:hover {
        background-color: #0056b3;
      }
      &:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
    `;

    const Response = styled.p`
      font-style: italic;
      color: #555;
      margin-bottom: 10px;
      display: inline-block;
      margin-right: 5px;
      animation: ${fadeIn} 0.3s ease-in-out;
    `;

    const LanguageSelect = styled.select`
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
      transition: border-color 0.3s ease;
      &:focus {
        border-color: #007bff;
      }
    `;

    const DifficultySelect = styled.select`
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      margin-bottom: 10px;
      transition: border-color 0.3s ease;
      &:focus {
        border-color: #007bff;
      }
    `;

    const TranslateButton = styled.button`
      background-color: #28a745;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      margin-bottom: 10px;
      transition: background-color 0.3s ease;
      &:hover {
        background-color: #218838;
      }
    `;

    const TopicButton = styled.button`
      background-color: #9c27b0;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      margin: 5px;
      transition: background-color 0.3s ease;
      &:hover {
        background-color: #7b1fa2;
      }
    `;

    const TopicContainer = styled.div`
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 20px;
    `;

    const Popup = styled.div`
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      animation: ${fadeIn} 0.3s ease-in-out;
    `;

    const PopupButton = styled.button`
      background-color: #007bff;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      margin-top: 10px;
      transition: background-color 0.3s ease;
      &:hover {
        background-color: #0056b3;
      }
    `;

    const ButtonContainer = styled.div`
      display: flex;
      justify-content: flex-start;
      margin-bottom: 10px;
    `;

    const AppTitle = styled.h1`
      text-align: center;
      color: #333;
      margin-bottom: 20px;
    `;

    const StartScreenContainer = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      text-align: center;
    `;

    const StartButton = styled.button`
      background-color: #007bff;
      color: white;
      border: none;
      padding: 15px 30px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-top: 20px;
      &:hover {
        background-color: #0056b3;
      }
    `;

    const GEMINI_API_KEY = 'AIzaSyCzGA8s-5wlQ_NfgDJ2ejFW5jncFOg3mJ4'; // Replace with your actual API key

    async function fetchGeminiResponse(prompt) {
      const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
      const headers = {
        'Content-Type': 'application/json',
      };
      const body = JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          maxOutputTokens: 200,
        }
      });

      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            ...headers,
            'x-goog-api-key': GEMINI_API_KEY,
          },
          body: body,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
      } catch (error) {
        console.error('Error fetching Gemini response:', error);
        return "Lo siento, no pude entender tu respuesta.";
      }
    }

    function App() {
      const [question, setQuestion] = useState('');
      const [answer, setAnswer] = useState('');
      const [response, setResponse] = useState('');
      const [translation, setTranslation] = useState('');
      const [conversationHistory, setConversationHistory] = useState([]);
      const [language, setLanguage] = useState('es');
      const [difficulty, setDifficulty] = useState('beginner');
      const [showTopicSelection, setShowTopicSelection] = useState(true);
      const inputRef = useRef(null);
      const scrollRef = useRef(null);
      const [topic, setTopic] = useState('');
      const [showPopup, setShowPopup] = useState(false);
      const [popupMessage, setPopupMessage] = useState('');
      const [showStartScreen, setShowStartScreen] = useState(true);

      const languageOptions = {
        'es': 'español',
        'ga': 'Gaeilge',
        'en': 'English',
        'fr': 'français',
        'de': 'Deutsch',
      };

      const difficultyOptions = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced',
      };

      const buttonText = {
        'es': 'Enviar',
        'ga': 'Seol',
        'en': 'Send',
        'fr': 'Envoyer',
        'de': 'Senden',
      };

      const placeholderText = {
        'es': 'Escribe tu respuesta aquí',
        'ga': 'Scríobh do fhreagra anseo',
        'en': 'Write your answer here',
        'fr': 'Écrivez votre réponse ici',
        'de': 'Schreibe deine Antwort hier',
      };

      const predefinedTopics = {
        'es': ['Viajes/Vacaciones', 'Comer fuera', 'Deporte y Entretenimiento', 'Trabajo'],
        'ga': ['Taisteal/Saoire', 'Ag ithe amuigh', 'Spórt agus Siamsaíocht', 'Obair'],
        'en': ['Travel/Holiday', 'Eating out', 'Sport and Entertaining', 'Work'],
        'fr': ['Voyage/Vacances', 'Manger au restaurant', 'Sport et Divertissement', 'Travail'],
        'de': ['Reisen/Urlaub', 'Auswärts essen', 'Sport und Unterhaltung', 'Arbeit'],
      };

      useEffect(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, [conversationHistory, response]);

      const handleLanguageChange = (event) => {
        setLanguage(event.target.value);
      };

      const handleDifficultyChange = (event) => {
        setDifficulty(event.target.value);
      };

      const handleTopicSelect = async (selectedTopic) => {
        setTopic(selectedTopic);
        const initialPrompt = `Inicia una conversación con el usuario sobre el tema "${selectedTopic}" con una pregunta en ${languageOptions[language]}.`;
        const initialQuestion = await fetchGeminiResponse(initialPrompt);
        setQuestion(initialQuestion);
        setShowTopicSelection(false);
      };

      const handleSuggestTopic = async () => {
        const prompt = `Sugiere un tema para una conversación con el usuario en ${languageOptions[language]}.`;
        const suggestedTopic = await fetchGeminiResponse(prompt);
        setTopic(suggestedTopic);
        const initialPrompt = `Inicia una conversación con el usuario sobre el tema "${suggestedTopic}" con una pregunta en ${languageOptions[language]}.`;
        const initialQuestion = await fetchGeminiResponse(initialPrompt);
        setQuestion(initialQuestion);
        setShowTopicSelection(false);
      };

      const handleAnswerChange = (event) => {
        setAnswer(event.target.value);
      };

      const handleSend = async () => {
        const userMessage = answer;
        const updatedHistory = [...conversationHistory, { role: 'user', content: userMessage }];

        let prompt = `Responde a la última pregunta o comentario del usuario en la siguiente conversación en ${languageOptions[language]}, como si estuvieras hablando con una persona real. Luego, haz una pregunta de seguimiento en ${languageOptions[language]}: \n`;
        updatedHistory.forEach(message => {
          prompt += `${message.role}: ${message.content}\n`;
        });

        const geminiResponse = await fetchGeminiResponse(prompt);
        const parts = geminiResponse.split("Pregunta de seguimiento:");
        setResponse(parts[0].trim());
        setQuestion(parts[1] ? parts[1].trim() : "");
        setConversationHistory(updatedHistory);

        const checkPrompt = `Evalúa la respuesta del usuario a la pregunta anterior. Si la respuesta es incorrecta o necesita mejora, sugiere una respuesta mejorada de nivel ${difficultyOptions[difficulty]}. Si la respuesta es correcta, responde con "Correcto".\nPregunta: ${question}\nRespuesta del usuario: ${userMessage}`;
        const checkResponse = await fetchGeminiResponse(checkPrompt);
        if (checkResponse.trim() !== "Correcto") {
          setPopupMessage(checkResponse);
          setShowPopup(true);
        }
        setAnswer('');
        setTranslation('');
      };

      const handleKeyDown = (event) => {
        if (event.key === 'Enter' && answer.trim()) {
          event.preventDefault();
          handleSend();
        }
      };

      const handleTranslate = async () => {
        let fullConversation = `Profesor: ${question}\n`;
        if (conversationHistory.length > 0) {
          fullConversation += `Tú: ${conversationHistory[conversationHistory.length - 1].content}\n`;
        }
        fullConversation += `Profesor: ${response}\n`;

        const translationPrompt = `Translate the following conversation to English:\n${fullConversation}`;
        let translatedText = await fetchGeminiResponse(translationPrompt);
        translatedText = translatedText.replace(/^(Profesor:|Tú:)\s*/gm, '').trim();
        setTranslation(translatedText);
      };

      const handleSimplifyPrompt = async () => {
        const simplifyPrompt = `Simplifica la siguiente pregunta para un estudiante de nivel ${difficultyOptions[difficulty]}:\n${question}`;
        const simplifiedQuestion = await fetchGeminiResponse(simplifyPrompt);
        setQuestion(simplifiedQuestion);
      };

      const handleClosePopup = () => {
        setShowPopup(false);
        setPopupMessage('');
      };

      const handleStartConversation = () => {
        setShowStartScreen(false);
      };

      if (showStartScreen) {
        return (
          <StartScreenContainer>
            <AppTitle>MultiLengua</AppTitle>
            <SectionLabel>Select Language and Difficulty</SectionLabel>
            <LanguageSelect value={language} onChange={handleLanguageChange}>
              {Object.entries(languageOptions).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </LanguageSelect>
            <DifficultySelect value={difficulty} onChange={handleDifficultyChange}>
              {Object.entries(difficultyOptions).map(([key, value]) => (
                <option key={key} value={key}>{value}</option>
              ))}
            </DifficultySelect>
            <StartButton onClick={handleStartConversation}>Start Conversation</StartButton>
          </StartScreenContainer>
        );
      }

      if (showTopicSelection) {
        return (
          <ConversationContainer>
            <ConversationArea>
              <AppTitle>MultiLengua</AppTitle>
              <SectionLabel>Select a Topic</SectionLabel>
              <TopicContainer>
                {predefinedTopics[language].map((topic) => (
                  <TopicButton key={topic} onClick={() => handleTopicSelect(topic)}>
                    {topic}
                  </TopicButton>
                ))}
                <TopicButton onClick={handleSuggestTopic}>Suggest a Topic</TopicButton>
              </TopicContainer>
            </ConversationArea>
          </ConversationContainer>
        );
      }

      return (
        <ConversationContainer>
          <ConversationArea ref={scrollRef}>
            <SectionLabel>Conversation</SectionLabel>
            <Question>{question}</Question>
            {conversationHistory.map((message, index) => (
              <Response key={index} style={{ fontStyle: message.role === 'user' ? 'normal' : 'italic', textAlign: message.role === 'user' ? 'right' : 'left' }}>
                {message.role === 'user' ? `Tú: ${message.content}` : `Profesor: ${message.content}`}
              </Response>
            ))}
            {response && <Response style={{ fontStyle: 'italic', textAlign: 'left' }}>{response}</Response>}
            <div style={{marginTop: 'auto'}}>
             <Input
                  as="textarea"
                  value={answer}
                  onChange={handleAnswerChange}
                  placeholder={placeholderText[language]}
                  ref={inputRef}
                  onKeyDown={handleKeyDown}
                />
                <ButtonContainer>
                  <Button onClick={handleSend} disabled={!answer.trim()}>{buttonText[language]}</Button>
                  <Button onClick={handleSimplifyPrompt}>Simplify Prompt</Button>
                </ButtonContainer>
            </div>
          </ConversationArea>
          <TranslationArea>
            <SectionLabel>Translation</SectionLabel>
            <TranslateButton onClick={handleTranslate}>Translate</TranslateButton>
            {translation && <Response>{translation}</Response>}
          </TranslationArea>
          {showPopup && (
            <Popup>
              <p>{popupMessage}</p>
              <PopupButton onClick={handleClosePopup}>Close</PopupButton>
            </Popup>
          )}
        </ConversationContainer>
      );
    }

    export default App;
