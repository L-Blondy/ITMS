require('dotenv').config();
require('./polyfills/String.isOneOf.js');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const chalk = require('chalk');
const adminUserRoutes = require('../routes/administration/adminUserRoutes.js');
const adminCategoriesRoutes = require('../routes/administration/adminCategoriesRoutes.js');
const dashboardRoutes = require('./routes/dashboardRoutes.js');
const reportRoutes = require('./routes/reportRoutes.js');
const ticketRoutes = require('./routes/ticketRoutes.js');
const authRoutes = require('./routes/authRoutes.js');

const app = express();

app
	.use(cors())
	.use(express.json())
	.use(express.urlencoded({ extended: true }))
	.use(authRoutes)
	.use('/it/dashboard', dashboardRoutes)
	.use('/it/report', reportRoutes)
	.use('/it/ticket', ticketRoutes)
	.use('/it/administration/user', adminUserRoutes)
	.use('/it/administration/categories', adminCategoriesRoutes);

mongoose
	.set('useNewUrlParser', true)
	.set('useUnifiedTopology', true)
	.set('useFindAndModify', false)
	.set('useCreateIndex', true)
	.connect(process.env.DB_URL)
	.then(() => console.log(chalk.bold.blue('# MongoDB Connected !')))
	.catch(err => console.log(err));

app.listen(3000, () => console.log('http://localhost:3000')); 