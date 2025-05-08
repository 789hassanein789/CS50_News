# CS50 News

## Table of content
1. [overview](#overview-of-the-project)
2. [Distinctiveness and Complexity](#Distinctiveness-and-Complexity)
3. [Files content](#Files-content)
    - [CS50_News/](#CS50_News)
5. [overview](#overview-of-the-project)
6. [requirements](#requirements)
7. [How to run](#How-to-run)
8. [Note](#Note)
9. [overview](#overview-of-the-project)

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

# Note