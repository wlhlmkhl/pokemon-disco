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
const diceButton = document.querySelector("#dice-button");
const pokeballButton = document.querySelector("#pokeball-button");

// Class & funktioner som används i Class

class Pokemon {
  constructor(name, image, types, weight, height, stats, moves) {
    this.name = name;
    this.image = image;
    this.types = types;
    this.weight = weight;
    this.height = height;
    this.stats = stats;
    this.moves = moves;
  }
  compare(pokemon) {
    let thisPokemon = extractValues(this);
    let contenderPokemon = extractValues(pokemon);

    let thisPokemonScore = 0;
    let contenderPokemonScore = 0;

    // Jämför stats
    for (let i = 0; i < thisPokemon.stats.length; i++) {
      if (thisPokemon.stats[i] > contenderPokemon.stats[i]) {
        thisPokemonScore++;
      } else if (thisPokemon.stats[i] < contenderPokemon.stats[i]) {
        contenderPokemonScore++;
      }
    }
    // Jämför weight och height
    if (thisPokemon.weight > contenderPokemon.weight) {
      thisPokemonScore++;
    } else if (thisPokemon.weight < contenderPokemon.weight) {
      contenderPokemonScore++;
    }
    if (thisPokemon.height > contenderPokemon.height) {
      thisPokemonScore++;
    } else if (thisPokemon.height < contenderPokemon.height) {
      contenderPokemonScore++;
    }
    let msg = "";
    if (thisPokemonScore > contenderPokemonScore) {
      winnerCard("#card-one");
      msg = `${this.name
        .toUpperCase()
        .bold()} is the superior in more fields than ${pokemon.name
        .toUpperCase()
        .bold()}`;
    } else if (thisPokemonScore < contenderPokemonScore) {
      winnerCard("#card-two");
      msg = `${this.name
        .toUpperCase()
        .bold()} is inferior in more fields than the mighty ${pokemon.name
        .toUpperCase()
        .bold()}`;
    } else {
      winnerCard("#card-one");
      winnerCard("#card-two");
      msg = `${this.name
        .toUpperCase()
        .bold()} is equally strong as ${pokemon.name.toUpperCase().bold()}`;
    }
    messageToDom(msg);
  }
  async battle(pokemon) {
    const UPDATE_INTERVAL = 2000;
    const firstAttacker =
      this.stats[5].base_stat > pokemon.stats[5].base_stat
        ? {
            attacker: this,
            attackerId: "#card-one",
            defender: pokemon,
            defenderId: "#card-two",
          }
        : {
            attacker: pokemon,
            defender: this,
            attackerId: "#card-two",
            defenderId: "#card-one",
          };
    let attackerHp = firstAttacker.attacker.stats[0].base_stat;
    updateHP(attackerHp, firstAttacker.attackerId);
    let defenderHp = firstAttacker.defender.stats[0].base_stat;
    updateHP(defenderHp, firstAttacker.defenderId);
    while (attackerHp > 0 && defenderHp > 0) {
      // Första attacken
      let attackerDmg = attack(firstAttacker.attacker, firstAttacker.defender);
      defenderHp -= attackerDmg;
      punch(firstAttacker.attackerId);
      if (defenderHp <= 0) {
        updateHP(0, firstAttacker.defenderId);
        winnerCard(firstAttacker.attackerId);
        messageToDom(
          `${firstAttacker.defender.name
            .toUpperCase()
            .bold()} fainted! ${firstAttacker.attacker.name
            .toUpperCase()
            .bold()} wins!`
        );
        break;
      }
      updateHP(defenderHp, firstAttacker.defenderId);
      messageToDom(
        `${firstAttacker.attacker.name.toUpperCase().bold()} used ${
          firstAttacker.attacker.moves
        } and did -${attackerDmg} hp.`
      );

      await wait(UPDATE_INTERVAL);

      // counter-attack
      let defenderDmg = attack(firstAttacker.defender, firstAttacker.attacker);
      attackerHp -= defenderDmg;
      punch(firstAttacker.defenderId);
      if (attackerHp <= 0) {
        updateHP(0, firstAttacker.attackerId);
        winnerCard(firstAttacker.defenderId);
        messageToDom(
          `${firstAttacker.attacker.name
            .toUpperCase()
            .bold()} fainted! ${firstAttacker.defender.name
            .toUpperCase()
            .bold()} wins!`
        );
        break;
      } else {
        updateHP(attackerHp, firstAttacker.attackerId);
        messageToDom(
          `${firstAttacker.defender.name.toUpperCase().bold()} used ${
            firstAttacker.defender.moves
          } and did -${defenderDmg} hp.`
        );
      }
      await wait(UPDATE_INTERVAL);
    }
  }
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function attack(attacker, defender) {
  let damage =
    attacker.stats[3].base_stat +
    attacker.stats[1].base_stat -
    (defender.stats[2].base_stat + defender.stats[4].base_stat) * 0.8;
  damage = Math.round(damage);
  if (damage < 10) {
    damage = 10;
  }
  return damage;
}

function updateHP(newHp, cardId) {
  let hpElement = document.querySelector(`${cardId} .hp`);
  hpElement.innerHTML = `<span>HP</span> ${newHp}
  `;
}

// function messageToDom(string) {
//   let messageContainer = document.querySelector("#message-container");
//   messageContainer.innerHTML = "";
//   messageContainer.innerHTML = string;
// }
function messageToDom(string) {
  let messageContainer = document.querySelector("#message-container");
  messageContainer.style.backgroundColor = "#fff;";
  messageContainer.style.boxshadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
  messageContainer.innerHTML = "";
  const words = string.split(" ");
  let index = 0;
  const intervalId = setInterval(() => {
    if (index < words.length) {
      let span = document.createElement("span");
      span.innerHTML = words[index] + " ";
      messageContainer.appendChild(span);
      index++;
    } else {
      clearInterval(intervalId);
    }
  }, 200);
}
function extractValues(pokemon) {
  let stats = pokemon.stats.map((stat) => stat.base_stat);
  let weight = pokemon.weight;
  let height = pokemon.height;
  return { stats, weight, height }; // Returnera ett objekt med stats, weight och height
}

function winnerCard(id) {
  let card = document.querySelector(id);
  card.classList.add("winning-card");
  setTimeout(() => {
    card.classList.remove("winning-card");
  }, 5000);
}
function punch(id) {
  let card = document.querySelector(id);
  if (id === "#card-one") {
    card.classList.add("punch-to-two");
    setTimeout(() => {
      card.classList.remove("punch-to-two");
    }, 1000);
  } else {
    card.classList.add("punch-to-one");
    setTimeout(() => {
      card.classList.remove("punch-to-one");
    }, 1000);
  }
}

//Functions

function saveToLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
function getFromLocalStorage(key) {
  let data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}
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
    object.stats,
    object.moves[0].move.name
  );

  assignOneOrTwo(pokemon, id);
}
function assignOneOrTwo(pokemon, id) {
  switch (id) {
    case "one":
      saveToLocalStorage("one", pokemon);
      pokemonOne = pokemon;
      break;
    case "two":
      saveToLocalStorage("two", pokemon);
      pokemonTwo = pokemon;
      break;
    default:
      break;
  }
}
function fetchOneOrTwo(id) {
  switch (id) {
    case "one":
      return { pokemonOne: pokemonOne };
    case "two":
      return { pokemonTwo: pokemonTwo };
    default:
      break;
  }
}

