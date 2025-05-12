const links = document.querySelectorAll('.news-search .h-card');
const pages = document.querySelectorAll('.page');
const placeholders = document.querySelectorAll('#distribution-form .article');
const scrollBtns = document.querySelector('#scroll-heading #scroll-buttons')
const scrollDiv = document.querySelector('.scroll-div')
const scrollRightBtn = document.querySelector('.scroll-right')
const scrollLeftBtn = document.querySelector('.scroll-left')
const scrollLinks = document.querySelectorAll('.scroll-div > a')
const positionInput = document.querySelector('#position-input')
const sectionHeading = document.querySelector('.section-heading')
const backBtn = document.querySelector('.back-btn')
const paginationLinks = document.querySelectorAll('.pagination-link')
const nextLink = document.querySelector('#next-link')
const previousLink = document.querySelector('#previous-link')
const newsDiplay = document.querySelector('#news-display')
const numPages = document.querySelectorAll('.number-items')
let darkMode = localStorage.getItem('darkmode');
let currentPage = 1

if (darkMode === 'enabled') {
    document.body.classList.add('dark-mode');
    document.body.setAttribute('data-bs-theme', 'dark')
}

const pageParam = new URLSearchParams(window.location.search)
const page = pageParam.get('page')
const position = pageParam.get('position')

if (page) {
    show(page)
}
positionInput.value = position

links.forEach(link => {
    link.addEventListener('click', clickLink)
})

placeholders.forEach(placeholder => {
    placeholder.addEventListener('click', () => {
        sessionStorage.setItem('selected-placement', placeholder.dataset.num)
        show('search-page')
    })
})

if (sectionHeading) {
    let input = document.createElement('input')
    input.classList.add('t-input')
    input.name = 'title'
    input.placeholder = 'Section Title'
    sectionHeading.replaceWith(input)
}

backBtn.addEventListener('click', () => {
    show('placements-page')
})

paginationLinks.forEach(link => {
    link.addEventListener('click', (e) => pagination(e))
})

function show(pageName) {
    pages.forEach(page => {
        page.classList.add('d-none')
    })
    const pageToSee = document.getElementById(pageName)
    pageToSee.scroll(top)
    pageToSee.classList.remove('d-none')
}

function pagination(e) {
    const p = e.currentTarget.dataset.p
    fetch(`/staff/page/placements/only?p=${p}`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        }
    })
    .then(res => res.json())
    .then(result => {
        console.log(result)
        newsDiplay.innerHTML = ""
        currentPage = parseInt(result.current_page)
        const news = result.news
        news.forEach(article => {
            const link = document.createElement("a")
            link.classList.add("h-card")
            link.dataset.id = `${article.id}`
            link.draggable = false
            link.dataset.id = article.id
            const category = article.category.replace('_', ' ')
            link.innerHTML = `
                    <div class="h-card-main-image-div">
                        <div class="h-card-sub-image-div">
                            <img src="${article.image}" class="h-card-image" draggable="false">
                        </div>
                    </div>
                    <div class="h-card-content">
                        <h4 class="headline">${article.headline}</h4>
                        <div class="sub-headline-div">
                            <h6 class="sub-headline">${article.sub_headline}</h6>
                        </div>
                        <div class="x-secondary-div side-secondary">
                            <span>${article.timestamp}</span>
                            <div></div>
                            <span>${category}</span>
                        </div>
                    </div>
                `
            newsDiplay.appendChild(link)
        })
        const links = document.querySelectorAll('.news-search .h-card');
        links.forEach(link => {
            link.addEventListener('click', clickLink)
        })
        document.querySelectorAll('.pagination .active').forEach(active => {
            active.classList.remove('active')
        })
        document.querySelector(`.pagination-link-${currentPage}`).parentElement.classList.add('active')
        paginationLinks.forEach(link => {
            link.classList.remove('active')
            if (link.classList.contains(`.pagination-link-${currentPage}`)) {
                link.classList.add('active')
            }
        })
        nextLink.dataset.p = parseInt(currentPage) + 1
        if (result.next) {
            nextLink.parentElement.classList.remove('d-none')
        }
        else {
            nextLink.parentElement.classList.add('d-none')
        }
        previousLink.dataset.p = parseInt(currentPage) - 1
        if (result.previous) {
            previousLink.parentElement.classList.remove('d-none')
        }
        else {
            previousLink.parentElement.classList.add('d-none')
        }
        numPages.forEach(item => item.classList.add('d-none'))
        for (let i = currentPage - 5; i <= currentPage + 5; i++) {
            const item = document.querySelector(`.page-item-${i}`)
            if (item) {
                item.classList.remove("d-none")
            }
        }
    })
}

function clickLink() {
    const selected = document.querySelector(`#placements-page [data-num='${sessionStorage.getItem('selected-placement')}']`)
    const img = selected.querySelector(`img`)
    const h6 = selected.querySelector('h6')
    const p = selected.querySelector('p')
    const category = selected.querySelector('.category-placeholder')
    const secondaryDiv = selected.querySelector('.secondary-div')
    if (img) {
        img.src = this.querySelector('img').src
    }
    if (h6) {
        h6.textContent = this.querySelector('h4').textContent
    }
    if (p) {
        p.textContent = this.querySelector('h6').textContent
    }
    if (secondaryDiv) {
        const linkSecondaryDiv = this.querySelector('.x-secondary-div')
        secondaryDiv.firstChild.textContent = linkSecondaryDiv.firstChild.textContent
        secondaryDiv.lastChild.textContent = linkSecondaryDiv.lastChild.textContent        
    }
    if (category) {
        category.textContent = this.querySelector('.x-secondary-div').lastElementChild.textContent
    }
    selected.firstElementChild.value = this.dataset.id
    show('placements-page')
}

function selectDesign() {
    show('placements-page')
    const section = this.previousElementSibling
    const sectionName = section.id.replace('-section-design', '')
    sessionStorage.setItem('chosed-design', sectionName)
    distributionForm.innerHTML = section.outerHTML
    
    const sectionTitle = distributionForm.querySelector(`section .${sectionName}-section-heading`)
    if (sectionTitle) {
        const newInput = document.createElement('input')
        newInput.classList.add('t-input')
        newInput.name = 'section-title'
        newInput.placeholder = 'Section Title'
        sectionTitle.replaceWith(newInput)
    }
    show('placements-page')
}

if (scrollDiv) {
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
}