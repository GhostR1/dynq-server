const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = process.env.PORT || 3000
const app = express();

const establishmentR = require('./routes/establishment');
const adminR = require('./routes/admin');
const employeeR = require('./routes/employee');
const problemR = require('./routes/problem')
const clientR = require('./routes/client');
const appointmentR = require('./routes/appointment');

app.use(cors());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, PATCH, PUT, GET, POST');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/api/establishment', establishmentR);
app.use('/api/admin', adminR);
app.use('/api/employee', employeeR);
app.use('/api/problem', problemR);
app.use('/api/client', clientR);
app.use('/api/appointment', appointmentR);

app.use((reg, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});


async  function  start() {
    try{
        await  mongoose.connect("mongodb+srv://admin:"+
            process.env.MONGO_ATLAS_PW +
            "@dynqdb.urxp9.mongodb.net/DynQ", {
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