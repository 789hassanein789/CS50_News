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
const radioBtns = document.querySelectorAll('.btn-check')
const select = document.querySelector('#sub_category')
const suggestionsTags = suggestionsList.querySelectorAll('li')
const cancelBtn = overlay.querySelector('.cancel-btn')
const editImg = document.getElementById('new-img-input') 
const closeTags = document.querySelectorAll('.chosed-tags .fa-x')
const deleteNew = document.querySelector('#delete-new')
const backBtn = document.querySelector('.back-btn');
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
	console.log(input.files[0].name)
    uploadImage()
})

//TODO: replace the datalist with a custom list, problem not with inputfield.
document.querySelectorAll('datalist option').forEach(option => {
	option.addEventListener('click', addTag)
})

tagsInput.addEventListener('keyup', addTag)

tagsInput.addEventListener('input', suggestions)
/*
tagsInput.addEventListener('blur', () => {
    setTimeout(() => {
        suggestionsList.classList.add('d-none')
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
	document.body.style.overflowY = 'auto';
})

form.addEventListener('submit', (e) => e.preventDefault())

radioBtns.forEach(btn => {
	btn.addEventListener('click', radioSelect)
	if (btn.checked) {
		console.log(btn)
		if (btn.value !== "Business") {
			const selectedRadio = select.querySelectorAll(`.${btn.id[0]}`)
			selectedRadio.forEach(radio => {
				radio.classList.remove('d-none')
			})
			select.firstElementChild.classList.remove('d-none')
		}
	}
})

suggestionsTags.forEach(li => {
	li.addEventListener('click', () => {
		createTag(li.firstChild.textContent)
		suggestionsList.classList.add('d-none')
        tagsInput.value = '';
	})

})

cancelBtn.addEventListener('click', () => {
	overlay.classList.add('d-none')
	document.body.style.overflowY = 'auto';
})

if (editImg && editImg) {
	if (editImg.src !== '') {
		label.style.backgroundImage = `url(${editImg.src})`;
		imgText.style.display = 'none';
		document.querySelectorAll('.chosed-tags li').forEach(li => tags.push(li.firstElementChild.textContent))
	}
	if (editImg.src && editImg.src !== window.location.href) {
		fetch(editImg.src)
			.then(res => res.blob())
			.then(blob => {
				const file = new File([blob], "image.png", { type: blob.type });
				const dataTransfer = new DataTransfer();
				dataTransfer.items.add(file);
				input.files = dataTransfer.files;
			})
			.catch(error => console.error("Error loading image:", error));
	}
}

closeTags.forEach(closeBtn => {
	closeBtn.addEventListener('click', () => {
		removeTag(closeBtn.parentElement, closeBtn.getAttribute('data-tag'))
	})
})

backBtn.addEventListener('click', () => {
	editorForm.classList.add('d-none')
	form.classList.remove('d-none')
})

function uploadImage() {
	console.log('hi')
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

function enterAddTag(e) {
	console.log("enterAddTag")
	if (e.key == 'Enter') {
		suggestionsList.classList.add('d-none')
		let tag = e.target.value.replace(/\s+/g, ' ');
		if (tag.length > 1 && !tags.includes(tag)) {
			tag.split(',').forEach(tag => {
				createTag(tag)
			});
		}
		e.target.value = '';
	}
}

function addTag(e) {
	if (e.key == 'Enter') {
		console.log('addTag')
		suggestionsList.classList.add('d-none')
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
    i.onclick = () => removeTag(li, tag);
}

function removeTag(element, tag) {
    let index = tags.indexOf(tag);
    tags = [ ...tags.slice(0, index), ...tags.slice(index + 1)]
    element.remove()
}

// TODO:
function suggestions() {
	console.log('suggestions')
	tagsError.classList.add('d-none')
	suggestionsTags.forEach(tag => {
		tag.classList.add('d-none')
	})
    const query = this.value.trim().toLowerCase();
    suggestionsList.classList.add('d-none')
	suggestionsList.classList.remove('d-none')
    if (query) {
		suggestionsTags.forEach(tag => {
			if (tag.firstChild.textContent.includes(query) && !tags.includes(tag.firstChild.textContent)) {
				tag.classList.remove('d-none')
			}
		})
		/*
		.filter(tag => tag.includes(query) && !tags.includes(tag));

        filteredTags.forEach(tag => {
			tag.classList.remove('d-none')
        const li = document.createElement('li');
        li.textContent = tag;
        li.classList.add('list-group-item', 'list-group-item-action')
        li.addEventListener('click', () => {
            createTag(tag)
            suggestionsList.classList.add('d-none')
            tagsInput.value = '';
        });
        suggestionsList.appendChild(li);
		
        });
		*/
    }
};

