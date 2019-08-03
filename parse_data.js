const cheerio = require('cheerio');

module.exports = {};

module.exports.parseYear = (year, contents) => {
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
                year,
                data: {
                    name: null,
                    urosCount: null,
                    narttuCount: null,
                    totalCount: null
                },
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

    // Example values of countTxt:
    // - "1 uros, 1 narttu"
    // - "2 urosta, 4 narttua"
    // - "1 uros"
    // - "2 urosta"
    // - "1 narttu"
    // - "7 narttua"
    const countTxt = $(tr.children[3]).text().split('::')[0].trim();
    const countSplitted = countTxt.split(',');

    let urosCount;
    let narttuCount;

    if (countSplitted.length === 1) {
        if (countSplitted[0].includes('uros')) {
            urosCount = parseInt(countSplitted[0].replace(' urosta').replace(' uros'), 10);
            narttuCount = 0;
        } else if (countSplitted[0].includes('nart')) {
            urosCount = 0;
            narttuCount = parseInt(countSplitted[0].replace(' narttua').replace(' narttu'), 10);
        } else {
            throw "Unable to parse: " + countTxt;
        }
    } else {
        urosCount = parseInt(countSplitted[0].replace(' urosta').replace(' uros'), 10);
        narttuCount = parseInt(countSplitted[1].replace(' narttua').replace(' narttu'), 10);
    }

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
    const rawColor = $(tr.children[5]).text();

    // Map and harmonize data
    switch (rawColor) {
        case "soopeli valkoisin merkein":
            return "soopeli";
        case "soopeli-valkoinen":
            return "soopeli";
        case "musta-valkoinen":
            return "mustavalkoinen";
        case "":
            return "(puuttuu)"
        default:
            return rawColor;
    }
}

return module.exports;