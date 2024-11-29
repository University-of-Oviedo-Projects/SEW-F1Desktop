/**
 * Clase Api
 * 
 * Este archivo JavaScript implementa la lógica principal de un juego de preguntas y respuestas.
 * Incluye funcionalidades como:
 * 
 * 1. Gestión de las preguntas y respuestas del juego.
 * 
 * 2. Mecanismos para registrar y mostrar la puntuación del jugador.
 * 
 * 3. Soporte para diferentes modos de juego (normal y control por voz).
 * 
 * 4. Uso de APIs de HTML5 para mejorar la experiencia del usuario:
 *    - **Audio**: Para reproducir sonidos de respuesta correcta e incorrecta.
 *    - **SpeechSynthesis**: Para leer preguntas y opciones en voz alta en el modo por voz.
 *    - **SpeechRecognition**: Para capturar respuestas del usuario mediante reconocimiento de voz.
 *    - **Web Storage (localStorage)**: Para guardar y recuperar la puntuación más alta del jugador.
 *    - **Canvas**: Para dibujar una barra de progreso que muestre el tiempo restante para responder.
 *      
 */

class Api {
    constructor() {
        this.questions = [
            // PREGUNTAS FÁCILES (4)
            {
                question: "¿Quién ganó el campeonato de F1 en 2020?",
                options: ["Lewis Hamilton", "Max Verstappen", "Sebastian Vettel", "Charles Leclerc"],
                answer: "Lewis Hamilton"
            },
            {
                question: "¿Quién ganó el campeonato de F1 en 2021?",
                options: ["Lewis Hamilton", "Max Verstappen", "Sebastian Vettel", "Charles Leclerc"],
                answer: "Max Verstappen"
            },
            {
                question: "¿Quién ha sido el único piloto español en ganar 2 mundiales?",
                options: ["Lewis Hamilton", "Carlos Sainz", "Fernando Alonso", "Jaime Alguersuari"],
                answer: "Fernando Alonso"
            },
            {
                question: "¿Qué piloto brasileño tuvo una histórica rivalidad con Alain Prost?",
                options: ["Felipe Massa", "Rubens Barrichello", "Ayrton Senna", "Nelson Piquet"],
                answer: "Ayrton Senna"
            },
            {
                question: "¿Qué piloto es apodado 'El Rey de Mónaco' por sus victorias en ese circuito?",
                options: ["Michael Schumacher", "Lewis Hamilton", "Ayrton Senna", "Max Verstappen"],
                answer: "Ayrton Senna"
            },
        
            // PREGUNTAS NORMALES (5)
            {
                question: "¿Qué equipo de F1 ha ganado más títulos de constructores en la historia?",
                options: ["Ferrari", "McLaren", "Mercedes", "Red Bull"],
                answer: "Ferrari"
            },
            {
                question: "¿En qué año debutó Fernando Alonso en la Fórmula 1?",
                options: ["2001", "1999", "2003", "2005"],
                answer: "2001"
            },
            {
                question: "¿Cuál fue el último equipo en ganar un título de constructores antes de la era híbrida de Mercedes?",
                options: ["Ferrari", "Red Bull", "McLaren", "Renault"],
                answer: "Red Bull"
            },
            {
                question: "¿Qué piloto ostenta el récord de más poles consecutivas en una temporada?",
                options: ["Lewis Hamilton", "Michael Schumacher", "Sebastian Vettel", "Ayrton Senna"],
                answer: "Ayrton Senna"
            },
            {
                question: "¿Cuál es el circuito más largo del calendario de la Fórmula 1?",
                options: ["Spa-Francorchamps", "Monza", "Silverstone", "Circuito de las Américas"],
                answer: "Spa-Francorchamps"
            },
        
            // PREGUNTAS DIFÍCILES (8)
            {
                question: "¿Cuál fue el último equipo de Ayrton Senna en la F1?",
                options: ["Williams", "McLaren", "Ferrari", "Lotus"],
                answer: "Williams"
            },
            {
                question: "¿Quién es el piloto más joven en ganar una carrera de F1?",
                options: ["Sebastian Vettel", "Max Verstappen", "Lewis Hamilton", "Fernando Alonso"],
                answer: "Max Verstappen"
            },
            {
                question: "¿Cuál fue el primer circuito nocturno en el calendario de F1?",
                options: ["Singapur", "Bahrein", "Abu Dhabi", "Japón"],
                answer: "Singapur"
            },
            {
                question: "¿En qué equipo debutó Michael Schumacher en la F1?",
                options: ["Benetton", "Jordan", "Ferrari", "Mercedes"],
                answer: "Jordan"
            },
            {
                question: "¿En qué país nació el piloto campeón mundial Niki Lauda?",
                options: ["Alemania", "Suiza", "Austria", "Italia"],
                answer: "Austria"
            },
            {
                question: "¿Cuál fue la primera temporada en la que Lewis Hamilton ganó un título mundial?",
                options: ["2007", "2008", "2009", "2010"],
                answer: "2008"
            },
            {
                question: "¿Qué fabricante fue el primero en introducir un motor turbo en la F1?",
                options: ["Ferrari", "Renault", "Honda", "Mercedes"],
                answer: "Renault"
            },
            {
                question: "¿Quién tiene el récord de más podios en la historia de la F1?",
                options: ["Michael Schumacher", "Sebastian Vettel", "Lewis Hamilton", "Alain Prost"],
                answer: "Lewis Hamilton"
            },
        
            // PREGUNTAS EXTREMAS (6)
            {
                question: "¿Cuál fue el primer piloto en alcanzar los 100 Grandes Premios ganados?",
                options: ["Michael Schumacher", "Sebastian Vettel", "Ayrton Senna", "Lewis Hamilton"],
                answer: "Lewis Hamilton"
            },
            {
                question: "¿Cuál es el récord de mayor número de victorias en una sola temporada?",
                options: ["15", "13", "19", "14"],
                answer: "19"
            },
            {
                question: "¿Quién fue el primer piloto en ganar un Gran Premio de F1 con motor Ferrari?",
                options: ["Alberto Ascari", "Juan Manuel Fangio", "Giuseppe Farina", "José Froilán González"],
                answer: "José Froilán González"
            },
            {
                question: "¿En qué año se celebró la primera carrera oficial del Campeonato Mundial de F1?",
                options: ["1947", "1950", "1953", "1955"],
                answer: "1950"
            },
            {
                question: "¿Cuántas carreras consecutivas ganó Sebastian Vettel en 2013, estableciendo un récord?",
                options: ["8", "9", "7", "10"],
                answer: "9"
            },
            {
                question: "¿Quién fue el campeón mundial de F1 en el año en que murió Ayrton Senna?",
                options: ["Michael Schumacher", "Damon Hill", "Nigel Mansell", "Mika Hakkinen"],
                answer: "Michael Schumacher"
            }
        ];
        
        this.score = 0;
        this.gameMode = null; 
        this.timeLimit = 15; 
        this.progressInterval = null;
        this.currentQuestionIndex = 0;

        // Obtener la puntuación más alta del almacenamiento local
        this.highScore = localStorage.getItem('highScore') || 0;
        this.createSections(); 

        let normalModeButton = document.querySelector('main > section > button:nth-of-type(1)');
        let voiceModeButton = document.querySelector('main > section > button:nth-of-type(2)');

        if (normalModeButton && voiceModeButton) {
            normalModeButton.addEventListener('click', () => this.startGame('normal'));
            voiceModeButton.addEventListener('click', () => this.startGame('voice'));
        } else {
            console.error('No se encontraron los botones');
        }

        // Inicializar reconocimiento de voz
        this.supportsSpeechRecognition = this.initSpeechRecognition();

        // Cancelar la locución al salir de la página
        window.addEventListener("beforeunload", () => window.speechSynthesis.cancel());
    }

