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
            $url = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=$apiKey&tags=" . urlencode($this->pais) . "&per_page=5&format=json&nojsoncallback=1";
    
            // Usar cURL con keep-alive para mejorar la eficiencia de las solicitudes
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, array('Connection: keep-alive')); // Hacer que la conexión se mantenga viva
            $response = curl_exec($ch);
    
            // Verificar si hubo un error con la solicitud
            if ($response === false) {
                echo "No se pudo conectar con la API de Flickr: " . curl_error($ch);
                curl_close($ch);
                return;
            }
            curl_close($ch);
    
            // Decodificar la respuesta JSON
            $data = json_decode($response, true);
    
            // Verificar si la respuesta contiene fotos
            if (!isset($data['photos']['photo']) || count($data['photos']['photo']) == 0) {
                echo "No se encontraron fotos para el país especificado.";
                return;
            }
    
            // Recoger las URLs de las fotos y almacenarlas
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
        <meta name="description" content="Una página web que emula a la pagina web de la Formula 1, 
            incluyendo informacion sobre un piloto asignado, los circuitos, la meteorologia, 
            las noticias, los viajes y juegos." />
        <meta name="keywords" content="Formula 1, Ocon, Carreras, Coches">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title>F1 Desktop</title>
        <link rel="icon" type="image/x-icon" href="../multimedia/imagenes/favicon-16x16.png">
        
        <!-- Preload de los estilos -->
        <link rel="preload" href="../estilo/layout.css" as="style">
        <link rel="preload" href="../estilo/estilo.css" as="style">
        <link rel="preload" href="../js/viajes.js" as="script">
        <link rel="preload" href="../js/ayuda.js" as="script">

        <!-- Después de que se haya descargado, se aplica el CSS -->
        <link rel="stylesheet" href="../estilo/layout.css">
        <link rel="stylesheet" href="../estilo/estilo.css">

        <!-- Añadir referencia al archivo viajes.js -->
        <script src="../js/viajes.js"></script>

        <!-- Añadir referencia al archivo ayuda.js -->
        <script src="../js/ayuda.js"></script>
    </head>

    <body>
        <header>
            <h1><a href="../index.html">F1 Desktop</a></h1>

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

        <p>Estas en <a href="index.html" title="Home">Inicio</a> >> Viajes</p>

        <!-- Botón para abrir el popup de ayuda -->
        <button>Ayuda</button>

        <main>
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

            <h2>Mapas estáticos y dinámicos</h2>
            <div hidden></div>

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