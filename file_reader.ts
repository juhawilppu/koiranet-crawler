const fs = require('fs');

export const readFile = (filepath) => {
    return fs.readFileSync(filepath, 'utf8');
}
