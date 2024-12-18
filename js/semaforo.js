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
        const h2 = document.createElement('h2');
        
        h2.textContent = "Semáforo"; 
        main.appendChild(h2);

        for (let i = 1; i <= this.lights; i++) {
            const light = document.createElement("div");
            main.appendChild(light);
        }

        this.startButton = document.createElement("button");
        this.startButton.textContent = "Arranque";
        this.startButton.onclick = () => this.initSequence();
        main.appendChild(this.startButton);

        this.reactionButton = document.createElement("button");
        this.reactionButton.textContent = "Reacción";
        this.reactionButton.onclick = () => this.stopReaction(); 
        this.reactionButton.disabled = true;
        main.appendChild(this.reactionButton);

        this.reactionTimeDisplay = document.createElement("p");
        main.appendChild(this.reactionTimeDisplay);
    }

    initSequence() {
        const main = document.querySelector("main");
        const recordH3 = document.querySelector("main > h3");
        const recordsList = document.querySelector("main > ol");

        if(recordH3) { recordH3.remove(); }
        if(recordsList) { recordsList.remove(); }        
        if(main.classList.contains("unload")) { main.classList.remove("unload"); }
        
        main.classList.add("load");  
        this.reactionTimeDisplay.textContent = "";

        const form = document.querySelector("main > form");
        if(form) { form.remove(); }
        
        if (this.startButton) {
            this.startButton.disabled = true;
        } else {
            return;
        }

        const timeoutDuration = this.difficulty * 1000;
        setTimeout(() => {
            this.unload_moment = new Date();
            this.endSequence();
        }, 2000 + timeoutDuration);
    }

    endSequence() {
        const main = document.querySelector("main");
        main.classList.remove("load");  main.classList.add("unload"); 
    
        this.reactionButton.disabled = false;
        this.startButton.disabled = true;
      }


    stopReaction() {
        this.clic_moment = new Date();
        const reactionTime = this.clic_moment - this.unload_moment; 
        const reactionTimeSeconds = (reactionTime / 1000).toFixed(3); 
        this.reactionTimeDisplay.textContent = `Tiempo de reacción: ${reactionTimeSeconds} segundos`;

        if (this.reactionButton) {
            this.reactionButton.disabled = true;
        }

        if (this.startButton) {
            this.startButton.disabled = false;
        }

        this.createRecordForm(reactionTimeSeconds);
    }

    createRecordForm(reactionTimeSeconds) {
        const currentForm = document.querySelector("main > form");
        if(currentForm) { currentForm.remove(); }

        const formHtml = document.createElement("form");
        formHtml.method = "post";
        formHtml.action = "semaforo.php";

        const labelNombre = document.createElement("label");
        labelNombre.textContent = "Nombre:";
        
        const inputNombre = document.createElement("input");
        inputNombre.type = "text";
        inputNombre.id = "nombre";
        inputNombre.name = "nombre";
        inputNombre.required = true;

        const labelApellidos = document.createElement("label");
        labelApellidos.textContent = "Apellidos:";

        const inputApellidos = document.createElement("input");
        inputApellidos.type = "text";
        inputApellidos.id = "apellidos";
        inputApellidos.name = "apellidos";
        inputApellidos.required = true;

        const labelNivel = document.createElement("label");
        labelNivel.textContent = "Nivel:";

        const inputNivel = document.createElement("input");
        inputNivel.type = "text";
        inputNivel.id = "nivel";
        inputNivel.name = "nivel";
        inputNivel.value = this.difficulty;
        inputNivel.readOnly = true;

        const labelTiempo = document.createElement("label");
        labelTiempo.textContent = "Tiempo de reacción (segundos):";

        const inputTiempo = document.createElement("input");
        inputTiempo.type = "text";
        inputTiempo.id = "tiempo";
        inputTiempo.name = "tiempo";
        inputTiempo.value = reactionTimeSeconds;
        inputTiempo.readOnly = true;

        const button = document.createElement("button");
        button.type = "submit";
        button.textContent = "Guardar Récord";

        formHtml.appendChild(labelNombre);
        formHtml.appendChild(inputNombre);
        formHtml.appendChild(labelApellidos);
        formHtml.appendChild(inputApellidos);
        formHtml.appendChild(labelNivel);
        formHtml.appendChild(inputNivel);
        formHtml.appendChild(labelTiempo);
        formHtml.appendChild(inputTiempo);
        formHtml.appendChild(button);

        $('main').append(formHtml);
    }    
}
