<!DOCTYPE html>

<?php
    class Record {
        private $server;
        private $user;
        private $pass;
        private $dbname;
        private $conn;

        public function __construct() {
            $this->server = "localhost";
            $this->user = "DBUSER2024";
            $this->pass = "DBPSWD2024";
            $this->dbname = "records";
        }

    private function connectDB() {
        $this->conn = new mysqli($this->server, $this->user, 
            $this->pass, $this->dbname);
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function insertRecord($nombre, $apellidos, $nivel, $tiempo) {
        $this->connectDB();
        $stmt = $this->conn
            ->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssdd", $nombre, $apellidos, $nivel, $tiempo);
        $stmt->execute();
        $stmt->close();
        $this->conn->close();
    }

    public function getTopRecords() {
        $this->connectDB();
        $stmt = $this->conn->prepare("SELECT nombre, apellidos, tiempo 
                    FROM registro ORDER BY tiempo ASC LIMIT 10");
        $stmt->execute();
        $result = $stmt->get_result();

        $records = [];
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $records[] = $row;
            }
        }
        
        $stmt->close();
        $this->conn->close();
        return $records;
    }
}
?>

<html lang="es">
    <head>
    <meta charset="utf-8" />
        <meta name="author" content="Adrián Martínez" />
        <meta name="description" content="Este documento consiste en un minijuego de 
            reaccion simulando las luces del semaforo de salida de un Gran Premio de F1" />
        <meta name="keywords" content="Formula 1, Ocon, Carreras, Coches" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <title>F1 Desktop</title>
        <link rel="icon" type="image/x-icon" href="../multimedia/imagenes/favicon-16x16.png" />

        <!-- Preload de los estilos -->
        <link rel="preload" href="../estilo/layout.css" as="style"/>
        <link rel="preload" href="../estilo/estilo.css" as="style"/>
        <link rel="preload" href="../estilo/semaforo.css" as="style"/>
        
        <link rel="stylesheet" href="../estilo/estilo.css" />
        <link rel="stylesheet" href="../estilo/layout.css" />
        <link rel="stylesheet" href="../estilo/semaforo.css" />

        <script src="../js/semaforo.js" defer></script>
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
        <script src="../js/ayuda.js" defer></script>

        <script>
            document.addEventListener("DOMContentLoaded", () => {
                new Semaforo();
                new AyudaGlobal();
            });
        </script>
    </head>

    <body>
        <header>
            <h1><a href="../index.html" target="_self" title="Pagina de inicio">F1 Desktop</a></h1>

            <nav>
                <a href="../index.html" target="_self" title="Página principal de inicio, regresa a la página principal">Inicio</a>
                <a href="../piloto.html" target="_self" title="Información sobre los pilotos">Piloto</a>
                <a href="../noticias.html" target="_self" title="Últimas noticias y actualizaciones">Noticias</a>
                <a href="../meteorologia.html" target="_self" title="Pronóstico meteorológico y condiciones climáticas">Meteorologia</a>
                <a href="viajes.php" target="_self" title="Información sobre viajes y destinos">Viajes</a>
                <a href="../calendario.html" target="_self" title="Calendario de eventos y actividades">Calendario</a>
                <a href="../circuitos.html" target="_self" title="Detalles sobre los circuitos y pistas">Circuitos</a>
                <a href="../juegos.html" target="_self" title="Juegos y actividades interactivas">Juegos</a>
            </nav>
        </header>

        <p>Estas en <a href="../index.html" title="Pagina de inicio">Inicio</a> 
            >> <a href="../juegos.html" title="Juegos">Juegos</a> >> Reacción</p>

        <button>Ayuda</button>
        <dialog> <!-- Ayuda Global --> </dialog>

        <main> 
            <!-- Aquí se mostrará el juego -->
        </main>

        <?php
            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                $record = new Record();
                $nombre = $_POST['nombre'];
                $apellidos = $_POST['apellidos'];
                $nivel = $_POST['nivel'];
                $tiempo = $_POST['tiempo'];
                $record->insertRecord($nombre, $apellidos, $nivel, $tiempo);

                $topRecords = $record->getTopRecords();
                if (!empty($topRecords)) {
                    echo "<h2>Top 10 Récords</h2><ol>";
                    foreach ($topRecords as $rec) {
                        echo "<li>Nombre: {$rec['nombre']}, Apellidos: {$rec['apellidos']} 
                            - Tiempo: {$rec['tiempo']} segundos</li>";
                    }
                    echo "</ol>";
                } else {
                    echo "<p>No hay récords para mostrar.</p>";
                }
            }
        ?>

        <footer>
            <p>&copy; Adrián Martínez, F1 Desktop</p>
        </footer>
    </body>
</html>