# CS50 News  

## overview of the project
cs50 News is a bbc like news website were users can read news and articles on various topics, including but not limited to the recent news, sport, business, culture, Innovation and more, admins of the site can add, edit and delete articles and they control the distribution of articels in different pages by controling the sections of the page and the articels placement in each section.

# Distinctiveness and Complexity
I have implemeted a fairly good authentication & authrization system in this project using django-allauth library making the user able to sign up, sign in and sign out, as will as signing in using a third party provider (google & github), after signing in the user can edit his account info like his email & password after varifing his identity by either entering his password or entering a one time password (OTP) that he receives on his email, and the user can reset his password even if he was signed out of his account by entering his email then receiving url to reset his password, 

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
