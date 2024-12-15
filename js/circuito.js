class ProcesamientoCircuitos {
    constructor() {
        const xmlFileInput = document.querySelector('main form:nth-of-type(1) input[type="file"]');
        const kmlFileInput = document.querySelector('main form:nth-of-type(2) input[type="file"]');
        const svgFileInput = document.querySelector('main form:nth-of-type(3) input[type="file"]');

        xmlFileInput.addEventListener("change", () => {
            this.procesarArchivoXML(xmlFileInput.files[0]);
        });

        kmlFileInput.addEventListener("change", () => {
            this.procesarArchivoKML(kmlFileInput.files[0]);
        });

        svgFileInput.addEventListener("change", () => {
            this.procesarArchivoSVG(svgFileInput.files[0]);
        });
        
        document.querySelectorAll("main section")
            .forEach(section => section.setAttribute("hidden", ''));
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

            this.mostrarContenidoXML(xmlDoc);
        };

        lector.readAsText(archivo);
    }

    mostrarContenidoXML(xmlDoc) {
        const section = document.createElement("section");
        const h3 = document.createElement("h3");
        h3.textContent = "Contenido del archivo XML";
        section.appendChild(h3);
        const kmlForm = document.querySelector("main form:nth-of-type(2)");
        document.querySelector("main").insertBefore(section, kmlForm);
        const contenedor = document.querySelector("main > section");

        const añadirElemento = (contenedor, titulo, valor) => {
            const p = document.createElement("p");
            p.textContent = `${titulo}: ${valor}`;
            contenedor.appendChild(p);
        };

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

        const centroPista = xmlDoc.querySelector("centro-pista > coordenada");
        if (centroPista) {
            const longitud = centroPista.querySelector("longitud")?.textContent;
            const latitud = centroPista.querySelector("latitud")?.textContent;
            const altitud = centroPista.querySelector("altitud")?.textContent;
            añadirElemento(contenedor, "Centro de Pista", `Longitud: ${longitud}, Latitud: ${latitud}, Altitud: ${altitud}`);
        }

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

    procesarArchivoKML(archivo) {
        const main = document.querySelector("main");
        const formKML = document.querySelector("main form:nth-of-type(3)");
        const h3 = document.createElement("h3");
        h3.textContent = "Contenido del archivo KML";
        const div = document.createElement("div");        
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

    mostrarContenidoKML(coordinates) {
        var mapDiv = document.querySelector("main > div");

        var map = new google.maps.Map(mapDiv, {
            zoom: 10,
            center: coordinates.length > 0 ? coordinates[0] : { lat: 0, lng: 0 }
        });

        const spaPolyline = new google.maps.Polyline({
            path: coordinates,
            geodesic: true,
            strokeColor: "#FF0000",
            strokeOpacity: 1.0,
            strokeWeight: 4
        });

        spaPolyline.setMap(map);
        const bounds = new google.maps.LatLngBounds();
        coordinates.forEach(coord => bounds.extend(coord));
        map.fitBounds(bounds);

        document.querySelector("main > div").removeAttribute('hidden');
    }    
    
    // Método para procesar archivos SVG
    procesarArchivoSVG(archivo) {
        const h3 = document.querySelector("main form:nth-of-type(3) + h3");
        if (h3) h3.remove();
        const svg = document.querySelector("main svg");
        if (svg) svg.remove();

        const h3New = document.createElement("h3");
        h3New.textContent = "Contenido del archivo SVG";
        document.querySelector("main").appendChild(h3New);
        const lector = new FileReader();       

        lector.onload = (e) => {
            const contenidoSVG = e.target.result;
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(contenidoSVG, "image/svg+xml");
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