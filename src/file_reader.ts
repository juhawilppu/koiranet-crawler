const fs = require('fs');

export const readFile = (filepath : string) => {
    return fs.readFileSync(filepath, 'utf8');
}
