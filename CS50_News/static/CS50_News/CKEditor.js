const {
	DecoupledEditor,
	Alignment,
	Autoformat,
	AutoImage,
	AutoLink,
	Autosave,
	BalloonToolbar,
	Base64UploadAdapter,
	BlockQuote,
	Bold,
	Bookmark,
	Code,
	Essentials,
	FindAndReplace,
	FontBackgroundColor,
	FontColor,
	FontFamily,
	FontSize,
	Heading,
	HorizontalLine,
	ImageBlock,
	ImageCaption,
	ImageInline,
	ImageInsert,
	ImageInsertViaUrl,
	ImageResize,
	ImageStyle,
	ImageTextAlternative,
	ImageToolbar,
	ImageUpload,
	Indent,
	IndentBlock,
	Italic,
	Link,
	LinkImage,
	List,
	ListProperties,
	Markdown,
	MediaEmbed,
	Mention,
	PageBreak,
	Paragraph,
	PasteFromMarkdownExperimental,
	PasteFromOffice,
	RemoveFormat,
	SpecialCharacters,
	SpecialCharactersArrows,
	SpecialCharactersCurrency,
	SpecialCharactersEssentials,
	SpecialCharactersLatin,
	SpecialCharactersMathematical,
	SpecialCharactersText,
	Strikethrough,
	Subscript,
	Superscript,
	TextTransformation,
	Title,
	TodoList,
	Underline,
	WordCount
} = window.CKEDITOR;

const label = document.querySelector('#label');
const input = document.querySelector('#img-input');
const imgText = document.querySelector('#img-text');
const ul = document.querySelector('ul');
const tagsInput = document.querySelector('#tags-input');
const suggestionsList = document.querySelector('.suggestions');
const allInputs = document.querySelectorAll('input');
const overlay = document.querySelector('.overlay');
const customImg = document.querySelector('.custom-img');
const downloadBtn = document.querySelector('.popup-btn');
let customCropper = "";
let fileName = "";
const form = document.querySelector('#init-form');
const continueBtn = document.querySelector('.continue-btn');
const editorForm = document.querySelector('#editor-form');
const errors = document.querySelectorAll('.error');
const tagsError = document.querySelector('.tags-input-error');
let chosedTags;

const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3NjU0OTc1OTksImp0aSI6IjJkODE4MDBiLWFiOTMtNDM3Ny05MzBjLWQ2MTM3OTcxYzBhMCIsImxpY2Vuc2VkSG9zdHMiOlsiMTI3LjAuMC4xIiwibG9jYWxob3N0IiwiMTkyLjE2OC4qLioiLCIxMC4qLiouKiIsIjE3Mi4qLiouKiIsIioudGVzdCIsIioubG9jYWxob3N0IiwiKi5sb2NhbCJdLCJ1c2FnZUVuZHBvaW50IjoiaHR0cHM6Ly9wcm94eS1ldmVudC5ja2VkaXRvci5jb20iLCJkaXN0cmlidXRpb25DaGFubmVsIjpbImNsb3VkIiwiZHJ1cGFsIl0sImxpY2Vuc2VUeXBlIjoiZGV2ZWxvcG1lbnQiLCJmZWF0dXJlcyI6WyJEUlVQIiwiQk9YIl0sInZjIjoiYzljYThhMWIifQ.jC4HvAjJ_ZI33iwdEbEz5DGM_XjG_mg_PgVtV6YxXcui2qE2wavucwUrYD3BK1GFeVWmpSbvGHIiN2iamD2DEQ';

const editorConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'fontSize',
			'fontFamily',
			'fontColor',
			'fontBackgroundColor',
			'|',
			'bold',
			'italic',
			'underline',
			'|',
			'link',
			'insertImage',
			'blockQuote',
			'|',
			'alignment',
			'|',
			'bulletedList',
			'numberedList',
			'todoList',
			'outdent',
			'indent'
		],
		shouldNotGroupWhenFull: false
	},
	plugins: [
		Alignment,
		Autoformat,
		AutoImage,
		AutoLink,
		Autosave,
		BalloonToolbar,
		Base64UploadAdapter,
		BlockQuote,
		Bold,
		Bookmark,
		Code,
		Essentials,
		FindAndReplace,
		FontBackgroundColor,
		FontColor,
		FontFamily,
		FontSize,
		Heading,
		HorizontalLine,
		ImageBlock,
		ImageCaption,
		ImageInline,
		ImageInsert,
		ImageInsertViaUrl,
		ImageResize,
		ImageStyle,
		ImageTextAlternative,
		ImageToolbar,
		ImageUpload,
		Indent,
		IndentBlock,
		Italic,
		Link,
		LinkImage,
		List,
		ListProperties,
		Markdown,
		MediaEmbed,
		Mention,
		PageBreak,
		Paragraph,
		PasteFromMarkdownExperimental,
		PasteFromOffice,
		RemoveFormat,
		SpecialCharacters,
		SpecialCharactersArrows,
		SpecialCharactersCurrency,
		SpecialCharactersEssentials,
		SpecialCharactersLatin,
		SpecialCharactersMathematical,
		SpecialCharactersText,
		Strikethrough,
		Subscript,
		Superscript,
		TextTransformation,
		Title,
		TodoList,
		Underline,
		WordCount
	],
	balloonToolbar: ['bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
	fontFamily: {
		supportAllValues: true
	},
	fontSize: {
		options: [10, 12, 14, 'default', 18, 20, 22],
		supportAllValues: true
	},
	heading: {
		options: [
			{
				model: 'paragraph',
				title: 'Paragraph',
				class: 'ck-heading_paragraph'
			},
			{
				model: 'heading1',
				view: 'h1',
				title: 'Heading 1',
				class: 'ck-heading_heading1'
			},
			{
				model: 'heading2',
				view: 'h2',
				title: 'Heading 2',
				class: 'ck-heading_heading2'
			},
			{
				model: 'heading3',
				view: 'h3',
				title: 'Heading 3',
				class: 'ck-heading_heading3'
			},
			{
				model: 'heading4',
				view: 'h4',
				title: 'Heading 4',
				class: 'ck-heading_heading4'
			},
			{
				model: 'heading5',
				view: 'h5',
				title: 'Heading 5',
				class: 'ck-heading_heading5'
			},
			{
				model: 'heading6',
				view: 'h6',
				title: 'Heading 6',
				class: 'ck-heading_heading6'
			}
		]
	},
	image: {
		toolbar: [
			'toggleImageCaption',
			'imageTextAlternative',
			'|',
			'imageStyle:inline',
			'imageStyle:wrapText',
			'imageStyle:breakText',
			'|',
			'resizeImage'
		]
	},
	licenseKey: LICENSE_KEY,
	link: {
		addTargetToExternalLinks: true,
		defaultProtocol: 'https://',
		decorators: {
			toggleDownloadable: {
				mode: 'manual',
				label: 'Downloadable',
				attributes: {
					download: 'file'
				}
			}
		}
	},
	list: {
		properties: {
			styles: true,
			startIndex: true,
			reversed: true
		}
	},
	mention: {
		feeds: [
			{
				marker: '@',
				feed: [
					/* See: https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html */
				]
			}
		]
	},
	menuBar: {
		isVisible: true
	},
	placeholder: 'Type or paste your content here!'
};

let editor

DecoupledEditor.create(document.querySelector('#editor'), editorConfig).then(newEditor => {
	const wordCount = newEditor.plugins.get('WordCount');
	document.querySelector('#editor-word-count').appendChild(wordCount.wordCountContainer);

	document.querySelector('#editor-toolbar').appendChild(newEditor.ui.view.toolbar.element);
	document.querySelector('#editor-menu-bar').appendChild(newEditor.ui.view.menuBarView.element);
	editor = newEditor

	return newEditor;
});

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

tagsInput.addEventListener('keyup', addTag)

tagsInput.addEventListener('input', suggestions)
/*
tagsInput.addEventListener('blur', () => {
    setTimeout(() => {
        suggestionsList.innerHTML = '';
    }, 100);
});
*/
allInputs.forEach(input => {
    input.addEventListener('focus', () => {
        const alert = document.querySelector('.alert')
        if (alert) {
            alert.remove()
        }
    })
})

downloadBtn.addEventListener('click', (e) => {
    e.preventDefault()
    let imgURL = customCropper.getCroppedCanvas().toDataURL()
    label.style.backgroundImage = `url(${imgURL})`;
    input.src = imgURL;
    imgText.style.display = 'none';
    overlay.classList.add('d-none');
})

form.addEventListener('submit', (e) => e.preventDefault())

