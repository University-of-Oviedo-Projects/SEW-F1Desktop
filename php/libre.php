<!DOCTYPE html>

<?php
    class Controller {
        // Atributos
        private $server;
        private $user;
        private $pass;
        private $db_name;
        private $conn;

        public function __construct() {
            $this->server = "localhost";
                $this->user = "DBUSER2024";
                $this->pass = "DBPSWD2024";
                $this->db_name = "f1_management";
                $this->connectDB() ;
        }

        private function connectDB() {
            $this->conn = new mysqli($this->server, $this->user, 
                $this->pass, $this->db_name);
            if ($this->conn->connect_error) {
                die("Connection failed: " . $this->conn->connect_error);
            }
        }

        public function establecerBD() {
            $create_db = "CREATE DATABASE IF NOT EXISTS $this->db_name COLLATE utf8_spanish_ci";
            if ($this->conn->query($create_db) !== TRUE) {
                echo "Error creando la base de datos: " . $$this->conn->error;
            }            
            $this->conn->select_db($this->db_name);

            $tables = [
                "CREATE TABLE IF NOT EXISTS Escuderias (
                    id_escuderia INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(50) NOT NULL UNIQUE,
                    pais VARCHAR(50) NOT NULL
                )",
                
                "CREATE TABLE IF NOT EXISTS Circuitos (
                    id_circuito INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(50) NOT NULL UNIQUE,
                    pais VARCHAR(50) NOT NULL,
                    longitud_km FLOAT NOT NULL
                )",
                
                "CREATE TABLE IF NOT EXISTS Pilotos (
                    id_piloto INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(50) NOT NULL,
                    apellido VARCHAR(50) NOT NULL,
                    nacionalidad VARCHAR(50) NOT NULL,
                    escuderia_nombre VARCHAR(50) NOT NULL,
                    FOREIGN KEY (escuderia_nombre) REFERENCES Escuderias(nombre)
                    ON DELETE CASCADE ON UPDATE CASCADE
                )",
                
                "CREATE TABLE IF NOT EXISTS Carreras (
                    id_carrera INT AUTO_INCREMENT PRIMARY KEY,
                    nombre VARCHAR(50) NOT NULL UNIQUE,
                    fecha DATE NOT NULL,
                    nombre_circuito VARCHAR(50) NOT NULL,
                    FOREIGN KEY (nombre_circuito) REFERENCES Circuitos(nombre)
                    ON DELETE CASCADE ON UPDATE CASCADE
                )",
                
                "CREATE TABLE IF NOT EXISTS Resultados (
                    id_resultado INT AUTO_INCREMENT PRIMARY KEY,
                    id_piloto INT NOT NULL,  
                    nombre_piloto VARCHAR(100) NOT NULL,  
                    apellido_piloto VARCHAR(100) NOT NULL,  
                    id_carrera INT NOT NULL, 
                    nombre_carrera VARCHAR(100) NOT NULL,
                    nombre_circuito VARCHAR(100) NOT NULL,
                    posicion INT NOT NULL,
                    puntos INT NOT NULL,
                    FOREIGN KEY (id_piloto) REFERENCES Pilotos(id_piloto)  
                        ON DELETE CASCADE ON UPDATE CASCADE,
                    FOREIGN KEY (id_carrera) REFERENCES Carreras(id_carrera)
                        ON DELETE CASCADE ON UPDATE CASCADE
                );",
            ];

            foreach ($tables as $table) {
                if ($this->conn->query($table) !== TRUE) {
                    return "<p>Error al crear tabla: " . $this->conn->error . "</p>";
                }
            }

            $sqlStatements = [
                "INSERT INTO Escuderias (nombre, pais) VALUES
                ('Mercedes', 'Alemania'),
                ('Ferrari', 'Italia'),
                ('Red Bull Racing', 'Austria');",
            
                "INSERT INTO Circuitos (nombre, pais, longitud_km) VALUES
                ('Circuito de Mónaco', 'Mónaco', 3.337),
                ('Silverstone', 'Reino Unido', 5.891),
                ('Circuito de Spa-Francorchamps', 'Bélgica', 7.004);",
            
                "INSERT INTO Pilotos (nombre, apellido, nacionalidad, escuderia_nombre) VALUES
                ('Lewis', 'Hamilton', 'Británico', 'Mercedes'),
                ('Charles', 'Leclerc', 'Monegasco', 'Ferrari'),
                ('Max', 'Verstappen', 'Neerlandés', 'Red Bull Racing');",
            
                "INSERT INTO Carreras (nombre, fecha, nombre_circuito) VALUES
                ('Gran Premio de Mónaco', '2024-05-26', 'Circuito de Mónaco'),
                ('Gran Premio de Gran Bretaña', '2024-07-07', 'Silverstone'),
                ('Gran Premio de Bélgica', '2024-08-25', 'Circuito de Spa-Francorchamps');",
            
                "INSERT INTO Resultados (id_piloto, nombre_piloto, apellido_piloto, id_carrera, nombre_carrera, nombre_circuito, posicion, puntos) VALUES
                (1, 'Lewis', 'Hamilton', 1, 'Gran Premio de Mónaco', 'Circuito de Mónaco', 1, 25),
                (2, 'Charles', 'Leclerc', 1, 'Gran Premio de Mónaco', 'Circuito de Mónaco', 2, 18);"
            ];

            foreach ($sqlStatements as $sql) {
                if ($this->conn->query($sql) === FALSE) {
                    return "Error: " . $sql . $this->conn->error;
                }
            }

            return "Base de datos creada correctamente.";
        }

        public function dropAllTablas() {
            $this->conn->query("SET FOREIGN_KEY_CHECKS = 0");
            $resultado = $this->conn->query("SHOW TABLES");
        
            if ($resultado->num_rows > 0) {
                while ($row = $resultado->fetch_assoc()) {
                    $nombreTabla = reset($row);
        
                    if (!$this->conn->query("DROP TABLE IF EXISTS $nombreTabla")) {
                        return "Error al eliminar la tabla $nombreTabla: " . $this->conn->error;
                    }
                }
            } else {
                return  "No se encontraron tablas en la base de datos.";
            }
            
            $this->conn->query("SET FOREIGN_KEY_CHECKS = 1");
        }        
        
        public function importCSV($filePath) {
            $file = fopen($filePath, "r");
        
            if ($file === FALSE) {
                return  "Error al abrir el archivo CSV.";
            }
        
            $currentTable = '';  
            $header = [];    
            $query = null;       
        
            while (($data = fgetcsv($file, 1000, ",")) !== FALSE) {
                if (empty($data[0])) { continue; }
        
                if (in_array($data[0], ['Escuderias', 'Pilotos', 'Carreras', 'Circuitos', 'Resultados'])) {
                    if (!empty($currentTable)) {
                        foreach ($rows as $row) {
                            $query->execute();
                        }
                    }
        
                    $currentTable = $data[0];
                    $header = fgetcsv($file, 1000, ","); 
                    $rows = [];
        
                    switch ($currentTable) {
                        case 'Escuderias':
                            $query = $this->conn->prepare("INSERT INTO Escuderias (nombre, pais) VALUES (?, ?)");
                            break;
                        case 'Pilotos':
                            $query = $this->conn->prepare("INSERT INTO Pilotos (nombre, apellido, nacionalidad, id_escuderia) VALUES (?, ?, ?, ?)");
                            break;
                        case 'Carreras':
                            $query = $this->conn->prepare("INSERT INTO Carreras (nombre, fecha, id_circuito) VALUES (?, ?, ?)");
                            break;
                        case 'Circuitos':
                            $query = $this->conn->prepare("INSERT INTO Circuitos (nombre, pais, longitud_km) VALUES (?, ?, ?)");
                            break;
                        case 'Resultados':
                            $query = $this->conn->prepare("INSERT INTO resultadoados (id_piloto, id_carrera, posicion, puntos) VALUES (?, ?, ?, ?)");
                            break;
                        default:
                            fclose($file);
                            return "Tabla desconocida: $currentTable";
                    }
                }
        
                if (!empty($data) && count($data) > 1) {
                    $query->bind_param(str_repeat('s', count($header)), ...$data);
                    $rows[] = $data;
                }
            }
        
            if (!empty($rows)) {
                foreach ($rows as $row) {
                    $query->execute();
                }
            }
        
            fclose($file);
            return "Datos importados correctamente desde el archivo CSV.";
        }
        
        public function exportCSV() {
            $fileName = "bd_datos.csv";
            $file = fopen($fileName, "w");
            $tablas = $this->conn->query("SHOW tables");
        
            if ($tablas->num_rows > 0) {
                while ($table = $tablas->fetch_array()) {
                    $nombreTabla = $table[0];
                    fputcsv($file, array("Datos de la tabla: $nombreTabla"));
                    $resultado = $this->conn->query("SELECT * FROM $nombreTabla");
        
                    if ($resultado->num_rows > 0) {
                        $headers = [];
                        $columns = $resultado->fetch_fields();                        

                        foreach ($columns as $column) {
                            $headers[] = $column->name;
                        }

                        fputcsv($file, $headers);
                        while ($row = $resultado->fetch_assoc()) {
                            fputcsv($file, array_values($row)); 
                        }
                    }

                    fputcsv($file, []);
                }
            }
        
            fclose($file);
            return "Datos exportados a archivo CSV: <a href='$fileName' download>Descargar</a>";
        }
        
        public function registrarCarrera($nombre, $fecha, $nombre_circuito) {
            // Verificar si el circuito ya existe en la base de datos
            $query = $this->conn->prepare("SELECT id_circuito FROM Circuitos WHERE nombre = ?");
            $query->bind_param("s", $nombre_circuito);
            $query->execute();
            $result = $query->get_result();
        
            if ($result->num_rows == 0) {
                return "Error: El circuito '$nombre_circuito' no existe en el sistema. Por favor, ingresa un circuito válido.";
            }
        
            $query = $this->conn->prepare("INSERT INTO Carreras (nombre, fecha, nombre_circuito) VALUES (?, ?, ?)");
            $query->bind_param("sss", $nombre, $fecha, $nombre_circuito);
            $query->execute();
            return "Carrera '$nombre' registrada correctamente.";
        }

        public function registrarResultado($nombre_piloto, $apellido_piloto, 
                $nombre_carrera, $nombre_circuito, $posicion, $puntos) {
            // 1. Obtener id_piloto a partir del nombre y apellido
            $query_piloto = $this->conn->prepare("SELECT id_piloto FROM Pilotos WHERE nombre = ? AND apellido = ?");
            $query_piloto->bind_param("ss", $nombre_piloto, $apellido_piloto);
            $query_piloto->execute();
            $result_piloto = $query_piloto->get_result();
        
            if ($result_piloto->num_rows > 0) {
                $row_piloto = $result_piloto->fetch_assoc();
                $id_piloto = $row_piloto['id_piloto'];
        
                // 2. Obtener id_carrera a partir del nombre_carrera
                $query_carrera = $this->conn->prepare("SELECT id_carrera FROM Carreras WHERE nombre = ?");
                $query_carrera->bind_param("s", $nombre_carrera);
                $query_carrera->execute();
                $result_carrera = $query_carrera->get_result();
        
                if ($result_carrera->num_rows > 0) {
                    $row_carrera = $result_carrera->fetch_assoc();
                    $id_carrera = $row_carrera['id_carrera'];
        
                    // 3. Obtener id_circuito a partir del nombre_circuito
                    $query_circuito = $this->conn->prepare("SELECT id_circuito FROM Circuitos WHERE nombre = ?");
                    $query_circuito->bind_param("s", $nombre_circuito);
                    $query_circuito->execute();
                    $result_circuito = $query_circuito->get_result();
        
                    if ($result_circuito->num_rows > 0) {        
                        // 4. Insertar el resultado en la tabla Resultados
                        $query_resultado = $this->conn->prepare("INSERT INTO Resultados (id_piloto, nombre_piloto, apellido_piloto, id_carrera, nombre_carrera, nombre_circuito, posicion, puntos) VALUES (?, ?, ?, ?, ?, ?, ?)");
                        $query_resultado->bind_param("issssii", $id_piloto, $nombre_piloto, $apellido_piloto, $id_carrera, $nombre_carrera, $nombre_circuito, $posicion, $puntos);
                        $query_resultado->execute();
        
                        return "Resultado registrado correctamente para el piloto $nombre_piloto $apellido_piloto en la carrera $nombre_carrera.";
                    } else {
                        return "Error: No se encontró el circuito $nombre_circuito.";
                    }
                } else {
                    return "Error: No se encontró la carrera $nombre_carrera.";
                }
            } else {
                return "Error: No se encontró el piloto $nombre_piloto $apellido_piloto.";
            }
        }

        public function verResultadosPilotos() {
            $query = "SELECT p.nombre, p.apellido, c.nombre AS carrera, r.posicion, r.puntos 
                      FROM Resultados r 
                      JOIN Pilotos p ON r.id_piloto = p.id_piloto
                      JOIN Carreras c ON r.id_carrera = c.id_carrera";
            $result = $this->conn->query($query);
            
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    return "Piloto: " . $row['nombre'] . " " . $row['apellido'] . " - Carrera: " . $row['carrera'] . " - Posición: " . $row['posicion'] . " - Puntos: " . $row['puntos'];
                }
            } else {
                return "No hay resultados registrados.";
            }
        }

        public function estadisticasPilotos() {
            $query = "SELECT p.nombre, p.apellido, SUM(r.puntos) AS puntos_totales
                      FROM Pilotos p
                      JOIN Resultados r ON p.id_piloto = r.id_piloto
                      GROUP BY p.id_piloto";
            $result = $this->conn->query($query);
            
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    return "Piloto: " . $row['nombre'] . " " . $row['apellido'] . " - Puntos Totales: " . $row['puntos_totales'];
                }
            } else {
                return "No hay resultados de pilotos.";
            }
        }

        public function mejoresResultadosPorCarrera() {
            $query = "SELECT c.nombre AS carrera, p.nombre, p.apellido, r.posicion
                      FROM Resultados r
                      JOIN Pilotos p ON r.id_piloto = p.id_piloto
                      JOIN Carreras c ON r.id_carrera = c.id_carrera
                      ORDER BY r.posicion ASC";

            $result = $this->conn->query($query);
            if ($result->num_rows > 0) {
                while ($row = $result->fetch_assoc()) {
                    return "Carrera: " . $row['carrera'] . " - Piloto: " . $row['nombre'] . " " . $row['apellido'] . " - Posición: " . $row['posicion'];
                }
            } else {
                return "No hay resultados de carreras.";
            }
        }

        public function registrarPiloto($nombre, $apellido, $nacionalidad, $nombre_escuderia) {
            $query = $this->conn->prepare("INSERT INTO Pilotos (nombre, apellido, nacionalidad, nombre_escuderia) VALUES (?, ?, ?, ?)");
            $query->bind_param("sssi", $nombre, $apellido, $nacionalidad, $nombre_escuderia);
            $query->execute();
            return "Piloto registrado correctamente.";
        }

        public function registrarCircuito($nombre, $fecha, $longitud) {
            $query = $this->conn->prepare("INSERT INTO Circuitos (nombre, pais, longitud) VALUES (?, ?, ?)");
            $query->bind_param("ssi", $nombre, $pais, $longitud);
            $query->execute();
            return "Carrera registrada correctamente.";
        }       
    }
