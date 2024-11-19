class Viajes {
    constructor() {
        this.latitude = null;
        this.longitude = null;
        this.error = null;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this.setPosition.bind(this),
                this.handleError.bind(this)
            );
        } else {
            this.error = "Geolocation is not supported by this browser.";
        }
    }

    setPosition(position) {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.showStaticMap();
        this.showDynamicMap();
    }

    handleError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.error = "User denied the request for Geolocation.";
                break;
            case error.POSITION_UNAVAILABLE:
                this.error = "Location information is unavailable.";
                break;
            case error.TIMEOUT:
                this.error = "The request to get user location timed out.";
                break;
            case error.UNKNOWN_ERROR:
                this.error = "An unknown error occurred.";
                break;
        }
    }

    showStaticMap() {
        // Get the static map image
        const mapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${this.latitude},${this.longitude}&zoom=14&size=400x400&key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU`;
        
        // Create a new image element and set its attributes
        const img = document.createElement('img');
        img.src = mapUrl;
        img.alt = "Ubicación actual";
        img.setAttribute('data-map', 'static-map');

        const div = document.querySelector('main > div');
        const main = document.querySelector('main');

        // Append the image to the main element
        main.insertBefore(img, div);
    }

    showDynamicMap() {
        // Get the dynamic map div and create a new map
        const map = new google.maps.Map(document.querySelector('main > div'), {
            center: { lat: this.latitude, lng: this.longitude },
            zoom: 14
        });

        // Create a new marker and set its position
        new google.maps.Marker({
            position: { lat: this.latitude, lng: this.longitude },
            map: map,
            title: "Ubicación actual"
        });
    }
}