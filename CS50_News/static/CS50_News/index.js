let darkMode = localStorage.getItem('darkmode');
const toggleBtn = document.querySelector('#toggle-button');
const mainHeader = document.querySelector('#main-header_content')
const mainSearch = document.querySelector('.main-header_search');
const mainItems = document.querySelectorAll('.main-section-item');
const searchBtn = document.querySelector('#min-search-btn');
const backBtn = document.querySelector('#backBtn');
const accountDP = document.querySelector('#a-dp-btn');
const accountDPContent = document.querySelector('.a-dp-content');
const deleteLink = document.querySelector('#delete-link');
const deleteBackBtn = document.querySelector('#back-btn');
const popupForms = document.querySelectorAll('.popup-form');
const popup = document.querySelector('.popup');
const inputs = document.querySelectorAll('.otp-input');
const validationForm = document.querySelector('#validation-form');
const settingsForm = document.querySelector('#settings-form');
const loginForm = document.querySelector('#login-form');
const signupFrom = document.querySelector('#signup-form');
const closeBtns = document.querySelectorAll('.btn-close.setting-btn');
const settingUsername = document.querySelector('#username');
const settingFirst = document.querySelector('#first-name');
const settingLast = document.querySelector('#last-name');
const loginError = document.querySelector('#conflict-login');
const loginInputs = document.querySelectorAll('.login-input');
const navLinks = document.querySelectorAll('.nav-link');
const headingIcons = document.querySelectorAll('#main-header_content i');
const AgreeBtn = document.querySelector('.signup-form-btn')
const passwordForm = document.querySelector('#password-block form');
const emailForm = document.querySelector('#email-block form');
const hiddenPassword = document.querySelector('#hidden-password')
const emailDiv = document.querySelector('#email')
const passwordDiv = document.querySelector('#password')
const continueBtn = document.querySelector('#validation-block .popup-btn');
const resetForm = document.querySelector('#reset-form')
const logoutForm = document.querySelector('#logout-form');
const changePasswordError = document.querySelector('#password-block .error-p')
const doneBtn = document.querySelector('#password-block .popup-btn')
const resetLink = document.querySelector('#reset-link');
const settingBtn = document.querySelector('#setting-btn');
const backBtns = document.querySelectorAll('.back-btn')
const socialForm = document.querySelector('#social-reauthenticate-form')
const usernameInput = document.querySelector('#username')
const usernameInputError = document.querySelector('#username-error')
const passwordBlockInputs = document.querySelectorAll('#password-block .popup-input')
const popupInputs = document.querySelectorAll('.popup-input')
const emailBlockError = document.querySelector('#email-block .error-p')
const emailBlockInput = document.querySelector('#new-email')
const resendLink = document.querySelector('#resend-link')
const resentContinueBtn = document.querySelector('#reset-block .continue-btn')
const passwordResetLink = document.querySelector('#password-reset-link')
const newPasswordForm = document.querySelector('#new-password-form')
const successForm = document.querySelector('#success-form')
const newPasswordContinueBtn = document.querySelector('#new-password-block .continue-btn')


const popupContent = popup.innerHTML;
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

// dark/light mood
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

// offcanvas dropdown
mainItems.forEach(item => {
    item.addEventListener('click', () => {
        item.nextElementSibling.classList.toggle('d-none');
    })
})

// selected section style

// get category from sessionStorage
let category = sessionStorage.getItem('categorySelected')
let Main = sessionStorage.getItem('mainCategory')

// Main if null
if (category == null) {
    category = 'Home'
    sessionStorage.setItem('categorySelected', 'Home')
}

if (Main == null) {
    Main = 'Home'
    sessionStorage.setItem('mainCategory', 'Home')
}

// add classes
const selected = document.getElementById(category)
//check if selected exist, when clicking Home or Business selected doesn't exist.
if (selected) {
    selected.classList.add('fw-bolder');
}

const subNav = document.getElementById(`sub-nav-${category}`);

if(subNav) {
    subNav.classList.add('fw-bolder');
}

document.querySelector(`#${Main}-category`).classList.add('selected')
document.querySelector(`#nav-${Main}`).classList.add('clicked')

