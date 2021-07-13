const personagensContador = document.getElementById("personagens");
const luasContador = document.getElementById("luas");
const planetasContador = document.getElementById("planetas");
const navesContador = document.getElementById("naves");

preencherContadores();
preencherTabela();

google.charts.load("current", { packages: ["corechart"] });
google.charts.setOnLoadCallback(desenharGrafico);

async function desenharGrafico() {
  const response = await swapiGet("films/");
  const filmsArray = response.data.results;
  const dataArray = [];

  dataArray.push(["Filmes", "Episódios"]);

  filmsArray.forEach((films) => {
    dataArray.push([films.title, Number(films.episode_id)]);
  });

  var data = google.visualization.arrayToDataTable(dataArray);

  var options = {
    title: "Filmes do Star Wars",
    titleFontSize: 18,
    legend: "none",
    backgroundColor: "transparent",
    fontName: "Roboto",
  };

  var chart = new google.visualization.PieChart(
    document.getElementById("piechart")
  );

  chart.draw(data, options);
}

function preencherContadores() {
  Promise.all([
    swapiGet("people/"),
    swapiGet("vehicles/"),
    swapiGet("planets/"),
    swapiGet("starships/"),
  ]).then(function (results) {
    personagensContador.innerHTML = results[0].data.count;
    luasContador.innerHTML = results[1].data.count;
    planetasContador.innerHTML = results[2].data.count;
    navesContador.innerHTML = results[3].data.count;
  });
}

async function preencherTabela() {
  const response = await swapiGet("films/");
  const tableData = response.data.results;
  tableData.forEach((film) => {
    $(`#filmsTable`).append(
      `<tr><td> ${film.title}</td>
       <td> ${moment(film.release_date).format("DD / MM / YYYY")} </td>
       <td> ${film.director} </td>
       <td> ${film.episode_id} </td></tr>`
    );
  });
}

function swapiGet(param) {
  return axios.get(`https://swapi.dev/api/${param}`);
}
