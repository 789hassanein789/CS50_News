# CS50 News  

cs50 News is a bbc like news website were users can read the recent articles and news on any topic.

* **Authentication & Authorization**: a user can register & log in into any account and

* **Home Page**: the main route of the site should take the user to the Home page which display's all the important news 

* **Admin Page**: The admin page is a page that is only accessible for admin via which the admin can:

    - publish new articles
    - distribute new articles in the site
    - manage users accounts

* **Categories**: each article should have a list of categories/tags that tell the user what this article is about, each article can have up to 5 categories and should have at least one main category  

* **Dark/Light Mood**: 

* **New Page**: when a user click's at a New he should be redircted to that New page where the user can:

    - the content of the new article including the Headline, subheadline, auther, main image, content, time since the article was published and all tags/categories at the bottom of the article.
    - the should display an edit and delete buttons if the admin is the auther of the article, clicking at the edit button should redirect the admin to the create article page with the article info prepopulating the fields, and clicking at the delete button should evoke a popup where the admin can conrifm or cancel.
    - clicking at any category should take the user to a page displaying all the news articles that have the category with the most recent article first.
    - the page should display all related articles, clicking at any article should take the user to that article page.

* **Ranking algorithm**: implement a ranking algorithm that frequently reorder's all the new articles in the database based on the new article popularity.