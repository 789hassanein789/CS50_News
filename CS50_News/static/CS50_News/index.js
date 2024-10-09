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
const inputs = document.querySelectorAll('.otp-input');
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

inputs.forEach((input) => {
    input.addEventListener('input', userInput)
    input.addEventListener('keydown', userKeyDown)
})

searchBtn.addEventListener('click', toggleSearch)
backBtn.addEventListener('click', toggleSearch)


if (accountDP) {
    accountDP.addEventListener('click', () => {
        accountDPContent.classList.toggle('d-none')
    })
}


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
    if (document.querySelector('#validation-password')) {
        document.querySelector('#validation-password').value = ''
    }
    if (accountDPContent && !accountDPContent.classList.contains('d-none')) {
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
        show('settings')
    })  
    .catch(() => {
        document.querySelector('#validation-form > .error-p').classList.remove('d-none');
        passwordInput.classList.add('is-invalid');
        passwordInput.value = ''
        continueBtn.textContent = 'Continue'
    })
}

function userKeyDown(event) {
    if (event.keyCode === 8) {
        self.value = '';
        backward(self)
        event.preventDefault()
    }
    else if (event.keyCode === 37) {
        event.preventDefault()
        backward(self)
    }
    else if (event.keyCode === 39) {
        event.preventDefault()
        forward(self)
    }
}

function userInput(e) {
     if (e.target.value.length > 0) {
        e.target.value = e.target.value.slice(-1)
        forward(e.target)
    }
}

function show(block) {
    document.querySelectorAll('.popup-block').forEach(b => {
        b.classList.add('d-none')
    })
    document.querySelector(`#${block}-block`).classList.remove('d-none')
}

function removeError(input) {
    if (input.value !== '' && input.classList.contains('is-invalid')) {
        document.querySelectorAll('.error-p').forEach(p => {
            p.classList.add('d-none');
        })
        document.querySelectorAll('.is-invalid').forEach(field => {
            field.classList.remove('is-invalid');
        })
    }
}

function accountEdit() {
    document.querySelector('#done-btn').innerHTML = '<div class="spinner-border" role="status"></div>'
    let form = new FormData(document.querySelector('#settings-form'))
    fetch('/edit', {
        method: 'POST',
        headers: {
        'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: "same-origin",
        body: form
    })
    .then((res) => {
    document.querySelector('#done-btn').textContent = 'Done'
    settings()
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
    show('otp');
    fetch('/OTP')
}

function verifyOtp() {
    
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

function inputError(name) {
    document.querySelector(`#${name}-input`).classList.add('is-invalid');
    const errorPar = document.querySelector(`#${name}-input-error-p`);
    errorPar.classList.remove('d-none');
}

function signup() {
    const form = new FormData(document.querySelector('#signup-form'))
    let empty = false
    for (const value of form.entries()) {
        if (value[1] == '') {
            inputError(value[0])
            empty = true
        }
    }
    if (empty) {
        return
    }
    const continueBtn = document.querySelector('.signup-form-btn')
    continueBtn.innerHTML = '<div class="spinner-border" role="status"></div>'
    fetch('/_allauth/browser/v1/auth/signup', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        credentials: "same-origin",
        body: JSON.stringify({
            'email': form.get('email'),
            'username': form.get('username'),
            'password': form.get('password')
        })
    })
    .then(res => res.json())
    .then(result => {
        if (result.status == 401) {
            show('otp');
        }
        else {
            throw result
        }
    })
    .catch((error) => {
        continueBtn.textContent = 'Agree & Continue';
        if (error.status == 400) {
            const input = document.querySelector(`#${error.errors[0].param}-input`);
            input.value = '';
            input.classList.add('is-invalid')
            const errorPar = document.querySelector(`#${error.errors[0].param}-input-error-p`);
            errorPar.textContent = error.errors[0].message;
            errorPar.classList.remove('d-none')
        }
        else {
            console.log(error)
        }
    })
}

function login() {
    const form = new FormData(document.querySelector('#login-form'))
    let empty = false
    for (const value of form.entries()) {
        if (value[1] == '') {
            inputError(value[0])
            empty = true
        }
    }
    if (empty) {
        return
    }
    const continueBtn = document.querySelector('#login-form > .popup-btn');
    continueBtn.innerHTML = '<div class="spinner-border" role="status"></div>'
    fetch('/_allauth/browser/v1/auth/login', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        credentials: "same-origin",
        body: JSON.stringify({
            'email': form.get('email-login'),
            'password': form.get('password-login')
        })
    })
    .then(res => res.json())
    .then(result => {
        if (result.status == 200) {
            location.reload()
        }
        else {
            throw result
        }
    })
    .catch(error => {
        if (error.status == 400) {
            const input = document.querySelector(`#${error.errors[0].param}-login-input`);
            input.value = '';
            input.classList.add('is-invalid')
            const errorPar = document.querySelector(`#${error.errors[0].param}-login-input-error-p`);
            errorPar.textContent = error.errors[0].message;
            errorPar.classList.remove('d-none')
        }
        else {
            document.querySelector('#conflict-login').classList.remove('d-none');
        }
        continueBtn.textContent = 'Continue'

    })
}

function provider() {
    fetch("/_allauth/browser/v1/auth/provider/redirect", {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            'provider': 'google',
            'callback_url': 'http://127.0.0.1:8000/accounts/google/login/callback/',
            'process': 'login'
        })
    })
}

function passwordRequest() {
    fetch('_allauth/browser/v1/auth/password/request', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        credentials: "same-origin", 
        body: JSON.stringify({
            'email': ''
        })
    })
}

function verifyEmail() {
    let key = '';
    let errorPar = document.querySelector('#otp-input-error-p');
    inputs.forEach(input => {
        key += input.value.slice(-1);
    })
    if (key.length < 6) {
        errorPar.textContent = 'please enter your one time password'
        errorPar.classList.remove('d-none');
        inputs.forEach(input => {
            input.classList.add('is-invalid')
        })
        return
    }
    fetch('/_allauth/browser/v1/auth/email/verify', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        credentials: "same-origin", 
        body: JSON.stringify({
            'key': key
        })
    })
    .then(res => res.json())
    .then(result => {
        if (!result.errors) {
            console.log(result);
            location.reload();
        }
        else {
            throw result
        }
    })
    .catch(error => {
        console.log('error')
        console.log(error);
        console.log(error.errors[0].message);
        errorPar.textContent = error.errors[0].message
        errorPar.classList.remove('d-none');
        inputs.forEach(input => {
            input.classList.add('is-invalid')
        })
    })

}