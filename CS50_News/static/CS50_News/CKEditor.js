const {
	DecoupledEditor,
	Alignment,
	Autoformat,
	AutoImage,
	AutoLink,
	Autosave,
	BalloonToolbar,
	BlockQuote,
	Bold,
	Bookmark,
	CKBox,
	CKBoxImageEdit,
	CloudServices,
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
	Paragraph,
	PasteFromOffice,
	PictureEditing,
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
	TodoList,
	Underline
} = window.CKEDITOR;
const { AIAssistant, ExportPdf, ExportWord, ImportWord, MultiLevelList, OpenAITextAdapter } = window.CKEDITOR_PREMIUM_FEATURES;

const form = document.querySelector('#init-form')
const editorForm = document.querySelector('#editor-form');

const LICENSE_KEY =
	'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzUxNzExOTksImp0aSI6IjBmNmZjYjUxLTI1MGYtNDY1Ny1hM2FmLThlZDIxMTE4ODY5NyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImVlZTNiZWEzIn0.nYFLSY7Q0uRO6rmeJNZZRN5recQtN360REK3L2ZReOixr_DJu-_kQ90obePzMeIU84Xp7blqLawTCMlvUYdQVA';

/**
 * USE THIS INTEGRATION METHOD ONLY FOR DEVELOPMENT PURPOSES.
 *
 * This sample is configured to use OpenAI API for handling AI Assistant queries.
 * See: https://ckeditor.com/docs/ckeditor5/latest/features/ai-assistant/ai-assistant-integration.html
 * for a full integration and customization guide.
 */
const AI_API_KEY = 'eyJhbGciOiJFUzI1NiJ9.eyJleHAiOjE3MzUxNzExOTksImp0aSI6IjBmNmZjYjUxLTI1MGYtNDY1Ny1hM2FmLThlZDIxMTE4ODY5NyIsInVzYWdlRW5kcG9pbnQiOiJodHRwczovL3Byb3h5LWV2ZW50LmNrZWRpdG9yLmNvbSIsImRpc3RyaWJ1dGlvbkNoYW5uZWwiOlsiY2xvdWQiLCJkcnVwYWwiLCJzaCJdLCJ3aGl0ZUxhYmVsIjp0cnVlLCJsaWNlbnNlVHlwZSI6InRyaWFsIiwiZmVhdHVyZXMiOlsiKiJdLCJ2YyI6ImVlZTNiZWEzIn0.nYFLSY7Q0uRO6rmeJNZZRN5recQtN360REK3L2ZReOixr_DJu-_kQ90obePzMeIU84Xp7blqLawTCMlvUYdQVA';

const CLOUD_SERVICES_TOKEN_URL =
	'https://0zs1pat_03ek.cke-cs.com/token/dev/98dca0da3f19cc35b9a26a0a97a1b7ac6efa41f15697f30780355e66c323?limit=10';

const editorConfig = {
	toolbar: {
		items: [
			'aiCommands',
			'aiAssistant',
			'|',
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
			'multiLevelList',
			'todoList',
			'outdent',
			'indent'
		],
		shouldNotGroupWhenFull: false
	},
	plugins: [
		AIAssistant,
		Alignment,
		Autoformat,
		AutoImage,
		AutoLink,
		Autosave,
		BalloonToolbar,
		BlockQuote,
		Bold,
		Bookmark,
		CKBox,
		CKBoxImageEdit,
		CloudServices,
		Essentials,
		ExportPdf,
		ExportWord,
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
		ImportWord,
		Indent,
		IndentBlock,
		Italic,
		Link,
		LinkImage,
		List,
		ListProperties,
		MultiLevelList,
		OpenAITextAdapter,
		Paragraph,
		PasteFromOffice,
		PictureEditing,
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
		TodoList,
		Underline
	],
	ai: {
		openAI: {
			requestHeaders: {
				Authorization: 'Bearer ' + AI_API_KEY
			}
		}
	},
	balloonToolbar: ['aiAssistant', '|', 'bold', 'italic', '|', 'link', 'insertImage', '|', 'bulletedList', 'numberedList'],
	cloudServices: {
		tokenUrl: CLOUD_SERVICES_TOKEN_URL
	},
	exportPdf: {
		stylesheets: [
			/* This path should point to application stylesheets. */
			/* See: https://ckeditor.com/docs/ckeditor5/latest/features/converters/export-pdf.html */
			'./style.css',
			/* Export PDF needs access to stylesheets that style the content. */
			'https://cdn.ckeditor.com/ckeditor5/44.1.0/ckeditor5.css',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/44.1.0/ckeditor5-premium-features.css'
		],
		fileName: 'export-pdf-demo.pdf',
		converterOptions: {
			format: 'A4',
			margin_top: '20mm',
			margin_bottom: '20mm',
			margin_right: '12mm',
			margin_left: '12mm',
			page_orientation: 'portrait'
		}
	},
	exportWord: {
		stylesheets: [
			/* This path should point to application stylesheets. */
			/* See: https://ckeditor.com/docs/ckeditor5/latest/features/converters/export-word.html */
			'./style.css',
			/* Export Word needs access to stylesheets that style the content. */
			'https://cdn.ckeditor.com/ckeditor5/44.1.0/ckeditor5.css',
			'https://cdn.ckeditor.com/ckeditor5-premium-features/44.1.0/ckeditor5-premium-features.css'
		],
		fileName: 'export-word-demo.docx',
		converterOptions: {
			document: {
				orientation: 'portrait',
				size: 'A4',
				margins: {
					top: '20mm',
					bottom: '20mm',
					right: '12mm',
					left: '12mm'
				}
			}
		}
	},
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
			'resizeImage',
			'|',
			'ckboxImageEdit'
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
	menuBar: {
		isVisible: true
	},
	placeholder: 'Type or paste your content here!'
};

