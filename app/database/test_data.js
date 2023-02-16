const mongoose = require('mongoose');

// Create default user
mongoose.model('admin_account').findOne({username: 'bipbip'}, (err, doc) => {
    if(!doc){
        const AdminModel = mongoose.model('admin_account')
        let defaultAdmin = new AdminModel()
        defaultAdmin.username = 'bipbip'
        defaultAdmin.password = 'bipbip'
        defaultAdmin.save()
    }
})