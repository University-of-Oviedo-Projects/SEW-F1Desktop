/*
    Esta clase se encarga de mostrar un popup de ayuda al usuario
    cuando presiona la tecla F1 o hace clic en el botón de ayuda.

    El contenido de ayuda se muestra en un <dialog> que se abre
    con el método showModal() y se cierra con el método close().

    El contenido de ayuda se crea directamente en el <dialog> sin
    necesidad de crear un div adicional. Se crean secciones con
    títulos y contenido o listas de elementos. 
    
    Al final de cada se añade un botón para cerrar el popup. 
*/
class AyudaGlobal {
    constructor() {
        this.prepareHelpButton();
    }

    // Función para preparar el botón de ayuda
    prepareHelpButton() {
        // Detectar la tecla F1
        document.addEventListener("keydown", (event) => {
            if (event.key === "F1") {
                event.preventDefault(); // Evita la ayuda predeterminada del navegador
                this.createHelpContent();
            }
        });

        // Detectar el clic en el botón de ayuda
        const openHelpButton = document.querySelector("body > button");
        if (openHelpButton) {
            openHelpButton.addEventListener("click", () => {
                this.createHelpContent();
            });
        }
    }
    createHelpContent() {
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
                    "Home: página principal.",
                    "Piloto: información sobre el piloto Esteban Ocon.",
                    "Noticias: ver las ultimas noticias sobre la F1, crear noticias.",
                    "Meteorología: información sobre Países Bajos, predicción meteorológica sobre el circuito de Zandvoort.",
                    "Viajes: consultar cambio de moneda, mapas y carrusel de fotos.",
                    "Circuitos: obtener informacion de zandvoort mediante archivos.",
                    "Calendario: carreras de la temporada actual de F1.",
                    "Juegos: mini juegos relacionados con la Fórmula 1.",
                ],
            },
        ];

        const dialog = document.querySelector("body > dialog");
        dialog.innerHTML = ""; // Limpiar el contenido anterior

        sections.forEach((section) => {
            const title = document.createElement("h3");
            title.textContent = section.title;
            dialog.appendChild(title);

            if (section.content) { 
                const paragraph = document.createElement("p");
                paragraph.innerHTML = section.content;
                dialog.appendChild(paragraph);
            }

            if (section.list) { 
                const ul = document.createElement("ul");
                section.list.forEach((item) => {
                    const li = document.createElement("li");
                    li.innerHTML = `${item.split(":")[0]}: ${item.split(":")[1]}`;
                    ul.appendChild(li);
                });
                dialog.appendChild(ul);
            }
        });

        const closeButton = document.createElement("button");
        closeButton.textContent = "Cerrar";
        closeButton.addEventListener("click", () => {
            dialog.close(); 
        });

        dialog.appendChild(closeButton);
        dialog.showModal();
    }
}
