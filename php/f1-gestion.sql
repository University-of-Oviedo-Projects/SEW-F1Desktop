-- Eliminar la base de datos si ya existe
DROP DATABASE IF EXISTS f1_gestion;

-- Crear la base de datos nuevamente
CREATE DATABASE f1_gestion COLLATE utf8_spanish_ci;

-- Usar la base de datos recién creada
USE f1_gestion;

-- Eliminar tablas si existen
DROP TABLE IF EXISTS Resultados;
DROP TABLE IF EXISTS Carreras;
DROP TABLE IF EXISTS Pilotos;
DROP TABLE IF EXISTS Circuitos;
DROP TABLE IF EXISTS Escuderias;

-- Crear tablas
CREATE TABLE Escuderias (
    id_escuderia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    pais VARCHAR(50) NOT NULL,
    sede VARCHAR(50) NOT NULL
);

CREATE TABLE Circuitos (
    id_circuito INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    pais VARCHAR(50) NOT NULL,
    longitud_km FLOAT NOT NULL
);

CREATE TABLE Pilotos (
    id_piloto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    nacionalidad VARCHAR(50) NOT NULL,
    id_escuderia INT NOT NULL,
    FOREIGN KEY (id_escuderia) REFERENCES Escuderias(id_escuderia)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Carreras (
    id_carrera INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    fecha DATE NOT NULL,
    nombre_circuito VARCHAR(50) NOT NULL,
    FOREIGN KEY (nombre_circuito) REFERENCES Circuitos(nombre)
    ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE Resultados (
    id_resultado INT AUTO_INCREMENT PRIMARY KEY,
    id_piloto INT NOT NULL,
    id_carrera INT NOT NULL,
    posicion INT NOT NULL,
    puntos INT NOT NULL,
    FOREIGN KEY (id_piloto) REFERENCES Pilotos(id_piloto)
    ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (id_carrera) REFERENCES Carreras(id_carrera)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Insertar datos de ejemplo
INSERT INTO Escuderias (nombre, pais, sede) VALUES
    ('Mercedes', 'Alemania', "Brackley"),
    ('Ferrari', 'Italia', "Maranello"),
    ('Red Bull Racing', 'Austria', "Milton Keynes");

INSERT INTO Circuitos (nombre, pais, longitud_km) VALUES
    ('Circuito de Mónaco', 'Mónaco', 3.337),
    ('Silverstone', 'Reino Unido', 5.891),
    ('Circuito de Spa-Francorchamps', 'Bélgica', 7.004);

INSERT INTO Pilotos (nombre, apellido, nacionalidad, id_escuderia) VALUES
    ('Lewis', 'Hamilton', 'Británico', 1),
    ('Charles', 'Leclerc', 'Monegasco', 2),
    ('Max', 'Verstappen', 'Neerlandés', 3);

INSERT INTO Carreras (nombre, fecha, nombre_circuito) VALUES
    ('Gran Premio de Mónaco', '2024-05-26', 'Circuito de Mónaco'),
    ('Gran Premio de Gran Bretaña', '2024-07-07', 'Silverstone'),
    ('Gran Premio de Bélgica', '2024-08-25', 'Circuito de Spa-Francorchamps');

INSERT INTO Resultados (id_piloto, id_carrera, posicion, puntos) VALUES
    (1, 1, 1, 25),
    (2, 1, 2, 18);
