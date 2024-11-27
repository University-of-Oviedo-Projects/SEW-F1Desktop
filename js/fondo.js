class Fondo {
    constructor(pais, capital, circuito) {
        console.log("Creando una instancia de Fondo..."); 
        this.pais = pais;
        this.capital = capital;
        this.circuito = circuito;
        this.getFondo();
    }

    // Método para realizar la consulta AJAX
    getFondo() {
        var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        $.getJSON(flickrAPI, 
        {
            tags: this.circuito + ", F1, Formula 1, ",
            tagmode: "all",
            format: "json"
        }).done(function(data) {
            $("body").css({
                "background-image": `url(${data.items[0].media.m.replace('_m', '_b')})`,
                "height": "100vh",
                "width": "100vw",
                "background-size": "cover",
                "background-repeat": "no-repeat",
                "background-position": "center"
            });
        });
    }
}
