<!DOCTYPE html>

<?php
    class Carrusel {
        private $capital;
        private $pais;
        private $fotos;

        public function __construct($capital, $pais) {
            $this->capital = $capital;
            $this->pais = $pais;
            $this->fotos = [];
        }

        public function fetchfotos() {
            $apiKey = 'aef049db4852b23d7b6f7303dfc8e7f2';
            $url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=$apiKey&tags=" . urlencode($this->pais) . "&per_page=10&format=json&nojsoncallback=1";
            
            $response = file_get_contents($url);
            if ($response === false) {
                echo "No se pudo conectar con la API de Flickr.";
                return;
            }
        
            $data = json_decode($response, true);
            if (!isset($data['photos']['photo'])) { 
                echo "No se encontraron fotos para el país especificado.";
                return;
            }
        
            foreach ($data['photos']['photo'] as $photo) { 
                $photoUrl = "https://farm{$photo['farm']}.staticflickr.com/{$photo['server']}/{$photo['id']}_{$photo['secret']}.jpg";
                $this->fotos[] = $photoUrl;
            }
        }
        
        public function renderizarCarrusel() {
            foreach ($this->fotos as $foto) {
                echo "<img src=\"$foto\" alt=\"Foto de $this->pais\" />";
            }
        }
    }       
?>

<html lang="es">
    <head>
        <meta charset="utf-8" />
        <meta name="author" content="Adrián Martínez" />
        <meta name="description" content="Una página web que emula a la pagina web de la Formula 1, 
            incluyendo informacion sobre un piloto asignado, los circuitos, la meteorologia, 
            las noticias, los viajes y juegos." />
        <meta name="keywords" content="Formula 1, Ocon, Carreras, Coches">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>F1 Desktop</title>
        <link rel="icon" type="image/x-icon" href="multimedia/imagenes/favicon-16x16.png">
        
        <!-- Preload de los estilos -->
        <link rel="preload" href="../estilo/layout.css" as="style">
        <link rel="preload" href="../estilo/estilo.css" as="style">

        <!-- Después de que se haya descargado, se aplica el CSS -->
        <link rel="stylesheet" href="../estilo/layout.css">
        <link rel="stylesheet" href="../estilo/estilo.css">

        <!-- Este script carga Google Maps de manera correcta, sin el atributo charset -->
        <script defer async 
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC6j4mF6blrc4kZ54S6vYZ2_FpMY9VzyRU" >
        </script>

        <!-- Añadir referencia a jQuery -->
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

        <!-- Slick Carousel -->
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.css"/>
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick-theme.min.css"/>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.8.1/slick.min.js"></script>

        <!-- Añadir referencia al archivo viajes.js -->
        <script src="../js/viajes.js"></script>

        <!-- Añadir referencia al archivo ayuda.js -->
        <script src="../js/ayuda.js"></script>

        <style>
            article {
                width: 100%;
                max-width: 100vh;
                height: 70vh;
                position: relative;
                overflow: hidden; 
                margin: 2em auto;
                border-radius: 1em;
            }

            article h3 {
                width: 100%;
                text-align: center;
                margin-bottom: 0.5em;
                font-size: 2em;
            }

            main > article img {
                width: 100%;
                max-width: 100vh;
                height: 60vh;
                position: absolute;
                transition: all 0.5s;
                object-fit: cover;
                border-radius: 0.5em;
            }

            main > article button {
                position: absolute;
                width: 2em;
                height: 2em;
                padding: 0.5em;
                border: none;
                border-radius: 50%;
                z-index: 10;
                cursor: pointer;
                background-color: #fff;
                font-size: 1em;
                display: flex;
                flex-direction: column;
                align-items:center;
                justify-content: center;
            }

            main > article button:active {
                transform: scale(1.1);
            }

            main > article button:nth-of-type(2) {
                top: 50%;
                left: 2%;
            }

            main > article button:nth-of-type(1) {
                top: 50%;
                right: 2%;
            }
        </style>
    </head>

    <body>
        <header>
            <h1><a href="index.html">F1 Desktop</a></h1>

            <nav>
                <a href="../index.html">Home </a>
                <a href="../piloto.html">Piloto </a>
                <a href="../noticias.html">Noticias </a>
                <a href="../meteorologia.html">Meteorologia </a>
                <a href="viajes.php">Viajes </a>
                <a href="../calendario.html">Calendario </a>
                <a href="../circuitos.html">Circuitos </a>
                <a href="../juegos.html">Juegos </a>
            </nav>
        </header>

        <p>Estas en <a href="index.html" title="Home">Inicio</a> 
            >> <a href="viajes.html" title="Viajes">Viajes</a><p>

        <main data-pages="mapa">
            <h2>Mapas estáticos y dinámicos</h2>
            <!--<div></div>-->

            <article>
                <header>
                    <h2>Carrusel</h2>
                </header>

                <?php
                    $carousel = new Carrusel('Amsterdam', 'Netherlands');
                    $carousel->fetchfotos();
                    $carousel->renderizarCarrusel();
                ?>

                <button> &gt; </button>
                <button> &lt; </button>
            </article>
        </main>

        <!-- Pie de página -->
        <footer>
            <!-- Botón para abrir el popup de ayuda -->
            <button>Ayuda</button>
            <!-- Información del autor -->
            <p>&copy; Adrián Martínez, F1 Desktop</p>
        </footer>

        <!-- Popup de ayuda -->
        <dialog>
            <!-- Contenido de la ayuda -->
            <section>
                <h2>Bienvenido a la ayuda web de F1Destkop</h2>
            </section>
        </dialog> 
           
        <!-- Script para cargar la ayuda -->
        <script>
            document.addEventListener("DOMContentLoaded", () => {
                new Viajes();
                new HelpHandler(); 
            });
        </script>
    </body>
</html>