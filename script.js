// Globals
const typeColor = {
  bug: "#26de81",
  dragon: "#ffeaa7",
  electric: "#fed330",
  fairy: "#FF0069",
  fighting: "#30336b",
  fire: "#f0932b",
  flying: "#81ecec",
  grass: "#00b894",
  ground: "#EFB549",
  ghost: "#a55eea",
  ice: "#74b9ff",
  normal: "#95afc0",
  poison: "#6c5ce7",
  psychic: "#a29bfe",
  rock: "#2d3436",
  water: "#0190FF",
};
const baseUrl = "https://pokeapi.co/api/v2/pokemon?limit=151";
const dropDownPokemonOne = document.querySelector("#select-dropdown-one");
const dropDownPokemonTwo = document.querySelector("#select-dropdown-two");
let pokemonOne;
let pokemonTwo;
const compareButton = document.querySelector("#compare-button");
const battleButton = document.querySelector("#battle-button");

// Class

class Pokemon {
  constructor(name, image, types, weight, height, stats) {
    this.name = name;
    this.image = image;
    this.types = types;
    this.weight = weight;
    this.height = height;
    this.stats = stats;
  }
  compare(pokemon) {
    let thisPokemonOverallStats = this.stats.reduce((total, stat) => {
      return total + stat.base_stat;
    }, 0);
    let contenderPokemonOverallStats = pokemon.stats.reduce((total, stat) => {
      return total + stat.base_stat;
    }, 0);

    if (thisPokemonOverallStats > contenderPokemonOverallStats) {
      return `${this.name} is superior to ${pokemon.name}`;
    } else if (thisPokemonOverallStats < contenderPokemonOverallStats) {
      return `${this.name} is inferior to ${pokemon.name}`;
    } else {
      return `${this.name} is equally strong as ${pokemon.name}`;
    }
  }
}

//Functions

async function getPokemonList(url) {
  try {
    const response = await axios.get(url);
    return response.data.results;
  } catch (error) {
    console.log("err: ", error);
  }
}
async function populateDropdown(...elem) {
  let array = await getPokemonList(baseUrl);
  createOptionsForDropdown(array, ...elem);
}
function createOptionsForDropdown(array, ...dropdowns) {
  dropdowns.forEach((dropdown) => {
    array.forEach((pokemon) => {
      let newOption = document.createElement("option");
      newOption.value = pokemon.url;
      newOption.textContent = pokemon.name.toUpperCase();
      dropdown.append(newOption);
    });
  });
}
async function getData(url) {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.log("error:", error);
  }
}

async function getPokemonData(url) {
  try {
    let pokemonData = await getData(url);
    return pokemonData;
  } catch (error) {
    console.log("error:", error);
  }
}
function capturePokemon(object, id) {
  let pokemon = new Pokemon(
    object.name,
    object.sprites.other.dream_world.front_default,
    object.types,
    object.weight,
    object.height,
    object.stats
  );
  assignOneOrTwo(pokemon, id);
}
function assignOneOrTwo(pokemon, id) {
  switch (id) {
    case "one":
      pokemonOne = pokemon;
      break;
    case "two":
      pokemonTwo = pokemon;
      break;
    default:
      break;
  }
}
function fetchOneOrTwo(id) {
  switch (id) {
    case "one":
      return pokemonOne;
    case "two":
      return pokemonTwo;
    default:
      break;
  }
}
function createPokemonCard(object, id) {
  console.log(object);
  const themeColor = typeColor[object.types[0].type.name];
  let cardId = id === "one" ? "card-one" : "card-two";
  let card = document.querySelector(`#${cardId}`);
  card.innerHTML = "";
  card.innerHTML = `
        <p class="hp">
          <span>HP</span>
            ${object.stats[0].base_stat}
        </p>
        <img src=${object.image} />
        <h2 class="poke-name">${object.name.toUpperCase()}</h2>
        <div id="types"class="types">
        </div>
        <div class="stats">
          <div>
            <h3>${object.stats[1].base_stat}</h3>
            <p>Attack</p>
            <h3>${object.stats[3].base_stat}</h3>
            <p>Special Attack</p>
          </div>
          <div>
            <h3>${object.stats[2].base_stat}</h3>
            <p>Defense</p>
            <h3>${object.stats[4].base_stat}</h3>
            <p>Special Defense</p>
          </div>
          <div>
            <h3>${object.stats[5].base_stat}</h3>
            <p>Speed</p>
          </div>
        </div>
  `;
  appendTypes(object.types);
  styleCard(themeColor, card);
}

function appendTypes(array) {
  console.log(array);
  array.forEach((type) => {
    let span = document.createElement("span");
    span.textContent = type.type.name;
    document.querySelector(".types").append(span);
  });
}
function styleCard(color, card) {
  card.style.background = `radial-gradient(circle at 50% 0%, ${color} 36%, #ffffff 36%)`;
  card.style.boxShadow = `0 20px 30px rgba(0, 0, 0, 0.15)`;
  card.querySelectorAll(".types span").forEach((typeColor) => {
    typeColor.style.backgroundColor = color;
  });
}

async function handleSelectClick(url, id) {
  let pokemonObj = await getPokemonData(url);
  capturePokemon(pokemonObj, id);
  let pokemon = fetchOneOrTwo(id);
  createPokemonCard(pokemon, id);
}

// KOD-FLOW & DOM
populateDropdown(dropDownPokemonOne, dropDownPokemonTwo);

dropDownPokemonOne.addEventListener("change", (event) => {
  let url = dropDownPokemonOne.value;
  let id = event.target.id.slice(-3);
  handleSelectClick(url, id);
});
dropDownPokemonTwo.addEventListener("change", (event) => {
  let url = dropDownPokemonTwo.value;
  let id = event.target.id.slice(-3);
  handleSelectClick(url, id);
});
compareButton.addEventListener("click", () => {
  let messageContainer = document.querySelector("#message-container");
  let msg = pokemonOne.compare(pokemonTwo);
  messageContainer.textContent = msg;
});
