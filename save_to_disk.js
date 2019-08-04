const fs = require('fs');

module.exports = {};
module.exports.saveToDisk = (filepath, lines) => {
    const stream = fs.createWriteStream(filepath);
    stream.once('open', function(fd) {
        lines.forEach(line => {
            stream.write(line + "\n");            
        });
        stream.end();
    });
    console.log('Saved file ' + filepath);
}

return module.exports;