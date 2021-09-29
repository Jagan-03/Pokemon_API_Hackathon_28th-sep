let getPokemonDetails = async (URL) => {
  try {
    let url = URL;
    // Fetching information using FETCH
    let data = await fetch(url);
    // Returning the data in json format
    return data.json();
  } catch (error) {
    console.error(error);
  }
};

// Displaying pokemons in the Home page(index.html)
let displayPokemons = async () => {
  let allPokemons = await getPokemonDetails(
    "https://pokeapi.co/api/v2/pokemon?limit=50"
  );
  console.log(allPokemons.results);
  // Getting hold of the main container where all the card bodies are going to be placed
  let pokemons = document.getElementById("pokemons");
  // Creating new card for each pokemons
  allPokemons.results.forEach(async (pokemon, index) => {
    // Getting the pokemon details form the API
    let pokemonDetails = await getPokemonDetails(pokemon.url);
    // Creating new container for card
    let newCardContainer = document.createElement("div");
    newCardContainer.classList.add("col-md-3", "mt-2", "mb-3");
    let newLink = document.createElement("a");
    newLink.href = "/pages/pokemon-details.html";
    newLink.id = index;
    newLink.setAttribute("onclick", "handlePokemonSelection(this)");
    // Creating new card
    let newCard = document.createElement("div");
    newCard.classList.add("card");
    // New container for card image
    let newCardImageCont = document.createElement("div");
    newCardImageCont.classList.add(
      "bg-image",
      "hover-zoom",
      "hover-overlay",
      "hover-shadow"
    );
    // Image element
    let newCardImage = document.createElement("img");
    newCardImage.classList.add("w-100");
    newCardImage.src =
      pokemonDetails.sprites.other["official-artwork"].front_default;
    newCardImage.alt = pokemon.name;
    // Container mask
    let newMask = document.createElement("div");
    newMask.classList.add("mask");
    let newMaskImage = document.createElement("img");
    newMaskImage.classList.add("mask-image");
    newMaskImage.src = "/images/pokeball.png";
    newMask.appendChild(newMaskImage);
    // Appending the image to image cont
    newCardImageCont.append(newCardImage, newMask);
    // New container for card body
    let newCardBody = document.createElement("div");
    newCardBody.classList.add(
      "card-body",
      "text-center",
      "bg-black",
      "text-light"
    );
    // Pokemon name element
    let pokemonName = document.createElement("h5");
    pokemonName.classList.add("card-title");
    pokemonName.innerText = pokemon.name.toUpperCase();
    // Appending the name to card body
    newCardBody.appendChild(pokemonName);

    // Appending all the child to new Card
    newCard.append(newCardImageCont, newCardBody);
    // Appending newCard to the link
    newLink.appendChild(newCard);
    // Appending the newLink to the newCardContainer
    newCardContainer.appendChild(newLink);

    // And finally appending the NewCardContainer to the main pokemon container
    pokemons.appendChild(newCardContainer);
  });
};

let handlePokemonSelection = (pokemon) => {
  // storing the pokemon index to the localstorage
  localStorage.selectedPokemon = pokemon.id;
};

// Displaying pokemon details in separate page (pokemon-details.html)
let displayPokemonDetail = async () => {
  // getting the selected pokemon index from the local storage
  let selectedPokemon = localStorage.getItem("selectedPokemon");
  // Getting all pokemon details
  let allPokemons = await getPokemonDetails(
    "https://pokeapi.co/api/v2/pokemon?limit=50"
  );
  let pokemonName = allPokemons.results[selectedPokemon].name.toUpperCase();
  // Getting the details of the selected pokemon
  let pokemonDetails = await getPokemonDetails(
    allPokemons.results[selectedPokemon].url
  );
  console.log(pokemonDetails);
  // Getting hold of the pokemon detail container to update pokemon details
  let pokemonCont = document.getElementById("pokemon-detail");
  // Creating a container for displaying the pokemon's details
  let pokemon = document.createElement("div");
  pokemon.classList.add(
    "container",
    "d-flex",
    "flex-column",
    "pokemon",
    "rounded"
  );
  //Row - 1 Title row with pokemon's name
  let name = document.createElement("div");
  name.classList.add("text-center", "pb-5");
  name.innerHTML = `<h1 class="name">${pokemonName}</h1>`;
  // Appending the name to pokemon container
  pokemon.appendChild(name);
  // Appending the pokemon to main container

  // Row 2
  let detailsCont = document.createElement("div");
  detailsCont.classList.add("row");
  // Column 1 avatar
  let avatarCont = document.createElement("div");
  avatarCont.classList.add("col-lg-6", "pb-3");
  avatarCont.innerHTML = `<div class="pokemon-avatar text-center rounded">
    <img src=${pokemonDetails.sprites.other["official-artwork"].front_default} class="img-fluid" alt=${pokemonName}>
    </div>`;
  detailsCont.appendChild(avatarCont);

  // Column 2 details
  let pokemonDescription = document.createElement("div");
  pokemonDescription.classList.add("col-lg-6", "pokemon-det", "rounded");
  // Column - 2 Row 1
  let row1 = document.createElement("div");
  row1.classList.add("bg-dark", "row", "rounded", "p-3");
  // height element
  row1.innerHTML += `<div class="col-lg-6">
                                    <h5 class="text-light">HEIGHT</h5>
                                    <p class="text-info">${pokemonDetails.height} cm</p>
                                </div>`;
  // weight element
  row1.innerHTML += `<div class="col-lg-6">
    <h5 class="text-light">WEIGHT</h5>
    <p class="text-info">${pokemonDetails.weight} lbs</p>
</div>`;
  // Abilities
  row1.innerHTML += `<div class="col-lg-12">
    <h5 class="text-light">ABILITIES</h5>
    <p id="abilities" class="text-info"></p>
</div>`;

  // Column - 2 Row 2
  let row2 = document.createElement("div");
  row2.classList.add("row", "p-3");
  row2.innerHTML = `<h5 class="text-black fw-bold">TYPES</h5>`;
  pokemonDetails.types.forEach((type) => {
    row2.innerHTML += `<span class="badge bg-danger w-25 m-2 p-2">${type[
      "type"
    ].name.toUpperCase()}</span>`;
  });
  // Column - 2 Row 3
  let row3 = document.createElement("div");
  row3.classList.add("row", "p-3");
  row3.innerHTML = `<h5 class="text-black fw-bold">MOVES</h5>`;
  let movesDiv = document.createElement("div");
  movesDiv.classList.add("moves", "row");
  pokemonDetails.moves.forEach((move) => {
      movesDiv.innerHTML += `<span class="badge bg-info text-dark w-25 m-2 p-2">${move["move"].name.toUpperCase()}</span>`;
    });
    row3.appendChild(movesDiv);

    // Appending all row to pokemonDescription Cont
  pokemonDescription.append(row1, row2, row3);
//   Appending pokemonDescription to detailsCont
  detailsCont.appendChild(pokemonDescription);
//   Appending detailsCont to pokemon Cont
  pokemon.appendChild(detailsCont);
//   Appedning Pokemon to pokemon cont
  pokemonCont.appendChild(pokemon);

//   Adding pokemon abilities
  pokemonDetails.abilities.forEach((ability) => {
    if (document.getElementById("abilities").innerText === "") {
      document.getElementById("abilities").innerText +=
        ability["ability"].name.toUpperCase();
    } else {
      document.getElementById("abilities").innerText +=
        ", " + ability["ability"].name.toUpperCase();
    }
  });
};