?>

<html lang="es">
    <head>
        <meta charset="utf-8" />
        <meta name="author" content="Adrián Martínez" />
        <meta name="description" content="Gestión avanzada de datos de Fórmula 1." />
        <meta name="keywords" content="Formula 1, Ocon, Carreras, Coches" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        
        <title>F1 Desktop</title>
        <link rel="icon" type="image/x-icon" href="../multimedia/imagenes/favicon-16x16.png" />

        <!-- Preload de los estilos -->
        <link rel="preload" href="../estilo/layout.css" as="style"/>
        <link rel="preload" href="../estilo/estilo.css" as="style"/>

        <!-- Después de que se haya descargado, se aplica el CSS -->
        <link rel="stylesheet" href="../estilo/layout.css"/>
        <link rel="stylesheet" href="../estilo/estilo.css"/>
        
        <!-- Añadir referencia al archivo ayuda.js -->
        <script src="../js/ayuda.js" defer></script>
    </head>

    <body>
        <header>
            <h1><a href="../index.html">F1 Desktop</a></h1>

            <nav>
                <a href="../index.html">Inicio </a>
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
            >> <a href="../juegos.html" title="Juegos">Juegos</a> >> Gestion F1</p>

        <!-- Botón para abrir el popup de ayuda -->
        <button>Ayuda</button>

        <?php
            $controller = new Controller();
            $mensajes = array();  

            if ($_SERVER["REQUEST_METHOD"] == "POST") {

                if (isset($_POST['create_db'])) {
                    $mensajes['create_db'] = $controller->establecerBD();
                
                } else if (isset($_POST['import_csv'])) {
                    $mensajes['import_csv'] = $controller->importCSV($_FILES['csv_import']['tmp_name']);
                
                } else if (isset($_POST['export_csv'])) {
                    $mensajes['export_csv'] = $controller->exportCSV();
                
                } else if (isset($_POST['registrar_carrera'])) {
                    $mensajes['registrar_carrera'] = $controller->registrarCarrera($_POST['nombre_carrera'], $_POST['fecha_carrera'], $_POST['nombre_circuito']);
                
                } else if (isset($_POST['registrar_resultado'])) {
                    $mensajes['registrar_resultado'] = $controller->registrarResultado($_POST['nombre_piloto'], $_POST['apellido_piloto'], $_POST['nombre_carrera'], $_POST['nombre_circuito'], $_POST['posicion'], $_POST['puntos']);
                
                } else if (isset($_POST['ver_resultados'])) {
                    $mensajes['ver_resultados'] = $controller->verResultadosPilotos();
                
                } else if (isset($_POST['estadisticas_pilotos'])) {
                    $mensajes['estadisticas_pilotos'] = $controller->estadisticasPilotos();
                
                } else if (isset($_POST['mejores_resultados'])) {
                    $mensajes['mejores_resultados'] = $controller->mejoresResultadosPorCarrera();
                
                } else if (isset($_POST['registrar_piloto'])) {
                    $mensajes['registrar_piloto'] = $controller->registrarPiloto($_POST['nombre_piloto'], $_POST['apellido_piloto'], $_POST['nacionalidad_piloto'], $_POST['escuderia_piloto']);
                
                } else if (isset($_POST['registrar_circuito'])) {
                    $mensajes['registrar_circuito'] = $controller->registrarCircuito($_POST['nombre_circuito'], $_POST['pais_circuito'], $_POST['longitud_circuito']);
                
                } else if (isset($_POST['drop_db'])) {
                    $mensajes['drop_db'] = $controller->dropAllTablas();
                }
            }
        ?>
        
        <main>
            <h2>Gestión Avanzada de Fórmula 1</h2>
            
            <!-- Formulario Crear Base de Datos -->
            <form method="POST">
                <button type="submit" name="create_db">Crear Base de Datos</button>
                <?php if (isset($mensajes['create_db'])): ?>
                    <p><?php echo $mensajes['create_db']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario Importar CSV -->
            <form method="POST" enctype="multipart/form-data">
                <label for="csv_import">Importar Datos desde CSV:</label>
                <input type="file" id="csv_import" name="csv_import" accept=".csv" />
                <button type="submit" name="import_csv">Importar CSV</button>
                <?php if (isset($mensajes['import_csv'])): ?>
                    <p><?php echo $mensajes['import_csv']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario Exportar CSV -->
            <form method="POST">
                <button type="submit" name="export_csv">Exportar Datos</button>
                <?php if (isset($mensajes['export_csv'])): ?>
                    <p><?php echo $mensajes['export_csv']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario Registrar Carrera -->
            <form method="POST">
                <h3>Registrar Nueva Carrera</h3>
                <label for="nombre_carrera">Nombre del Gran Premio: </label>
                <input type="text" id="nombre_carrera" name="nombre_carrera" required/>
                
                <label for="fecha_carrera">Fecha del Gran Premio: </label>
                <input type="date" id="fecha_carrera" name="fecha_carrera" required/>
                
                <label for="nombre_circuito">Nombre del Circuito: </label>
                <input type="text" id="nombre_circuito" name="nombre_circuito" required/>
                
                <button type="submit" name="registrar_carrera">Registrar Carrera</button>
                <?php if (isset($mensajes['registrar_carrera'])): ?>
                    <p><?php echo $mensajes['registrar_carrera']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario Registrar Resultado -->
            <form method="POST">
                <h3>Registrar Resultado de Piloto en una Carrera</h3>
                <label for="id_piloto">Piloto: </label>
                <input type="text" id="id_piloto" name="id_piloto" required/>
                
                <label for="id_carrera_resultado">Carrera: </label>
                <input type="text" id="id_carrera_resultado" name="id_carrera_resultado" required/>
                
                <label for="posicion">Posición: </label>
                <input type="number" id="posicion" name="posicion" required/>
                
                <label for="puntos">Puntos: </label>
                <input type="number" id="puntos" name="puntos" required/>
                
                <button type="submit" name="registrar_resultado">Registrar Resultado</button>
                <?php if (isset($mensajes['registrar_resultado'])): ?>
                    <p><?php echo $mensajes['registrar_resultado']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario Ver Resultados -->
            <form method="POST">
                <h3>Ver Resultados de Pilotos</h3>
                <button type="submit" name="ver_resultados">Ver Resultados</button>
                <?php if (isset($mensajes['ver_resultados'])): ?>
                    <p><?php echo $mensajes['ver_resultados']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario Estadísticas de Pilotos -->
            <form method="POST">
                <h3>Estadísticas de Pilotos</h3>
                <button type="submit" name="estadisticas_pilotos">Ver Estadísticas</button>
                <?php if (isset($mensajes['estadisticas_pilotos'])): ?>
                    <p><?php echo $mensajes['estadisticas_pilotos']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario Mejores Resultados -->
            <form method="POST">
                <h3>Mejores Resultados por Carrera</h3>
                <button type="submit" name="mejores_resultados">Ver Mejores Resultados</button>
                <?php if (isset($mensajes['mejores_resultados'])): ?>
                    <p><?php echo $mensajes['mejores_resultados']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario Registrar Piloto -->
            <form method="POST">
                <h3>Registrar Nuevo Piloto</h3>
                <label for="nombre_piloto">Nombre del Piloto: </label>
                <input type="text" id="nombre_piloto" name="nombre_piloto" required/>
                
                <label for="apellido_piloto">Apellido del Piloto: </label>
                <input type="text" id="apellido_piloto" name="apellido_piloto" required/>
                
                <label for="nacionalidad_piloto">Nacionalidad del Piloto: </label>
                <input type="text" id="nacionalidad_piloto" name="nacionalidad_piloto" required/>
                
                <label for="escuderia_piloto">Nombre de la Escudería: </label>
                <input type="text" id="escuderia_piloto" name="escuderia_piloto" required/>
                
                <button type="submit" name="registrar_piloto">Registrar Piloto</button>
                <?php if (isset($mensajes['registrar_piloto'])): ?>
                    <p><?php echo $mensajes['registrar_piloto']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario Registrar Circuito -->
            <form method="POST">
                <h3>Registrar Nuevo Circuito</h3>
                <label for="nombre_circuito">Nombre del Circuito: </label>
                <input type="text" id="nombre_circuito" name="nombre_circuito" required/>
                
                <label for="pais_circuito">País del Circuito: </label>
                <input type="text" id="pais_circuito" name="pais_circuito" required/>
                
                <label for="longitud_circuito">Longitud del Circuito (km): </label>
                <input type="number" id="longitud_circuito" name="longitud_circuito" required/>
                
                <button type="submit" name="registrar_circuito">Registrar Circuito</button>
                <?php if (isset($mensajes['registrar_circuito'])): ?>
                    <p><?php echo $mensajes['registrar_circuito']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario Restaurar Base de Datos -->
            <form method="POST">
                <button type="submit" name="drop_db">Restaurar Base de Datos</button>
                <?php if (isset($mensajes['drop_db'])): ?>
                    <p><?php echo $mensajes['drop_db']; ?></p>
                <?php endif; ?>
            </form>
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
                new HelpHandler();                 
            });
        </script>
    </body>
</html>
