class Calendario {

    constructor() {
        this.apiUrl = 'https://api.jolpi.ca/ergast/f1/2024.json';
        this.preconnectAPI();
        this.fetchRaces();
    }

    preconnectAPI() {
        const preconnect = document.createElement('link');
        preconnect.rel = 'preconnect';
        preconnect.href = 'https://api.jolpi.ca';
        document.head.appendChild(preconnect);
    }

    fetchRaces() {
        $.ajax({
            url: this.apiUrl,
            method: 'GET',
            dataType: 'json',
            success: (data) => {
                this.displayRaces(data.MRData.RaceTable.Races);
            },
            error: (error) => {
                console.error('Error fetching race data:', error);
            }
        });
    }

    displayRaces(races) {
        // Seleccionar el contenedor <section> dentro de <main>
        const raceContainer = document.querySelector('main');

        // Asegurarse de que está vacío antes de añadir contenido
        raceContainer.innerHTML = '<h2>Carreras de la temporada</h2>';

        // Añadir cada carrera como un <article> en el contenedor
        races.forEach(race => {
            const raceElement = document.createElement('article');
            raceElement.innerHTML = `
                <header>
                    <h3>${race.raceName}</h3>
                </header>
                <p><strong>Circuito:</strong> ${race.Circuit.circuitName}</p>
                <p><strong>Coordenadas:</strong> ${race.Circuit.Location.lat}, ${race.Circuit.Location.long}</p>
                <p><strong>Fecha y Hora:</strong> ${race.date} ${race.time}</p>
            `;

            raceContainer.appendChild(raceElement);
        });
    }
}