class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8];
        this.lights = 4;
        this.unload_moment = null;
        this.clic_moment = null;

        const randomIndex = Math.floor(Math.random() * this.levels.length);
        this.difficulty = this.levels[randomIndex];

        this.createStructure();
    }

    createStructure() {
        const main = document.querySelector("main");

        const semaforoContainer = document.createElement("section");
        const h2 = document.createElement('h2');
        h2.textContent = "¡Pon a prueba tus reflejos!"; 
        semaforoContainer.appendChild(h2);
        main.appendChild(semaforoContainer);

        for (let i = 1; i <= this.lights; i++) {
            const light = document.createElement("div");
            light.className = "light";
            light.id = `light${i}`;
            semaforoContainer.appendChild(light);
        }

        // Botón de inicio
        this.startButton = document.createElement("button");
        this.startButton.textContent = "Arranque";
        this.startButton.onclick = () => this.initSequence();
        main.appendChild(this.startButton);

        // Botón para registrar tiempo de reacción
        this.reactionButton = document.createElement("button");
        this.reactionButton.textContent = "Reaccionar";
        this.reactionButton.onclick = () => this.stopReaction(); 
        this.reactionButton.disabled = true;
        main.appendChild(this.reactionButton);

        // Mostrar el tiempo de reacción
        this.reactionTimeDisplay = document.createElement("p");
        main.appendChild(this.reactionTimeDisplay);
    }

    initSequence() {
        const main = document.querySelector("main");
        main.classList.add("load");  

        this.reactionTimeDisplay.textContent = "";
        
        // Deshabilitar el botón de inicio
        if (this.startButton) {
            this.startButton.disabled = true;
        } else {
            console.error("Start button not found");
            return;
        }

        let minSeconds, maxSeconds;

        // Determinar el rango de tiempo según la dificultad
        if (this.difficulty === 0.2) {
            minSeconds = 2;
            maxSeconds = 4;
        } else if (this.difficulty === 0.5) {
            minSeconds = 4;
            maxSeconds = 6;
        } else if (this.difficulty === 0.8) {
            minSeconds = 6;
            maxSeconds = 8;
        }

        const randomSeconds = Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds; 
        const timeoutDuration = randomSeconds * 1000;

        // Esperar aleatoriamente para apagar las luces
        setTimeout(() => {
            this.turnOffLights();
        }, timeoutDuration);
    }

    turnOffLights() {
        const main = document.querySelector("main");
        main.classList.remove("load"); 
        main.classList.add("unload"); 

        this.unload_moment = new Date();

        // Usar la referencia almacenada para el botón de reacción
        if (this.reactionButton) {
            this.reactionButton.disabled = false;
        } else {
            console.error("Reaction button not found");
        }
    }

    stopReaction() {
        this.clic_moment = new Date();
        const reactionTime = this.clic_moment - this.unload_moment; 
        const reactionTimeSeconds = (reactionTime / 1000).toFixed(3); 

        // Mostrar el tiempo de reacción
        this.reactionTimeDisplay.textContent = `Tiempo de reacción: ${reactionTimeSeconds} segundos`;

        const main = document.querySelector("main");
        main.classList.remove("load");
        main.classList.remove("unload");

        // Deshabilitar el botón de reacción y habilitar el de inicio
        if (this.reactionButton) {
            this.reactionButton.disabled = true;
        }

        if (this.startButton) {
            this.startButton.disabled = false;
        }
    }
}
