class Viajes {
    constructor() {
        this.latitude = null;
        this.longitude = null;
        this.error = null;

        // Crear un botón para iniciar la geolocalización
        this.createGeolocationButton();

        // Inicializar el carrusel
        this.initializeCarousel();
    }

    createGeolocationButton() {
        const button = document.createElement("button");
        button.textContent = "Mostrar mi ubicación";
        button.addEventListener("click", this.requestLocation.bind(this));
        const h2 = document.querySelector("main > h2");
        h2.insertAdjacentElement("afterend", button);
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
        document.querySelector('main > button').setAttribute('data-state', 'hidden');
        
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
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&zoom=17&size=800x800&scale=4&markers=color:red%7C${this.latitude},${this.longitude}&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU`;
    
        const img = document.createElement('img');
        img.src = mapUrl;
        img.alt = "Ubicación actual";
        img.setAttribute('data-map', 'static-map');
    
        let div = document.querySelector('main > div');
        let article = document.querySelector('main > article');

        if (!div) {
            div = document.createElement('div');
            document.querySelector('main').insertBefore(div, article);
        }
        document.querySelector('main').insertBefore(img, article);
    }

    showDynamicMap() {
        let div = document.querySelector('main > div');
        let article = document.querySelector('main > article');

        if (!div) {
            div = document.createElement('div');
            document.querySelector('main').insertBefore(article, div);
        }

        const map = new google.maps.Map(div, {
            center: { lat: this.latitude, lng: this.longitude },
            zoom: 14
        });

        new google.maps.Marker({
            position: { lat: this.latitude, lng: this.longitude },
            map: map,
            title: "Ubicación actual"
        });
    }

    initializeCarousel() {
        const slides = document.querySelectorAll("img");
        const nextSlide = document.querySelector("main > article > button");

        let curSlide = 3;
        let maxSlide = slides.length - 1;

        nextSlide.addEventListener("click", function () {
            // check if current slide is the last and reset current slide
            if (curSlide === maxSlide) {
                curSlide = 0;
            } else {
                curSlide++;
            }

            //   move slide by -100%
            slides.forEach((slide, indx) => {
                var trans = 100 * (indx - curSlide);
                $(slide).css('transform', 'translateX(' + trans + '%)')
            });
        });

        const prevSlide = document.querySelector("button:nth-of-type(2)");
        prevSlide.addEventListener("click", function () {
            // check if current slide is the first and reset current slide to last
            if (curSlide === 0) {
                curSlide = maxSlide;
            } else {
                curSlide--;
            }

            //   move slide by 100%
            slides.forEach((slide, indx) => {
                var trans = 100 * (indx - curSlide);
                $(slide).css('transform', 'translateX(' + trans + '%)')
            });
        })
    }
}