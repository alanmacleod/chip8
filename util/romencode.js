

// for offline processing of ROMs into json with nodejs


var fs = require('fs');

var rom_data = fs.readFileSync('../rom/PONG',{encoding:'base64'});

var json = {
  title: 'PONG',
  binary: rom_data
};

fs.writeFileSync("../rom/json/pong.json", JSON.stringify(json));

console.log("wrote file");
