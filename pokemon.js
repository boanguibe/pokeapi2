class PokemonDetails {
    constructor() {
      this.apiUrl = 'https://pokeapi.co/api/v2/pokemon';
      this.pokemonDetailsContainer = document.getElementById('pokemonDetailsContainer');
  
      this.getPokemonFromURL();
    }
  
    async getPokemonFromURL() {
      const urlParams = new URLSearchParams(window.location.search);
      const pokemonName = urlParams.get('name');
      const pokemonUrl = urlParams.get('url');
  
      if (!pokemonName || !pokemonUrl) {
        return;
      }
  
      try {
        const response = await fetch(pokemonUrl);
        if (!response.ok) {
          throw new Error('No se encontró el Pokémon');
        }
        const data = await response.json();
        const pokemonDetails = this.createPokemonDetails(pokemonName, data);
        this.displayPokemonDetails(pokemonDetails);
      } catch (error) {
        console.log('Error:', error);
        alert('No se encontró el Pokémon');
      }
    }
  
    createPokemonDetails(name, data) {
      // Crea los elementos y estructura HTML para mostrar los detalles del Pokémon
      const pokemonDetails = document.createElement('div');
      pokemonDetails.classList.add('col');
      pokemonDetails.innerHTML = `
        <h1>${name}</h1>
        <p>Weight: ${data.weight}</p>
        <p>Height: ${data.height}</p>
        <p>Base Experience: ${data.base_experience}</p>
        <img src="${data.sprites.front_default}" alt="${name} Sprite">
      `;
      return pokemonDetails;
    }
  
    displayPokemonDetails(pokemonDetails) {
      this.pokemonDetailsContainer.appendChild(pokemonDetails);
    }
  }
  
  window.addEventListener('DOMContentLoaded', () => {
    new PokemonDetails();
  });
  