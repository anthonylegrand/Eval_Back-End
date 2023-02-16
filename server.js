const express = require("express");
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

require('./app/database/index.model')

// routes
require('./app/routes/account.routes')(app)
require('./app/routes/perssonage.routes')(app)

app.listen(8080, () => {
    console.log(`Server is running on port ${8080}.`);
});