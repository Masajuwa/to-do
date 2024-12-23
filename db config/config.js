const mongoose = require("mongoose")
require("dotenv").config()

const MONGODB_URL = process.env.MONGODB_URL

function connectToDb () {
    mongoose.connect(MONGODB_URL)

    mongoose.connection.on('connected', () => {
        console.log("Connected to database successfully")
    })

    mongoose.connection.on('error', (err) => {
        console.log({ message : "error"})
    })
}

module.exports = { connectToDb }