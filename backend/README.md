# REST API + Panneau d’administration

## Intro

The backend folder is a [Django project](https://www.djangoproject.com) that contains all the logic for a REST API as well as an Admin Panel and is responsible for storing data in a [Django compatible database](https://docs.djangoproject.com/en/4.2/ref/databases/).

## Installation

1. Install python and pip

   This program is developed and tested in python 3.10.12

1. Clone this repository with `git clone`

1. Go to the backend folder

   ```sh
   cd backend
   ```

1. Download dependencies

   ```sh
   pip install -r requirements.txt
   ```

## Run server

### In development

> :warning: **Do not run development in a production environment**

#### Apply database migrations

The following command creates a SQLite database and initializes it.

```sh
python manage.py migrate
```

#### Create an superuser

A super user is a user that have all access in the admin panel.

```sh
python manage.py createsuperuser
```

#### Run the development server

```sh
python manage.py runserver
```

### In production

TODO
