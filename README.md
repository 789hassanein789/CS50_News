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
        - admin.js
        - CKEditor.css
        - CKEditor.js
        - create.css
        - create.css.map
        - create.scss
        - crop.js
        - footer.css
        - footer.css.map
        - footer.scss
        - index.css
        - index.css.map
        - index.js
        - index.scss
        - new.css
        - new.css.map
        - new.scss
        - news.js
        - placements.js
        - reset.css
        - reset.js
        - staff.css
        - staff.css.map
        - staff.js
        - staff.scss
        - style.css
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
        - designs: a directory
            - _carousel.html
            - _featured.html
            - _hero.html
            - _left.html
            - _more.html
            - _news.html
            - _only.html
            - _right.html
            - _scroll.html
            - _trending.html
         - pages
            - business.html
            - culture.html
            - earth.html
            - innovation.html
            - news.html
            - sport.html
            - travel.html  
         - sections
            - _carousel.html
            - _featured.html
            - _hero.html
            - _left.html
            - _more.html
            - _news.html
            - _only.html
            - _right.html
            - _scroll.html
            - _trending.html
         - sub_templates
            - _footer.html
            - _main- header.html
            - _navbar.html
            - _offcanvas.html
            - _overlay.html
            - _subnav.html        
    - templatetags
        - change.py 
- final_project
   - .env
   - settings.py
   - urls.py
            
- CS50_News: the main app directory
    - static/CS50_News: static files directory
        - bundles: containes images to style the site (logo & google png image)
    - templates/CS50_News: templates directory

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
