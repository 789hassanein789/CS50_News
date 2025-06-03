import { settings, show, getCookie } from './index.js'

const mainCheckbox = document.querySelector('#main-checkbox')
const allCheckboxs = document.querySelectorAll('.table-checkbox')
const secondaryDropdowns = document.querySelectorAll('.secondary-dropdown')
const managementForm = document.querySelector('#user-management-form')
const managementPopupForm = document.querySelector('#management-popup-form')
const actionSelect = document.querySelector('#action-select')
const managementPopupMessage = document.querySelector('.management-message')
const managementCancelBtn = document.querySelector('#management-popup-form .cancel-btn')
const deleteLinks = document.querySelectorAll('.delete-link')
const permissionLinks = document.querySelectorAll('.sub-dropdown .dropdown-item')
const links = document.querySelectorAll('.list-group-item-action')
mainCheckbox.addEventListener("click", toggleAll)
allCheckboxs.forEach(checkbox => {
    if (checkbox.checked == true) {
        checkbox.addEventListener('click', checkbox.classList.add('active'))
    }
    else {
        checkbox.addEventListener('click', checkbox.classList.remove('active'))
    }
})

secondaryDropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', () => {
        dropdown.parentElement.nextElementSibling.classList.toggle('d-none')
    })
})

permissionLinks.forEach(link => {
    link.addEventListener('click', () => {
        managementPopupMessage.textContent = `the user ${link.dataset.username} will be promoted to ${link.textContent}, are you sure you want to continue?`
        settings()
        show("management-popup")
        managementPopupForm.dataset.event = 'click'
        managementPopupForm.dataset.userId = `${link.dataset.userId}`
        managementPopupForm.dataset.action = `${link.textContent}`
    })
})

managementCancelBtn.addEventListener('click', settings)

deleteLinks.forEach(link => {
    link.addEventListener('click', (link) => {
        managementPopupMessage.textContent = `the user ${link.datase.username} will be deleted & all of its records will be lost, are you sure you want to continue?`
        settings()
        show("management-popup")
        managementPopupForm.dataset.event = 'delete'
        managementPopupForm.dataset.userId = `${link.dataset.userId}`
    })
})

actionSelect.addEventListener("change", (e) => {
    if (e.target.value === "delete") {
        managementForm.action = "/delete-user"
    }
    else {
        managementForm.action = "/user-management"
    }
})

managementForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const currentForm = new FormData(managementForm)
    let action = currentForm.get("action")
    if (action === "delete") {
        action = "deleted"
    }
    const usernames = []
    allCheckboxs.forEach(checkbox => {
        if (checkbox.checked) {
            usernames.push(checkbox.dataset.username)
        }
    })
    managementPopupMessage.textContent = `the users ${usernames.map(username => `${username}`).join(', ')} will be ${action}, are you sure you want to continue?`
    settings()
    show("management-popup")
    managementPopupForm.dataset.event = 'submit'
})

managementPopupForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const action = managementPopupForm.dataset.event
    if (action !== 'submit') {
        allCheckboxs.forEach(checkbox => checkbox.checked = false)
        document.querySelector(`#checkbox-${managementPopupForm.dataset.userId}`).checked = true;
        if (action === 'delete') {
            managementForm.action = '/delete-user'
        }
        else {
            actionSelect.value = managementPopupForm.dataset.action;
        }
    }
    managementForm.submit()
})

links.forEach(link => {
    link.addEventListener("click", () => {
        let fetchUrl
        if (link.dataset.sub !== undefined) {
            fetchUrl = `/staff/add/${link.dataset.slug}/${link.dataset.cat}/${link.dataset.sub}`
        }
        else {
            fetchUrl = `/staff/add/${link.dataset.slug}/${link.dataset.cat}`
        }
        fetch(fetchUrl, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken')
                },
                credentials: "same-origin",
            })
            .then(res => {
                console.log(res)
            })
    })
})


function toggleAll() {
    allCheckboxs.forEach(checkbox => {
        checkbox.checked = this.checked
    })
}