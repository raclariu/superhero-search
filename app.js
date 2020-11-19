const apiUrl = 'https://cors-anywhere.herokuapp.com/https://superheroapi.com/api/10218999215392598';
const searchBtn = document.querySelector('.search-btn');
const randBtn = document.querySelector('.rand-btn');
const searchResults = document.querySelector('.heroes');

async function getHero() {
	const searchInput = document.querySelector('.search-box').value;
	searchResults.innerHTML = '';
	try {
		const res = await fetch(`${apiUrl}/search/${searchInput}`);
		const data = await res.json();
		displaySearchResults(data);
		return data;
	} catch (error) {
		console.log('getHero error -> ', error);
	}
}

async function getRandomHero() {
	const randomId = Math.floor(Math.random() * 731);
	console.log(randomId);
	try {
		const res = await fetch(`${apiUrl}/${randomId}`);
		const data = await res.json();
		displaySearchResults(data);
		return data;
	} catch (error) {
		console.log('getHero error -> ', error);
	}
}

function displaySearchResults(data) {
	console.log(data);
	const heroesFoundArray = data.results;
	console.log(heroesFoundArray);
	heroesFoundArray.forEach(hero => {
		console.log(hero.id);
		const newHeroCard = document.createElement('div');
		newHeroCard.classList.add('hero-card');
		newHeroCard.innerHTML = `
			<img src="${hero.image.url}" alt="${hero.name}">
		<p>${hero.name}</p>
		<button class="light-text">More Details</button>
		`;
		searchResults.appendChild(newHeroCard);
	});
}

// Event listeners
searchBtn.addEventListener('click', getHero);
randBtn.addEventListener('click', getRandomHero);