    // Crear las secciones del juego
    createSections() {
        // Seleccionar el elemento main del DOM
        const main = document.querySelector('main');

        // Crear contenedor de puntuación
        const scoreContainer = document.createElement('section');
        const h2 = document.createElement('h2');
        h2.textContent = "Puntuación: ";
        const span = document.createElement('span');
        span.textContent = "0";
        h2.appendChild(span);
        scoreContainer.appendChild(h2);
        scoreContainer.setAttribute('data-state', 'hidden');
        main.appendChild(scoreContainer);

        // Crear contenedor de pregunta
        const questionContainer = document.createElement('section');
        questionContainer.classList.add('question-container');
        questionContainer.setAttribute('data-state', 'hidden');
        main.appendChild(questionContainer);

        // Crear contenedor de opciones
        const optionsContainer = document.createElement('section');
        optionsContainer.classList.add('options-container');
        optionsContainer.setAttribute('data-state', 'hidden');
        main.appendChild(optionsContainer);

        // Crear contenedor de puntuación final
        const finalScoreContainer = document.createElement('section');
        const h21 = document.createElement('h2');
        h21.textContent = "Puntuación Final";
        finalScoreContainer.appendChild(h21);
        finalScoreContainer.classList.add('final-score-container');
        finalScoreContainer.setAttribute('data-state', 'hidden');
        main.appendChild(finalScoreContainer);

        // Crear diálogo de puntuación final
        const scoreDialog = document.createElement('dialog');
        main.appendChild(scoreDialog);
    }