configUpdateAlert(editorConfig);

let editor

DecoupledEditor.create(document.querySelector('#editor'), editorConfig).then(newEditor => {
	document.querySelector('#editor-toolbar').appendChild(newEditor.ui.view.toolbar.element);
	document.querySelector('#editor-menu-bar').appendChild(newEditor.ui.view.menuBarView.element);
	editor = newEditor

	return newEditor;
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

let initialData;

form.addEventListener('submit', (e) => {
    e.preventDefault()
    initialData = initSubmit()
})

editorForm.addEventListener('submit', (e) => {
    e.preventDefault();
	if (initialData) {
		finalSubmit(initialData)
	}
	else {
		alert('your form is incomplete, please try resubmiting the previous form.')
	}
})


function initSubmit() {
    let body = new FormData(form)
    const ps = document.querySelectorAll('ul p');
    let values = [];
    ps.forEach(p => {
        values.push(p.textContent);
        console.log(values);
    })
    body.append('categories', values)
    form.classList.add('d-none')
    editorForm.classList.remove('d-none')
	document.body.classList.add('overflow-y-hidden');
	globalThis.scrollTo({top: 0, left: 0, behavior: 'smooth'})
    for (const [key, value] of body) {
        console.log(`${key}: ${value}\n`);
    }
	return body
}

function finalSubmit(body) {
	console.log(editor.getData())
    body.append('content', editor.getData())
	fetch('/add', {
		method: 'POST',
		headers: {
		'X-CSRFToken': getCookie('csrftoken'),
		},
		credentials: "same-origin",
		body: body
	})
}
/**
 * This function exists to remind you to update the config needed for premium features.
 * The function can be safely removed. Make sure to also remove call to this function when doing so.
 */
function configUpdateAlert(config) {
	if (configUpdateAlert.configUpdateAlertShown) {
		return;
	}

	const isModifiedByUser = (currentValue, forbiddenValue) => {
		if (currentValue === forbiddenValue) {
			return false;
		}

		if (currentValue === undefined) {
			return false;
		}

		return true;
	};

	const valuesToUpdate = [];

	configUpdateAlert.configUpdateAlertShown = true;

	if (!isModifiedByUser(config.licenseKey, '<YOUR_LICENSE_KEY>')) {
		valuesToUpdate.push('LICENSE_KEY');
	}

	if (!isModifiedByUser(config.ai?.openAI?.requestHeaders?.Authorization, 'Bearer <YOUR_AI_API_KEY>')) {
		valuesToUpdate.push('AI_API_KEY');
	}

	if (!isModifiedByUser(config.cloudServices?.tokenUrl, '<YOUR_CLOUD_SERVICES_TOKEN_URL>')) {
		valuesToUpdate.push('CLOUD_SERVICES_TOKEN_URL');
	}

	if (valuesToUpdate.length) {
		window.alert(
			[
				'Please update the following values in your editor config',
				'to receive full access to Premium Features:',
				'',
				...valuesToUpdate.map(value => ` - ${value}`)
			].join('\n')
		);
	}
}