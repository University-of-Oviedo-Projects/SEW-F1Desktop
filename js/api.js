/**
 * Clase Api
 * 
 * Este archivo JavaScript implementa la lógica principal de un juego de preguntas y respuesta.
 * Incluye funcionalidades como:
 * 
 * 1. Gestión de las preguntas y respuesta del juego.
 * 
 * 2. Mecanismos para registrar y mostrar la puntuación del jugador.
 * 
 * 3. Barras para mostrar el tiempo restante para responder a cada pregunta.
 * 
 * 4. Uso de APIs de HTML5 para mejorar la experiencia del usuario:
 *    - **API Web Audio**: Para reproducir sonidos de respuesta correcta e incorrecta.
 *    - **API Web Storage (localStorage)**: Para guardar y recuperar la puntuación más alta del jugador.
 *    - **API Canvas**: Para dibujar una barra de progreso que muestre el tiempo restante para responder.
 */

class Api {
    constructor() {
        this.preguntas = [
            // PREGUNTAS FÁCILES (4)
            {
                pregunta: "¿Quién ganó el campeonato de F1 en 2020?",
                opciones: ["Lewis Hamilton", "Max Verstappen", "Sebastian Vettel", "Charles Leclerc"],
                respuesta: "Lewis Hamilton"
            },
            {
                pregunta: "¿Quién ganó el campeonato de F1 en 2021?",
                opciones: ["Lewis Hamilton", "Max Verstappen", "Sebastian Vettel", "Charles Leclerc"],
                respuesta: "Max Verstappen"
            },
            {
                pregunta: "¿Quién ha sido el único piloto español en ganar 2 mundiales?",
                opciones: ["Lewis Hamilton", "Carlos Sainz", "Fernando Alonso", "Jaime Alguersuari"],
                respuesta: "Fernando Alonso"
            },
            {
                pregunta: "¿Qué piloto brasileño tuvo una histórica rivalidad con Alain Prost?",
                opciones: ["Felipe Massa", "Rubens Barrichello", "Ayrton Senna", "Nelson Piquet"],
                respuesta: "Ayrton Senna"
            },
            {
                pregunta: "¿Qué piloto es apodado 'El Rey de Mónaco' por sus victorias en ese circuito?",
                opciones: ["Michael Schumacher", "Lewis Hamilton", "Ayrton Senna", "Max Verstappen"],
                respuesta: "Ayrton Senna"
            },
        
            // PREGUNTAS NORMALES (5)
            {
                pregunta: "¿Qué equipo de F1 ha ganado más títulos de constructores en la historia?",
                opciones: ["Ferrari", "McLaren", "Mercedes", "Red Bull"],
                respuesta: "Ferrari"
            },
            {
                pregunta: "¿En qué año debutó Fernando Alonso en la Fórmula 1?",
                opciones: ["2001", "1999", "2003", "2005"],
                respuesta: "2001"
            },
            {
                pregunta: "¿Cuál fue el último equipo en ganar un título de constructores antes de la era híbrida de Mercedes?",
                opciones: ["Ferrari", "Red Bull", "McLaren", "Renault"],
                respuesta: "Red Bull"
            },
            {
                pregunta: "¿Qué piloto ostenta el récord de más poles consecutivas en una temporada?",
                opciones: ["Lewis Hamilton", "Michael Schumacher", "Sebastian Vettel", "Ayrton Senna"],
                respuesta: "Ayrton Senna"
            },
            {
                pregunta: "¿Cuál es el circuito más largo del calendario de la Fórmula 1?",
                opciones: ["Spa-Francorchamps", "Monza", "Silverstone", "Circuito de las Américas"],
                respuesta: "Spa-Francorchamps"
            },
        
            // PREGUNTAS DIFÍCILES (8)
            {
                pregunta: "¿Cuál fue el último equipo de Ayrton Senna en la F1?",
                opciones: ["Williams", "McLaren", "Ferrari", "Lotus"],
                respuesta: "Williams"
            },
            {
                pregunta: "¿Quién es el piloto más joven en ganar una carrera de F1?",
                opciones: ["Sebastian Vettel", "Max Verstappen", "Lewis Hamilton", "Fernando Alonso"],
                respuesta: "Max Verstappen"
            },
            {
                pregunta: "¿Cuál fue el primer circuito nocturno en el calendario de F1?",
                opciones: ["Singapur", "Bahrein", "Abu Dhabi", "Japón"],
                respuesta: "Singapur"
            },
            {
                pregunta: "¿En qué equipo debutó Michael Schumacher en la F1?",
                opciones: ["Benetton", "Jordan", "Ferrari", "Mercedes"],
                respuesta: "Jordan"
            },
            {
                pregunta: "¿En qué país nació el piloto campeón mundial Niki Lauda?",
                opciones: ["Alemania", "Suiza", "Austria", "Italia"],
                respuesta: "Austria"
            },
            {
                pregunta: "¿Cuál fue la primera temporada en la que Lewis Hamilton ganó un título mundial?",
                opciones: ["2007", "2008", "2009", "2010"],
                respuesta: "2008"
            },
            {
                pregunta: "¿Qué fabricante fue el primero en introducir un motor turbo en la F1?",
                opciones: ["Ferrari", "Renault", "Honda", "Mercedes"],
                respuesta: "Renault"
            },
            {
                pregunta: "¿Quién tiene el récord de más podios en la historia de la F1?",
                opciones: ["Michael Schumacher", "Sebastian Vettel", "Lewis Hamilton", "Alain Prost"],
                respuesta: "Lewis Hamilton"
            },
        
            // PREGUNTAS EXTREMAS (6)
            {
                pregunta: "¿Cuál fue el primer piloto en alcanzar los 100 Grandes Premios ganados?",
                opciones: ["Michael Schumacher", "Sebastian Vettel", "Ayrton Senna", "Lewis Hamilton"],
                respuesta: "Lewis Hamilton"
            },
            {
                pregunta: "¿Cuál es el récord de mayor número de victorias en una sola temporada?",
                opciones: ["15", "13", "19", "14"],
                respuesta: "19"
            },
            {
                pregunta: "¿Quién fue el primer piloto en ganar un Gran Premio de F1 con motor Ferrari?",
                opciones: ["Alberto Ascari", "Juan Manuel Fangio", "Giuseppe Farina", "José Froilán González"],
                respuesta: "José Froilán González"
            },
            {
                pregunta: "¿En qué año se celebró la primera carrera oficial del Campeonato Mundial de F1?",
                opciones: ["1947", "1950", "1953", "1955"],
                respuesta: "1950"
            },
            {
                pregunta: "¿Cuántas carreras consecutivas ganó Sebastian Vettel en 2013, estableciendo un récord?",
                opciones: ["8", "9", "7", "10"],
                respuesta: "9"
            },
            {
                pregunta: "¿Quién fue el campeón mundial de F1 en el año en que murió Ayrton Senna?",
                opciones: ["Michael Schumacher", "Damon Hill", "Nigel Mansell", "Mika Hakkinen"],
                respuesta: "Michael Schumacher"
            }
        ];
        
        this.puntuacion = 0;
        this.timeLimit = 15; 
        this.intervaloBarra = null;
        this.indicePreguntaActual = 0;
        this.crearSecciones(); 

        // Obtener la puntuación más alta del almacenamiento local
        this.highpuntuacion = localStorage.getItem('highpuntuacion') || 0;

        let botonEmpezarJuego = document.querySelector('main > section > button');
        if (botonEmpezarJuego) {
            botonEmpezarJuego.addEventListener('click', () => this.empezarJuego());
        } 

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audiocontexto = new AudioContext();
    }

