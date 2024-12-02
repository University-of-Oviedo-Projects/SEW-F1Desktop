<!DOCTYPE html>

<?php
    class Record {
        // Atributos
        private $server;
        private $user;
        private $pass;
        private $dbname;
        private $conn;

        // Constructor
        public function __construct() {
            $this->server = "localhost";
            $this->user = "DBUSER2024";
            $this->pass = "DBPSWD2024";
            $this->dbname = "records";
            $this->connectDB() ;
        }

    private function connectDB() {
        $this->conn = new mysqli($this->server, $this->user, 
            $this->pass, $this->dbname);
        if ($this->conn->connect_error) {
            die("Connection failed: " . $this->conn->connect_error);
        }
    }

    public function insertRecord($nombre, $apellidos, $nivel, $tiempo) {
        $stmt = $this->conn
            ->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("ssdd", $nombre, $apellidos, $nivel, $tiempo);
        $stmt->execute();
        $stmt->close();
    }

    public function getTopRecords() {
        $stmt = $this->conn->prepare("SELECT nombre, apellidos, tiempo 
                    FROM registro ORDER BY tiempo ASC LIMIT 10");
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $records = [];
            while ($row = $result->fetch_assoc()) {
                $records[] = $row;
            }
            return $records;
        } else {
            return [];
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
        <meta name="keywords" content="Formula 1, Ocon, Carreras, Coches" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <title>F1 Desktop</title>
        <link rel="icon" type="image/x-icon" href="multimedia/imagenes/favicon-16x16.png" />

        <!-- Preload de los estilos -->
        <link rel="preload" href="../estilo/layout.css" as="style"/>
        <link rel="preload" href="../estilo/estilo.css" as="style"/>
        
        <link rel="stylesheet" href="../estilo/estilo.css" />
        <link rel="stylesheet" href="../estilo/layout.css" />
        <link rel="stylesheet" href="../estilo/semaforo.css" />
        
        <!-- Añadir referencia al archivo semaforo.js -->
        <script src="../js/semaforo.js"></script>

        <!-- Añadir referencia a jQuery -->
        <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

        <!-- Añadir referencia al archivo ayuda.js -->
        <script src="../js/ayuda.js"></script>
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

        <p>Estas en <a href="../index.html" title="Home">Inicio</a> 
            >> <a href="../juegos.html" title="Juegos">Juegos</a>
            >> <a href="php/semaforo.php" title="Reacción">Reacción</a></p>

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

        <!-- Pie de página -->
        <footer>
            <!-- Botón para abrir el popup de ayuda -->
            <button>Ayuda</button>
            <!-- Texto de derechos de autor -->
            <p>&copy; Adrián Martínez, F1 Desktop</p>
        </footer>

        <!-- Popup de ayuda -->
        <dialog>
            <!-- Contenido de la ayuda -->
            <section>
                <h2>Bienvenido a la ayuda web de F1Destkop</h2>
            </section>
        </dialog> 
        
        <!-- Script para cargar el juego y la ayuda -->
        <script>
            document.addEventListener("DOMContentLoaded", () => {
                new Semaforo();  
                new HelpHandler(); 
            });
        </script>
    </body>
</html>