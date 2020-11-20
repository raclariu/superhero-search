const apiUrl = 'https://superheroapi.com/api/10218999215392598';
const searchInput = document.querySelector('.search-box');
const searchBtn = document.querySelector('.search-btn');
const randBtn = document.querySelector('.rand-btn');
const searchResults = document.querySelector('.heroes');

function enableLoadingAnim() {
	const loader = document.createElement('div');
	const loaderContainer = document.querySelector('.loader-container');
	loaderContainer.classList.add('loader-enabled');
	loader.classList.add('loader');
	loaderContainer.appendChild(loader);
	searchInput.disabled = true;
	searchInput.style.opacity = 0.5;
	searchBtn.style.opacity = 0.5;
	randBtn.style.opacity = 0.5;
	getHero();
}

function disableLoadingAnim() {
	const loader = document.querySelector('.loader');
	const loaderContainer = document.querySelector('.loader-container');
	console.dir(loader);
	loaderContainer.classList.remove('loader-enabled');
	searchInput.style.opacity = 1;
	searchBtn.style.opacity = 1;
	randBtn.style.opacity = 1;
	searchInput.disabled = false;
	loader.remove();
	searchInput.value = '';
}

function noHeroesFoundError() {
	const errorText = document.createElement('p');
	errorText.classList.add('error-text');
	errorText.innerText = `No heroes found with your query (${searchInput.value})`;
	searchResults.insertAdjacentElement('beforebegin', errorText);
}

async function getHero() {
	const searchInput = document.querySelector('.search-box').value;
	searchResults.innerHTML = '';
	try {
		const res = await fetch(`${apiUrl}/search/${searchInput}`);
		const data = await res.json();
		if (data.response === 'success') {
			displaySearchResults(data);
			disableLoadingAnim();
		} else if ((data.response = 'error')) {
			noHeroesFoundError();
			disableLoadingAnim();
		}
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
searchBtn.addEventListener('click', enableLoadingAnim);
randBtn.addEventListener('click', getRandomHero);
