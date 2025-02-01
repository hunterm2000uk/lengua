const readline = require('readline').createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const conversation = [
      {
        question: "¿Hola! ¿Cómo estás hoy?",
        responses: {
          "bien": "¡Me alegro! ¿Qué tal tu día?",
          "mal": "Oh, lo siento. ¿Qué pasó?",
          "mas o menos": "Entiendo. ¿Hay algo que pueda hacer para ayudar?",
          "no se": "No te preocupes. ¿Quieres hablar de otra cosa?"
        },
        followUp: {
          "bien": "¿Qué tal tu día?",
          "mal": "¿Qué pasó?",
          "mas o menos": "¿Hay algo que pueda hacer para ayudar?",
          "no se": "¿Quieres hablar de otra cosa?"
        }
      },
      {
        question: "¿Qué te gusta hacer en tu tiempo libre?",
        responses: {
          "leer": "¡Excelente! ¿Qué tipo de libros te gustan?",
          "deportes": "¡Genial! ¿Qué deportes practicas?",
          "musica": "¡Interesante! ¿Qué tipo de música escuchas?",
          "nada": "Entiendo. ¿Hay algo que te gustaría probar?"
        },
        followUp: {
          "leer": "¿Qué tipo de libros te gustan?",
          "deportes": "¿Qué deportes practicas?",
          "musica": "¿Qué tipo de música escuchas?",
          "nada": "¿Hay algo que te gustaría probar?"
        }
      },
      {
        question: "¿Cuál es tu comida favorita?",
        responses: {
          "pizza": "¡Delicioso! ¿Con qué ingredientes te gusta?",
          "pasta": "¡Muy bien! ¿Qué tipo de salsa prefieres?",
          "tacos": "¡Excelente elección! ¿De qué tipo?",
          "no tengo": "Entiendo. ¿Hay algo que te gustaría probar?"
        },
        followUp: {
          "pizza": "¿Con qué ingredientes te gusta?",
          "pasta": "¿Qué tipo de salsa prefieres?",
          "tacos": "¿De qué tipo?",
          "no tengo": "¿Hay algo que te gustaría probar?"
        }
      },
      {
        question: "¿Qué planes tienes para el fin de semana?",
        responses: {
          "descansar": "¡Qué bien! Es importante relajarse.",
          "salir": "¡Genial! ¿A dónde te gustaría ir?",
          "trabajar": "Entiendo. ¡Espero que no sea muy pesado!",
          "no se": "No te preocupes. ¡Siempre hay tiempo para decidir!"
        },
        followUp: {
          "descansar": "Es importante relajarse.",
          "salir": "¿A dónde te gustaría ir?",
          "trabajar": "¡Espero que no sea muy pesado!",
          "no se": "¡Siempre hay tiempo para decidir!"
        }
      },
      {
        question: "Fue un placer hablar contigo. ¡Hasta luego!",
        responses: {},
        followUp: {}
      }
    ];

    let currentQuestionIndex = 0;

    function askQuestion() {
      const currentQuestion = conversation[currentQuestionIndex];
      readline.question(currentQuestion.question + '\n', (answer) => {
        const normalizedAnswer = answer.toLowerCase().trim();
        let response = currentQuestion.responses[normalizedAnswer];
        if (!response) {
          response = "No entiendo. ¿Puedes intentar de nuevo?";
        }
        console.log(response);

        if (currentQuestion.followUp[normalizedAnswer]) {
          readline.question(currentQuestion.followUp[normalizedAnswer] + '\n', (followUpAnswer) => {
            console.log("¡Gracias por tu respuesta!");
            currentQuestionIndex++;
            if (currentQuestionIndex < conversation.length) {
              askQuestion();
            } else {
              readline.close();
            }
          });
        } else {
          currentQuestionIndex++;
          if (currentQuestionIndex < conversation.length) {
            askQuestion();
          } else {
            readline.close();
          }
        }
      });
    }

    console.log("¡Hola! Vamos a practicar tu español.");
    askQuestion();