    // Crear las secciones del juego
    crearSecciones() {
        const main = document.querySelector('main');

        // Crear contenedor de puntuación
        const puntuacioncontenedor = document.createElement('section');
        const h21 = document.createElement('h2');
        h21.textContent = "Puntuación: ";
        const span = document.createElement('span');
        span.textContent = "0";
        h21.appendChild(span);
        puntuacioncontenedor.appendChild(h21);
        puntuacioncontenedor.setAttribute('hidden', '');
        main.appendChild(puntuacioncontenedor);

        // Crear contenedor de pregunta
        const preguntacontenedor = document.createElement('section');
        preguntacontenedor.setAttribute('hidden', '');
        const h22 = document.createElement('h2');
        h22.textContent = "Pregunta";
        h22.setAttribute('hidden', '');
        preguntacontenedor.appendChild(h22);
        main.appendChild(preguntacontenedor);

        // Crear contenedor de opciones
        const opcionescontenedor = document.createElement('section');
        const h23 = document.createElement('h2');
        h23.textContent = "Opciones";
        opcionescontenedor.appendChild(h23);
        opcionescontenedor.setAttribute('hidden', '');
        main.appendChild(opcionescontenedor);

        // Crear contenedor de puntuación final
        const finalpuntuacioncontenedor = document.createElement('section');
        const h24 = document.createElement('h2');
        h24.textContent = "Puntuación Final";
        finalpuntuacioncontenedor.appendChild(h24);
        finalpuntuacioncontenedor.setAttribute('hidden', '');
        main.appendChild(finalpuntuacioncontenedor);
    }