function crop(url) {
    overlay.classList.remove('d-none');
	document.body.style.overflowY = 'hidden';
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
			background: false,
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

function radioSelect(e) {
	select.querySelectorAll('option').forEach(option => {
		option.classList.add('d-none')
	})
	select.selectedIndex = 0
	if (e.target.id !== "Business") {
		const selectedRadio = select.querySelectorAll(`.${e.target.id[0]}`)
		selectedRadio.forEach(radio => {
			radio.classList.remove('d-none')
		})
		select.firstElementChild.classList.remove('d-none')
		select.disabled = false
	}
	else {
		select.disabled = true
	}
}

let initialData;

continueBtn.addEventListener('click', () => {
    initialData = initSubmit()
})

editorForm.addEventListener('submit', (e) => {
    e.preventDefault();
	finalSubmit(initialData);
})

function initSubmit() {
	console.log(form.querySelector('.btn-check:checked'))
 	let selectedValue = select.options[select.selectedIndex].value;
	errors.forEach(error => {
		error.classList.add('d-none')
	})
	if (!editImg) {
		if (form.blob.value === '') {
			errors[0].classList.remove('d-none')
		}
	}
	if (form.headline.value === '') {
		errors[1].classList.remove('d-none')
	}
	else if (form.Sub_headline.value === '') {
		errors[2].classList.remove('d-none')
	}
	else if (!form.querySelector('.btn-check:checked')) {
		errors[3].classList.remove('d-none')
	}
	else if (selectedValue === "Sub Category") {
		errors[4].classList.remove('d-none')
	}
	else if (!form.querySelector('li > p')) {
		errors[5].classList.remove('d-none')
	}
	else {
		let body = new FormData(form)
		if (customCropper) {
			customCropper.getCroppedCanvas().toBlob((blob) => {
				body.append('blob', blob)
			})
		}
		console.log(tags)
		body.append('tags', tags)
		const ps = document.querySelectorAll('ul p');
		form.classList.add('d-none')
		editorForm.classList.remove('d-none')
		document.body.classList.add('overflow-y-hidden');
		globalThis.scrollTo({top: 0, left: 0, behavior: 'smooth'})
		return body
	}
}

function finalSubmit(body) {
	const content = editor.getData()
	if (content === "") {
		document.body.innerHTML = '<div class="alert alert-danger" role="alert">you should add content to your article!</div>' + body.innerHTML;
	}
	else {
		body.append('content', content)
		fetch(window.location.href, {
			method: 'POST',
			headers: {
			'X-CSRFToken': getCookie('csrftoken'),
			},
			credentials: "same-origin",
			body: body,
			redirect: "follow"
		})
		.then(result => {
			result.text().then(text => console.log(text))
			if (result.ok) {
				window.location.href = result.url
			}
			else {
				console.log(result)
				form.classList.remove('d-none')
				document.body.innerHTML = `<div class="alert alert-danger" role="alert">${result.message}</div> ${document.body.innerHTML}`;
				editorForm.classList.add('d-none')
			}
		})
		.catch(error => {
			
		})
	}}