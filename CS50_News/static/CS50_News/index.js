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
const settingBtn = document.querySelector('.setting-btn');
const deleteLink = document.querySelector('#delete-link');
const deleteBackBtn = document.querySelector('#back-btn');
const popupForms = document.querySelectorAll('.popup-form');
const subItems = document.querySelectorAll('.sub-item');
const popup = document.querySelector('.popup');
const popupContent = popup.innerHTML;
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

settingBtn.addEventListener('click', settings)

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
    document.querySelector('#validation-password').value = ''
    if (!accountDPContent.classList.contains('d-none')) {
        accountDPContent.classList.add('d-none')
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function validate() {
    const passwordInput = document.querySelector('#validation-password');
    const continueBtn = document.querySelector('#continue-btn');
    continueBtn.innerHTML = '<div class="spinner-border" role="status"></div>'
    let form = new FormData(document.querySelector('#validation-form'));
    fetch('/check', {
         method: 'POST',
         headers: {
            'X-CSRFToken': getCookie('csrftoken'),
         },
         credentials: "same-origin",
         body: form
    })
    .then((res) => res.json())
    .then((result) => {
        document.querySelector('#validation-form > .erorr-p').classList.add('d-none');
        passwordInput.classList.remove('is-invalid');
        passwordInput.value = ''
        popup.innerHTML = `
        <form class="popup-form" id="settings-form">
            <button type="button" class="btn-close setting-btn" onclick="closeSettings()" aria-label="Close"></button>
            <p class="popup-brand">CS50 News</a>
            <div class="g-0">
                <p class="fs-4 fw-bold m-0">Account Info</p>
                <div class="ai-input" id="email" onclick="otp()">
                    <div class="field">
                        <div class="field_title">Email</div>
                        <div class="fw-bold">${result.email}</div>
                    </div>
                    <button class="icon-btn" type="button">
                        <i class="fa-solid fa-chevron-right fa-lg"></i>
                    </button>
                </div>
                <div class="ai-input" id="password" onclick="otp()">
                    <div class="field">
                        <div class="field_title">Password</div>
                        <div class="fw-bold">**********</div>
                    </div>
                    <button class="icon-btn" type="button">
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
            <button class="popup-btn" type="button" id="done-btn" onclick="accountEdit()">
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
        <form action="" class="popup-form d-none" id="otp-form">
            <p class="fs-3 fw-bold m-0">Check your email inbox</p>
            <p class="m-0">We'll need you to verify your email address. We’ve sent a 6-digit code to your email address. The code expires in 15 minutes. Please enter it below.</p>
            <div>
                <div class="otp-div">
                    <input type="tel" class="otp-input form-control" id="otp-0" autofocus>
                    <input type="tel" class="otp-input form-control" id="otp-1">
                    <input type="tel" class="otp-input form-control" id="otp-2">
                    <input type="tel" class="otp-input form-control" id="otp-3">
                    <input type="tel" class="otp-input form-control" id="otp-4">
                    <input type="tel" class="otp-input form-control" id="otp-5">
                </div>
            </div>
            <button class="popup-btn" onclick="verifyOtp()" type="button" id="continue-btn">
                Continue
            </button>
            <button class="popup-btn" onclick="show('settings-form')" type="button" id="cancel-btn">
                Cancel
            </button>
            <p class="m-0 min-font">Didn’t receive the email? <a href="">Resend</a></p>
        </form>
        `
        aiInputs = document.querySelectorAll('.ai-input');
        aiInputs.forEach(input => {
            input.addEventListener('click', () => {
                
            })
        })

        let inputs = document.querySelectorAll('.otp-input');
        inputs.forEach((input) => {
            input.addEventListener('input', userInput)
            input.addEventListener('keydown', (event) => {
                if (event.keyCode === 8) {
                    input.value = '';
                    backward(input)
                    event.preventDefault()
                }
                else if (event.keyCode === 37) {
                    event.preventDefault()
                    backward(input)
                }
                else if (event.keyCode === 39) {
                    event.preventDefault()
                    forward(input)
                }
            })
        })
        function userInput(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g,'')
            if (e.target.value.length > 0) {
                e.target.value = e.target.value.slice(-1)
                forward(e.target)
            }
        }
    })  
    .catch(() => {
        document.querySelector('#validation-form > .erorr-p').classList.remove('d-none');
        passwordInput.classList.add('is-invalid');
        passwordInput.value = ''
        continueBtn.textContent = 'Continue'
    })
}



function show(form) {
    document.querySelectorAll('.popup-form').forEach(f => {
        f.classList.add('d-none')
    })
    document.querySelector(`#${form}`).classList.remove('d-none')
}

function removeError(input) {
    if (input.value !== '') {
        document.querySelector('#validation-form > .erorr-p').classList.add('d-none');
        input.classList.remove('is-invalid');
    }
}

function closeSettings() {
    popup.innerHTML = popupContent;
    settings()
}

function accountEdit() {
    document.querySelector('#done-btn').innerHTML = '<div class="spinner-border" role="status"></div>'
    let form = new FormData(document.querySelector('#settings-form'))
    fetch('/account', {
        method: 'POST',
        headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: "same-origin",
        body: form
    })
    .then((res) => {
    document.querySelector('#done-btn').textContent = 'Done'
    closeSettings()
    })
}

function forward(input) {
    let index = Number(input.id.slice(-1))
    if (index < 5) {
        let newInput = document.querySelector(`#otp-${index + 1}`);
        newInput.focus();
        newInput.select();
    }
}

function backward(input)   {
    let index = Number(input.id.slice(-1))
    if (index !== 0) {
        let newInput = document.querySelector(`#otp-${index - 1}`);
        newInput.focus()
        newInput.select()
    }
}

function otp() {
    show('otp-form');
    fetch('/OTP')
}

function verifyOtp() {
    let otpCode = '';
    const inputs = document.querySelectorAll('.otp-input');
    inputs.forEach(input => {
        otpCode += input.value.slice(-1);
    })
    let form = new FormData();
    form.append('otp', otpCode);
    fetch('/OTP', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        credentials: 'same-origin',
        body: form
    });
}