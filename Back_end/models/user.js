const {DataTypes} = require('sequelize')
const sequelize = require('../config')
const User = sequelize.define('User',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
        },
    name:{
        type:DataTypes.STRING,
        allowNull:false
    },
    user_id:{
        type:DataTypes.STRING,
        allowNull:false,
        unique: true

    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
        unique: true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    ispremiummember:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
})
module.exports = User