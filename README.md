# Clone and install the required dependencies
```
git clone https://github.com/origin9kawin/homecare.git
cd homecare/server
npm install
```
Create MySQL database called `database_development`. Once the database has been created, migrate the sequelize models and seed data.
```
node_modules/.bin/sequelize db:migrate
node_modules/.bin/sequelize db:seed:all
```
# Running the app
`nodemon`


# keep tablename sam defaults to avoid headache except for 
`HomeUser` which is 
`freezeTablename: true`
