class Viajes {
    constructor() {
        this.latitude = null;
        this.longitude = null;
        this.error = null;

        // Crear un botón para iniciar la geolocalización
        this.createGeolocationButton();
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
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&zoom=14&size=400x400&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU`;

        const img = document.createElement('img');
        img.src = mapUrl;
        img.alt = "Ubicación actual";
        img.setAttribute('data-map', 'static-map');

        const div = document.querySelector('main > div');
        const main = document.querySelector('main');
        main.insertBefore(img, div);
    }

    showDynamicMap() {
        const map = new google.maps.Map(document.querySelector('main > div'), {
            center: { lat: this.latitude, lng: this.longitude },
            zoom: 14
        });

        new google.maps.Marker({
            position: { lat: this.latitude, lng: this.longitude },
            map: map,
            title: "Ubicación actual"
        });
    }
}
