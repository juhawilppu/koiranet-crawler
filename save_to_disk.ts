const fs = require('fs');

export const saveToDisk = (filepath, lines) => {
    const stream = fs.createWriteStream(filepath);
    stream.once('open', function(fd) {
        lines.forEach(line => {
            stream.write(line + "\n");            
        });
        stream.end();
    });
    console.log('Saved file ' + filepath);
}