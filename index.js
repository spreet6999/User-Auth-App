const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

//Importing Routes
const authRoute = require('./routes/auth');
const dashboardRoute = require('./routes/privateRoutes/dashboard');

//Connect to DB
mongoose.connect(process.env.DB_CONNECT,
    { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('Connected to the DB...'))
    .catch(err => console.log(`DB Connection Error: ${err.message}`));


//Middlewares
app.use(express.json());

//Route Middlewares
app.use('/api/user', authRoute);
app.use('/api/dashboard', dashboardRoute);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));