const form = document.querySelector('#reset-form');
const btn = document.querySelector('.reset-submit-btn');

btn.addEventListener('click', reset)

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

function reset() {
    console.log('hi')
    const newForm = new FormData(form)
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
    })
}