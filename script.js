class PokemonApp {
  constructor() {
    this.apiUrl = 'https://pokeapi.co/api/v2/pokemon';
    this.pokemonContainer = document.getElementById('pokemonContainer');
    this.modalContainer = document.getElementById('modalContainer');
    this.loadButton = document.getElementById('loadButton');
    this.resetButton = document.getElementById('resetButton');
    this.chartCanvas = document.getElementById('chartCanvas');
    this.nextButton = document.getElementById('nextPokemon');

    this.pokemons = [];
    this.offset = 0;
    this.limit = 20; // Número de pokemones a cargar por vez

    this.loadButton.addEventListener('click', this.loadMorePokemons.bind(this));
    this.resetButton.addEventListener('click', this.resetPokemons.bind(this));
    // this.nextbutton.addEventListener('click', this.nextPokemon.bind(this));

    this.searchForm = document.querySelector('form');
    this.searchForm.addEventListener('submit', this.searchPokemon.bind(this));
    
  }
  
  async searchPokemon(event) {
    event.preventDefault();
  
    const searchInput = this.searchForm.querySelector('input');
    const searchTerm = searchInput.value.trim().toLowerCase();
  
    if (searchTerm === '') {
      return;
    }
  
    try {
      const response = await fetch(`${this.apiUrl}/${searchTerm}`);
      if (!response.ok) {
        throw new Error('No se encontró el Pokémon');
      }
      const data = await response.json();
      const pokemon = {
        name: data.name,
        url: `${this.apiUrl}/${data.id}`,
      };
      window.location.href = `pokemon.html?name=${pokemon.name}&url=${pokemon.url}`;
    } catch (error) {
      console.log('Error:', error);
      alert('No se encontró el Pokémon');
    }
  }
  

  async getPokemons() {
    try {
      const fetchData = () => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(fetch(`${this.apiUrl}?offset=${this.offset}&limit=${this.limit}`));
          }, 2000);
        });
      };
  
      const response = await fetchData();
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.log('Error:', error);
      throw new Error('Error al obtener los pokemones');
    }
  }

  async getPokemons() {
  try {
    const fetchData = () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(fetch(`${this.apiUrl}?offset=${this.offset}&limit=${this.limit}`));
        }, 2000);
      });
    };

    const response = await fetchData();
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.log('Error:', error);
    throw new Error('Error al obtener los pokemones');
  }
}

  async getPokemonDetails(url) {
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log('Error:', error);
      throw new Error('Error al obtener los detalles del Pokémon');
    }
  }

  displayPokemons(pokemons) {
    pokemons.forEach((pokemon) => {
      const card = this.createCard(pokemon);
      this.pokemonContainer.appendChild(card);
      this.pokemons.push(pokemon);
    });
  }


  async displayModal(pokemon) {
    this.modalContainer.innerHTML = '';

    const modal = document.createElement('div');
    modal.classList.add('modal', 'fade');
    modal.tabIndex = '-1';
    modal.role = 'dialog';
    modal.setAttribute('aria-hidden', 'true');

    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog');
    modalDialog.role = 'document';

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const modalHeader = document.createElement('div');
    modalHeader.classList.add('modal-header');

    const modalTitle = document.createElement('h5');
    modalTitle.classList.add('modal-title');
    modalTitle.textContent = this.capitalizeFirstLetter(pokemon.name);

    const modalCloseButton = document.createElement('button');
    modalCloseButton.classList.add('btn-close');
    modalCloseButton.type = 'button';
    modalCloseButton.setAttribute('data-bs-dismiss', 'modal');
    modalCloseButton.setAttribute('aria-label', 'Close');

    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(modalCloseButton);

    const modalBody = document.createElement('div');
    modalBody.classList.add('modal-body');

    const pokemonDetails = await this.getPokemonDetails(pokemon.url);

    modalBody.appendChild(this.createChart(pokemonDetails));

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);

    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    this.modalContainer.appendChild(modal);

    const myModal = new bootstrap.Modal(modal);
    myModal.show();
  }

  createCard(pokemon) {
    const card = document.createElement('div');
    card.classList.add('card');

    const image = document.createElement('img');
    image.classList.add('card-img-top');
    image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${this.getPokemonId(
      pokemon.url
    )}.svg`;
    // image.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${this.getPokemonId(
    //   pokemon.url
    // )}.png`;
    image.alt = pokemon.name;

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const cardTitle = document.createElement('h6');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = this.capitalizeFirstLetter(pokemon.name);

    const cardButton = document.createElement('button');
    cardButton.classList.add('btn', 'btn-secondary', 'btn-sm');
    cardButton.textContent = 'Ver más';
    cardButton.addEventListener('click', () => this.displayModal(pokemon));

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardButton);

    card.appendChild(image);
    card.appendChild(cardBody);

    return card;
  }

  createChart(pokemon) {
    const chartCanvas = document.createElement('canvas');
    chartCanvas.id = 'chartCanvas';

    const ctx = chartCanvas.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['HP', 'Attack', 'Defense', 'Special Attack', 'Special Defense', 'Speed'],
        datasets: [
          {
            label: 'Poderes',
            data: [
              pokemon.stats[0].base_stat,
              pokemon.stats[1].base_stat,
              pokemon.stats[2].base_stat,
              pokemon.stats[3].base_stat,
              pokemon.stats[4].base_stat,
              pokemon.stats[5].base_stat,
            ],
            backgroundColor: [
              'rgba(255, 99, 132, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(75, 192, 192, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
            ],
          },
        ],
      },
    });

    return chartCanvas;
  }

  getPokemonId(url) {
    const regex = /\/(\d+)\//;
    const match = url.match(regex);
    return match[1];
  }

  getRandomStats() {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 100));
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  async loadMorePokemons() {
    const pokemons = await this.getPokemons();
    this.displayPokemons(pokemons);
    this.offset += this.limit;
    document.getElementById('loadButton').innerHTML='Cargar mas';
  }
// Boton siguiente
  async nextPokemon() {
    const pokemons = await this.getPokemons();
    this.displayPokemons(pokemons);
    this.offset += this.limit;
  }

  resetPokemons() {
    document.getElementById('loadButton').innerHTML='Cargar';
    this.pokemonContainer.innerHTML = '';
    this.pokemons = [];
    this.offset = 0;
  }
}


const app = new PokemonApp();