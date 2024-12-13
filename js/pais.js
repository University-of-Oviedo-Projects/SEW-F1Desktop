class Pais {
    constructor(nombre_pais, nombre_capital, poblacion){
        this.nombre_pais = nombre_pais;
        this.nombre_capital = nombre_capital;
        this.poblacion = poblacion;

        this.rellenarInformacion();
        this.obtenerPrevisionTiempo();
    }

    get nombrePais() {
        return this.nombre_pais;
    }

    get nombreCapital() {
        return this.nombre_capital;
    }

    get poblacionPais() {
        return this.poblacion;
    }

    get nombreCircuito() {
        return this.nombre_circuito;
    }

    get formaGobierno() {
        return this.forma_gobierno;
    }

    get coordMeta() {
        return this.coord_meta;
    }

    obtenerNombrePais() {
        return `Nombre del país: ${this.nombre_pais}`;
    }

    obtenerCapitalPais() {
        return `Capital del país: ${this.nombre_capital}`;
    }

    obtenerPoblacionPais() {
        return `Población: ${this.poblacion}`;
    }

    obtenerPoblacionPais() {
        return `Población: ${this.poblacion}`;
    }

    obtenerNombreCircuito() {
        return `Nombre del circuito: ${this.nombre_circuito}`;
    }

    obtenerFormaGobierno() {
        return `Forma de gobierno: ${this.forma_gobierno}`;
    }

    obtenerCoordMeta() {
        return `Coordenadas de la meta: ${this.coord_meta}`;
    }

    obtenerReligionMayoritaria() {
        return `Religión mayoritaria: ${this.religion}`;
    }

    rellenarInformacion() {
        this.nombre_circuito = "Zandvoort";;
        this.forma_gobierno = "Monarquía parlamentaria";
        this.coord_meta = "4.5408, 52.3889, 17.84";
        this.religion = "Catolica";
    }

    obtenerInfoPrincipal() {
        return this.obtenerNombrePais() + ', ' + this.obtenerCapitalPais();
    }
    
    // Escribir información en el HTML
    mostrarInfoEnHTML() {
        const parrafo = document.createElement("p");
        parrafo.textContent =  this.coordMeta();
        document.body.appendChild(parrafo);
    }

    obtenerInfoSecundariaHTML() {
        return `
            <ul>
                <li>Nombre del circuito: ${this.nombre_circuito}</li>
                <li>Población: ${this.poblacion}</li>
                <li>Forma de gobierno: ${this.forma_gobierno}</li>
                <li>Religión mayoritaria: ${this.religion}</li>
            </ul> `;
    }

    getAllInformation() {
        return `
            <h3>Información del país</h3>

            <ul>
                <li>Nombre del país: ${this.nombre_pais}</li>
                <li>Nombre del circuito: ${this.nombre_circuito}</li>
                <li>Capital del país: ${this.nombre_capital}</li>
                <li>Población: ${this.poblacion}</li>
                <li>Forma de gobierno: ${this.forma_gobierno}</li>
                <li>Coordenadas de la meta: ${this.coord_meta}</li>
                <li>Religión mayoritaria: ${this.religion}</li>
            </ul>
        `;
    }

    obtenerPrevisionTiempo() {
        const apiKey = 'b499a8f7f2a8275193568c88d9a158bf';
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${this.nombre_circuito}&mode=xml&lang=es&units=metric&appid=${apiKey}`;
        
        $.ajax({
            url: url,
            method: 'GET',
            success: function(data) {
                $('article').remove();
                let previsionesPorDia = {};
    
                $(data).find('time').each(function(index, element) {
                    const date = $(element).attr('from').split('T')[0]; 

                    if (!previsionesPorDia[date]) {
                        previsionesPorDia[date] = {
                            date: date,
                            tempMax: $(element).find('temperature').attr('max'),
                            tempMin: $(element).find('temperature').attr('min'),
                            humidity: $(element).find('humidity').attr('value'),
                            icon: $(element).find('symbol').attr('var'),
                            rain: $(element).find('precipitation').attr('value') || 0
                        };
                    }
                });
    
                let dayCount = 0; 
                for (const date in previsionesPorDia) {
                    if (dayCount >= 5) return; 
                    const previs = previsionesPorDia[date];
    
                    const article = $('<article></article>');
                    const header = $('<header></header>');
                    const h3 = $('<h3></h3>');
                    h3.text(previs.date);
                    header.append(h3);
                    article.append(header);
                    const p1 = $('<p></p>');
                    p1.text(`Temperatura Máxima: ${previs.tempMax}°C`);
                    article.append(p1);
                    const p2 = $('<p></p>');
                    p2.text(`Temperatura Mínima: ${previs.tempMin}°C`);
                    article.append(p2);
                    const p3 = $('<p></p>');
                    p3.text(`Humedad: ${previs.humidity}%`);
                    article.append(p3);
                    const img = $('<img></img>');
                    img.attr('src', `https://openweathermap.org/img/w/${previs.icon}.png`);
                    img.attr('alt', 'Icono del tiempo');
                    article.append(img);
                    const p4 = $('<p></p>');
                    p4.text(`Precipitación: ${previs.rain} mm`);
                    article.append(p4);

                    $('main').append(article);
                    dayCount++; // Incrementar el contador de días
                }
            },
            error: function(error) { // No hacer nada en caso de error 
                }
        });
    }    
}