// defining an object for category maping
sub_categorys = [['Home'],
                ['News', 'Israil-Gaza_war', 'Ukraine-Russia_war', 'Iraq', 'US_&_Canada', 'Middle_East', 'Europe', 'Asia', 'Africa', 'Australia', 'Latine_America'],
                ['Sport', 'Martial_Arts', 'Football', 'Cricket', 'Formula_1', 'Tennis', 'Golf', 'Athletics', 'Cycling'],
                ['Business'],
                ['Innovation', 'Technology', 'Science_&_Health'],
                ['Culture', 'Books', 'Style', 'Film_&_TV', 'Music', 'Art_&_Design', 'Entertainment'],
                ['Travel', 'Destinations', 'Food_&_Drink', 'Adventures'],
                ['Earth', 'Natural_Wonders', 'Weather_&_Climate']];

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        const li = link.firstElementChild;
        sessionStorage.setItem('categorySelected', `${li.dataset.target}`);
        for (let i = 0; i < sub_categorys.length; i++) {
            let list = sub_categorys[i];
            for(let x = 0; x < list.length; x++) {
                if (li.dataset.target === list[x]) {
                    sessionStorage.setItem('mainCategory', `${list[0]}`);
                }
            }
        }
    })
})

inputs.forEach((input) => {
    input.addEventListener('input', userInput)
    input.addEventListener('keydown', userKeyDown)
    input.addEventListener('paste', userPaste)
})

searchBtn.addEventListener('click', toggleSearch)
backBtn.addEventListener('click', toggleSearch)


if (accountDP) {
    accountDP.addEventListener('click', () => {
        accountDPContent.classList.toggle('d-none')
    })
}


validationForm && validationForm.addEventListener('submit',(event) => {
    event.preventDefault();
    reauthenticate()
})



closeBtns.forEach(button => {
    button.addEventListener('click',() => {
        settings()
    })
})

deleteLink && deleteLink.addEventListener('click',() => {
    show('delete')
})

deleteBackBtn && deleteBackBtn.addEventListener('click',() => {
    show('settings')
})

loginForm && loginForm.addEventListener('submit', () => {
    event.preventDefault()
    login()
})

signupFrom && signupFrom.addEventListener('submit', (e) => {
    e.preventDefault()
    signup()
})

// Create a MediaQueryList object
let media = window.matchMedia("(max-width: 480px)")

// Call listener function at run time
iconSize(media);

// Attach listener function on state changes
media.addEventListener("change", function() {
iconSize(media);
});

passwordForm && passwordForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const form = new FormData(passwordForm)
    console.log(form.get('current-password'))
    if (form.get('current-password')) {
        changePassword(form)
    }
    else {
        changeProviderPassword(form)
    }
})

passwordDiv && passwordDiv.addEventListener('click' , () => {
    show('password');
})

resetForm && resetForm.addEventListener('submit', (e) => {
    e.preventDefault()
    requestPasswordReset(resetForm)
})

logoutForm && logoutForm.addEventListener('submit', (e) => {
    e.preventDefault()
    logout()
})

emailDiv && emailDiv.addEventListener('click', () => {
    show('email')
})

emailForm && emailForm.addEventListener('submit', (e) => {
    e.preventDefault()
    changeEmail()
})

resetLink && resetLink.addEventListener('click', () => {
    show('reset')
})

settingBtn && settingBtn.addEventListener('click', () => {
    fetch('/reauthenticate')
    .then(res => {
        if (res.ok) {
            show('settings')
        }
        else {
            show('validation')
        }
        settings()
    })
})

backBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        show('settings')
    })
})

socialForm && socialForm.addEventListener('submit', (e) => {
    e.preventDefault()
    fetch('/reauthenticate')
    .then(res => {
        if (res.ok) {
            show('settings')
            settings()
        }
        else {
            socialForm.submit()
        }
    })
})

usernameInput && usernameInput.addEventListener('input', () => {
    removeError(usernameInput)
})

popupInputs.forEach(input => {
    input.addEventListener('input', () => {
        removeError(input)
    })
})

resendLink.addEventListener('click', resendOtp)

passwordResetLink && passwordResetLink.addEventListener('click', () => {
    requestPasswordReset(successForm)
})

newPasswordForm && newPasswordForm.addEventListener('submit', reset)

const param = new URLSearchParams(window.location.search)
const auth = param.get('auth')

