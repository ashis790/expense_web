const {DataTypes } = require('sequelize')
const sequelize = require('../config')
const User = require('./user')
const Order = sequelize.define('Order',{
    id:{
        type:DataTypes.INTEGER,
        allowNull:false,
        autoIncrement:true,
        primaryKey:true
    },
    UserId:{
        type:DataTypes.INTEGER,
        allowNull:false,
        references:{
            model:User,
            key:'id'
        },
         onDelete: 'CASCADE',
    },
    orderId:{
        type:DataTypes.STRING,
        allowNull:false,
        unique:true
     },
     status:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue: 'PENDING'
     },
     paymentSessionId:{
        type: DataTypes.STRING,
        allowNull: true,
     }
})
module.exports = Order