
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

# Edit database infomation .env
vi .env

# Install all dependencies
npm install

# MySQL create DB with unicode
CREATE DATABASE `homecare_dev_alpha` DEFAULT CHARACTER SET = `utf8`;

# Sequelize Migration
npm install -g sequelize-cli
sequelize db:migrate
sequelize db:seed:all

# Run on port 5000
nodemon
```

## For Expo
```
cd mobile

# Install all dependencies
npm install

# Run Expo
expo start
```


## Environment variables

Name | Value
------------ | -------------
PORT|5000
LOG_LEVEL|info
DEBUG|*
SQL_HOST|127.0.0.1
SQL_PORT|3306
SQL_DB|homecare_dev_alpha
SQL_USER|user
SQL_PASS|password
SQL_DIALECT|mysql
SQL_POOL_LIMIT|100
EXPIRE_TOKEN_VERIFY|24h
EXPIRE_TOKEN_LOGIN|24h
USER_DEFAULT_VISIBLE|1
SECRET_KEY|Thi$i$a$ec5#t
LENGTH_MAX_USER_SIGNUP|20
LENGTH_MIN_USER_SIGNUP|3
LENGTH_MAX_PWD_SIGNUP|25
LENGTH_MIN_PWD_SIGNUP|3
UPLOAD_LOCATION|uploads
UPLOAD_FILESIZE|2
UPLOAD_MAX_COUNT|20
UPLOAD_FILE_EXTENSION|png,jpg,jpeg
MOCK_DATA_GENERATE|5
MOCK_DATA_GENERATE_CASE|10
MOCK_DATA_GENERATE_IMAGE|3
MOCK_DATA_GENERATE_PHONE|5
MOCK_DATA_GENERATE_DEFECT|2
MOCK_DATA_GENERATE_USER|1

## Structure

```

.
├── README.md
├── mobile
│   ├── App.js
│   ├── app.json
│   ├── assets
│   │   ├── addphoto.png
│   │   ├── icon.png
│   │   ├── login-background.png
│   │   ├── login-logo.png
│   │   ├── splash.png
│   │   ├── test.png
│   │   └── touch.png
│   ├── babel.config.js
│   ├── components
│   │   ├── AccessRequest.js
│   │   ├── CameraScreen.js
│   │   ├── CheckAssign.js
│   │   ├── CheckReview.js
│   │   ├── CheckSave.js
│   │   ├── CheckSummary.js
│   │   ├── Checking.js
│   │   ├── Credential.js
│   │   ├── Footer.js
│   │   ├── Home.js
│   │   ├── ImageBrowser.js
│   │   ├── ImageTile.js
│   │   ├── Isloading.js
│   │   ├── LayoutUtil.js
│   │   ├── LocalSQLite.js
│   │   ├── Login.js
│   │   ├── LogoutHandler.js
│   │   ├── MakeRequest.js
│   │   ├── Modal.js
│   │   ├── ReRow.js
│   │   ├── Root.js
│   │   ├── SemiFinal.js
│   │   ├── Signed.js
│   │   ├── SopImage.js
│   │   ├── SopImgUp.js
│   │   ├── SopStep.js
│   │   └── caseListItem.js
│   ├── config
│   │   └── Config.js
│   ├── fonts
│   │   ├── Kanit-Regular.ttf
│   │   ├── Roboto-Medium.ttf
│   │   └── SukhumvitSet-Bold.ttf
│   ├── package.json
│   └── utils
│       └── UnixThai.js
└── server
    ├── config
    │   ├── api.js
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
    │   ├── 20190720232754-create-home-case-number.js
    │   └── 20190817050707-create-home-reason-det.js
    ├── models
    │   ├── homecase.js
    │   ├── homecasedet.js
    │   ├── homecasenumber.js
    │   ├── homecate.js
    │   ├── homeimage.js
    │   ├── homeimgmaintag.js
    │   ├── homeimgsubtag.js
    │   ├── homelistdefect.js
    │   ├── homephone.js
    │   ├── homeproj.js
    │   ├── homereason.js
    │   ├── homereasondet.js
    │   ├── homestatus.js
    │   ├── homesubcat.js
    │   ├── homeuser.js
    │   └── index.js
    ├── package.json
    ├── routes
    │   ├── create
    │   │   ├── hmcase.js
    │   │   ├── hmcasedetail.js
    │   │   ├── hmcaseimage.js
    │   │   ├── maincat.js
    │   │   ├── project.js
    │   │   ├── reason.js
    │   │   ├── status.js
    │   │   └── subcat.js
    │   ├── middlewares
    │   │   └── logger.js
    │   └── sign
    │       ├── signin.js
    │       ├── signout.js
    │       └── signup.js
    ├── seeders
    │   ├── 20190710033652-HomeUser.js
    │   ├── 20190711025554-HomeReason.js
    │   ├── 20190711031659-HomeStatus.js
    │   ├── 20190714094713-HomeImgMainTag.js
    │   ├── 20190716025506-HomeProj.js
    │   ├── 20190720090723-HomeSubCat.js
    │   └── 20190720095733-HomeCase.js
    ├── server.js
    └── uploads
        └── a.jpg

16 directories, 102 files
```