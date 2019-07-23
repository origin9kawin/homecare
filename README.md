
# Origin HomeCare


## Features
- **Framework**: Express
- **Authentication**: JWT
- **Database**: MySQL (Sequelize)
- **Debuging**: Debug
- **Logging**: Winston
- Request Validation

## Getting Started
```shell
git clone https://github.com/origin9kawin/homecare.git
```

## For Nodejs
```
cd server

# Create environment variables from example
mv .env.example .env

# Install all dependencies
npm install

# Sequelize Migration
sequelize db:migrate
sequelize db:seed:all

# Run on port 5000
nodemon
```


## Environment variables

Name | Value
------------ | -------------
PORT|5000
LOG_LEVEL|"info"
DEBUG|*
SQL_HOST|"127.0.0.1"
SQL_PORT|3306
SQL_DB|"dbname"
SQL_USER|"dbuser"
SQL_PASS|"dbpassword"
SQL_DIALECT|"mysql"
SQL_POOL_LIMIT|100
EXPIRE_TOKEN_VERIFY|"24h"
EXPIRE_TOKEN_LOGIN|"3h"
USER_DEFAULT_VISIBLE|1
SECRET_KEY|"Thi$i$a$ec5#t"
QUERY_MAX_LIMIT|20
QUERY_MIN_LIMIT|5
QUERY_MAX_OFFSET|20
QUERY_MIN_OFFSET|0
LENGTH_MAX_USER_SIGNUP|15
LENGTH_MIN_USER_SIGNUP|3
LENGTH_MAX_PWD_SIGNUP|15
LENGTH_MIN_PWD_SIGNUP|3
UPLOAD_LOCATION|"uploads"
UPLOAD_FILESIZE|2
UPLOAD_MAX_COUNT|10
UPLOAD_FILE_EXTENSION|"png,jpg,jpeg"
MOCK_DATA_GENERATE|10
MOCK_DATA_GENERATE_PHONE|2
MOCK_DATA_GENERATE_DEFECT|2

## Structure

```

├── config
│   ├── api.js
│   ├── authentication.js
│   ├── config.json
│   ├── database.js
│   ├── mock.js
│   ├── sequelize.js
│   ├── upload.js
│   └── user.js
├── migrations
│   ├── 20190715012452-create-home-case-det.js
│   ├── 20190715014812-create-home-image.js
│   ├── 20190715021706-create-home-case.js
│   ├── 20190715022427-create-home-cate.js
│   ├── 20190715022544-create-home-proj.js
│   ├── 20190715022720-create-home-sub-cat.js
│   ├── 20190715022831-create-home-status.js
│   ├── 20190715022937-create-home-user.js
│   ├── 20190715031337-create-home-reason.js
│   ├── 20190719025203-create-home-list-defect.js
│   ├── 20190719083558-create-home-phone.js
│   ├── 20190719094527-create-home-img-main-tag.js
│   ├── 20190719094658-create-home-img-sub-tag.js
│   └── 20190720232754-create-home-case-number.js
├── models
│   ├── homecasedet.js
│   ├── homecase.js
│   ├── homecasenumber.js
│   ├── homecate.js
│   ├── homeimage.js
│   ├── homeimgmaintag.js
│   ├── homeimgsubtag.js
│   ├── homelistdefect.js
│   ├── homephone.js
│   ├── homeproj.js
│   ├── homereason.js
│   ├── homestatus.js
│   ├── homesubcat.js
│   ├── homeuser.js
│   └── index.js
├── package.json
|── package-lock.json
├── routes
│   ├── create
│   │   ├── hmcasedetail.js
│   │   ├── hmcaseimage.js
│   │   ├── hmcase.js
│   │   ├── maincat.js
│   │   ├── project.js
│   │   ├── reason.js
│   │   ├── status.js
│   │   └── subcat.js
│   ├── middlewares
│   │   └── logger.js
│   ├── sign
│   │   ├── signin.js
│   │   ├── signout.js
│   │   └── signup.js
│   └── test
│── seeders
│   ├── 20190710033652-HomeUser.js
│   ├── 20190711025554-HomeReason.js
│   ├── 20190711031659-HomeStatus.js
│   ├── 20190714094713-HomeImgMainTag.js
│   ├── 20190715024245-HomeCaseDet.js
│   ├── 20190715024356-HomeImage.js
│   ├── 20190715024843-HomeCase.js
│   ├── 20190715025352-HomeCate.js
│   ├── 20190715025506-HomeProj.js
│   ├── 20190715025554-HomeReason.js
│   ├── 20190715031659-HomeStatus.js
│   ├── 20190715033239-HomeSubCat.js
│   ├── 20190715033652-HomeUser.js
│   ├── 20190716025506-HomeProj.js
│   ├── 20190720090723-HomeSubCat.js
│   ├── 20190720095733-HomeCase.js
│   └── 20190723061059-HomeImages.js
└── server.js
```
