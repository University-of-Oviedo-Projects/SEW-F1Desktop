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

        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
        this.createAndLoadGameTutorial();
    }

    createAndLoadGameTutorial() {
        const tutorialButton = document.querySelector('main > button'); 
        
        tutorialButton.addEventListener('click', () => {
            const dialog = document.createElement('dialog');

            const h3 = document.createElement('h3');
            h3.textContent = '¿Cómo jugar?';
            dialog.appendChild(h3);

            const p = document.createElement('p');
            p.textContent = 'El objetivo del juego es encontrar todas las parejas de cartas en el menor tiempo posible. Haz clic en dos cartas para ver sus imágenes; si coinciden, se quedarán reveladas, de lo contrario se voltearán de nuevo. ¡Buena suerte!';
            dialog.appendChild(p);
            
            const button = document.createElement('button');
            button.addEventListener('click', () => {
                dialog.close();
                dialog.remove();
            });
            button.textContent = 'Cerrar';
            dialog.appendChild(button);

            document.querySelector('main').appendChild(dialog);
            dialog.showModal();
        });
    }

    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));           
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }

    unflipCards() {
        this.lockBoard = true;
    
        setTimeout(() => {
            this.firstCard.setAttribute("data-state", "hidden");
            this.firstCard.querySelector("img").setAttribute('hidden', '');
            this.secondCard.setAttribute("data-state", "hidden");
            this.secondCard.querySelector("img").setAttribute('hidden', '');           
            this.resetBoard();
        }, 700);
    }    

    resetBoard() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
    }

    checkForMatch() {
        this.firstCard.getAttribute('data-element') 
            === this.secondCard.getAttribute('data-element')
            ? this.disableCards() : this.unflipCards();
    }

    disableCards() {
        this.firstCard.removeAttribute("data-state", "flip");
        this.secondCard.removeAttribute("data-state", "flip");

        this.firstCard.setAttribute("data-state", "revealed");
        this.secondCard.setAttribute("data-state", "revealed");

        this.resetBoard();
        this.checkForWin();
    }

    checkForWin() {
        const allCards = document.querySelectorAll('article');
        const allRevealed = Array.from(allCards).every(card => 
                card.getAttribute('data-state') === 'revealed');

        if (allRevealed) {
            const dialog = document.createElement('dialog');
            const h2 = document.createElement('h2');
            h2.textContent = '¡Felicidades!';
            dialog.appendChild(h2);
            const p = document.createElement('p');
            p.textContent = '¡Has encontrado todas las parejas! ¿Quieres jugar de nuevo?';
            dialog.appendChild(p);
            document.querySelector('main').appendChild(dialog);
            
            dialog.showModal();
            setTimeout(() => { 
                dialog.close(); 
                dialog.remove();
            }, 1700);
        }
    }

    createElements() {
        const container = document.querySelector('main'); 

        const section = document.createElement('section');
        const h2 = document.createElement('h2');
        h2.textContent = 'Juego de memoria';
        section.appendChild(h2);

        const button = document.createElement('button');
        button.textContent = 'Tutorial';
        container.appendChild(button);

        this.elements.forEach((item) => {
            const article = document.createElement('article');
            article.setAttribute('data-state', 'hidden');
            article.setAttribute('data-element', item.element);

            const h3 = document.createElement('h3');
            h3.textContent = "Tarjeta de memoria";
            article.appendChild(h3);

            const img = document.createElement('img');
            img.src = item.source;
            img.alt = item.element;
            img.setAttribute('hidden', '');

            article.appendChild(img);
            section.appendChild(article);
        });

        container.appendChild(section);
    }

    addEventListeners() {
        const cards = document.querySelectorAll('article');

        cards.forEach(card => {
            card.addEventListener('click', this.flipCard.bind(this, card));
        });
    }

    flipCard(game) {
        let cardToFlip = game;

        if (cardToFlip.getAttribute('data-state') === 'revealed'
            || this.lockBoard
            || cardToFlip === this.firstCard) {
            return;
        }

        cardToFlip.setAttribute('data-state', 'flip');
        const img = cardToFlip.querySelector('img');
        img.removeAttribute('hidden');

        if (!this.hasFlippedCard) {
            this.hasFlippedCard = true;
            this.firstCard = cardToFlip;
        } else {
            this.secondCard = cardToFlip;
            this.lockBoard = true;
            this.checkForMatch();
        }
    }
}