function uploadImage() {
    let imgURL = URL.createObjectURL(input.files[0]);
    let img = new Image()
    img.src = imgURL
    img.onload = () => {
        let width = img.naturalWidth
        let height = img.naturalHeight

        if (width / height != 16 / 9) crop(imgURL)
        
        else {
            label.style.backgroundImage = `url(${imgURL})`;
            imgText.style.display = 'none';
        }
    }    
}

function addTag(e) {
    if (e.key == 'Enter') {
		suggestionsList.innerHTML = '';
        let tag = e.target.value.replace(/\s+/g, ' ');
        if (tag.length > 1 && !tags.includes(tag)) {
            tag.split(',').forEach(tag => {
                createTag(tag)
            });
        }
        e.target.value = '';
    }
}

function createTag(tag) {
	if (tags.length >= 5) {
		tagsError.textContent = 'you have entered 5 tags, which is the maximum number of tags.';
		tagsError.classList.remove('d-none');
		return
	}
	tags.push(tag)
    let li = document.createElement('li')
    let p = document.createElement('p')
    let i = document.createElement('i')
    p.textContent = tag
    i.classList.add('fa-solid', 'fa-x', 'fa-xs')
    li.appendChild(p)
    li.appendChild(i)
    
    ul.insertBefore(li, tagsInput);
    i.onclick = () => removeTag(i, tag);
}

function removeTag(element, tag) {
    let index = tags.indexOf(tag);
    tags = [ ...tags.slice(0, index), ...tags.slice(index + 1)]
    element.parentElement.remove()
}

function suggestions() {
	tagsError.classList.add('d-none')
    const query = this.value.trim().toLowerCase();
    suggestionsList.innerHTML = '';
    if (query) {
        console.log(tags);
		console.log(!tags.includes('hi'))
		const filteredTags = availableTags.filter(tag => tag.includes(query) && !tags.includes(tag));

        filteredTags.forEach(tag => {
        const li = document.createElement('li');
        li.textContent = tag;
        li.classList.add('list-group-item', 'list-group-item-action')
        li.addEventListener('click', () => {
            createTag(tag)
            suggestionsList.innerHTML = '';
            tagsInput.value = '';
        });
        suggestionsList.appendChild(li);
        });
    }
};

function crop(url) {
    overlay.classList.remove('d-none');
    customImg.setAttribute('src', url)
    let Reader = new FileReader();
    Reader.readAsDataURL(input.files[0]);
    Reader.onload = () => {
        if (customCropper) {
            customCropper.destroy()
        }
		customCropper = new Cropper(customImg, {
			viewMode: 2,
			aspectRatio: 16/9,
			zoomable: false,
		});   
    }
    fileName = input.files[0].name.split('.')[0]
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

let initialData;

continueBtn.addEventListener('click', (e) => {
    initialData = initSubmit()
})

editorForm.addEventListener('submit', (e) => {
    e.preventDefault();
	finalSubmit(initialData);
})

function initSubmit() {
	errors.forEach(error => {
		error.classList.add('d-none')
	})
	if (form.img.value === '') {
		errors[0].classList.remove('d-none')
	}
	else if (form.headline.value === '') {
		errors[1].classList.remove('d-none')
	}
	else if (form.Sub_headline.value === '') {
		errors[2].classList.remove('d-none')
	}
	else if (form.querySelector('li > p') == null) {
		errors[3].classList.remove('d-none')
	}
	else {
		let body = new FormData(form)

		customCropper.getCroppedCanvas().toBlob((blob) => {
			body.append('blob', blob)
		})

		const ps = document.querySelectorAll('ul p');
		let values = [];
		ps.forEach(p => {
			values.push(p.textContent);
			console.log(values);
		})
		body.append('categories', values.join())
		form.classList.add('d-none')
		editorForm.classList.remove('d-none')
		document.body.classList.add('overflow-y-hidden');
		globalThis.scrollTo({top: 0, left: 0, behavior: 'smooth'})
		return body
	}
}

function finalSubmit(body) {
	console.log(editor.getData())
	console.log(body)
    body.append('content', editor.getData())
	fetch('/add', {
		method: 'POST',
		headers: {
		'X-CSRFToken': getCookie('csrftoken'),
		},
		credentials: "same-origin",
		body: body
	})
	.then(res => res.json())
	.then(result => {
		if (result.ok) {
			window.location.assign(result.url)
		}
	})
	.catch (error => {
		form.classList.remove('d-none')
		document.body.innerHTML = `<div class="alert alert-danger" role="alert">${error.message}</div> ${document.body.innerHTML}`;
		editorForm.classList.add('d-none')
	})
}

