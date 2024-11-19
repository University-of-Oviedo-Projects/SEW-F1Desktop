class Memoria {

    elements = [
        { element: "Red Bull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
        { element: "Red Bull", source: "https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg" },
        { element: "Mclaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
        { element: "Mclaren", source: "https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg" },
        { element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
        { element: "Alpine", source: "https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg" },
        { element: "Aston Martin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
        { element: "Aston Martin", source: "https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg" },
        { element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
        { element: "Ferrari", source: "https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg" },
        { element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" },
        { element: "Mercedes", source: "https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg" }
    ];

    constructor() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;

        // Barajar los elementos
        this.shuffleElements();

        // Crear los elementos en el DOM
        this.createElements();

        // Añadir los eventos a los elementos
        this.addEventListeners();

        // Cargar el tutorial
        this.createAndLoadGameTutorial();
    }

    createAndLoadGameTutorial() {
        // Selección de elementos del tutorial
        const tutorialButton = document.querySelector('button');  
        const tutorialPopup = document.querySelector('dialog');  
        const closeTutorial = tutorialPopup.querySelector('button');  

        // Mostrar el tutorial
        tutorialButton.addEventListener('click', () => {
            tutorialPopup.showModal();
        });

        // Cerrar el tutorial
        closeTutorial.addEventListener('click', () => {
            tutorialPopup.close();
        });
    }

    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1)); // Índice aleatorio entre 0 y i           

            // Intercambia los elementos en las posiciones i y j
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }

    unflipCards() {
        this.lockBoard = true;

        setTimeout(() => {
            this.firstCard.setAttribute("data-state", "card-hidden");
            this.firstCard.querySelector("img").setAttribute('data-state', 'card-hidden');
            this.secondCard.setAttribute("data-state", "card-hidden");
            this.secondCard.querySelector("img").setAttribute('data-state', 'card-hidden');

            this.resetBoard();
        }, 1000);
    }

    resetBoard() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    checkForMatch() {
        this.firstCard.getAttribute("data-element") === this.secondCard.getAttribute("data-element") ?
            this.disableCards() : this.unflipCards();
    }

    disableCards() {
        this.firstCard.setAttribute("data-state", "card-revealed");
        this.secondCard.setAttribute("data-state", "card-revealed");

        // Eliminar el evento click de las cartas que ya han sido emparejadas
        this.resetBoard();

        // Comprobar si el usuario ha ganado
        this.checkForWin();
    }

    checkForWin() {
        // Seleccionar todas las cartas y comprobar si todas están reveladas
        const allCards = document.querySelectorAll('article');

        // Comprobar si todas las cartas están reveladas
        const allRevealed = Array.from(allCards).every(card => 
                card.getAttribute('data-state') === 'card-revealed');

        if (allRevealed) {
            // Extraer el popup del DOM
            const popup = document.querySelector('main dialog:nth-of-type(2)');

            // Mostrar el popup por 5 segundos            
            popup.showModal();

            // Cerrar el popup después de 2 segundos
            setTimeout(() => { popup.close(); }, 3500);
        }
    }

    createElements() {
        const container = document.querySelector('main section'); 

        this.elements.forEach((item) => {
            // Crear un nuevo artículo para cada elemento
            const article = document.createElement('article');
            article.setAttribute('data-element', item.element);
            article.setAttribute('data-state', 'card-hidden');

            // Crear el encabezado y añadirlo al artículo
            const header = document.createElement('header');
            const h2 = document.createElement('h2');
            h2.textContent = "Memory card";
            header.appendChild(h2);
            article.appendChild(header);

            // Crear la imagen y añadirla al artículo
            const img = document.createElement('img');
            img.src = item.source;
            img.alt = "Memory card";
            img.setAttribute('data-state', 'hidden');

            // Agregar la imagen al artículo
            article.appendChild(img);

            // Agregar el artículo al contenedor
            container.appendChild(article);
        });
    }

    addEventListeners() {
        const cards = document.querySelectorAll('article');

        cards.forEach(card => {
            card.addEventListener('click', this.flipCard.bind(this, card));
        });
    }

    flipCard(article) {
        if (article.getAttribute('data-state') === 'card-revealed'
            || this.lockBoard
            || article === this.firstCard) {
            return;
        }

        article.setAttribute('data-state', 'card-revealed');

        const img = article.querySelector('img');
        img.setAttribute('data-state', 'visible');

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = article;
        } else {
            this.secondCard = article;
            this.checkForMatch();
        }
    }
}
