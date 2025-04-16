# CS50 News  

## overview of the project
cs50 News is a bbc like news website were users can read news and articles on various topics, including but not limited to the recent news, sport, business, culture, Innovation and more, admins of the site can add, edit and delete articles and they control the distribution of articels in different pages by controling the sections of the page and the articels placement in each section.

# Distinctiveness and Complexity
I have implemeted a fairly good authentication & authrization system in this project using django-allauth library making the user able to sign up, sign in and sign out, as will as signing in using a third party provider (google & github), edit his account info like his email & password, reset his password even if he was signed out of his account, and finally delete the account, the news is devided to main categories then sub categories and every page is devided to sections and placements within sections which is all customizable by the admins, the site supports dark mood as will as having a text editor integrated in the admin page for writing news articles.

# Files content
- CS50_News: the app directory.
    - models.py: all the app models are in this file which are, User: for storing users info, New: for storing news articles, Page: for storing page cutomization, Sections: for storing every section in every page, Placements: for storing every article placement in every section.
    - urls.py: containing all app urls.
    - utils.py: containing help functions.
    - views.py: containing all app views.
    - static/CS50_News: all static files in the application, which are css & javascrip files for the templates.
        - css: a directory containing all styling files which are SCSS & CSS files.
        - CKEditor.js: the js file for the text editor configurations and settings.
        - index.js: the js file for runing the main index.html template.
        - news.js: js file for the news.html template. 
        - placements.js: js file for placements.html template.
        - reset.js: js file for 
        - staff.js: js file for admin.html template
        - bundles: a directory containing the app logo and google logo.
        - cover: a directory for storing all the images uploaded for the articles.
    - templates/CS50_News: a directory containing all app templates.
        - admin.html: an admin template (only accessable to admins) for displaying all the articles created by the admin and a create article link.
        - editor.html: an admin template for creating news articles.
        - index.html: the main template for displaying news in pre-established pages depanding on the category requested. 
        - layout.html: the base template of the app which all other templates inherit from except editor.html, page.html and placements.html.
        - new.html: a template for displaying any requested new article.
        - pages.html: an admin template for preforming CRUD operations on sections from any page. 
        - placements.html: an admin template for selecting article palacements.
        - search.html: a template for displaying search results and tags related news.
        - designs: a directory containing all the sections design as subtemplates to select from. 
         - sections: a directory containing all sections as subtemplates to display at pages dynamically
         - sub_templates: sub templates used on different places in the project including the layout.html base template.
            - _footer.html: the site footer.
            - _main- header.html: the site header.
            - _navbar.html: a navigation bar for navigating categories.
            - _offcanvas.html: an offcanvas for navigating and other uses.
            - _overlay.html: an overlay for authentication and account sittings. 
            - _subnav.html: a sub navigation bar for navigating sub categories.
    - templatetags: a directory containing django templates custom tags to use in the app.
        - change.py: containes tag functions.
- final_project: the project directory.
   - .env: enviroment variables for securety.
## requirements
1. python3
2. pip
## How to run
1. run `pip install -r requirements.txt` to install all the project dependencies.
2. create a file to store your envirenment variables by running `python setup_env.py`, which will create a `.env` file in the project directory (final_project) to store all the envirenment variables.
3. in the `.env` file you can find seven variables, and they are:
   -EMAIL: for your support email address, it will be used to send emails for authentication.
   -EMAIL_PASSWORD: for your support email password & both of them are required for the authentication sysrem to work.
   -SECRET_KEY: the project `SECRET_KEY` and it will be pre-filled with a random secret_key when you generate the file using setup_env.py 
   -GOOGLE_OAUTH_CLIENT_ID: for google project client_id, its used for social authentication with google account and you can get it by creating a project on [google cloud APIs](https://console.cloud.google.com/apis/dashboard) then create OAuth 2.0 Client IDs in credentials.
   -GOOGLE_SECRET: for the google OAuth 2.0 client secret & both of the id and secret are required for the social authentication.
   -GITHUB_OAUTH_CLIENT_ID: for github project client_id, just like google its used for social authetication and you can get it by creating a project on [github Developer settings](https://github.com/settings/developers).
   -GITHUB_SECRET: for the github project client secret.
4. make the migrations & migrate by running `python manage.py makemigrations` & `python manage.py migrate`

* **Authentication & Authorization**: a user can register & log in into any account and

* **Home Page**: the main route of the site should take the user to the Home page which display's all the important news 

* **Admin Page**: The admin page is a page that is only accessible for admin via which the admin can:

    - publish new articles
    - distribute new articles in the site
    - manage users accounts

* **Categories**: each article should have a category and a list of tags, each article can have up to 10 tags and must have one category

* **New Page**: when a user click's at a New he should be redircted to that New page where the user can:

    - the content of the new article including the Headline, subheadline, auther, main image, content, time since the article was published and all tags/categories at the bottom of the article.
    - the should display an edit and delete buttons if the admin is the auther of the article, clicking at the edit button should redirect the admin to the create article page with the article info prepopulating the fields, and clicking at the delete button should evoke a popup where the admin can conrifm or cancel.
    - clicking at any category should take the user to a page displaying all the news articles that have the category with the most recent article first.
    - the page should display all related articles, clicking at any article should take the user to that article page.

* **Ranking algorithm**: implement a ranking algorithm that frequently reorder's all the new articles in the database based on the new article popularity.
