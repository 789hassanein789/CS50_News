const distributionForm = document.querySelector('#distribution-form');
const newsSearch = document.querySelector('.news-search');
const createLinks = document.querySelectorAll('.create')
const editPage = document.querySelector('#edit-page')
const mainPage = document.querySelector('#main-page')
const pagesContainer = document.querySelector('#main-page')
const selectBtns = document.querySelectorAll('.select-btn')
const pages = document.querySelectorAll('.page')
const placementsPage = document.querySelector('#placements-page')
const backBtns = document.querySelectorAll('.back-btn')
const placementsBtn = placementsPage.querySelector('.btn-success')
const sectionEditBtns = document.querySelectorAll('.section-edit')
const mainPageLinks = document.querySelectorAll('#main-page a')
const selectLinks = document.querySelectorAll('.select-link')
let placeholders;
let darkMode = localStorage.getItem('darkmode');

if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
    document.body.setAttribute('data-bs-theme', 'dark')
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


backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.parentElement.parentElement.classList.forEach(val => {
            if (val.startsWith('page-num-')) {
                const num = Number(val[9]) - 1
                document.querySelectorAll('.page').forEach(p => {
                    p.classList.add('d-none')
                })
                document.querySelector(`.page-num-${num}`).classList.remove('d-none')
            }
        })
    })
})

mainPageLinks.forEach(article => {
    article.removeAttribute('href')
})

createLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (link.dataset.num)
        selectLinks.forEach(selectlink => {
            selectlink.setAttribute('href', `${selectlink.getAttribute('href')}?position=${link.dataset.num}`)
        })
        show('edit-page')
    })
})

function show(pageName) {
    pages.forEach(page => {
        page.classList.add('d-none')
    })
    const pageToSee = document.getElementById(pageName)
    pageToSee.scroll(top)
    pageToSee.classList.remove('d-none')
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.body.setAttribute('data-bs-theme', 'dark');
    localStorage.setItem('darkmode', 'enabled');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    document.body.removeAttribute('data-bs-theme')
    localStorage.setItem('darkmode', null);
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

function addSection() {
    let ids = []
    placeholders.forEach(link => {
        if (link.dataset.chosen !== '') {
            ids.push(link.dataset.chosen)
        }
        else {
            link.classList.add('is-invalid')
        }
    })
    fetch('', {
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
        if (!res.errors) {
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

function editSection() {
    let ids = []
    placeholders.forEach(link => {
        if (link.dataset.chosen !== '') {
            ids.push(link.dataset.chosen)
        }
        else {
            link.classList.add('is-invalid')
        }
    })
    fetch('', {
        method: 'PUT',
        headers: {
           'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: "same-origin",
        body: JSON.stringify({
            'ids': ids,
            'section-id': sessionStorage.getItem('chosed-design'),
            'section-title': new FormData(distributionForm).get('section-title')
        }) 
   })
   .then(res => {
        if (res.ok) {
            window.location.reload()
        }
        else {
            throw res
        }
   })
   .catch((error) => {
        console.log(error)
    })
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

const scrollBtns = editPage.querySelector('#scroll-heading #scroll-buttons')
const scrollDiv = editPage.querySelector('.scroll-div')
const scrollRightBtn = editPage.querySelector('.scroll-right')
const scrollLeftBtn = editPage.querySelector('.scroll-left')
const scrollLinks = editPage.querySelectorAll('.scroll-div > a')

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

const mainPageScrollBtns = mainPage.querySelector('#scroll-heading #scroll-buttons')
const mainPageScrollDiv = mainPage.querySelector('.scroll-div')
const mainPageScrollRightBtn = mainPage.querySelector('.scroll-right')
const mainPageScrollLeftBtn = mainPage.querySelector('.scroll-left')
const mainPageScrollLinks = mainPage.querySelectorAll('.scroll-div > a')

let mainHolding = false

mainPageScrollDiv && mainPageScrollDiv.addEventListener('mousedown', (e) => {
    mainPageScrollDiv.dataset.mousePosition = e.clientX;
    mainHolding = false
})

window.addEventListener('mouseup', (e) => {
    mainPageScrollDiv.dataset.mousePosition = "0";
    mainPageScrollDiv.dataset.percentage = mainPageScrollDiv.dataset.new
})

mainPageScrollDiv && mainPageScrollDiv.addEventListener('mousemove', (e) => {
    if (mainPageScrollDiv.dataset.mousePosition === "0") return

    mainHolding = true

    const delta = parseFloat(mainPageScrollDiv.dataset.mousePosition) - e.clientX;
    const maxDelta = window.innerWidth / 2

    let percentage = (delta / maxDelta) * -100,
          newPercentage = parseFloat(mainPageScrollDiv.dataset.percentage) + percentage
    newPercentage = Math.min(newPercentage, 0)
    newPercentage = Math.max(newPercentage, -100)

    mainPageScrollDiv.dataset.new = newPercentage

    mainPageScrollDiv.animate({
        transform: `translate(${newPercentage}%, 0%)`
    }, {duration: 1200, fill: 'forwards'})
})

mainPageScrollRightBtn && mainPageScrollRightBtn.addEventListener('click', () => {
    mainPageScrollDiv.dataset.percentage = "-100"
    mainPageScrollDiv.animate({
        transform: `translate(${mainPageScrollDiv.dataset.percentage}%, 0%)`
    }, {duration: 500, fill: 'forwards'})
})

mainPageScrollLeftBtn && mainPageScrollLeftBtn.addEventListener('click', () => {
    mainPageScrollDiv.dataset.percentage = "0"
    mainPageScrollDiv.animate({
        transform: `translate(${mainPageScrollDiv.dataset.percentage}%, 0%)`
    }, {duration: 500, fill: 'forwards'})
})

mainPageScrollLinks && mainPageScrollLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (mainHolding) {
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