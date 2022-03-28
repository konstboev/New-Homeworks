function getPlanets() {
    let planets = [];
    let button = document.querySelector('button');
    button.addEventListener('click', showPlanets);

    function showPlanets() {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://swapi.dev/api/planets');
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function (event) {
            if (xhr.status === 200) {
                try {
                    planets = JSON.parse(xhr.response).results;
                    buildTable(planets);
                } catch (error) {
                    console.log(error);
                }
            }
            if (xhr.status === 404) {
                console.log(error);
            }

        }
        xhr.onerror = function (event) {
            console.log(event);
        }
        xhr.send();
    }

    function buildTable(data) {
        let table = document.createElement('table');
        let tr = document.createElement('tr');
        let number = document.createElement('th');
        number.textContent = 'Num';
        let namePlanet = document.createElement('th');
        namePlanet.textContent = 'Name';

        tr.append(number, namePlanet);
        table.append(tr);
        document.querySelector('body').append(table);


        for (let i = 0; i < data.length; i++) {
            let row = `<tr>
							<td>${i+1}</td>
							<td>${data[i].name}</td>
					</tr>`
            table.innerHTML += row;
        }
    }

}
getPlanets();