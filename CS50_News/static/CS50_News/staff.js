const distributionForm = document.querySelector('#distribution-form');
const newsSearch = document.querySelector('.news-search');
const links = document.querySelectorAll('.news-search .h-card');
const createLink = document.querySelector('#main-page .create')
const editPage = document.querySelector('#edit-page')
const pagesContainer = document.querySelector('#main-page')
const selectBtns = document.querySelectorAll('.select-btn')
const pages = document.querySelectorAll('.page')
const placementsPage = document.querySelector('#placements-page')
const backBtns = document.querySelectorAll('.back-btn')
const placementsBtn = placementsPage.querySelector('.btn-success')
let placeholders;

const full = new URLSearchParams(window.location.search)
const page = full.get('page')

if (page) {
    show(page)
}

selectBtns.forEach(btn => {
    btn.addEventListener('click', selectDesign)
})

createLink.addEventListener('click', () => {
    show('edit-page')
})

links.forEach(link => {
    link.addEventListener('click', () => {
        const selected = document.querySelector(`#placements-page [data-num='${sessionStorage.getItem('selected-placement')}']`)
        const img = selected.querySelector(`img`)
        const h6 = selected.querySelector('h6')
        const p = selected.querySelector('p')
        const secondaryDiv = selected.querySelector('.secondary-div')
        if (img) {
            img.src = link.querySelector('img').src
        }
        if (h6) {
            h6.textContent = link.querySelector('h4').textContent
        }
        if (p) {
            p.textContent = link.querySelector('h6').textContent
        }
        if (secondaryDiv) {
            const linkSecondaryDiv = link.querySelector('.x-secondary-div')
            secondaryDiv.firstChild.textContent = linkSecondaryDiv.firstChild.textContent
            secondaryDiv.lastChild.textContent = linkSecondaryDiv.lastChild.textContent        
        }
        selected.dataset.chosen = link.dataset.id
        show('placements-page')
    })
})

placementsBtn.addEventListener('click', addSection)

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

function show(pageName) {
    pages.forEach(page => {
        page.classList.add('d-none')
    })
    const pageToSee = document.getElementById(pageName)
    pageToSee.scroll(top)
    pageToSee.classList.remove('d-none')
}

function selectDesign() {
    show('placements-page')
    const sectionName = this.previousElementSibling.id.replace('-section', '')
    sessionStorage.setItem('chosed-design', sectionName)
    distributionForm.innerHTML = this.parentElement.outerHTML
    distributionForm.querySelector('.select-btn').remove()
    console.log(sectionName)
    const sectionTitle = distributionForm.querySelector(`section .${sectionName}-section-heading`)
    console.log(sectionTitle)
    if (sectionTitle) {
        const newInput = document.createElement('input')
        newInput.classList.add('t-input')
        newInput.name = 'section-title'
        newInput.placeholder = 'Section Title'
        sectionTitle.replaceWith(newInput)
    }
    placeholders = document.querySelectorAll('#distribution-form .article')
    placeholders.forEach(placeholder => {
        placeholder.addEventListener('click', () => {
            sessionStorage.setItem('selected-placement', placeholder.dataset.num)
            show('search-page')
        })
    })

}

const scrollBtns = editPage.querySelector('#scroll-heading .buttons')
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