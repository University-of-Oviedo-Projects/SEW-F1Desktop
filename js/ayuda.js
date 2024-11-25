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

    // Función para mostrar el popup de ayuda sin usar div
    showHelpPopup() {
        const helpPopup = document.querySelector("dialog");
        helpPopup.innerHTML = ""; // Limpia cualquier contenido previo
        this.createHelpContent(helpPopup); // Agrega contenido directamente al <dialog>
        helpPopup.scrollTop = 0; // Asegura el desplazamiento en la parte superior

        // Agrega el evento para cerrar
        const closeHelpButton = helpPopup.querySelector("#close-help");
        if (closeHelpButton) {
            closeHelpButton.addEventListener("click", () => {
                this.closeHelpPopup();
            });
        }

        helpPopup.showModal();
    }

    // Función para cerrar el popup de ayuda
    closeHelpPopup() {
        const helpPopup = document.querySelector("dialog");
        helpPopup.close();
    }

    // Función para crear el contenido de ayuda directamente en el dialog
    createHelpContent(helpPopup) {
        // Crear secciones de ayuda
        const sections = [
            {
                title: "¿Cómo funciona?",
                content: `Para obtener ayuda en cualquier momento, presiona la tecla F1 o 
                          haz clic en el botón de ayuda en el pie de página.`,
            },
            {
                title: "¿Qué puedo hacer en esta web?",
                content: `En esta web puedes encontrar información sobre los pilotos, 
                          las carreras, las noticias y la meteorología de la Fórmula 1.
                          Además, puedes consultar el calendario de carreras de la temporada y jugar  
                          a mini juegos relacionados con la Fórmula 1.`,
            },
            {
                title: "Secciones disponibles:",
                list: [
                    "Home: Página principal con información general.",
                    "Piloto: Información sobre el piloto de F1 Esteban Ocon.",
                    "Noticias: Crear y ver las ultimas noticias sobre la F!.",
                    "Meteorología: Información meteorológica sobre el circuito de Zandvoort.",
                    "Viajes: Mapa estatico  dinamico de tu ubicación.",
                    "Circuitos: Información el circuito de Zandvoort.",
                    "Calendario: Calendario de carreras de la temporada.",
                    "Juegos: Mini juegos relacionados con la Fórmula 1.",
                ],
            },
        ];

        // Añadir contenido al <dialog>
        sections.forEach((section) => {
            // Título de la sección
            const title = document.createElement("h3");
            title.textContent = section.title;
            helpPopup.appendChild(title);

            // Contenido o lista de la sección
            if (section.content) {
                const paragraph = document.createElement("p");
                paragraph.innerHTML = section.content;
                helpPopup.appendChild(paragraph);
            }

            if (section.list) {
                const ul = document.createElement("ul");
                section.list.forEach((item) => {
                    const li = document.createElement("li");
                    li.innerHTML = `<strong>${item.split(":")[0]}:</strong> ${item.split(":")[1]}`;
                    ul.appendChild(li);
                });
                helpPopup.appendChild(ul);
            }
        });

        // Botón de cierre
        const closeButton = document.createElement("button");
        closeButton.id = "close-help";
        closeButton.textContent = "Cerrar";
        helpPopup.appendChild(closeButton);
    }
}
