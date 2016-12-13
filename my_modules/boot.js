"use strict"
////////////////////////////////////////////////////////////////////////////////
//  Dependencies  //////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
const Users = require('./users.js');
const User = require('./users.js').User;
const security = require('./security.js');
const cli = require('commander');

const admin_actions = (pass_info, options) => {
  if(options.create && pass_info.length){
    new User({
      userName: 'admin',
      password: pass_info,
      role: 'admin'
    }).save()
    .then((WriteResult) => {
      if(WriteResult.insertedCount > 0)
        console.log('Administrator account correctly set')
      else
        console.log('Something went wrong, please try again')
    })
    .catch(err => console.log(err))
  }
  if(options.change  && pass_info.match(/^.*\|.+$/)){
    console.log('Sorry, this functionallity is not implemented yet');
  }
}

cli
  .version('0.1.0')
  .command('admin [pass_info]')
  .description('Admin password administration')
  .option('-c, --create','Creates the administrator account if it doesn\'t exist. Usage: password --change < "password" >')
  .option('-c, --change','Changes the admin password. Usage: password --change < "old pass|new pass" >')
  .action(admin_actions);

cli.parse(process.argv);

const checkAdmin = (cb) => {

  Users.findByName('admin')
  .then((user) => {
    if(!user)
      console.log('Administrator account must be created, please use: admin --create < "password" >');
    else
      cb();
  })
  .catch((err) => {
    console.log(err);
  })

}

module.exports = {
  checkAdmin: checkAdmin
}