    startGame(gameMode) {
        this.gameMode = gameMode;
        document.querySelector('main > section').setAttribute('data-state', 'hidden');

        // Mostrar las secciones de puntuación, pregunta y opciones
        document.querySelector("body > main > section:nth-of-type(2)").setAttribute("data-state", "visible");
        document.querySelector("body > main > section:nth-of-type(3)").setAttribute("data-state", "visible");
        document.querySelector("body > main > section:nth-of-type(4)").setAttribute("data-state", "visible");
        this.showQuestion(); // Mostrar la primera pregunta

        const highScore = this.getHighScore();  // Web Storage
        const messageContainer = document.querySelector('body > main > section:nth-of-type(2)'); 
        const paragraph = document.createElement('p');
        paragraph.textContent = `Puntuación más alta: ${highScore}`;
        messageContainer.appendChild(paragraph);
            
        setTimeout(() => {
            paragraph.remove();
        }, 4000);        
    }

    showQuestion() {
        const questionContainer = document.querySelectorAll("body > main > section")[2];
        const optionsContainer = document.querySelectorAll("body > main > section")[3];
        const question = this.questions[this.currentQuestionIndex];

        questionContainer.innerHTML = `<h2>${question.question}</h2>`;
        optionsContainer.innerHTML = '';
        optionsContainer.innerHTML = `<h2>Opciones</h2>`;

        question.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => this.checkAnswer(option));
            
            if (this.gameMode === 'voice') {
                button.disabled = true; // Deshabilitar botones en modo voz
            } 

