<!DOCTYPE html>

<?php
    class Controller {
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
        }

        private function connectDB($dbName = null) {
            $this->conn = new mysqli($this->server, $this->user, $this->pass, $dbName);
    
            if ($this->conn->connect_error) {
                die("Connection failed: " . $this->conn->connect_error);
            }
        }

        private function cerrarConexion() {
            if ($this->conn) $this->conn->close();  
        }

        public function establecerBD() {
            $this->connectDB();
    
            $sqlFile = './libre.sql';  
            $sql = file_get_contents($sqlFile);
    
            if ($sql === false) return "Error al leer el archivo SQL.";
    
            if ($this->conn->multi_query($sql)) {
                do {
                    if ($result = $this->conn->store_result()) {
                        $result->free();
                    }
                } while ($this->conn->next_result());
    
                $this->cerrarConexion();
                $this->connectDB($this->db_name);
                $this->cerrarConexion();
    
                return "Base de datos y tablas creadas correctamente.";
    
            } else {
                $this->cerrarConexion();
                return "Error al ejecutar el archivo SQL: " . $this->conn->error;
            }
        }
        
        public function importCSV($filePath) {
            $this->connectDB($this->db_name);
            $file = fopen($filePath, "r");
        
            if (!$file) {
                $this->cerrarConexion();
                return "Error al abrir el archivo CSV.";
            }
        
            // Consultas para cada tabla
            $queries = [
                'Escuderias' => "INSERT INTO Escuderias (nombre, pais) VALUES (?, ?)",
                'Pilotos' => "INSERT INTO Pilotos (nombre, apellido, nacionalidad, id_escuderia) VALUES (?, ?, ?, ?)",
                'Carreras' => "INSERT INTO Carreras (nombre, fecha, nombre_circuito) VALUES (?, ?, ?)",
                'Circuitos' => "INSERT INTO Circuitos (nombre, pais, longitud_km) VALUES (?, ?, ?)",
                'Resultados' => "INSERT INTO Resultados (id_piloto, id_carrera, posicion, puntos) VALUES (?, ?, ?, ?)"
            ];
        
            $currentTable = '';  
            $rows = [];          
            $query = null;     
        
            // Leer el archivo CSV y procesar los datos
            while (($data = fgetcsv($file, 1000, ",")) !== FALSE) {
                if (empty($data[0])) continue;  

                $data = array_map(function($value) {
                    return trim($value, '"');
                }, $data);
        
                if (count($data) == 3 && in_array($data[2], ['nombre', 'pais', 'longitud_km'])) {
                    if ($currentTable && !empty($rows) && $query) {
                        $this->executeQuery($query, $rows);
                        $rows = [];
                    }
                    $currentTable = 'Circuitos';
                    $columns = $data;
                    $query = $this->conn->prepare($queries['Circuitos']);

                } elseif (count($data) == 3 && in_array($data[2], ['nombre', 'fecha', 'nombre_circuito'])) {
                    if ($currentTable && !empty($rows) && $query) {
                        $this->executeQuery($query, $rows);
                        $rows = [];
                    }
                    $currentTable = 'Carreras';
                    $columns = $data;
                    $query = $this->conn->prepare($queries['Carreras']);

                } elseif (count($data) == 2 && in_array($data[0], ['nombre', 'nacionalidad'])) {
                    if ($currentTable && !empty($rows) && $query) {
                        $this->executeQuery($query, $rows);
                        $rows = [];
                    }
                    $currentTable = 'Escuderias';
                    $columns = $data;
                    $query = $this->conn->prepare($queries['Escuderias']);

                } elseif (count($data) == 4 && in_array($data[2], ['nombre', 'nacionalidad', 'escuderia', 'id_escuderia'])) {
                    if ($currentTable && !empty($rows) && $query) {
                        $this->executeQuery($query, $rows);
                        $rows = [];
                    }
                    $currentTable = 'Pilotos';
                    $columns = $data;
                    $query = $this->conn->prepare($queries['Pilotos']);

                } elseif (count($data) == 4 && in_array($data[0], ['id_piloto', 'id_carrera', 'posicion', 'puntos'])) {
                    if ($currentTable && !empty($rows) && $query) {
                        $this->executeQuery($query, $rows);
                        $rows = [];
                    }
                    $currentTable = 'Resultados';
                    $columns = $data;
                    $query = $this->conn->prepare($queries['Resultados']);
                }

                if ($data[0] === 'nombre' || $data[0] === 'id_piloto'
                    || $data[0] === 'pais' || $data[0] === 'nombre_circuito'
                    || $data[0] === 'apellido' || $data[0] === 'fecha'
                    || $data[0] === 'nacionalidad' || $data[0] === 'posicion'
                    || $data[0] === 'longitud_km' || $data[0] === 'puntos'
                    || $data[0] === 'escuderia' || $data[0] === 'id_escuderia'
                    || $data[0] === 'id_carrera') {
                    continue;  
                }
        
                // Añadir los datos a las filas de la tabla actual
                if ($currentTable && count($data) > 1) {
                    $data = array_map(function($value) {
                        return trim($value, '"');}, $data);
                    $rows[] = $data;
                }
            }
        
            if ($currentTable && !empty($rows) && $query) {
                $this->executeQuery($query, $rows);
            }
        
            fclose($file);
            $this->cerrarConexion();
            return "Datos importados correctamente desde el archivo CSV.";

        }
        
        private function executeQuery($query, $rows) {
            foreach ($rows as $row) {
                $types = '';
                foreach ($row as $value) {
                    // Determinar el tipo de dato de cada valor en la fila
                    $types .= is_int($value) ? 'i' : (is_float($value) ? 'd' : 's');
                }
        
                if (!$query->bind_param($types, ...$row)) {
                    return "Error al enlazar los parámetros: " . $query->error;
                }
        
                if (!$query->execute()) {
                    return "Error al insertar los datos: " . $query->error;
                }
            }
        }              
        
        public function exportCSV() {
            $this->connectDB($this->db_name);;
            $fileName = "bd_datos.csv";

            $file = fopen($fileName, "w");
            $tablas = $this->conn->query("SHOW TABLES");
        
            if ($tablas->num_rows > 0) {
                while ($table = $tablas->fetch_array()) {
                    $nombreTabla = $table[0];
                    $columnas = $this->conn->query("DESCRIBE $nombreTabla");
                    $encabezados = [];

                    while ($columna = $columnas->fetch_assoc()) {
                        $encabezados[] = $columna['Field'];
                    }
                    
                    fputcsv($file, $encabezados);
                    $resultado = $this->conn->query("SELECT * FROM $nombreTabla");

                    if ($resultado->num_rows > 0) {
                        while ($row = $resultado->fetch_assoc()) {
                            fputcsv($file, array_values($row)); 
                        }
                    }
  
                    fputcsv($file, []);
                }
            }
        
            fclose($file);
            $this->cerrarConexion();
            return "Datos exportados a archivo CSV: <a href='$fileName' download>Descargar</a>";
        }        
        
        public function registrarCarrera($nombre, $fecha, $nombre_circuito_carrera) {
            $this->connectDB($this->db_name);;
            $nombre_circuito = $nombre_circuito_carrera;

            // Verificar si el circuito ya existe en la base de datos
            $query = $this->conn->prepare("SELECT id_circuito FROM Circuitos WHERE nombre = ?");
            $query->bind_param("s", $nombre_circuito);
            $query->execute();
            $result = $query->get_result();
        
            if ($result->num_rows == 0) {
                $this->cerrarConexion();
                return "Error: El circuito '$nombre_circuito' no existe en el sistema.
                     Por favor, ingresa un circuito válido.";
            }
        
            $query = $this->conn->prepare("INSERT INTO Carreras 
                (nombre, fecha, nombre_circuito) VALUES (?, ?, ?)");

            $query->bind_param("sss", $nombre, $fecha, $nombre_circuito);
            $query->execute();
            $this->cerrarConexion();
            return "Carrera '$nombre' registrada correctamente.";
        }

        public function obtenerPilotos() {
            $this->connectDB($this->db_name);;
            $query = "SELECT nombre, apellido FROM Pilotos";
            $result = $this->conn->query($query);
            
            if ($result->num_rows > 0) {
                echo "<option value='' disabled selected>Seleccione una opción</option>";
                while ($row = $result->fetch_assoc()) {
                    echo "<option value='" . $row['nombre'] . " " . $row['apellido'] . "'>" . $row['nombre'] . " " . $row['apellido'] . "</option>";
                }
            }
            $this->cerrarConexion();
        }

        public function obtenerEscuderias() {
            $this->connectDB($this->db_name);;
            $query = "SELECT nombre, pais FROM Escuderias";
            $result = $this->conn->query($query);

            if ($result->num_rows > 0) {
                echo "<option value='' disabled selected>Seleccione una opción</option>";
                while ($row = $result->fetch_assoc()) {
                    echo "<option value='" . $row['nombre'] . "'>" . $row['nombre'] . " - " . $row['pais'] . "</option>";
                }
            }
            $this->cerrarConexion();
        }

        public function obtenerCircuitos() {
            $this->connectDB($this->db_name);;
            $query = "SELECT nombre FROM Circuitos";
            $result = $this->conn->query($query);

            if ($result->num_rows > 0) {
                echo "<option value='' disabled selected>Seleccione una opción</option>";
                while ($row = $result->fetch_assoc()) {
                    echo "<option value='" . $row['nombre'] . "'>" . $row['nombre'] . "</option>";
                }
            }
            $this->cerrarConexion();
        }

        public function obtenerCarreras() {
            $this->connectDB($this->db_name);;
            $query = "SELECT nombre, fecha, nombre_circuito FROM Carreras";
            $result = $this->conn->query($query);

            if ($result->num_rows > 0) {
                echo "<option value='' disabled selected>Seleccione una opción</option>";
                while ($row = $result->fetch_assoc()) {
                    echo "<option value='" . $row['nombre'] . "'>" . $row['nombre'] . " - " . $row['fecha'] . " - " . $row['nombre_circuito'] . "</option>";
                }
            }
            $this->cerrarConexion();
        }

        public function registrarResultado($piloto, $carrera, $posicion, $puntos) {
            $this->connectDB($this->db_name);;

            $nombre_parts = explode(" ", $piloto);
            $nombre_piloto = $nombre_parts[0];
            $apellido_piloto = $nombre_parts[count($nombre_parts) - 1];
        
            // 1. Obtener id_circuito a partir del nombre_circuito
            $query_carrera = $this->conn->prepare("SELECT * FROM Carreras WHERE nombre = ?");
            $query_carrera->bind_param("s", $carrera);
            $query_carrera->execute();
            $result_carrera = $query_carrera->get_result();
            
            // 2. Obtener id_piloto a partir del nombre y apellido
            $query_piloto = $this->conn->prepare("SELECT id_piloto FROM Pilotos WHERE nombre = ? AND apellido = ?");
            $query_piloto->bind_param("ss", $nombre_piloto, $apellido_piloto);
            $query_piloto->execute();
            $result_piloto = $query_piloto->get_result();

            if ($result_carrera->num_rows > 0 && $result_piloto->num_rows > 0) {
                $row_carrera = $result_carrera->fetch_assoc();
                $id_carrera = $row_carrera['id_carrera'];

                $row_piloto = $result_piloto->fetch_assoc();
                $id_piloto = $row_piloto['id_piloto'];
        
                // 2. Insertar el resultado en la tabla Resultados
                $query_resultado = $this->conn->prepare("INSERT INTO Resultados 
                            (id_piloto, id_carrera, posicion, puntos) 
                            VALUES (?, ?, ?, ?)");
        
                $query_resultado->bind_param("iiii", $id_piloto, $id_carrera, $posicion, $puntos);
                $query_resultado->execute();
                $this->cerrarConexion();
        
                return "Resultado registrado correctamente.";
            
            } else {
                $this->cerrarConexion();
                return "Error.";
            }
        }
        
        public function verResultadosPilotos() {
            $this->connectDB($this->db_name);;

            $query = "SELECT p.nombre, p.apellido, c.nombre AS carrera, r.posicion, r.puntos 
                      FROM Resultados r 
                      JOIN Pilotos p ON r.id_piloto = p.id_piloto
                      JOIN Carreras c ON r.id_carrera = c.id_carrera";
            $result = $this->conn->query($query);
            
            if ($result->num_rows > 0) {
                $resultados = "";
                while ($row = $result->fetch_assoc()) {
                    $resultados .= "<p>Piloto: " . $row['nombre'] . " " . $row['apellido'] . " - Carrera: " . $row['carrera'] . " - Posición: " . $row['posicion'] . " - Puntos: " . $row['puntos'] . "</p>";
                }
                return $resultados; 
            } else {
                $this->cerrarConexion();
                return "No hay resultados registrados.";
            }
        }

        public function estadisticasPilotos() {
            $this->connectDB($this->db_name);;
            $query = "SELECT p.nombre, p.apellido, SUM(r.puntos) AS puntos_totales
                      FROM Pilotos p
                      JOIN Resultados r ON p.id_piloto = r.id_piloto
                      GROUP BY p.id_piloto";
            $result = $this->conn->query($query);
            
            if ($result->num_rows > 0) {
                $estadisticas = ""; 
                while ($row = $result->fetch_assoc()) {
                    $estadisticas .= "<p>Piloto: " . $row['nombre'] . " " . $row['apellido'] . " - Puntos Totales: " . $row['puntos_totales'] . "</p>";
                }
                
                $this->cerrarConexion(); 
                return $estadisticas; 
            } else {
                $this->cerrarConexion();
                return "No hay resultados de pilotos.";
            }
        }

        public function mejoresResultadosPorCarrera() {
            $this->connectDB($this->db_name);;
    
            $query = "SELECT c.nombre AS carrera, c.fecha, p.nombre AS piloto_nombre, p.apellido AS piloto_apellido, r.posicion
                      FROM Resultados r
                      JOIN Pilotos p ON r.id_piloto = p.id_piloto
                      JOIN Carreras c ON r.id_carrera = c.id_carrera
                      ORDER BY c.nombre, r.posicion ASC";  
        
            $result = $this->conn->query($query);
            
            if ($result->num_rows > 0) {
                $resultados = ""; 
                $current_carrera = "";  
                $count = 0;  
        
                while ($row = $result->fetch_assoc()) {
                    if ($current_carrera !== $row['carrera']) {
                        if ($current_carrera !== "") {
                            $resultados .= "</ul>";  
                        }
                        
                        $current_carrera = $row['carrera'];  
                        $resultados .= "<h3>" . $row['carrera'] . " - " . $row['fecha'] . "</h3>"; 
                        $resultados .= "<ul>";  
                        $count = 0;  
                    }
        
                    if ($count < 3) {
                        $resultados .= "<li>Posición: " . $row['posicion'] . " - Piloto: " . $row['piloto_nombre'] . " " . $row['piloto_apellido'] . "</li>";
                        $count++;  
                    }
                }
        
                $resultados .= "</ul>";  
                $this->cerrarConexion();                
                return $resultados; 
            } else {
                $this->cerrarConexion(); 
                return "No hay resultados de carreras.";
            }
        }        

        public function registrarPiloto($nombre, $apellido, $nacionalidad, $nombre_escuderia) {
            $this->connectDB($this->db_name);;

            $find_escuderia = $this->conn->prepare("SELECT id_escuderia FROM Escuderias WHERE nombre = ?");
            $find_escuderia->bind_param("s", $nombre_escuderia);
            $find_escuderia->execute();
            $resultados = $find_escuderia->get_result();

            if ($resultados->num_rows <= 0) {
                return "Error: La escudería '$nombre_escuderia' no existe en el sistema.
                     Por favor, ingresa una escudería válida.";
            }

            $query = $this->conn->prepare("INSERT INTO Pilotos (nombre, apellido, nacionalidad, id_escuderia) VALUES (?, ?, ?, ?)");
            $query->bind_param("ssss", $nombre, $apellido, $nacionalidad, $id_escuderia);
            $query->execute();
            $this->cerrarConexion();
            return "Piloto registrado correctamente.";
        }

        public function registrarCircuito($nombre, $pais, $longitud) {
            $this->connectDB($this->db_name);;
            $query = $this->conn->prepare("INSERT INTO Circuitos (nombre, pais, longitud_km) VALUES (?, ?, ?)");
            $query->bind_param("ssi", $nombre, $pais, $longitud);
            $query->execute();
            $this->cerrarConexion();
            return "Circuito registrado correctamente.";
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

        <link rel="stylesheet" href="../estilo/layout.css"/>
        <link rel="stylesheet" href="../estilo/estilo.css"/>
        
        <script src="../js/ayuda.js" defer></script>

        <script>
            document.addEventListener("DOMContentLoaded", () => {
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
            >> <a href="../juegos.html" title="Juegos">Juegos</a> >> Gestion F1</p>

        <button>Ayuda</button>
        <dialog> <!-- Ayuda Global --> </dialog>

        <?php
            $controller = new Controller();
            $mensajes = array();  

            if ($_SERVER["REQUEST_METHOD"] == "POST") {
                if (isset($_POST['create_db'])) {
                    $mensajes['create_db'] = $controller->establecerBD();       

                } else if (isset($_POST['import_csv'])) {
                    if (isset($_FILES['csv_import']) && $_FILES['csv_import']['error'] === UPLOAD_ERR_OK) {
                        $path = $_FILES['csv_import']['tmp_name'];
                        $mensajes['import_csv'] = $controller->importCSV($path);
                    } else {
                        $mensajes['import_csv'] = "Hubo un error al cargar el archivo.";
                    }               

                } else if (isset($_POST['export_csv'])) {
                    $mensajes['export_csv'] = $controller->exportCSV();          

                } else if (isset($_POST['registrar_carrera'])) {
                    $mensajes['registrar_carrera'] = $controller->registrarCarrera($_POST['nombre_carrera'], $_POST['fecha_carrera'], $_POST['nombre_circuito_carrera']);
                
                } else if (isset($_POST['registrar_resultado'])) {
                    $mensajes['registrar_resultado'] = $controller->registrarResultado(
                        $_POST['piloto'],  
                        $_POST['carrera'], 
                        $_POST['posicion'],        
                        $_POST['puntos']           
                    );
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
                }
            }
        ?>
        
        <main>
            <h2>Gestión Avanzada de Fórmula 1</h2>
            
            <!-- Formulario para crear tablas y restaurar tablas -->
            <form method="POST">
                <button type="submit" name="create_db">Crear Base de Datos</button>
                <?php if (isset($mensajes['create_db'])): ?>
                    <p><?php echo $mensajes['create_db']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Importtar datos de CSV -->
            <form method="POST" enctype="multipart/form-data">
                <label for="csv_import">Importar datos de un CSV:</label>
                <input type="file" id="csv_import" name="csv_import" accept=".csv" required />
                <button type="submit" name="import_csv" id="import_csv">Importar datos del CSV</button>
                <?php if (isset($mensajes['import_csv'])): ?>
                    <p><?php echo $mensajes['import_csv']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Exportar datos a CSV -->
            <form method="POST">
                <label for="export_csv">Exportar Datos a CSV:</label>
                <button type="submit" id="export_csv" name="export_csv">Exportar Datos a CSV</button>
                <?php if (isset($mensajes['export_csv'])): ?>
                    <p><?php echo $mensajes['export_csv']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario ver informacion de la BD -->
            <form method="POST">
                <!-- Ver resultados de todos los pilotos -->
                <h3>Resultados de Pilotos en Carreras</h3>
                <button type="submit" name="ver_resultados">Ver Resultados</button>
                <?php if (isset($mensajes['ver_resultados'])): ?>
                    <p><?php echo $mensajes['ver_resultados']; ?></p>
                <?php endif; ?>

                <!-- Ver las estadísticas de los pilotos -->
                <h3>Mundial de Pilotos</h3>
                <button type="submit" name="estadisticas_pilotos">Ver clasificación</button>
                <?php if (isset($mensajes['estadisticas_pilotos'])): ?>
                    <p><?php echo $mensajes['estadisticas_pilotos']; ?></p>
                <?php endif; ?>

                <!-- Ver los mejores resultados de cada carrera -->
                <h3>Podium de cada Carrera</h3>
                <button type="submit" name="mejores_resultados">Ver podiums</button>
                <?php if (isset($mensajes['mejores_resultados'])): ?>
                    <p><?php echo $mensajes['mejores_resultados']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario para registrar un nuevo piloto junto con su escudería -->
            <form method="POST">
                <h3>Registrar Nuevo Piloto</h3>
                <label for="nombre_piloto">Nombre del Piloto: </label>
                <input type="text" id="nombre_piloto" name="nombre_piloto" required/>
                
                <label for="apellido_piloto">Apellido del Piloto: </label>
                <input type="text" id="apellido_piloto" name="apellido_piloto" required/>
                
                <label for="nacionalidad_piloto">Nacionalidad del Piloto: </label>
                <input type="text" id="nacionalidad_piloto" name="nacionalidad_piloto" required/>
                
                <label for="escuderia_piloto">Nombre de la Escudería: </label>
                <select id="escuderia_piloto" name="escuderia_piloto" required>
                    <?php
                        $controller = new Controller();
                        $controller->obtenerEscuderias();                                              
                    ?>
                </select>
                
                <button type="submit" name="registrar_piloto">Registrar Piloto</button>
                <?php if (isset($mensajes['registrar_piloto'])): ?>
                    <p><?php echo $mensajes['registrar_piloto']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario para registrar un nuevo circuito -->
            <form method="POST">
                <h3>Registrar Nuevo Circuito</h3>
                <label for="nombre_circuito">Nombre del Circuito: </label>
                <input type="text" id="nombre_circuito" name="nombre_circuito" required/>
                
                <label for="pais_circuito">País del Circuito: </label>
                <input type="text" id="pais_circuito" name="pais_circuito" required/>
                
                <label for="longitud_circuito">Longitud del Circuito (km): </label>
                <input type="number" id="longitud_circuito" name="longitud_circuito" required step="0.01"/>
                
                <button type="submit" name="registrar_circuito">Registrar Circuito</button>
                <?php if (isset($mensajes['registrar_circuito'])): ?>
                    <p><?php echo $mensajes['registrar_circuito']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario para registrar una nueva carrera -->
            <form method="POST">
                <h3>Registrar Nueva Carrera</h3>
                <label for="nombre_carrera">Nombre del Gran Premio: </label>
                <input type="text" id="nombre_carrera" name="nombre_carrera" required/>
                
                <label for="fecha_carrera">Fecha del Gran Premio: </label>
                <input type="date" id="fecha_carrera" name="fecha_carrera" required/>
                
                <label for="nombre_circuito_carrera">Circuito: </label>
                <select id="nombre_circuito_carrera" name="nombre_circuito_carrera" required>
                    <?php
                        $controller = new Controller();
                        $controller->obtenerCircuitos();                                              
                    ?>
                </select>
                
                <button type="submit" name="registrar_carrera">Registrar Carrera</button>
                <?php if (isset($mensajes['registrar_carrera'])): ?>
                    <p><?php echo $mensajes['registrar_carrera']; ?></p>
                <?php endif; ?>
            </form>

            <!-- Formulario para registrar un resultado de un piloto en una carrera -->
            <form method="POST">
                <h3>Registrar Resultado de Piloto en una Carrera</h3>

                <!-- Desplegable de Piloto -->
                <label for="piloto">Piloto: </label>
                <select id="piloto" name="piloto" required>
                    <?php
                        // Obtener los pilotos disponibles desde la base de datos
                        $controller = new Controller();
                        $controller->obtenerPilotos();
                    ?>
                </select>

                <!-- Desplegable de Carrera -->
                <label for="carrera">Carrera: </label>
                <select id="carrera" name="carrera" required>
                    <?php
                        $controller = new Controller();
                        $controller->obtenerCarreras();
                    ?>
                </select>

                <!-- Campos de Posición y Puntos -->
                <label for="posicion">Posición: </label>
                <input type="number" id="posicion" name="posicion" required/>
                <label for="puntos">Puntos: </label>
                <input type="number" id="puntos" name="puntos" required/>

                <button type="submit" name="registrar_resultado">Registrar Resultado</button>
                
                <?php if (isset($mensajes['registrar_resultado'])): ?>
                    <p><?php echo $mensajes['registrar_resultado']; ?></p>
                <?php endif; ?>
            </form>
        </main>

        <footer>
            <p>&copy; Adrián Martínez, F1 Desktop</p>
        </footer>
    </body>
</html>
