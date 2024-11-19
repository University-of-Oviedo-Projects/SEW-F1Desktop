class Fondo {
    constructor(pais, capital, circuito) {
        console.log("Creando una instancia de Fondo..."); 
        this.pais = pais;
        this.capital = capital;
        this.circuito = circuito;
        this.obtenerImagenCircuito();
    }

    obtenerImagenCircuito() {
        const apiKey = 'aef049db4852b23d7b6f7303dfc8e7f2';  // Tu API Key
        const url = 'https://api.flickr.com/services/rest/';
        
        const self = this;  // Referencia a 'this' para usar dentro de la función de éxito

        $.ajax({
            url: url,
            dataType: 'json',
            data: {
                method: 'flickr.photos.search',
                api_key: apiKey,
                text: self.circuito,  // Buscar por el nombre del circuito
                format: 'json',
                nojsoncallback: 1,
                per_page: 1,  // Obtener una sola imagen
                page: 1
            },
            success: function(data) {
                if (data.photos && data.photos.photo.length > 0) {
                    const photo = data.photos.photo[0];
                    const photoUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
                    
                    // Establecer la imagen como fondo en el body
                    $('body').css('background-image', `url(${photoUrl})`);
                    $('body').css('background-size', 'cover');  // Hacer que la imagen cubra toda la pantalla
                } else {
                    console.log('No se encontraron imágenes para el circuito:', self.circuito);
                }
            },
            error: function(error) {
                console.error('Error en la consulta a la API de Flickr:', error);
            }
        });
    }
}
