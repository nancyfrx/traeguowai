let currentType = 'cats';
let currentBreeds = catBreeds;

const breedGrid = document.getElementById('breedGrid');
const searchInput = document.getElementById('searchInput');
const modal = document.getElementById('modal');
const modalClose = document.querySelector('.modal-close');
const tabBtns = document.querySelectorAll('.tab-btn');

function renderBreeds(breeds) {
    breedGrid.innerHTML = '';
    
    breeds.forEach((breed, index) => {
        const card = document.createElement('div');
        card.className = 'breed-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        card.innerHTML = `
            <img src="${breed.image}" alt="${breed.name}" class="breed-card-image">
            <div class="breed-card-content">
                <h3 class="breed-card-title">${breed.name}</h3>
                <p class="breed-card-description">${breed.description}</p>
                <div class="breed-card-tags">
                    <span class="breed-card-tag">${breed.personality}</span>
                    <span class="breed-card-tag">${breed.origin}</span>
                </div>
            </div>
        `;
        
        card.addEventListener('click', () => showModal(breed));
        breedGrid.appendChild(card);
    });
}

function showModal(breed) {
    modal.querySelector('.modal-image').src = breed.image;
    modal.querySelector('.modal-image').alt = breed.name;
    modal.querySelector('.modal-title').textContent = breed.name;
    modal.querySelector('.modal-description').textContent = breed.description;
    
    const statValues = modal.querySelectorAll('.stat-value');
    statValues[0].textContent = breed.personality;
    statValues[1].textContent = breed.origin;
    statValues[2].textContent = breed.size;
    statValues[3].textContent = breed.lifespan;
    
    const apiLink = document.getElementById('apiLink');
    if (currentType === 'dogs') {
        apiLink.style.display = 'inline-flex';
    } else {
        apiLink.style.display = 'none';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function hideModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function filterBreeds(query) {
    const filtered = currentBreeds.filter(breed => 
        breed.name.toLowerCase().includes(query.toLowerCase()) ||
        breed.description.toLowerCase().includes(query.toLowerCase())
    );
    renderBreeds(filtered);
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentType = btn.dataset.type;
        currentBreeds = currentType === 'cats' ? catBreeds : dogBreeds;
        
        searchInput.value = '';
        renderBreeds(currentBreeds);
    });
});

searchInput.addEventListener('input', (e) => {
    filterBreeds(e.target.value);
});

modalClose.addEventListener('click', hideModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        hideModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        hideModal();
    }
});

renderBreeds(currentBreeds);