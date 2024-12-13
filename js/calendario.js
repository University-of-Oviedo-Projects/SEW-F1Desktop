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
                // No hacer nada en caso de error
            }
        });
    }

    displayRaces(races) {
        const raceContainer = document.querySelector('main');
        
        races.forEach(race => {
            const article = document.createElement('article');
            const header = document.createElement('header');
            const h3 = document.createElement('h3');
            h3.textContent = race.raceName;
            header.appendChild(h3);
            article.appendChild(header);
            const p1 = document.createElement('p');
            p1.textContent = `Circuito: ${race.Circuit.circuitName}`;	
            article.appendChild(p1);
            const p2 = document.createElement('p');
            p2.textContent = `Coordenadas: ${race.Circuit.Location.lat}, ${race.Circuit.Location.long}`;
            article.appendChild(p2);
            const p3 = document.createElement('p');
            p3.textContent = `Fecha y Hora: ${race.date} ${race.time}`;
            article.appendChild(p3);
            raceContainer.appendChild(article);
        });
    }
    
}