if (auth) {
    show(auth)
    settings()
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

function reauthenticate() {
    const passwordInput = document.querySelector('#validation-password');
    const errorPar = document.querySelector('#validation-password-error-p');
    continueBtn.innerHTML = '<div class="spinner-border" role="status"></div>';
    fetch('/_allauth/browser/v1/auth/reauthenticate', {
        method: 'POST',
        headers: {
           'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: "same-origin",
        body: JSON.stringify({
            'password': passwordInput.value
        }) 
   })
   .then((res) => res.json())
   .then(result => {
        if (result.status == 200) {
            errorPar.classList.add('d-none');
            passwordInput.classList.remove('is-invalid');
            passwordInput.value = ''
            continueBtn.textContent = 'Continue'
            if (validationForm.getAttribute('data-state') == 'submit') {
                validationForm.setAttribute('data-state', 'validate');
                settingsForm.submit();
                settings();
            }
            else {
                show('settings');
            }
        }
        else {
            throw result
        }
   })
   .catch((error) => {
        console.log(error)
        errorPar.classList.remove('d-none');
        errorPar.textContent = error.errors[0].message
        passwordInput.classList.add('is-invalid');
        passwordInput.value = ''
        continueBtn.textContent = 'Continue'
    })
}

function userKeyDown(event) {
    if (event.keyCode === 8) {
        event.target.value = '';
        backward(event.target)
        event.preventDefault()
    }
    else if (event.keyCode === 37) {
        event.preventDefault()
        backward(event.target)
    }
    else if (event.keyCode === 39) {
        event.preventDefault()
        forward(event.target)
    }
}

function userPaste(e) {
    e.preventDefault()
    let paste = (e.clipboardData || window.clipboardData).getData("text");
    console.log(paste)
    for (let i = 0; i < 6; i++) {
        document.querySelector(`#otp-${i}`).value = paste[i]
    }
}

function userInput(e) {
     if (e.target.value.length > 0) {
        e.target.value = e.target.value.slice(-1)
        forward(e.target)
    }
}

function show(block) {
    document.querySelectorAll('.popup-block').forEach(block => {
        block.classList.add('d-none')
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
    const settingsDoneBtn = document.querySelector('#settings-block .done-btn')
    settingsDoneBtn.innerHTML = '<div class="spinner-border" role="status"></div>'
    if (usernameInput.value === '') {
        usernameInput.classList.add('is-invalid')
        usernameInputError.textContent = 'required.'
        usernameInputError.classList.remove('d-none')
        settingsDoneBtn.textContent = 'Done'
    }
    else {
        fetch('/edit', {
            method: 'POST',
            headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            },
            credentials: "same-origin",
            body: JSON.stringify({
                'username': usernameInput.value,
            })
        })
        .then((res) => {
            if (res.status == 200) {
                settings()
            }
            else {
                throw res
            }
        })
        .catch((error) => {
            usernameInputError.textContent = 'The username is already taken, please try another one.'
            usernameInputError.classList.remove('d-none')
            usernameInput.classList.add('is-invalid')
        })
        .finally(settingsDoneBtn.textContent = 'Done')
    }
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
    fetch('/_allauth/browser/v1/auth/2fa/reauthenticate', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        credentials: "same-origin",
    })
    .then(res => res.json())
    .then(result => {
        console.log(result)
    })
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
    const nform = new FormData(signupFrom)
    for (const value of nform.entries()) {
        if (value[1] == '') {
            inputError(value[0])
            return
        }
    }
    AgreeBtn.innerHTML = '<div class="spinner-border" role="status"></div>'
    fetch('/_allauth/browser/v1/auth/signup', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        credentials: "same-origin",
        body: JSON.stringify({
            'email': nform.get('email'),
            'username': nform.get('username'),
            'password': nform.get('password')
        })
    })
    .then(res => res.json())
    .then(result => {
        if (result.status == 401) {
            sessionStorage.setItem('email', nform.get('email'))
            show('otp');
        }
        else {
            throw result
        }
    })
    .catch((error) => {
        AgreeBtn.textContent = 'Agree & Continue';
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
    const loginBtn = document.querySelector('#login-form > .popup-btn');
    loginBtn.innerHTML = '<div class="spinner-border" role="status"></div>'
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
            loginInputs.forEach(input => {
                input.value = '';
                input.classList.add('is-invalid');
            })
            const errorPar = document.querySelector(`#${error.errors[0].param}-login-input-error-p`);
            errorPar.textContent = error.errors[0].message;
            errorPar.classList.remove('d-none')
        }
        else if (error.status == 401) {
            show('otp')
        }
        else {
            loginError.textContent = 'the user is already loged in, try to reload the page';
            loginError.classList.remove('d-none');
        }
        loginBtn.textContent = 'Continue';

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
            'email': 'hassanein582@gmail.com'
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

function iconSize(x) {
    console.log('full')
    if (x.matches) {
        headingIcons.forEach(i => {
            if (i.classList.contains('fa-bars')) {
                i.classList.remove('fa-xl')
            }
            else {
                i.classList.add('fa-sm')
            }
        })
    }
    else {
        headingIcons.forEach(i => {
            if (i.classList.contains('fa-bars')) {
                i.classList.add('fa-xl')
            }
            else {
                i.classList.remove('fa-sm')
            }
        })
    }
}

function requestPasswordReset(form) {
    console.log('hi')
    let newForm = new FormData(form);
    console.log(resentContinueBtn)
    resentContinueBtn.innerHTML = '<div class="spinner-border" role="status"></div>'
    fetch('/_allauth/browser/v1/auth/password/request', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        credentials: "same-origin", 
        body: JSON.stringify({
            'email': newForm.get('email-reset')
        })
    })
    .then(res => res.json())
    .then(result => {
        if (!result.errors) {
            show('success')
            document.querySelector('#hidden').value = newForm.get('email-reset')
            document.querySelector('.success-email-message').textContent = `check your index box we have send a password reset mail to ${newForm.get('email-reset')}, it may take some time to appear. If you didn't receive anything try sending another email.`
            resentContinueBtn.textContent = 'continue'
        }
        else {
            throw result
        }
    })
    .catch(error => {
        console.log(error)
        resentContinueBtn.textContent = 'continue'
    })
}

function provider() {
    fetch('/_allauth/browser/v1/auth/provider/redirect', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'provider': 'google',
            'callback_url': 'http/127.0.0.1:8000/',
            'process': 'login'
        })
    })
    .then(res => console.log(res))
}

