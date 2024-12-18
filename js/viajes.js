class Viajes {
    constructor() {
        this.latitude = null;
        this.longitude = null;
        this.error = null;
        
        this.createGeolocationButton();
        this.initializeCarousel();
    }    

    createGeolocationButton() {
        const button = document.createElement("button");
        button.textContent = "Mostrar mi ubicación";
        const h2 = document.querySelector("main > h2");
        h2.insertAdjacentElement("afterend", button);
        button.addEventListener("click", this.loadGoogleMaps.bind(this));
    }

    loadGoogleMaps() {
        const script = document.createElement('script');
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDfmip4lu4OXDuJ-DSiuoXLYb26CCQQEGk&callback=initMap&loading=async&libraries=marker";
        script.defer = true;
        
        window.initMap = () => {
            this.requestLocation(); 
        };

        script.onerror = () => {
            this.error = "Ocurrió un error al cargar Google Maps.";
            const p = document.createElement('p');
            p.textContent = this.error;
            document.querySelector('main').insertBefore(p, document.querySelector('main > div'));
            setTimeout(() => { p.remove(); }, 4000);
        }
    
        document.head.appendChild(script); 
    }  

    requestLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this.setPosition.bind(this),
                this.handleError.bind(this)
            );
        } else {
            this.error = "La geolocalización no es compatible con este navegador.";
            const p = document.createElement('p');
            p.textContent = this.error;
            document.querySelector('main').insertBefore(p, document.querySelector('main > div'));
            setTimeout(() => { p.remove(); }, 4000);
        }
    }

    setPosition(position) {
        document.querySelector('main > div').removeAttribute('hidden')
        document.querySelector('main > button').remove();   

        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.showStaticMap();
        this.showDynamicMap();
    }

    handleError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.error = "El usuario denegó la solicitud de geolocalización.";
                break;
            case error.POSITION_UNAVAILABLE:
                this.error = "La información de ubicación no está disponible.";
                break;
            case error.TIMEOUT:
                this.error = "La solicitud de geolocalización ha caducado.";
                break;
            default:
                this.error = "Ocurrió un error desconocido.";
                break;
        }

        const p = document.createElement('p');
        p.textContent = this.error;
        document.querySelector('main').insertBefore(p, document.querySelector('main > div'));
        setTimeout(() => { p.remove(); }, 4000);
    }

    showStaticMap() {
        const apiKey = "AIzaSyDfmip4lu4OXDuJ-DSiuoXLYb26CCQQEGk";
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&zoom=17&size=800x800&scale=4&markers=color:red%7C${this.latitude},${this.longitude}&key=${apiKey}`;
    
        let img = document.createElement('img');
        img.src = mapUrl;
        img.alt = "Ubicación actual";
    
        const div = document.querySelector('main > div');
        document.querySelector('main').insertBefore(img, div);
    }
    
    showDynamicMap() {
        let divDynamic = document.querySelector('main > div');
        let article = document.querySelector('main > article');
    
        if (!divDynamic) {
            divDynamic = document.createElement('div');
            document.querySelector('main').insertBefore(divDynamic, article);
        }
    
        const map = new google.maps.Map(divDynamic, {
            center: { lat: this.latitude, lng: this.longitude },
            zoom: 12,
            mapId: 'f1b7b3b3b1b3b1b3',
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
    
        new google.maps.marker.AdvancedMarkerElement({
            map: map,
            position: { lat: this.latitude, lng: this.longitude },            
            title: "Ubicación actual"
        });
    }

    initializeCarousel() {
        const script = document.createElement('script');
        script.src = "https://code.jquery.com/jquery-3.6.0.min.js";
        
        script.onload = () => {
            const slides = document.querySelectorAll("img");
            const nextSlide = document.querySelector("main > article > button");

            let curSlide = 3;
            let maxSlide = slides.length - 1;

            nextSlide.addEventListener("click", function () {
                if (curSlide === maxSlide) {
                    curSlide = 0;
                } else {
                    curSlide++;
                }

                slides.forEach((slide, indx) => {
                    var trans = 100 * (indx - curSlide);
                    $(slide).css('transform', 'translateX(' + trans + '%)');
                });
            });

            const prevSlide = document.querySelector("button:nth-of-type(2)");

            prevSlide.addEventListener("click", function () {
                if (curSlide === 0) {
                    curSlide = maxSlide;
                } else {
                    curSlide--;
                }

                slides.forEach((slide, indx) => {
                    var trans = 100 * (indx - curSlide);
                    $(slide).css('transform', 'translateX(' + trans + '%)');
                });
            });
        }
    
        document.head.appendChild(script);
    }
}    