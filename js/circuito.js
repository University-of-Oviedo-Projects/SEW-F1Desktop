class ProcesamientoCircuitos {
    constructor() {
        document.querySelectorAll("main section")
            .forEach(section => section.setAttribute("data-state", "hidden"));
    }

    procesarArchivoXML(archivo) {
        const lector = new FileReader();
        
        lector.onload = (e) => {
            const contenidoXML = e.target.result;
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(contenidoXML, "application/xml");

            // Verificar si hay errores en el XML
            const parseError = xmlDoc.querySelector("parsererror");
            if (parseError) {
                document.querySelector("main section:nth-of-type(1)").innerText = "Error al parsear el XML";
                return;
            }

            // Procesar y mostrar el contenido del XML
            this.mostrarContenidoXML(xmlDoc);
        };

        lector.readAsText(archivo);
    }

    // Método para mostrar el contenido del archivo XML en el HTML
    mostrarContenidoXML(xmlDoc) {
        document.querySelector("main > section").setAttribute("data-state", "visible");
        const contenedor = document.querySelector("main > section");

        // Función auxiliar para crear elementos de texto
        const añadirElemento = (contenedor, titulo, valor) => {
            const p = document.createElement("p");
            p.textContent = `${titulo}: ${valor}`;
            contenedor.appendChild(p);
        };

        // Acceder a los nodos XML y mostrar su contenido
        const nombre = xmlDoc.querySelector("nombre")?.textContent;
        const longitudCircuito = xmlDoc.querySelector("longitud_circuito")?.textContent;
        const anchuraMedia = xmlDoc.querySelector("anchura_media")?.textContent;
        const fechaCarrera = xmlDoc.querySelector("fecha_carrera_2024")?.textContent;
        const horaComienzo = xmlDoc.querySelector("hora_comienzo_Esp")?.textContent;
        const vueltas = xmlDoc.querySelector("vueltas")?.textContent;
        const ciudad = xmlDoc.querySelector("ciudad")?.textContent;
        const pais = xmlDoc.querySelector("pais")?.textContent;

        if (nombre) añadirElemento(contenedor, "Nombre", nombre);
        if (longitudCircuito) añadirElemento(contenedor, "Longitud del Circuito", longitudCircuito);
        if (anchuraMedia) añadirElemento(contenedor, "Anchura Media", anchuraMedia);
        if (fechaCarrera) añadirElemento(contenedor, "Fecha de Carrera 2024", fechaCarrera);
        if (horaComienzo) añadirElemento(contenedor, "Hora de Comienzo", horaComienzo);
        if (vueltas)añadirElemento(contenedor, "Vueltas", vueltas);
        if (ciudad) añadirElemento(contenedor, "Ciudad", ciudad);
        if (pais) añadirElemento(contenedor, "País", pais);

        // Mostrar referencias
        const referencias = xmlDoc.querySelector("referencias");
        if (referencias) {
            const ref1 = document.createElement("a");
            ref1.href = referencias.getAttribute('enlace1');
            ref1.textContent = "Enlace 1";
            contenedor.appendChild(ref1);
            const ref2 = document.createElement("a");
            ref2.href = referencias.getAttribute('enlace2');
            ref2.textContent = "Enlace 2";
            contenedor.appendChild(ref2);
            const ref3 = document.createElement("a");
            ref3.href = referencias.getAttribute('enlace3');
            ref3.textContent = "Enlace 3";
            contenedor.appendChild(ref3);
        }

        // Mostrar fotos
        const fotos = xmlDoc.querySelector("fotos");
        if (fotos) {
            const img1 = document.createElement("img");
            img1.src = fotos.getAttribute('enlace1');
            img1.alt = "Foto 1";
            contenedor.appendChild(img1);
            const img2 = document.createElement("img");
            img2.src = fotos.getAttribute('enlace2');
            img2.alt = "Foto 2";
            contenedor.appendChild(img2);
            const img3 = document.createElement("img");
            img3.src = fotos.getAttribute('enlace3');
            img3.alt = "Foto 3";
            contenedor.appendChild(img3);
        }

        // Mostrar videos
        const videos = xmlDoc.querySelector("videos");
        if (videos) {
            const video1 = document.createElement("video");
            video1.src = videos.getAttribute('enlace1');
            video1.controls = true;
            contenedor.appendChild(video1);
            const video2 = document.createElement("video");
            video2.src = videos.getAttribute('enlace2');
            video2.controls = true;
            contenedor.appendChild(video2);
            const video3 = document.createElement("video");
            video3.src = videos.getAttribute('enlace3');
            video3.controls = true;
            contenedor.appendChild(video3);
        }

        // Mostrar centro de pista
        const centroPista = xmlDoc.querySelector("centro-pista > coordenada");
        if (centroPista) {
            const longitud = centroPista.querySelector("longitud")?.textContent;
            const latitud = centroPista.querySelector("latitud")?.textContent;
            const altitud = centroPista.querySelector("altitud")?.textContent;
            añadirElemento(contenedor, "Centro de Pista", `Longitud: ${longitud}, Latitud: ${latitud}, Altitud: ${altitud}`);
        }

        // Mostrar puntos
        const puntos = xmlDoc.querySelectorAll("puntos > tramo");
        puntos.forEach((tramo, index) => {
            const distancia = tramo.getAttribute("distancia");
            const sector = tramo.getAttribute("sector");
            const longitud = tramo.querySelector("longitud")?.textContent;
            const latitud = tramo.querySelector("latitud")?.textContent;
            const altitud = tramo.querySelector("altitud")?.textContent;
            añadirElemento(contenedor, `Tramo ${index + 1}`, `Distancia: ${distancia}, Sector: ${sector}, Longitud: ${longitud}, Latitud: ${latitud}, Altitud: ${altitud}`);
        });
    }

    // Método para procesar archivos KML
    procesarArchivoKML(archivo) {
        const h3 = document.createElement("h3");
        h3.textContent = "Contenido del archivo KML";
        const div = document.createElement("div");
        const formKML = document.querySelector("main form:nth-of-type(3)");
        const main = document.querySelector("main");
        main.insertBefore(h3, formKML);
        main.insertBefore(div, formKML);

        const lector = new FileReader();
        const coordinates = [];
            
        lector.onload = (e) => {
            const contenidoKML = e.target.result;
            const parser = new DOMParser();
            const kmlDoc = parser.parseFromString(contenidoKML, "application/xml");
            
            // Verificar si hay errores en el KML
            const parseError = kmlDoc.querySelector("parsererror");
            if (parseError) {
                document.querySelector("main > div").innerText = "Error al parsear el KML";
                return;
            }

            const coordinateNodes = kmlDoc.getElementsByTagName("coordinates");

            if(coordinateNodes.length > 0) {
                const coordText = coordinateNodes[0].textContent.trim();
                const coordinatesArray = coordText.split(/\s+/);

                coordinatesArray.forEach(pair => {
                    const [lng, lat] = pair.split(",").map(parseFloat);
                    coordinates.push({ lat, lng });
                });
            }

            this.mostrarContenidoKML(coordinates);
        
        };

        lector.readAsText(archivo);
    }

    // Método para mostrar el contenido del archivo KML en el HTML
    mostrarContenidoKML(coordinates) {
        // Verificar que el contenedor del mapa está disponible
        var mapDiv = document.querySelector("main > div");

        // Crear el mapa
        var map = new google.maps.Map(mapDiv, {
            zoom: 10,
            center: coordinates.length > 0 ? coordinates[0] : { lat: 0, lng: 0 }
        });

        // Crear la polilínea
        const spaPolyline = new google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 4
        });

        // Añadir la polilínea al mapa
        spaPolyline.setMap(map);

        // Ajustar los límites del mapa
        const bounds = new google.maps.LatLngBounds();
        coordinates.forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds);

        document.querySelector("main > div").setAttribute("data-state", "visible");
    }    
    
    // Método para procesar archivos SVG
    procesarArchivoSVG(archivo) {
        const h3 = document.createElement("h3");
        h3.textContent = "Contenido del archivo SVG";
        document.querySelector("main").appendChild(h3);

        const lector = new FileReader();            
        lector.onload = (e) => {
            const contenidoSVG = e.target.result;
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(contenidoSVG, "image/svg+xml");
            // Verificar si hay errores en el SVG
            const parseError = svgDoc.querySelector("parsererror");
            if (parseError) {
                document.querySelector("main").innerText = "Error al parsear el SVG";
                return;
            }
            // Procesar y mostrar el contenido del SVG
            this.mostrarContenidoSVG(svgDoc);
        };
        lector.readAsText(archivo);
    }
    

    // Método para mostrar el contenido del archivo SVG en el HTML
    mostrarContenidoSVG(svgDoc) {
        const contenedor = document.querySelector("main");
        const svgElement = svgDoc.documentElement;        
        const viewBox = svgElement.getAttribute("viewBox");

        if (!viewBox) {
            const width = svgElement.getAttribute("width") || svgElement.clientWidth;
            const height = svgElement.getAttribute("height") || svgElement.clientHeight;
            svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`);
        }

        contenedor.appendChild(svgElement);
    }
}