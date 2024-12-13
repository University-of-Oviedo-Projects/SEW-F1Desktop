class Noticias {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            // El navegador soporta todas las APIs necesarias
        } else {
            const messageContainer = document.querySelector('body > main > section'); 
            const paragraph = document.createElement('p');
            paragraph.textContent = `La API de File no es soportada en este navegador.`;
            messageContainer.appendChild(paragraph);
            
            setTimeout(() => {
                paragraph.remove();
            }, 4000);     
        }

        document.querySelector('main > h2').setAttribute('hidden', '');

        document.querySelector('input[type="file"]')
            .addEventListener('change', (event) => this.readInputFile(event));
        
        document.querySelector('main form:nth-of-type(2)')
            .addEventListener('submit', (event) => this.addNoticia(event));
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
        document.querySelector('main > h2').removeAttribute('hidden');

        const lines = contents.split('\n');
        lines.forEach(line => {
            const [titular, entradilla, autor] = line.split('_');
            const noticiaHtml = document.createElement('article');
            const header = document.createElement('header');
            const h3 = document.createElement('h3');
            h3.textContent = titular;
            header.appendChild(h3);
            noticiaHtml.appendChild(header);
            const p = document.createElement('p');
            p.textContent = entradilla;
            noticiaHtml.appendChild(p);
            const footer = document.createElement('footer');
            const em = document.createElement('em');
            em.textContent = autor;
            footer.appendChild(em);
            noticiaHtml.appendChild(footer);

            const h2UltimasNoticias = document.querySelector('main h2');
            const main = document.querySelector('main');
            main.insertBefore(noticiaHtml, h2UltimasNoticias.nextSibling);
        });
    }

    addNoticia(event) {
        event.preventDefault();
        document.querySelector('main > h2').removeAttribute('hidden');

        const titular = document.querySelector('input[placeholder="Titular"]').value;
        const entradilla = document.querySelector('textarea[placeholder="Contenido"]').value;
        const autor = document.querySelector('input[placeholder="Autor"]').value;

        if(!titular || !entradilla || !autor) {
            return;
        }

        const noticiaHtml = document.createElement('article');
        const header = document.createElement('header');
        const h2 = document.createElement('h2');
        h2.textContent = titular;
        header.appendChild(h2);
        noticiaHtml.appendChild(header);
        const p = document.createElement('p');
        p.textContent = entradilla;
        noticiaHtml.appendChild(p);
        const footer = document.createElement('footer');
        const em = document.createElement('em');
        em.textContent = autor;
        footer.appendChild(em);
        noticiaHtml.appendChild(footer);

        const h2UltimasNoticias = document.querySelector('main h2');
        const main = document.querySelector('main');
        main.insertBefore(noticiaHtml, h2UltimasNoticias.nextSibling);

        // Limpiar los campos del formulario después de añadir la noticia
        const inputs = document.querySelectorAll('input[type="text"]');
        inputs.forEach(input => input.value = '');
    }
}