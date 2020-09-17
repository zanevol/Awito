'use strict';

const dataBase = JSON.parse(localStorage.getItem('awito')) || [];

const modalAdd = document.querySelector('.modal__add'),
	addAd = document.querySelector('.add__ad'),
	modalBtnSubmit = document.querySelector('.modal__btn-submit'),
	modalAddSubmit = document.querySelector('.modal__submit'),
	catalog = document.querySelector('.catalog'),
	modalItem = document.querySelector('.modal__item'),
	elemsModalAddSubmit = [...modalAddSubmit].filter(elem => elem.tagName !== 'BUTTON' && elem.type !== 'submit'),
	modalBtnWarning = document.querySelector('.modal__btn-warning'),
	modalFileInput = document.querySelector('.modal__file-input'),
	modalFileBtn = document.querySelector('.modal__file-btn'),
	modalImageAdd = document.querySelector('.modal__image-add'),
	textFileBtn = modalFileBtn.textContent,
	srcModalImage = modalImageAdd.src,
	modalImageItem = document.querySelector('.modal__image-item'),
	modalHeaderItem = document.querySelector('.modal__header-item'),
	modalStatusItem = document.querySelector('.modal__status-item'),
	modalDescriptionItem = document.querySelector('.modal__description-item'),
	modalCostItem = document.querySelector('.modal__cost-item'),
	searchInput = document.querySelector('.search__input'),
	menuContainer = document.querySelector('.menu__container');
let counter = dataBase.length;

const infoPhoto = {};

const saveDB = () => localStorage.setItem('awito', JSON.stringify(dataBase));

const checkForm = () => {
	const validForm = elemsModalAddSubmit.every(elem => elem.value);
	modalBtnSubmit.disabled = !validForm;
	modalBtnWarning.style.display = validForm ? 'none' : '';
};

const openAddModal = () => {
	modalAdd.classList.remove('hide');
	modalBtnSubmit.disabled = true;
	document.addEventListener('keyup', closeModal);
};

const openItemModal = event => {
	const target = event.target;
	const card = target.closest('.card');

	if (card) {
		const item = dataBase.find(elem => elem.id === +card.dataset.id);
		modalImageItem.src = `data:image/jpeg;base64,${item.image}`;
		modalHeaderItem.textContent = item.nameItem;
		modalStatusItem.textContent = item.status === 'new' ? 'Новый' : 'Б/У';
		modalDescriptionItem.textContent = item.descriptionItem;
		modalCostItem.textContent = item.costItem;
		modalItem.classList.remove('hide');
		document.addEventListener('keyup', closeModal);
	}
};

const closeModal = event => {
	const target = event.target;
	if (target.matches('.modal__close') || target === modalAdd || target === modalItem || event.code === 'Escape') {
		modalAdd.classList.add('hide');
		modalItem.classList.add('hide');
		document.removeEventListener('keyup', closeModal);
		modalAddSubmit.reset();
		modalImageAdd.src = srcModalImage;
		modalFileBtn.textContent = textFileBtn;
		checkForm();
	}
};

const addAnnouncement = (event) => {
	event.preventDefault();
	const itemObj = {};
	for (const elem of elemsModalAddSubmit) {
		itemObj[elem.name] = elem.value;
	}
	itemObj.id = counter++;
	itemObj.image = infoPhoto.base64;
	dataBase.push(itemObj);
	closeModal({ target: modalAdd });
	saveDB();
	renderCard();
};

const renderCard = (DB = dataBase) => {
	catalog.textContent = '';
	DB.forEach((elem) => {
		catalog.insertAdjacentHTML('beforeend', `
		<li class="card" data-id="${elem.id}">
					<img class="card__image" src="data:image/jpeg;base64,${elem.image}" alt="test">
					<div class="card__description">
						<h3 class="card__header">${elem.nameItem}</h3>
						<div class="card__price">${elem.costItem} ₽</div>
					</div>
				</li>
		`)
	});
};

const addPhoto = event => {
	const target = event.target.files[0];
	const reader = new FileReader();
	infoPhoto.filename = target.name;
	infoPhoto.size = target.size;
	reader.readAsBinaryString(target);
	reader.addEventListener('load', event => {
		if (infoPhoto.size < 200000) {
			modalFileBtn.textContent = infoPhoto.filename;
			infoPhoto.base64 = btoa(event.target.result);
			modalImageAdd.src = `data:image/jpeg;base64,${infoPhoto.base64}`;
		}
		else {
			modalFileBtn.textContent = 'Файл не должен превышать 200Kb';
			modalFileInput.value = '';
			checkForm();
		}

	});

};

const searchInp = () => {
	const valueSearch = searchInput.value.trim().toLowerCase();
	if (valueSearch.length > 2) {
		const result = dataBase.filter(item => item.nameItem.toLowerCase().includes(valueSearch) || item.descriptionItem.toLowerCase().includes(valueSearch));
		renderCard(result);
	}
};

const menuFilter = event => {
	const target = event.target;
	if (target.tagName === 'A') {
		const result = dataBase.filter(item => item.category === target.dataset.category);
		renderCard(result);
	}
};




addAd.addEventListener('click', openAddModal);
modalAdd.addEventListener('click', closeModal);
catalog.addEventListener('click', openItemModal);
modalItem.addEventListener('click', closeModal);
modalAddSubmit.addEventListener('input', checkForm);
modalAddSubmit.addEventListener('submit', addAnnouncement);
modalFileInput.addEventListener('change', addPhoto);
searchInput.addEventListener('input', searchInp);
menuContainer.addEventListener('click', menuFilter);
renderCard();

