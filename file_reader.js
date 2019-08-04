const fs = require('fs');

module.exports = {};
module.exports.read = filepath => {
    return fs.readFileSync(filepath, 'utf8');
}

return module.exports;
