class HelpHandler {
    constructor() {
        this.prepareHelpButton();
    }

    // Función para preparar el botón de ayuda
    prepareHelpButton() {
        // Detectar la tecla F1
        document.addEventListener("keydown", (event) => {
            if (event.key === "F1") {
                event.preventDefault(); // Evita la ayuda predeterminada del navegador
                this.showHelpPopup();
            }
        });

        // Detectar el clic en el botón de ayuda 
        const openHelpButton = document.querySelector("footer button");
        if (openHelpButton) {
            openHelpButton.addEventListener("click", () => {
                this.showHelpPopup();
            });
        }
    }

    // Función para mostrar el popup de ayuda sin ID
    showHelpPopup() {
        const helpPopup = document.querySelector("dialog");
        helpPopup.innerHTML = this.getHelp(); // Inserta el contenido de ayuda
        helpPopup.scrollTop = 0; // Asegura el desplazamiento en la parte superior

        // Re-agregar el listener al botón de cerrar tras insertar contenido
        const closeHelpButton = helpPopup.querySelector("button");
        if (closeHelpButton) {
            closeHelpButton.addEventListener("click", () => {
                this.closeHelpPopup();
            });
        }

        // Usa un retraso mínimo para asegurar que scrollTop se aplique
        setTimeout(() => {
            helpPopup.scrollTop = 0;
        }, 0);

        helpPopup.showModal();
    }

    // Función para cerrar el popup de ayuda
    closeHelpPopup() {
        const helpPopup = document.querySelector("dialog");
        helpPopup.close();
    }

    getHelp() {
        return `
            <section>
                <h3>¿Cómo funciona?</h3>
                <p>Para obtener ayuda en cualquier momento, presiona la tecla F1 o 
                    haz clic en el botón de ayuda en el pie de pagina.</p>
            </section>

            <section>
                <h3>¿Qué puedo hacer en esta web?</h3>
                <p>En esta web puedes encontrar información sobre los pilotos, 
                    las carreras, las noticias y la meteorología de la Fórmula 1.</p>
                <p>Además, puedes consultar el calendario de carreras de la temporada y jugar  
                    a mini juegos relacionados con la Fórmula 1.</p>
            </section>

            <section>
                <h3>Secciones disponibles:</h3>
                <ul>
                    <li><strong>Home:</strong> Página principal con información general.</li>
                    <li><strong>Piloto:</strong> Información sobre los pilotos.</li>
                    <li><strong>Noticias:</strong> Últimas noticias y actualizaciones.</li>
                    <li><strong>Meteorología:</strong> Información meteorológica relevante.</li>
                    <li><strong>Viajes:</strong> Información sobre viajes y alojamiento.</li>
                    <li><strong>Circuitos:</strong> Información sobre los circuitos de la temporada.</li>
                    <li><strong>Calendario:</strong> Calendario de carreras de la temporada.</li>
                    <li><strong>Juegos:</strong> Mini juegos relacionados con la Fórmula 1.</li>                    
                </ul>
            </section>
            <button id="close-help">Cerrar</button>
        `;
    }
}
