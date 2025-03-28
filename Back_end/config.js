require('dotenv').config()
const {Sequelize } = require('sequelize')
console.log('DB_USER:', process.env.DB_USER); // Should print 'root'
console.log('DB_PASSWORD:', process.env.DB_PASSWORD); // Should print '@Ambika7914'
console.log('DB_HOST:', process.env.DB_HOST);
const sequelize = new Sequelize(
    'expensetracker',
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'mysql'
    }
)
sequelize.query('CREATE DATABASE IF NOT EXISTS expensetracker')
.then(()=>{
    console.log('databas created or allready exist')
})
.catch((err)=>{
    console.log(`error ${err} while reating data base`)
})

sequelize.authenticate()
    .then(()=>{
        console.log('data base connected sucessfully')

    })
    .catch((err)=>{
        console.log(`${err} error while connecting to datbase`)
    })

module.exports = sequelize