// implementing the dark/light mode switch
let darkMode = localStorage.getItem('darkmode');
const toggleBtn = document.querySelector('#toggle-button');
const mainHeader = document.querySelector('#main-header_content')
const mainSearch = document.querySelector('.main-header_search')

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    localStorage.setItem('darkmode', 'enabled');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    localStorage.setItem('darkmode', null);
}

if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
}

toggleBtn.addEventListener('click', () => {
    if (darkMode === 'enabled') {
        disableDarkMode()
    }
    else {
        enableDarkMode()
    }
    darkMode = localStorage.getItem('darkmode')
})

// the drop down functionality in the side navbar
const mainItems = document.querySelectorAll('.main-section-item');

mainItems.forEach(item => {
    let sectionName = item.dataset.sectionName
        item.addEventListener('click', () => {
            document.querySelector(`#${sectionName}-drop-down`).classList.toggle('d-none'); 
        })
})
let category = sessionStorage.getItem('categorySelected')
if (category == null) {
    category = 'Main'
    sessionStorage.setItem('categorySelected', 'Main')
}
console.log(category)
let selected = document.querySelector(`#${category}`)
let t = selected.getAttribute('data-target');
console.log(t)
selected.classList.add('fw-bolder')
document.querySelector(`#${t}`).classList.add('selected')
document.querySelector(`#nav-${t}`).classList.add('clicked')

// clicking on a sub-item event 
const subItems = document.querySelectorAll('.sub-item');

subItems.forEach(item => {
    item.addEventListener('click', () => {
        sessionStorage.setItem('categorySelected', `${item.id}`);
    })
})

const ddItems = document.querySelectorAll('.nav-dd-item');

ddItems.forEach(item => {
    let target = item.getAttribute('data-target')
        item.addEventListener('click', () => {
        let subItem = document.querySelector(`#${target}`)
        sessionStorage.setItem('categorySelected', `${subItem.id}`)
    })
})

const dropDowns = document.querySelectorAll('.drop-down');

dropDowns.forEach(dropDown => {
    let icon = dropDown.querySelector(':scope > .nav-link > .fa-caret-down');
    dropDown.addEventListener('mouseenter', () => {
        icon.classList.replace('fa-caret-down', 'fa-caret-up')
    })
    dropDown.addEventListener('mouseleave', () => {
        icon.classList.replace('fa-caret-up', 'fa-caret-down')
    })
})

function toggleSearch() {
    mainHeader.classList.toggle('d-none')
    mainSearch.classList.toggle('d-none')
}

const searchBtn = document.querySelector('#min-search-btn');
const backBtn = document.querySelector('#backBtn')

searchBtn.addEventListener('click', toggleSearch)
backBtn.addEventListener('click', toggleSearch)

