class Noticias {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("Todas las APIs de File están soportadas.");
        } else {
            const messageContainer = document.querySelector('body > main > section'); 
            const paragraph = document.createElement('p');
            paragraph.textContent = `La API de File no es soportada en este navegador.`;
            messageContainer.appendChild(paragraph);
            
            setTimeout(() => {
                paragraph.remove();
            }, 4000);     
        }

        // Oculta el h2 de "Últimas noticias"
        document.querySelector('main section > h2').setAttribute('data-state', 'hidden');

        // Evento change del input de archivo
        document.querySelector('input[type="file"]').addEventListener('change', (event) => this.readInputFile(event));
        
        // Evento submit del formulario para añadir noticia
        document.querySelector('main form:nth-of-type(2)').addEventListener('submit', (event) => this.addNoticia(event));
    }

    readInputFile(event) {
        const file = event.target.files[0];
        if (!file) {
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const contents = e.target.result;
            this.displayNoticias(contents);
        };

        reader.readAsText(file);
    }

    displayNoticias(contents) {
        // Mostrar el h2 de "Últimas noticias"
        document.querySelector('main section > h2').setAttribute('data-state', 'visible');

        const lines = contents.split('\n');
        lines.forEach(line => {
            const [titular, entradilla, autor] = line.split('_');
            const noticiaHtml = `
                <article>
                    <header>
                        <h2>${titular}</h2>
                    </header>
                    <p>${entradilla}</p>
                    <footer>
                        <p><em>${autor}</em></p>
                    </footer>
                </article>
            `;
            document.querySelector('main section').insertAdjacentHTML('beforeend', noticiaHtml);
        });
    }

    addNoticia(event) {
        event.preventDefault();

        // Mostrar el h2 de "Últimas noticias"
        document.querySelector('main section > h2').setAttribute('data-state', 'visible');

        // Obtener valores de los campos del formulario
        const titular = document.querySelector('input[placeholder="Titular"]').value;
        const entradilla = document.querySelector('input[placeholder="Contenido"]').value;
        const autor = document.querySelector('input[placeholder="Autor"]').value;

        const noticiaHtml = `
            <article>
                <header>
                    <h2>${titular}</h2>
                </header>
                <p>${entradilla}</p>
                <footer>
                    <p><em>${autor}</em></p>
                </footer>
            </article>
        `;
    
        // Añadir la noticia al contenedor de noticias
        document.querySelector('main section').insertAdjacentHTML('beforeend', noticiaHtml);

        // Limpiar los campos del formulario después de añadir la noticia
        document.querySelector('form').reset();
    }
}