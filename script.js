// Globals
const baseUrl = "https://pokeapi.co/api/v2/pokemon?limit=151";
const selectBtnOne = document.querySelector("#select-button-one");
const dropDownPokemonOne = document.querySelector("#select-dropdown-one");
let pokemonOne;
let pokemonTwo;

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
    //???
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
async function populateDropdown(dropdown) {
  let array = await getPokemonList(baseUrl);
  createOptionsForDropdown(array, dropdown);
}
function createOptionsForDropdown(array, dropdown) {
  array.forEach((pokemon) => {
    let newOption = document.createElement("option");
    newOption.value = pokemon.url;
    newOption.textContent = pokemon.name.toUpperCase();
    dropdown.append(newOption);
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
function createPokemonCard(object) {}
function renderPokemon(object) {
  console.log(object);
  let container = document.querySelector("#card-container");
  container.innerHTML = "";
  let card = document.createElement("div");
  let img = document.createElement("img");
  img.src = object.image;
  img.alt = `a pokemon named ${object.name}`;
  img.classList.add("img");
  card.append(img);
  container.append(card);
}
async function handleSelectClick(url, id) {
  let pokemonObj = await getPokemonData(url);
  console.log(pokemonObj);
  capturePokemon(pokemonObj, id);
  let pokemon = fetchOneOrTwo(id);
  renderPokemon(pokemon);
}

// DOM
dropDownPokemonOne.addEventListener("click", (event) => {
  populateDropdown(event.target);
});
selectBtnOne.addEventListener("click", (event) => {
  let url = dropDownPokemonOne.value;
  let id = event.target.id.slice(-3);
  handleSelectClick(url, id);
});
