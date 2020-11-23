const apiUrl = 'https://cors-anywhere.herokuapp.com/https://superheroapi.com/api/10218999215392598';
const searchInput = document.querySelector('.search-box');
const searchBtn = document.querySelector('.search-btn');
const randBtn = document.querySelector('.rand-btn');
const searchResults = document.querySelector('.heroes');

function enableSpinner(e) {
	const btnDataset = e.target.dataset.type;
	const loader = document.createElement('div');
	const loaderContainer = document.querySelector('.loader-container');
	loaderContainer.classList.add('loader-enabled');
	loader.classList.add('loader');
	loaderContainer.appendChild(loader);
	searchInput.disabled = true;
	if (btnDataset === 'random') getRandomHero();
	else getHero();
}

function disableSpiner() {
	const loader = document.querySelector('.loader');
	const loaderContainer = document.querySelector('.loader-container');
	loaderContainer.classList.remove('loader-enabled');
	searchInput.disabled = false;
	loader.remove();
	searchInput.value = '';
}

function noHeroesFoundError(text) {
	const errorEl = document.createElement('p');
	errorEl.classList.add('error-text');
	if (text.includes('error')) errorEl.innerText = `${text}`;
	else errorEl.innerText = `No heroes found with your query (${text})`;
	searchResults.insertAdjacentElement('beforebegin', errorEl);
	disableSpiner();
	setTimeout(() => {
		errorEl.remove();
	}, 2500);
}

async function getHero() {
	searchResults.innerHTML = '';
	const searchInput = document.querySelector('.search-box').value;
	try {
		const res = await fetch(`${apiUrl}/search/${searchInput.trim().toLowerCase()}`);
		const data = await res.json();
		if (data.response === 'success') {
			data.results.forEach(hero => displayHeroes(hero));
			disableSpiner();
		} else if ((data.response = 'error')) {
			noHeroesFoundError(searchInput);
		}
		return data;
	} catch (error) {
		noHeroesFoundError('Server error');
		console.log('getHero error -> ', error);
	}
}

async function getRandomHero() {
	searchResults.innerHTML = '';
	const randomId = Math.floor(Math.random() * 731);
	console.log(randomId);
	try {
		const res = await fetch(`${apiUrl}/${randomId}`);
		const data = await res.json();
		if (data.response === 'success') {
			displayHeroes(data);
			disableSpiner();
		} else if ((data.response = 'error')) {
			noHeroesFoundError(searchInput);
		}
		return data;
	} catch (error) {
		console.log('getRandomHero error -> ', error);
	}
}

function displayHeroes(data) {
	console.log(data);
	const newHeroCard = document.createElement('div');
	newHeroCard.classList.add('hero-card');
	newHeroCard.innerHTML = `
		<img src="${data.image.url}" alt="${data.name}">
		<p>${data.name}</p>
		<button class="light-text">More Details</button>
		`;
	searchResults.appendChild(newHeroCard);
}

// Event listeners
searchBtn.addEventListener('click', e => (searchInput.value ? enableSpinner(e) : ''));
randBtn.addEventListener('click', enableSpinner);
searchInput.addEventListener('keydown', e => {
	if (e.key === 'Enter' && searchInput.value) enableSpinner(e);
});