            optionsContainer.appendChild(button);
        });

        // Crear el canvas para la barra de progreso
        this.progressBarCanvas = document.createElement('canvas');
        const optionsContainerToCanvas = document.querySelector('body > main > section:nth-of-type(3)');
        this.progressBarCanvas.width = 400;  // Establecer el ancho del canvas
        this.progressBarCanvas.height = 20; // Establecer la altura del canvas
        this.progressBarContext = this.progressBarCanvas.getContext('2d');
        optionsContainerToCanvas.appendChild(this.progressBarCanvas);

        // Leer pregunta en voz alta si el modo es de reconocimiento de voz
        if (this.gameMode === 'voice') {
            this.speakText(question.question + '. Las opciones son: ' + question.options.join(', '));
        } else {
            this.startProgressBar();
        }
    }

    // API Speech: Decir en voz alta la pregunta y las opciones
    speakText(text) {
        const speech = new SpeechSynthesisUtterance(text);

        speech.onend = () => {
            this.startSpeechRecognition();  // Comenzar reconocimiento de voz solo después de la locución
        };

        window.speechSynthesis.speak(speech);
    }

    // API Speech Recognition: Inicializar el reconocimiento de voz
    initSpeechRecognition() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            const messageContainer = document.querySelector('body > main > section)'); 
            const paragraph = document.createElement('p');
            paragraph.textContent = `El reconocimiento de voz no es compatible con este navegador`;
            console.error('El reconocimiento de voz no es compatible con este navegador');
            messageContainer.appendChild(paragraph);
            modeSelectionContainer.querySelector('button:nth-of-type(2)').disabled = true;
            return false;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.lang = 'es-ES';
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = this.onSpeechResult.bind(this);
        this.recognition.onerror = this.onSpeechError.bind(this);
        return true;
    }

    onSpeechResult(event) {
        const speechResult = event.results[0][0].transcript;
        const messageContainer = document.querySelector('body > main > section:nth-of-type(2)');
        const paragraph = document.createElement('p');
        paragraph.textContent = `Has dicho: ${speechResult}`;
        messageContainer.appendChild(paragraph);
        setTimeout(() => { paragraph.remove(); }, 4000);
        this.checkAnswer(speechResult);
    
        clearTimeout(this.voiceTimeout);
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }
    }
    
    onSpeechError(event) {
        console.error('Speech recognition error detected: ' + event.error);
    }
    

    // Empenzar el reconocimiento de voz
    startSpeechRecognition() {
        this.recognition.start();
        this.startProgressBar();
    }

    // Comprobar la respuesta seleccionada
    checkAnswer(selectedOption) {
        const question = this.questions[this.currentQuestionIndex];
        const buttons = document.querySelectorAll("body > main > section")[3].querySelectorAll("button");

        buttons.forEach(button => button.disabled = true);

        if (this.progressInterval) {
            clearInterval(this.progressInterval);  // Detener el intervalo
        }

        if (selectedOption === question.answer) {
            this.score++;
            this.playSound('correct-answer.wav');
        } else {
            if (navigator.vibrate) {
                navigator.vibrate(500); 
            } else {
                console.log('La vibración no es compatible con este dispositivo');
            }
            this.playSound('incorrect-answer.mp3');
        }

        buttons.forEach(btn => {
            if (question.answer.toLowerCase() === btn.textContent.toLowerCase()) {
                btn.setAttribute('data-state', 'correct');
            } else {
                btn.setAttribute('data-state', 'incorrect');
            }

            btn.disabled = true;
        });

        setTimeout(() => {
            this.currentQuestionIndex++;
            if (this.currentQuestionIndex < this.questions.length) {
                this.showQuestion();
            } else {
                this.endGame();
            }
        }, 2500);

        document.querySelector("body > main > section span").textContent = this.score;
    }

    // Acabar el juego
    endGame() {
        const scoreDialog = document.querySelector("body > main > dialog");

        // Guardar nueva puntuación más alta si es mayor
        if (this.score > this.highScore) {
            localStorage.setItem('highScore', this.score);
            this.highScore = this.score;
        }

        const h2 = document.createElement('h2');
        h2.textContent = "Juego Finalizado";
        const yourFinalPuntuacion = document.createElement('p');
        yourFinalPuntuacion.textContent = `Tu puntuación: ${this.score}`;
        const greatestPuntuacion =  document.createElement('p');       
        greatestPuntuacion.textContent = `Puntuación más alta: ${this.highScore}`;

        scoreDialog.appendChild(h2);
        scoreDialog.appendChild(yourFinalPuntuacion);
        scoreDialog.appendChild(greatestPuntuacion);

        scoreDialog.setAttribute('data-state', 'show');
        scoreDialog.showModal();

        // Cerrar automáticamente el diálogo después de 4 segundos
        setTimeout(() => {
            scoreDialog.classList.remove('show');
            scoreDialog.close();
        }, 4000);
    }

    // Sonido de respuesta correcta o incorrecta
    playSound(filename) {
        const audio = new Audio(`multimedia/audios/${filename}`);

        audio.play().then(() => {
            console.log('Audio is playing');
        }).catch(error => {
            console.error('Error playing audio:', error);
        });
    }

    // API Web Storage: Guardar y cargar datos en el almacenamiento local
    saveHighScore(score) {
        localStorage.setItem("highScore", score);
    }

    getHighScore() {
        return localStorage.getItem("highScore") || 0;
    }

    startProgressBar() {
        if (!this.progressBarCanvas) {
            console.error('El canvas de la barra de progreso no está definido');
            return;
        }

        const progressBarWidth = this.progressBarCanvas.width;
        const context = this.progressBarContext;
        const duration = 5000; // Duración de la barra de progreso en milisegundos (4 segundos)
        const step = progressBarWidth / (duration / 50); // Calculamos cuántos píxeles debe retroceder cada 50 ms
    
        // Limpiar cualquier trazo anterior
        context.clearRect(0, 0, progressBarWidth, this.progressBarCanvas.height);
        
        // Rellenar el fondo en gris (la barra completa al principio)
        context.fillStyle = 'gray';
        context.fillRect(0, 0, progressBarWidth, this.progressBarCanvas.height);
    
        let progress = progressBarWidth; // Iniciamos la barra llena
    
        // Función que actualiza la barra de progreso
        const updateProgressBar = () => {
            progress = Math.max(progress - step, 0);  // Retroceder la barra
    
            // Limpiar el área del canvas y dibujar la barra de progreso
            context.clearRect(0, 0, progressBarWidth, this.progressBarCanvas.height);
            context.fillStyle = 'green';
            context.fillRect(0, 0, progress, this.progressBarCanvas.height);
    
            // Si ya se ha llegado al final, detener el intervalo
            if (progress === 0) {
                clearInterval(this.progressInterval);
                this.checkAnswer(""); // Enviar una respuesta vacía
            } 
        }
    
        // Iniciar el intervalo para actualizar la barra de progreso
        this.progressInterval = setInterval(updateProgressBar, 50); // Actualizar cada 50 ms
    }
}    