function createPokemonCard(object, id) {
  const key = Object.keys(object)[0];
  const pokemon = object[key];
  const themeColor = typeColor[pokemon.types[0].type.name];
  let cardId = id === "one" ? "card-one" : "card-two";
  let typeId = id === "one" ? "types-one" : "types-two";
  let card = document.querySelector(`#${cardId}`);
  card.innerHTML = "";
  card.innerHTML = `
  <p class="hp">
    <span>HP</span>
      ${pokemon.stats[0].base_stat}
  </p>
  <img src=${pokemon.image}
  alt="a pokemon named ${pokemon.name}"
  class="img" />
  <h2 class="poke-name">${pokemon.name.toUpperCase()}</h2>
  <div class="types ${typeId}">
  </div>
  <div class="stats">
    <div>
      <h3>${pokemon.stats[1].base_stat}</h3>
      <p>Attack</p>
      <h3>${pokemon.stats[3].base_stat}</h3>
      <p>Special Attack</p>
    </div>
    <div>
      <h3>${pokemon.stats[5].base_stat}</h3>
      <p>Speed</p>
      <h3>${pokemon.weight}</h3>
      <p>Weight</p>
      <h3>${pokemon.height}</h3>
      <p>Height</p>
    </div>
    <div>
      <h3>${pokemon.stats[2].base_stat}</h3>
      <p>Defense</p>
      <h3>${pokemon.stats[4].base_stat}</h3>
      <p>Special Defense</p>
    </div>
  </div>
`;

  appendTypes(pokemon.types, typeId);
  styleCard(themeColor, card, typeId);
}

function appendTypes(array, id) {
  array.forEach((type) => {
    let span = document.createElement("span");
    span.textContent = type.type.name;
    document.querySelector(`.${id}`).append(span);
  });
}
function styleCard(color, card, id) {
  card.style.background = `radial-gradient(circle at 50% 0%, ${color} 36%, #ffffff 36%)`;
  card.style.boxShadow = `0 20px 30px rgba(0, 0, 0, 0.15)`;
  card.querySelectorAll(`.${id} span`).forEach((typeColor) => {
    typeColor.style.backgroundColor = color;
  });
}

async function handleSelectClick(url, id) {
  let pokemonObj = await getPokemonData(url);
  capturePokemon(pokemonObj, id);
  let pokemon = fetchOneOrTwo(id);
  createPokemonCard(pokemon, id);
}
async function handleDiceClick(num, id) {
  let pokemonList = await getPokemonList(baseUrl);
  let randomUrl = pokemonList[num].url;

  let pokemonObj = await getPokemonData(randomUrl);
  capturePokemon(pokemonObj, id);
  let pokemon = fetchOneOrTwo(id);
  createPokemonCard(pokemon, id);
}
function randomNumber(min, max) {
  let num = Math.floor(Math.random() * (max - min + 1) + min);
  return num;
}
function alternateString() {
  let nextValue = alternateString.nextValue || "one";
  alternateString.nextValue = nextValue === "one" ? "two" : "one";
  return nextValue;
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

// RandomButton

diceButton.addEventListener("click", () => {
  let num = randomNumber(0, 150);
  let id = alternateString();
  handleDiceClick(num, id);
});

// Compare Button

compareButton.addEventListener("click", () => {
  pokemonOne.compare(pokemonTwo);
});

// PokeBall Button
pokeballButton.addEventListener("click", () => {
  let num = alternateString();
  console.log(num);
});

// Battle Button

battleButton.addEventListener("click", () => {
  pokemonOne.battle(pokemonTwo);
});
