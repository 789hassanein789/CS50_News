// implementing the dark/light mode switch
let darkMode = localStorage.getItem('darkmode');
const toggleBtn = document.querySelector('#toggle-button');

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

// clicking on a sub-item event 
const subItems = document.querySelectorAll('.sub-item');

subItems.forEach(item => {
    let itemTarget = item.getAttribute('data-target');
    item.addEventListener('click', () => {
        document.querySelectorAll('.fw-bold').forEach(bold => bold.classList.remove('fw-bold'));
        document.querySelectorAll('.selected').forEach(selected => selected.classList.remove('selected'));
        let target = document.querySelector(`#${itemTarget}`);
        item.classList.add('fw-bold');
        target.classList.add('selected');
    })
})