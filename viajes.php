<!--
    Este documento da errores de validación en el W3C Validator debido 
    a que se está utilizando la API de Google Maps,
    la cual introduce elementos que no siguen el estándar
-->
<!DOCTYPE html>

<?php
    class Carrusel {
        private $capital;
        private $pais;
        private $ciudad;
        private $fotos;
    
        public function __construct($capital, $pais) {
            $this->capital = $capital;
            $this->pais = $pais;
            $this->ciudad = "Zandvoort";
            $this->fotos = [];
        }
    
        public function fetchfotos() {
            $apiKey = 'aef049db4852b23d7b6f7303dfc8e7f2';
            $tags = urlencode("F1, " . $this->pais . ", " . $this->capital . "," . $this->ciudad);
            $url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=$apiKey&tags=$tags&per_page=5&format=json&nojsoncallback=1";
    
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Connection: keep-alive')); 
            $response = curl_exec($ch);
    
            if ($response === false) {
                echo "No se pudo conectar con la API de Flickr: " . curl_error($ch);
                curl_close($ch);
                return;
            }

            curl_close($ch);
            $data = json_decode($response, true);
    
            if (!isset($data['photos']['photo']) || count($data['photos']['photo']) == 0) {
                echo "No se encontraron fotos para el país especificado.";
                return;
            }
    
            foreach ($data['photos']['photo'] as $photo) {
                $photoUrl = "https://farm{$photo['farm']}.staticflickr.com/{$photo['server']}/{$photo['id']}_{$photo['secret']}_m.jpg"; 
                $this->fotos[] = $photoUrl;
            }
        }
    
        public function renderizarCarrusel() {
            foreach ($this->fotos as $index => $foto) {
                echo "<img src=\"$foto\" alt=\"Foto de $this->pais\" loading=\"lazy\" />";
            }
        }
    }
          
    class Moneda {
        private $baseCurrency;
        private $targetCurrency;
        private $apiKey = "fca_live_f978WHzGyG3KBNjyUovfpzQac2ILRUDselGWDbPG"; 
        public function __construct($baseCurrency, $targetCurrency) {
            $this->baseCurrency = $baseCurrency;
            $this->targetCurrency = $targetCurrency;
        }

        public function obtenerCambio() {
            $url = "https://api.freecurrencyapi.com/v1/latest?apikey={$this->apiKey}&base_currency={$this->baseCurrency}";
            
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            $response = curl_exec($ch);
            curl_close($ch);

            if ($response === false) {
                echo "No se pudo conectar con la API de Flickr.";
                return;
            }

            if ($response === FALSE) {
                throw new Exception("Error al conectar con el servicio de cambio de moneda.");
            }

            $data = json_decode($response, true);

            if (isset($data['data'][$this->targetCurrency])) {
                return $data['data'][$this->targetCurrency];
            } else {
                throw new Exception("No se encontró la tasa de cambio para {$this->targetCurrency}.");
            }
        }
    }
?>

<html lang="es">
    <head>
        <meta charset="utf-8" />
        <meta name="author" content="Adrián Martínez" />
        <meta name="description" content="Este documento ofrece un carrusel con imagenes sobre
            Países Bajos, mapas con la localizacion del usuario y un cambio de moneda de € a $" />
        <meta name="keywords" content="Formula 1, Ocon, Carreras, Coches">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>F1 Desktop</title>
        <link rel="icon" type="image/x-icon" href="multimedia/imagenes/favicon-16x16.png">
        
        <!-- Preload de los estilos -->
        <link rel="preload" href="estilo/layout.css" as="style">
        <link rel="preload" href="estilo/estilo.css" as="style">
        <link rel="preload" href="js/viajes.js" as="script">
        <link rel="preload" href="js/ayuda.js" as="script">

        <link rel="stylesheet" href="estilo/layout.css">
        <link rel="stylesheet" href="estilo/estilo.css">

        <script src="js/viajes.js"></script>
        <script src="js/ayuda.js" defer></script>

        <script>
            document.addEventListener("DOMContentLoaded", () => {
                new AyudaGlobal();
            });
        </script>
    </head>

    <body>
        <header>
            <h1><a href="index.html" target="_self" title="Pagina de inicio">F1 Desktop</a></h1>

            <nav>
                <a href="index.html" target="_self" title="Página principal de inicio, regresa a la página principal">Inicio</a>
                <a href="piloto.html" target="_self" title="Información sobre los pilotos">Piloto</a>
                <a href="noticias.html" target="_self" title="Últimas noticias y actualizaciones">Noticias</a>
                <a href="meteorologia.html" target="_self" title="Pronóstico meteorológico y condiciones climáticas">Meteorologia</a>
                <a class="active" href="viajes.php" target="_self" title="Información sobre viajes y destinos">Viajes</a>
                <a href="calendario.html" target="_self" title="Calendario de eventos y actividades">Calendario</a>
                <a href="circuitos.html" target="_self" title="Detalles sobre los circuitos y pistas">Circuitos</a>
                <a href="juegos.html" target="_self" title="Juegos y actividades interactivas">Juegos</a>
            </nav>
        </header>

        <p>Estas en <a href="index.html" target="_self" title="Pagina de inicio">F1 Desktop</a> >> Viajes</p>

        <button>Ayuda</button>
        <dialog> <!-- Ayuda Global --> </dialog>

        <main>
            <!-- Google Maps API -->
            <h2>Mapas estáticos y dinámicos</h2>
            <script>
                new Viajes()
            </script>
            <div hidden> <!-- Contenedor del mapa dinámico --> </div>

            <!-- Carrusel de imágenes -->
            <article>
                <h2>Carrusel</h2>
                <?php
                    $carousel = new Carrusel('Amsterdam', 'Netherlands');
                    $carousel->fetchfotos();
                    $carousel->renderizarCarrusel();
                ?>
                <button> &gt; </button>
                <button> &lt; </button>
            </article>

            <!-- Cambio de moneda -->
            <?php
                try {
                    $paisMoneda = "EUR"; 
                    $cambioMoneda = "USD";

                    $moneda = new Moneda($paisMoneda, $cambioMoneda);
                    $tasaCambio = $moneda->obtenerCambio();
                    $formattedTasaCambio = number_format($tasaCambio, 2);

                    echo "<p>Cambio de moneda: 1 {$paisMoneda} equivale a {$formattedTasaCambio} {$cambioMoneda}</p>";
                } catch (Exception $e) {
                    echo "<p>Error con el cambio d emoneda: " . $e->getMessage() . "</p>";
                }
            ?>
        </main>

        <footer>            
            <p>&copy; Adrián Martínez, F1 Desktop</p>
        </footer>
    </body>
</html>