"""
***** Most of this was auto-generated by Django
***** We have only touched the installed apps and database stuff and
        media stuff at the bottom

Django settings for biopath project.

Generated by 'django-admin startproject' using Django 4.1.1.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/


ENVIORNMENT VARIBALES NEEDED:
    SECRET_KEY:  the django secret key, this needs to be kept secret
    DJANGO_ENV:  the current enviornment the app is in ("development"/"production")

    DB_NAME:     the name of the database being connected to
    DB_HOSTNAME: the name of the database host
    DB_PORT:     which port the database will be running on (NOTE: standard to postgres is 5432)
    DB_USERNAME: the database user
    DB_PASSWORD: the database password
"""

from pathlib import Path
import os
import sys
from datetime import timedelta

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.environ.get("SECRET_KEY")
SECRET_KEY = 'django-insecure-o%s2)@(x_ow3bm(6z0r-05nqc!eb!o^vt_)0nc^ua_)i=1x!_r'

# SECURITY WARNING: don't run with debug turned on in production!
# unless development is explicitly stated, set to debug to False to ensure safety
if os.environ.get("DJANGO_ENV") == "development":
    DEBUG = True
else: DEBUG = False

ALLOWED_HOSTS = [
    "wtfysc3awc.us-west-2.awsapprunner.com",
    "localhost"
]


# Application definition

INSTALLED_APPS = [
    'api',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',           
    'rest_framework.authtoken', # for generating authentication tokens
    'corsheaders',
    'frontend'
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'biopath.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'biopath.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

DATABASES =  {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get("DB_NAME"),
        'HOST': os.environ.get("DB_HOSTNAME"), # 'db', # name of postgres container
        'PORT': os.environ.get("DB_PORT"),     # default port for postgres
        'USER': os.environ.get('DB_USERNAME'),
        'PASSWORD': os.environ.get('DB_PASSWORD')
    }
}


if "RDS_DB_NAME" in os.environ: # when pushing to AWS this tag will be available via AWS copilot defined env variables  
    DATABASES =  {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get("RDS_DB_NAME"),
            'HOST': os.environ.get("RDS_HOSTNAME"), # 'db', # name of postgres container
            'PORT': os.environ.get("RDS_PORT"),     # default port for postgres
            'USER': os.environ.get('RDS_USERNAME'),
            'PASSWORD': os.environ.get('RDS_PASSWORD')
        }
    }
else:
    DATABASES = { # edited by Josh S
        # environment variables (ie for NAME, USER, and PASSWORD) are defined in the docker-compose file for service: backend
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get("POSTGRES_DB"),
            'HOST': os.environ.get("POSTGRES_DB_HOST"), # 'db', # name of postgres container
            'PORT': 5432, # default port for postgres
            'USER': os.environ.get('POSTGRES_USER'),
            'PASSWORD': os.environ.get('POSTGRES_PASSWORD'),
            'TEST': {
                'ENGINE': 'django.db.backends.sqlite3',
                'NAME': f'{BASE_DIR}/db.sqlite3',
            }
        }
    }


# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.1/howto/static-files/

STATIC_URL = 'static/'

STATIC_ROOT = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Allow CORS from localhost for development
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://wtfysc3awc.us-west-2.awsapprunner.com",
    "https://vwuucs6wau.us-west-2.awsapprunner.com"
]


# set authentication scheme for auth tokens 
# https://www.django-rest-framework.org/api-guide/authentication/#setting-the-authentication-scheme
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ]
}

# configure the JWT's DEFAULT_AUTHENTICATION_CLASSES
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
}

# Setup Session Engine Info
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
SESSION_COOKIE_NAME = 'myapp_session_id'



# This is for image storage
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
MEDIA_URL = "/media/"