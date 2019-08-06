const fs = require('fs');

export const saveToDisk = (filepath : string, lines : string[]) => {
    const stream = fs.createWriteStream(filepath);
    stream.once('open', function(fd : any) {
        lines.forEach(line => {
            stream.write(line + "\n");            
        });
        stream.end();
    });
    console.log('Saved file ' + filepath);
}