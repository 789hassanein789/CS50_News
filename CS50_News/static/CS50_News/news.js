const deleteNewLink = document.querySelector('#delete-new')
const overlay = document.querySelector('.overlay')
const closeBtn = document.querySelector('.close-btn')
const saveLink = document.querySelector('#save-link')

deleteNewLink.addEventListener('click', () => {
    overlay.classList.remove('d-none')
})

closeBtn.addEventListener('click', () => {
    overlay.classList.add('d-none')
})

saveLink.addEventListener('click', saveArticle)

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function deleteNew() {
    fetch("http://127.0.0.1:8000/delete-new", {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: "same-origin",
        body: JSON.stringify({
            "id": deleteNewLink.getAttribute('data-id')
        }),
    })
    .then(result => {
        result.text().then(text => console.log(text))
        
    })
    .catch(error => {
        
    })
}

function saveArticle() {
    fetch(`/save/${saveLink.getAttribute('data-slug')}`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
        },
        credentials: "same-origin"
    })
    .then(result => {
        if (saveLink.firstElementChild.classList.contains('fa-plus')) {
            saveLink.childNodes[2].textContent = ' Saved'
            saveLink.firstElementChild.classList.replace('fa-plus', 'fa-check')
        }
        else {
            saveLink.childNodes[2].textContent = ' Save'
            saveLink.firstElementChild.classList.replace('fa-check', 'fa-plus')

        }
    })
    .catch(error => {
        alert(error)
    })
}