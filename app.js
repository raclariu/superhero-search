const apiUrl = 'https://cors-anywhere.herokuapp.com/https://superheroapi.com/api/10218999215392598';
const searchInput = document.querySelector('.search-box');
const searchBtn = document.querySelector('.search-btn');
const randBtn = document.querySelector('.rand-btn');
let heroDetailsBtn;
let searchedHeroData = [];
const searchResults = document.querySelector('.heroes');
const modal = document.querySelector('.modal');
const modalContent = document.querySelector('.modal-content');
const closeModalBtn = document.querySelector('.modal-close');

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
		let res;
		let data;
		if (parseInt(searchInput)) {
			console.log('test');
			res = await fetch(`${apiUrl}/${searchInput.trim()}`);
			data = await res.json();
			if (data.response === 'success') {
				displayHeroes(data);
				disableSpiner();
			} else if ((data.response = 'error')) {
				noHeroesFoundError(searchInput);
			}
			return data;
		}

		if (typeof searchInput === 'string') {
			res = await fetch(`${apiUrl}/search/${searchInput.trim().toLowerCase()}`);
			data = await res.json();
			if (data.response === 'success') {
				data.results.forEach(hero => displayHeroes(hero));
				disableSpiner();
			} else if ((data.response = 'error')) {
				noHeroesFoundError(searchInput);
			}
			return data;
		}
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
	modalContent.innerHTML = '';
	searchedHeroData.push(data);
	const newHeroCard = document.createElement('div');
	newHeroCard.classList.add('hero-card');
	newHeroCard.setAttribute('data-id', `${data.id}`);
	newHeroCard.innerHTML = `
		<img src="${data.image.url}" alt="${data.name}">
		<p>${data.name}</p>
		<button class="light-text hero-details-btn">More Details</button>
		`;
	searchResults.appendChild(newHeroCard);
	heroDetailsBtn = document.querySelectorAll('.hero-details-btn');
	heroDetailsBtn.forEach(btn => btn.addEventListener('click', displayModal));
}

function displayModal(e) {
	modal.classList.add('active');
	const heroClickedId = e.target.parentElement.dataset.id;
	const hero = searchedHeroData.find(hero => hero.id === heroClickedId);
	console.log(hero);
	console.log(heroClickedId);
	modalContent.innerHTML = `
		<div class="portrait">
			<img src="${hero.image.url}" alt="${hero.name}">
			<p>${hero.name}</p>
		</div>
		<div class="appearance">
			<p>Appearance</p>
			<p>Gender: ${hero.appearance.gender}</p>
			<p>Eye Color: ${hero.appearance['eye-color']}</p>
			<p>Hair Color: ${hero.appearance['hair-color']}</p>
			<p>Race: ${hero.appearance.race}</p>
			<p>Height: ${hero.appearance.height[1]}</p>
			<p>Weight: ${hero.appearance.weight[1]}</p>
		</div>
		<div class="biography">
			<p>Biography</p>
			<p>Full Name: ${hero.biography['full-name']}</p>
			<p>Alter Egos: ${hero.biography['alter-egos']}</p>
			<p>Alignment: ${hero.biography.alignment}</p>
			<p>Publisher: ${hero.biography.publisher}</p>
		</div>
		<div class="powerstats">
			<label for="combat">Combat</label>
			<progress class="combat" value="${hero.powerstats.combat}" max="100">${hero.powerstats.combat}</progress>
			<label for="durability">Durability</label>
			<progress class="durability" value="${hero.powerstats.durability}" max="100">${hero.powerstats.durability}</progress>
			<label for="intelligence">Intelligence</label>
			<progress class="intelligence" value="${hero.powerstats.intelligence}" max="100">${hero.powerstats
		.intelligence}</progress>
			<label for="power">Power</label>
			<progress class="power" value="${hero.powerstats.power}" max="100">${hero.powerstats.power}</progress>
			<label for="speed">Speed</label>
			<progress class="speed" value="${hero.powerstats.speed}" max="100">${hero.powerstats.speed}</progress>
			<label for="strength">Strength</label>
			<progress class="strength" value="${hero.powerstats.strength}" max="100">${hero.powerstats.strength}</progress>
		</div>
	`;
}

function closeModal() {
	modal.classList.remove('active');
}

// Event listeners
searchBtn.addEventListener('click', e => (searchInput.value ? enableSpinner(e) : ''));
randBtn.addEventListener('click', enableSpinner);
searchInput.addEventListener('keydown', e => {
	if (e.key === 'Enter' && searchInput.value) enableSpinner(e);
});
closeModalBtn.addEventListener('click', closeModal);
