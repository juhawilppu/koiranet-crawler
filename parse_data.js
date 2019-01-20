const cheerio = require('cheerio');

module.exports = {};

module.exports.parseYear = (contents) => {
    const $ = cheerio.load(contents);
    const tbody = $('#Table tbody');

    const litters = [];

    tbody.children().each((index, tr) => {
        const ROWS_PER_LITTER = 4;

        // The html doesn't have a specific parent for each litter.
        //
        // Example:
        // <tbody>
        // <tr>...</tr> <- litter 0
        // <tr>...</tr> <- litter 0
        // <tr>...</tr> <- litter 0
        // <tr>...</tr> <- litter 1
        // etc.
        const litterIndex = Math.ceil(((index+1) / ROWS_PER_LITTER) - 1);
        const litterRowIndex = index % ROWS_PER_LITTER;

        // If new litter, create empty object
        if (!litters[litterIndex]) {
            litters[litterIndex] = {
                data: null,
                colors: []
            }
        }

        if (litterRowIndex === 0) {
            litters[litterIndex].data = parseLitterData(tr);
        } else if (litterRowIndex === 1) {
            // Header, do nothing
        } else if (litterRowIndex === 2) {
            litters[litterIndex].colors.push(parseDogColor(tr));
        } else if (litterRowIndex === 3) {
            litters[litterIndex].colors.push(parseDogColor(tr));

            // Sort the colors alphabetically.
            // This makes comparison of colors easier.
            litters[litterIndex].colors.sort();
        }
    });

    return litters;
}

/**
 * Parse KoiraNet HTML for litter basic data
 */
const parseLitterData = tr => {
    const $ = cheerio;

    const countTxt = $(tr.children[3]).text().split('::')[0].trim().split(',');
    const urosCount = parseInt(countTxt[0].replace(' urosta'), 10);
    const narttuCount = parseInt(countTxt[0].replace(' narttua'), 10);

    return {
        name: $(tr.children[2]).text(),
        urosCount,
        narttuCount,
        totalCount: urosCount + narttuCount
    }
}

/**
 * Parse KoiraNet HTML for a dog information
 */
const parseDogColor = tr => {
    const $ = cheerio;
    return $(tr.children[5]).text()
}

return module.exports;