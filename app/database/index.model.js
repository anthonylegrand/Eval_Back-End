require('dotenv').config()
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_HOST)
.then(() => console.log('MongoDB connected!'));

require('./models/perssonage.model')
require('./models/admin_account.model')


require('./test_data')