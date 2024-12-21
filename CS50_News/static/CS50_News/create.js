const label = document.querySelector('#label');
const input = document.querySelector('#img-input');
const imgText = document.querySelector('#img-text');
const ul = document.querySelector('ul');
const catInput = document.querySelector('#category-input');
const suggestionsList = document.querySelector('.suggestions');

const availableTags = [
    'israil-gaza war', 'ukraine-russia war', 'iraq', 'us & canada', 'middle east', 'europe', 'asia', 'africa', 'australia', 'latine America',
    'martial arts', 'football', 'cricket', 'formula 1', 'tennis', 'golf', 'athletics', 'cycling',
    'business',
    'technology', 'science & health',
    'books', 'style', 'film & tv', 'music', 'art & design', 'entertainment',
    'destinations', 'food & drink', 'adventures',
    'natural wonders', 'weather & climate'
  ];

let tags = [];

input.addEventListener('change', uploadImage)

label.addEventListener('dragover', (e) => {
    e.preventDefault()
})

label.addEventListener('drop', (e) => {
    e.preventDefault()
    input.files = e.dataTransfer.files
    uploadImage()
})

catInput.addEventListener('keyup', addTag)

catInput.addEventListener('input', suggestions)

catInput.addEventListener('blur', () => {
    setTimeout(() => {
        suggestionsList.innerHTML = '';
    }, 100);
});


function uploadImage() {
    let imgURL = URL.createObjectURL(input.files[0]);
    let img = new Image()
    img.src = imgURL
    img.onload = () => {
        let width = img.naturalWidth
        let height = img.naturalHeight

        if (width / height != 16 / 9) {
            document.body.innerHTML = `
            <div class="alert alert-danger" role="alert">
                This image is invalid, please enter an image with 16/9 aspect ratio
            </div>
            ` + document.body.innerHTML
        }
        else {
            label.style.backgroundImage = `url(${imgURL})`;
            imgText.style.display = 'none'
        }
    }
}

function addTag(e) {
    if (e.key == 'Enter') {
        let tag = e.target.value.replace(/\s+/g, ' ');
        if (tag.length > 1 && !tags.includes(tag)) {
            tag.split(',').forEach(tag => {
                tags.push(tag)
                createTag(tag)
            });
        }
        e.target.value = '';
    }
}

function createTag(tag) {
    let li = document.createElement('li')
    let p = document.createElement('p')
    let i = document.createElement('i')
    p.textContent = tag
    i.classList.add('fa-solid', 'fa-x', 'fa-xs')
    li.appendChild(p)
    li.appendChild(i)
    
    ul.insertBefore(li, catInput);
    i.onclick = () => removeTag(i, tag);
}

function removeTag(element, tag) {
    let index = tags.indexOf(tag);
    tags = [ ...tags.slice(0, index), ...tags.slice(index + 1)]
    element.parentElement.remove()
}

function suggestions() {
    const query = this.value.trim().toLowerCase();
    
    suggestionsList.innerHTML = '';

    if (query) {
        const filteredTags = availableTags.filter(tag => tag.includes(query));

        filteredTags.forEach(tag => {
        const li = document.createElement('li');
        li.textContent = tag;
        li.classList.add('list-group-item', 'list-group-item-action')
        li.addEventListener('click', () => {
            createTag(tag)
            suggestionsList.innerHTML = '';
            catInput.value = '';
        });
        suggestionsList.appendChild(li);
        });
    }
};