    empezarJuego() {
        // Ocultar el botón de inicio y el mensaje de bienvenida
        document.querySelector('main > section').setAttribute('hidden', '');

        // Mostrar las secciones de puntuación, pregunta y opciones
        document.querySelector("body > main > section:nth-of-type(2)").removeAttribute('hidden')
        document.querySelector("body > main > section:nth-of-type(3)").removeAttribute('hidden')
        document.querySelector("body > main > section:nth-of-type(4)").removeAttribute('hidden')
        this.mostrarPregunta(); // Mostrar la primera pregunta

        const highpuntuacion = this.retornarPuntuacionMasAlta();  // Web Storage
        const messagecontenedor = document.querySelector('body > main > section:nth-of-type(2)'); 
        const paragraph = document.createElement('p');
        paragraph.textContent = `Puntuación más alta: ${highpuntuacion}`;
        messagecontenedor.appendChild(paragraph);       
    }

    mostrarPregunta() {
        const preguntacontenedor = document.querySelectorAll("body > main > section")[2];
        const opcionescontenedor = document.querySelectorAll("body > main > section")[3];
        const pregunta = this.preguntas[this.indicePreguntaActual];

        preguntacontenedor.innerHTML = `<h2>${pregunta.pregunta}</h2>`;
        opcionescontenedor.innerHTML = '';
        opcionescontenedor.innerHTML = `<h2>Opciones</h2>`;

        pregunta.opciones.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.addEventListener('click', () => this.comprobarRespuesta(option));
            opcionescontenedor.appendChild(button);
        });

        // Crear el canvas para la barra de progreso
        this.progressBarCanvas = document.createElement('canvas');
        const opcionescontenedorToCanvas = document.querySelector('body > main > section:nth-of-type(3)');
        this.progressBarCanvas.width = window.innerWidth;  // Establecer el ancho del canvas
        this.progressBarCanvas.height = 20; // Establecer la altura del canvas
        this.progressBarContexto = this.progressBarCanvas.getContext('2d');
        opcionescontenedorToCanvas.appendChild(this.progressBarCanvas);

        // Leer pregunta en voz alta si el modo es de reconocimiento de voz
        this.ejecutarBarraProgreso();
    }

    // Comprobar la respuesta seleccionada
    comprobarRespuesta(opcionSeleccionada) {
        const pregunta = this.preguntas[this.indicePreguntaActual];
        const botonesOp = document.querySelectorAll("body > main > section")[3].querySelectorAll("button");

        botonesOp.forEach(button => button.disabled = true);

        if (this.intervaloBarra) {
            clearInterval(this.intervaloBarra);  // Detener el intervalo
        }

        if (opcionSeleccionada === pregunta.respuesta) {
            this.puntuacion++;
            this.reproducirSonido('respuesta-correcta.wav');
        } else {
            if (navigator.vibrate) {
                navigator.vibrate(500); 
            } 
            this.reproducirSonido('respuesta-incorrecta.mp3');
        }

        botonesOp.forEach(btn => {
            if (pregunta.respuesta.toLowerCase() === btn.textContent.toLowerCase()) {
                btn.textContent += ' (correcta)';
            } 

            btn.disabled = true;
        });

        setTimeout(() => {
            this.indicePreguntaActual++;
            if (this.indicePreguntaActual < this.preguntas.length) {
                this.mostrarPregunta();
            } else {
                this.finalizarJuego();
            }
        }, 2500);

        document.querySelector("body > main > section span").textContent = this.puntuacion;
    }

    finalizarJuego() {
        const contenedor = document.querySelector('main');
        const puntuacionDialog = document.createElement('dialog');

        if (this.puntuacion > this.highpuntuacion) { // Actualizar la puntuación más alta si es necesario
            localStorage.setItem('highpuntuacion', this.puntuacion);
            this.highpuntuacion = this.puntuacion;
        }

        const h2 = document.createElement('h2');
        h2.textContent = "Juego Finalizado";
        puntuacionDialog.appendChild(h2);
        const puntuacionFinalJugador = document.createElement('p');
        puntuacionFinalJugador.textContent = `Tu puntuación: ${this.puntuacion}`;
        puntuacionDialog.appendChild(puntuacionFinalJugador);
        const mayorPuntuacionTotal =  document.createElement('p');       
        mayorPuntuacionTotal.textContent = `Puntuación más alta: ${this.highpuntuacion}`;       
        puntuacionDialog.appendChild(mayorPuntuacionTotal);

        contenedor.appendChild(puntuacionDialog);
        puntuacionDialog.showModal();

        setTimeout(() => {
            puntuacionDialog.close();
            puntuacionDialog.remove();
        }, 2500);
    }

    reproducirSonido(filename) {
        this.cargarSonido(`multimedia/audios/${filename}`)
            .then(audioBuffer => {
                const source = this.audiocontexto.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(this.audiocontexto.destination);
                source.start();
                ('Audio is playing');
            })
            .catch(error => {
                // No hacer nada si hay un error
            });
    }

    /*
        * Cargar un archivo de audio y devolver un objeto de buffer de audio.
        * @param {string} url - La URL del archivo de audio a cargar.
        * @returns {Promise<AudioBuffer>} - Un objeto de buffer de audio.
        * @throws {Error} - Si hay un error al cargar el archivo de audio.
        * @async Es necesario esperar a que se cargue el archivo de audio.
    */
    async cargarSonido(url) {
        const response = await fetch(url);
        const data = await response.arrayBuffer();
        return await this.audiocontexto.decodeAudioData(data); 
    }

    guardarPuntuacionMasAlta(puntuacion) {
        localStorage.setItem("highpuntuacion", puntuacion);
    }

    retornarPuntuacionMasAlta() {
        return localStorage.getItem("highpuntuacion") || 0;
    }

    ejecutarBarraProgreso() {
        if (!this.progressBarCanvas) return;

        const anchoBarra = this.progressBarCanvas.width;
        const contexto = this.progressBarContexto;
        const duracion = 8000; 
        const paso = anchoBarra / (duracion / 50); 
    
        // Limpiar cualquier trazo anterior
        contexto.clearRect(0, 0, anchoBarra, this.progressBarCanvas.height);
        
        // Rellenar el fondo en gris (la barra completa al principio)
        contexto.fillStyle = 'gray';
        contexto.fillRect(0, 0, anchoBarra, this.progressBarCanvas.height);
    
        let progress = anchoBarra; // Iniciamos la barra llena
    
        // Función que actualiza la barra de progreso
        const actualizarBarraProgreso = () => {
            progress = Math.max(progress - paso, 0);  // Retroceder la barra
    
            // Limpiar el área del canvas y dibujar la barra de progreso
            contexto.clearRect(0, 0, anchoBarra, this.progressBarCanvas.height);
            contexto.fillStyle = 'green';
            contexto.fillRect(0, 0, progress, this.progressBarCanvas.height);
    
            // Si ya se ha llegado al final, detener el intervalo
            if (progress === 0) {
                clearInterval(this.intervaloBarra);
                this.comprobarRespuesta(""); // Enviar una respuesta vacía
            } 
        }
    
        // Iniciar el intervalo para actualizar la barra de progreso
        this.intervaloBarra = setInterval(actualizarBarraProgreso, 50); // Actualizar cada 50 ms
    }
}    
