const express = require('express')
const mongoose = require('mongoose')

const PORT = process.env.PORT || 3000

const app = express()

async  function  start() {
    try{
        await  mongoose.connect('mongodb+srv://admin:admin@dynqdb.urxp9.mongodb.net/dynqdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        app.listen(PORT, () => {
            console.log('Server has been started...')
        })
    } catch (e) {
        console.log(e)
    }
}

start()