function logout() {
    fetch('/_allauth/browser/v1/auth/session', {
        method: 'DELETE',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        }
    })
    .then(res => location.reload())
}

function changePassword(form) {
    const passwordDoneBtn = document.querySelector('#password-block .done-btn')
    passwordDoneBtn.innerHTML = '<div class="spinner-border" role="status"></div>'
    fetch('/_allauth/browser/v1/account/password/change', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'current_password': form.get('current-password'),
            'new_password': form.get('new-password'),
        }) 
    })
    .then(res => res.json())
    .then(result => {
        if (result.ok) {
            window.location.reload()
        }
        else {
            throw result
        }
    })
    .catch((error) => {
        console.log(error)
        const passwordError = document.getElementById(error.errors[0].param)
        passwordError.textContent = error.errors[0].message
        passwordError.classList.remove('d-none')
        passwordDoneBtn.textContent = 'Done'
        passwordBlockInputs.forEach(input => {
            input.classList.add('is-invalid')
        })
    })
}

function changeProviderPassword(form) {
    const passwordDoneBtn = document.querySelector('#password-block .done-btn')
    passwordDoneBtn.innerHTML = '<div class="spinner-border" role="status"></div>'
    fetch('/_allauth/browser/v1/account/password/change', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            'new_password': form.get('password'),
        })
    })
    .then(res => res.json())
    .then(result => {
        if (result.ok) {
            window.location.reload()
        }
        else {
            throw result
        }
    })
    .catch((error) => {
        changePasswordError.textContent = error.errors[0].message
        changePasswordError.classList.remove('d-none')
        passwordDoneBtn.textContent = 'Done'
        passwordBlockInputs.forEach(input => {
            input.classList.add('is-invalid')
        })
    })
}

function changeEmail() {
    const form = new FormData(emailForm)
    console.log(form.get('email'))
    const emailDoneBtn = document.querySelector('#email-block .done-btn')
    emailDoneBtn.innerHTML = '<div class="spinner-border" role="status"></div>'
    fetch('/_allauth/browser/v1/account/email', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'email': form.get('email'),
        })
    }) 
    .then(res => res.json())
    .then(result => {
        if (result.status == 200) {
            emailDoneBtn.textContent = 'Done'
            show('otp')
        }
        else {
            throw result
        }
    })
    .catch((error) => {
        emailBlockError.textContent = error.errors[0].message
        emailBlockError.classList.remove('d-none')
        emailDoneBtn.textContent = 'Done'
        emailBlockInput.classList.add('is-invalid')
    })
}

function resendOtp() {
    console.log(sessionStorage.getItem('email'))
    fetch('/_allauth/browser/v1/account/email', {
        method: 'PUT',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            'email': 'hassanein582@gmail.com',
        })
    }) 
    .then(res => res.json())
    .then(result => {
        if (!result.ok) {
            throw result
        }
        else {
            console.log(result)
        }
    })
    .catch((error) => {
        console.log(error)
    })
}

function reset(e) {
    e.preventDefault()
    console.log('hi')
    const newForm = new FormData(newPasswordForm)
    newPasswordContinueBtn.innerHTML = '<div class="spinner-border" role="status"></div>'
    fetch('/_allauth/browser/v1/auth/password/reset', {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken')
        },
        credentials: "same-origin", 
        body: JSON.stringify({
            'key': newForm.get('key'),
            'password': newForm.get('reset-password')
        })
    })
    .then(res => res.json())
    .then(result => {
        if (!result.errors) {
            window.location.replace('/')
        }
        else {
            throw result
        }
    })
    .catch(error => {
        console.log(error)
        newPasswordContinueBtn.textContent = 'continue'
    })
}
