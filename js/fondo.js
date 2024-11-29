class Fondo {
    constructor(pais, capital, circuito) {
        this.pais = pais;
        this.capital = capital;
        this.circuito = circuito;
        this.getFondo();

        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
              socket.close(); 
            }
        });
    }

    // Método para realizar la consulta AJAX
    getFondo() {
        var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        $.getJSON(flickrAPI, 
        {
            tags: this.circuito,
            tagmode: "all",
            format: "json"
        }).done(function(data) {
            if (data.items && data.items.length > 0) {
                $("body").css({
                    "background-image": `url(${data.items[0].media.m.replace('_m', '_b')})`,
                    "height": "100vh",
                    "width": "100vw",
                    "background-size": "cover",
                    "background-repeat": "no-repeat",
                    "background-position": "center"
                });
            } else {
                console.error("No se encontraron imágenes.");
            }
        }).fail(function() {
            console.error("Error al realizar la consulta AJAX.");
        });
    }
}
