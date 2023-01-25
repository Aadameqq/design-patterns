const fs = require('fs')


fs.mkdir(`./patterns/${process.env.PNAME}`,function(err,file){
    if (err) throw err;
    fs.createWriteStream(`./patterns/${process.env.PNAME}/main.ts`)
})


