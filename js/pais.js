class Pais {
    constructor(nombre_pais, nombre_capital, poblacion){
        this.nombre_pais = nombre_pais;
        this.nombre_capital = nombre_capital;
        this.poblacion = poblacion;
        this.rellenarInformacion();
        this.obtenerPrevisionTiempo();

        document.querySelector("aside").innerHTML += this.getAllInformation();
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
        return `Religión mayoritaria: ${this.religion_mayoritaria}`;
    }


    rellenarInformacion() {
        this.nombre_circuito = "Zandvoort";;
        this.forma_gobierno = "Monarquía parlamentaria";
        this.coord_meta = "4.5408, 52.3889, 17.84";
        this.religion = "Catolica";
    }

    obtenerInfoPrincipal() {
        return  this.obtenerNombrePais() + ', ' + this.obtenerCapitalPais;
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
                <li>Religión mayoritaria: ${this.religion_mayoritaria}</li>
            </ul> `;
    }

    getAllInformation() {
        return `
            <ul>
                <li>${this.obtenerNombrePais()}</li>
                <li>${this.obtenerCapitalPais()}</li>
                <li>${this.obtenerPoblacionPais()}</li>
                <li>${this.obtenerNombreCircuito()}</li>
                <li>${this.obtenerFormaGobierno()}</li>
                <li>${this.obtenerCoordMeta()}</li>
                <li>${this.obtenerReligionMayoritaria()}</li>
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
                $('article').remove(); // Eliminar artículos anteriores
    
                // Usamos un objeto para guardar las previsiones por día
                let previsionesPorDia = {};
    
                $(data).find('time').each(function(index, element) {
                    const date = $(element).attr('from').split('T')[0]; // Obtener solo la fecha, sin la hora
    
                    // Solo agregamos la previsión si no existe ya para ese día
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
    
                let dayCount = 0; // Contador para asegurarnos de que solo mostramos previsión de 5 días
                for (const date in previsionesPorDia) {
                    if (dayCount >= 5) return; // Limitar a solo 5 días
                    const previs = previsionesPorDia[date];
    
                    const article = $('<article></article>');
                    const header = $('<header></header>');
                    header.append(`<h2>${previs.date}</h2>`);
                    article.append(header);
                    article.append(`<p>Temperatura Máxima: ${previs.tempMax}°C</p>`);
                    article.append(`<p>Temperatura Mínima: ${previs.tempMin}°C</p>`);
                    article.append(`<p>Humedad: ${previs.humidity}%</p>`);
                    article.append(`<img src="https://openweathermap.org/img/w/${previs.icon}.png" alt="Icono del tiempo">`);
                    article.append(`<p>Precipitación: ${previs.rain} mm</p>`);
    
                    // Insertar el artículo antes del footer
                    $('footer').before(article); 
    
                    dayCount++; // Incrementar el contador de días
                }
            },
            error: function(error) {
                console.error('Error al obtener la previsión del tiempo:', error);
            }
        });
    }    
}