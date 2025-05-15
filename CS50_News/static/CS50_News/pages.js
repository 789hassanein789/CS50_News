const distributionForm = document.querySelector('#distribution-form');
const newsSearch = document.querySelector('.news-search');
const createLinks = document.querySelectorAll('.create')
const editPage = document.querySelector('#edit-page')
const mainPage = document.querySelector('#main-page')
const pagesContainer = document.querySelector('#main-page')
const selectBtns = document.querySelectorAll('.select-btn')
const pages = document.querySelectorAll('.page')
const placementsPage = document.querySelector('#placements-page')
const backBtn = editPage.querySelector('.back-btn')
const sectionEditBtns = document.querySelectorAll('.section-edit')
const mainPageArticles = document.querySelectorAll('#main-page .article')
const selectLinks = document.querySelectorAll('.select-link')
const createBtns = document.querySelectorAll(".create-btn")
const cancelBtn = document.querySelector('#cancel-btn')
const overlay = document.querySelector('.overlay')
let placeholders;

// dark mode
let darkMode = localStorage.getItem('darkmode');
if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
    document.body.setAttribute('data-bs-theme', 'dark')
}

// edit page back button
backBtn.addEventListener('click', back)

// make articles unclickable in the main page
mainPageArticles.forEach(article => {
    article.removeAttribute('href')
})

// chose a position in the main page & show('edit-page')
createLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (link.dataset.num)
        selectLinks.forEach(selectlink => {
            selectlink.setAttribute('href', `${selectlink.getAttribute('href')}&position=${link.dataset.num}`)
        })
        show('edit-page')
    })
})

// create link drop down
createBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        const child = btn.firstElementChild
        child.classList.toggle('fa-chevron-down')
        child.classList.toggle('fa-chevron-up')
        btn.nextElementSibling.classList.toggle('d-none')
    })
})

// cancel delete section
cancelBtn.addEventListener('click', overlay.classList.add('d-none'))

function show(pageName) {
    pages.forEach(page => {
        page.classList.add('d-none')
    })
    const pageToSee = document.getElementById(pageName)
    pageToSee.scroll(top)
    pageToSee.classList.remove('d-none')
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Check if this cookie string begins with the name we want
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function back() {
    editPage.classList.add('d-none')
    mainPage.classList.remove('d-none')
}

function editDesign(e) {
    const section = e.target.parentElement.nextElementSibling
    const sectionName = section.id.replace('-section', '')
    sessionStorage.setItem('chosed-design', section.dataset.id)
    distributionForm.innerHTML = editPage.querySelector(`#${sectionName}-section-design`).outerHTML
    placeholders = document.querySelectorAll('#distribution-form .article');
    preSelectedPlaceholders = section.querySelectorAll('.article');
    for (let i = 0; i < placeholders.length; i++) {
        if (preSelectedPlaceholders[i]) {
            const img = placeholders[i].querySelector('img')
            const h6 = placeholders[i].querySelector('h6')
            const p = placeholders[i].querySelector('p')
            const secondaryDiv = placeholders[i].querySelector('.secondary-div')
            const linkSecondaryDiv = preSelectedPlaceholders[i].querySelector('.secondary-div')
            if (img) {
                img.src = preSelectedPlaceholders[i].querySelector('img').src
            }
            if (h6) {
                h6.textContent = preSelectedPlaceholders[i].querySelector('h6').textContent
            }
            if (p) {
                p.textContent = preSelectedPlaceholders[i].querySelector('p').textContent
            }
            if (secondaryDiv && linkSecondaryDiv) {
                secondaryDiv.firstChild.textContent = linkSecondaryDiv.firstChild.textContent
                secondaryDiv.lastChild.textContent = linkSecondaryDiv.lastChild.textContent        
            }
            placeholders[i].dataset.chosen = preSelectedPlaceholders[i].dataset.id
        }
        placeholders[i].addEventListener('click', () => {
            sessionStorage.setItem('selected-placement', placeholders[i].dataset.num)
            show('search-page')
        })
    }
    placementsBtn.addEventListener('click', editSection)
    show('placements-page')
}

const scrollDiv = document.querySelector('.scroll-div')
const scrollRightBtn = document.querySelector('.scroll-right')
const scrollLeftBtn = document.querySelector('.scroll-left')
const scrollLinks = document.querySelectorAll('.scroll-div > a')

let holding = false

scrollDiv && scrollDiv.addEventListener('mousedown', (e) => {
    scrollDiv.dataset.mousePosition = e.clientX;
    holding = false
})

window.addEventListener('mouseup', (e) => {
    scrollDiv.dataset.mousePosition = "0";
    scrollDiv.dataset.percentage = scrollDiv.dataset.new
})

scrollDiv && scrollDiv.addEventListener('mousemove', (e) => {
    if (scrollDiv.dataset.mousePosition === "0") return

    holding = true

    const delta = parseFloat(scrollDiv.dataset.mousePosition) - e.clientX;
    const maxDelta = window.innerWidth / 2

    let percentage = (delta / maxDelta) * -100,
        newPercentage = parseFloat(scrollDiv.dataset.percentage) + percentage
    newPercentage = Math.min(newPercentage, 0)
    newPercentage = Math.max(newPercentage, -100)

    scrollDiv.dataset.new = newPercentage

    scrollDiv.animate({
        transform: `translate(${newPercentage}%, 0%)`
    }, {duration: 1200, fill: 'forwards'})
})

scrollRightBtn && scrollRightBtn.addEventListener('click', () => {
    scrollDiv.dataset.percentage = "-100"
    scrollDiv.animate({
        transform: `translate(${scrollDiv.dataset.percentage}%, 0%)`
    }, {duration: 500, fill: 'forwards'})
})

scrollLeftBtn && scrollLeftBtn.addEventListener('click', () => {
    scrollDiv.dataset.percentage = "0"
    scrollDiv.animate({
        transform: `translate(${scrollDiv.dataset.percentage}%, 0%)`
    }, {duration: 500, fill: 'forwards'})
})

scrollLinks && scrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (holding) {
            e.preventDefault()
        }
    })
})

function deleteSection() {
    fetch(`delete/`, {
        method: 'POST',
        headers: {
           'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: "same-origin",
        body: JSON.stringify({
            'ids': ids,
            'section-name': sessionStorage.getItem('chosed-design'),
            'section-title': new FormData(distributionForm).get('section-title')
        }) 
   })
   .then(res => {
        if (res.status == 200) {
            console.log(res)
        }
        else {
            throw res
        }
   })
   .catch((error) => {
        console.log(error)
    })
}