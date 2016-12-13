'use strict';

const program = require('commander');

let pass = 'Ddba9151';

let response = (pass_info, options) => {
  if(options.change){
    console.log(pass_info);
    if(pass_info.match(/^.*\|.+$/)){
      let old_new = pass_info.split('|');
      if(old_new[0] === pass){
        pass = old_new[1]
        console.log('passwor changed', pass);
      }
      else{
        console.log('wrong passwor', old_new[1]);
      }
    }
    else{
      console.log("Wrong options input, use password --help for instructions");
    }
  }
  else if(pass.length)
    console.log("Admin pass already set");
  else
    console.log("Please set the admin password. (you can use password --help)");
}

program
.version('0.0.1')
.command('password [pass_info]')
.description('Admin password administration')
.option('-c, --change','Changes the admin password. Usage: password --change "old pass|new pass"')
.action(response);

program.parse(process.argv);
