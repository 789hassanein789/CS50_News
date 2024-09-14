// implementing the dark/light mode switch
let darkMode = localStorage.getItem('darkmode');
const toggleBtn = document.querySelector('#toggle-button');
const mainHeader = document.querySelector('#main-header_content')
const mainSearch = document.querySelector('.main-header_search');
const mainItems = document.querySelectorAll('.main-section-item');
const ddItems = document.querySelectorAll('.nav-dd-item');
const dropDowns = document.querySelectorAll('.drop-down');
const searchBtn = document.querySelector('#min-search-btn');
const backBtn = document.querySelector('#backBtn');
const accountDP = document.querySelector('#a-dp-btn');
const accountDPContent = document.querySelector('.a-dp-content');
const settingsBtn = document.querySelectorAll('.setting-btn');
const passwordInput = document.querySelector('#validation-password');
const continueBtn = document.querySelector('#continue-btn');
const deleteLink = document.querySelector('#delete-link');
const deleteBackBtn = document.querySelector('#back-btn');
const popupForms = document.querySelectorAll('.popup-form');
const subItems = document.querySelectorAll('.sub-item');
const popup = document.querySelector('.popup');
const popupContent = popup.textContent;
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

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

subItems.forEach(item => {
    item.addEventListener('click', () => {
        sessionStorage.setItem('categorySelected', `${item.id}`);
    })
})


ddItems.forEach(item => {
    let target = item.getAttribute('data-target')
        item.addEventListener('click', () => {
        let subItem = document.querySelector(`#${target}`)
        sessionStorage.setItem('categorySelected', `${subItem.id}`)
    })
})


dropDowns.forEach(dropDown => {
    let icon = dropDown.querySelector(':scope > .nav-link > .fa-caret-down');
    dropDown.addEventListener('mouseenter', () => {
        icon.classList.replace('fa-caret-down', 'fa-caret-up')
    })
    dropDown.addEventListener('mouseleave', () => {
        icon.classList.replace('fa-caret-up', 'fa-caret-down')
    })
})



searchBtn.addEventListener('click', toggleSearch)
backBtn.addEventListener('click', toggleSearch)



accountDP.addEventListener('click', () => {
    accountDPContent.classList.toggle('d-none')
})


settingsBtn.forEach(button => button.addEventListener('click', settings))

continueBtn.addEventListener('click', validate)

//deleteLink.addEventListener('click', show('delete-form'))

//deleteBackBtn.addEventListener('click', show('settings-form'))

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.body.setAttribute('data-bs-theme', 'dark')
    localStorage.setItem('darkmode', 'enabled');
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    document.body.removeAttribute('data-bs-theme')
    localStorage.setItem('darkmode', null);
}

function toggleSearch() {
    mainHeader.classList.toggle('d-none')
    mainSearch.classList.toggle('d-none')
}

function settings() {
    document.body.classList.toggle('overflow-hidden')
    document.querySelector('.overlay').classList.toggle('d-none')
    document.querySelector('.close-offcanvas').click()
    if (!accountDPContent.classList.contains('d-none')) {
        accountDPContent.classList.add('d-none')
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function validate(event) {
    event.preventDefault()
    continueBtn.innerHTML = '<div class="spinner-border" role="status"></div>'
    fetch('/check', {
         method: 'POST',
         headers: {
            'X-CSRFToken': getCookie('csrftoken'),
         },
         credentials: "same-origin",
         body: JSON.stringify({
            password: passwordInput.value
         })
    })
    .then((res) => res.json())
    .then((result) => {
        if(result.status == 200) {
            document.querySelector('#validation-form > .erorr-p').classList.add('d-none');
            passwordInput.classList.remove('is-invalid');
            passwordInput.value = ''
            popup.innerHTML = `
            <form class="popup-form" id="settings-form">
                <button type="button" class="btn-close setting-btn" aria-label="Close"></button>
                <p class="popup-brand">CS50 News</a>
                <div class="g-0">
                    <p class="fs-4 fw-bold m-0">Account Info</p>
                    <div class="ai-input" id="email">
                        <div class="field">
                            <div class="field_title">Email</div>
                            <div class="fw-bold">${result.email}</div>
                        </div>
                        <button class="icon-btn">
                            <i class="fa-solid fa-chevron-right fa-lg"></i>
                        </button>
                    </div>
                    <div class="ai-input" id="password">
                        <div class="field">
                            <div class="field_title">Password</div>
                            <div class="fw-bold">**********</div>
                        </div>
                        <button class="icon-btn">
                            <i class="fa-solid fa-chevron-right fa-lg"></i>
                        </button>
                    </div>
                </div>
                <p class="fs-4 fw-bold m-0">Personal Info</p>
                <div class="popup-input-div">
                    <input type="text" name="first-name" class="popup-input" placeholder="" id="first-name" value="${result.first}">
                    <label for="first-name" class="popup-label">First Name</label>
                </div>
                <div class="popup-input-div">
                    <input type="text" name="last-name" class="popup-input" placeholder="" id="last-name" value="${result.last}">
                    <label for="last-name" class="popup-label">Last Name</label>
                </div>
                <button class="popup-btn" id="done-btn">
                    Done
                </button>
                <p class="fs-4 fw-bold m-0">Delete Account</p>
                <p class="min-font">By deleting your account, you may be unable to access certain CS50 News services.</p>
                <a class="focus-link" id="delete-link" onclick="show('delete-form')">Delete Account</a>
                <p class="min-font">CS50 News treats this information with care and respect. For details, review our <a href="" class="focus-link min-font">Privacy Policy.</a></p>
                
            </form>
            <form action="/delete" method="post" class="popup-form d-none" id="delete-form">
                <input type="hidden" name="csrfmiddlewaretoken" value="${csrftoken}">                <p class="fs-4 fw-bold m-0">Are you sure?</p>
                <p>By deleting your account, you will no longer be able to log in to websites, mobile apps, or other online services, and you will not be able to use your account to access any associated purchases, credits, points, rewards, plans, content or other benefits you may have associated with it.</p>
                <button class="popup-btn" id="delete-btn">
                    Yes, delete this account
                </button>
                <button class="popup-btn" id="back-btn" onclick="show('settings-form')" type="button">
                    No, I'll keep it
                </button>
            </form>
            `
        }
        else {
            document.querySelector('#validation-form > .erorr-p').classList.remove('d-none');
            passwordInput.classList.add('is-invalid');
            passwordInput.value = ''
        }
        continueBtn.textContent = 'Continue'
    })
}

function show(form) {
    document.querySelectorAll('.popup-form').forEach(f => {
        f.classList.add('d-none')
    })
    document.querySelector(`#${form}`).classList.remove('d-none')
}