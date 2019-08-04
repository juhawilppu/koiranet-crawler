{

interface Litter {
    colors: string[];
    data : {
        kennel: string;
        date: Date;
        urosCount: number;
        narttuCount: number;
        totalCount: number;
    }
}

const cheerio = require('cheerio');
exports.parseYear = (contents : string) => {
    const $ = cheerio.load(contents);
    const tbody = $('#Table tbody');

    const litters : Litter[] = [];

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
            litters[litterIndex].colors.push(exports.parseDogColor(tr));
        } else if (litterRowIndex === 3) {
            litters[litterIndex].colors.push(
                exports.
                parseDogColor(tr));

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

    const date = exports.parseDate($(tr.children[1]).text());
    const kennel = $(tr.children[2]).text();

    const countTxt = $(tr.children[3]).text().split('::')[0].trim();

    const counts = exports.count(countTxt);

    return {
        kennel,
        date,
        urosCount: counts.urosCount,
        narttuCount: counts.narttuCount,
        totalCount: counts.totalCount
    }
}

exports.parseDate = date => {
    return date.replace('synt. ', '')
}

// Example values of countTxt:
// - "1 uros, 1 narttu"
// - "2 urosta, 4 narttua"
// - "1 uros"
// - "2 urosta"
// - "1 narttu"
// - "7 narttua"
exports.count = countTxt => {
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
        urosCount,
        narttuCount,
        totalCount: urosCount + narttuCount
    }
}

/**
 * Parse KoiraNet HTML for a dog information
 */
exports.parseDogColor = tr => {
    const $ = cheerio;
    const rawColor = $(tr.children[5]).text();
    return this.mapDogColor(rawColor);
}

exports.mapDogColor = rawColor => {
    // Harmonize data and translate to English.
    switch (rawColor) {
        case "soopeli":
            return "sable";
        case "soopeli valkoisin merkein":
            return "sable";
        case "soopeli-valkoinen":
            return "sable";
        case "mustavalkoinen":
            return "black and white";
        case "musta-valkoinen":
            return "black and white";
        case "tricolour":
            return "tricolour";
        case "blue merle":
            return "blue merle";
        case "":
            return null;
        default:
            throw "Unmapped color " + rawColor;
    }
}

exports.formatCsv = litters => {
    const lines = [];
    lines.push('NAME,COLOR_COMBINATION,DATE,MALE_PUPPIES,FEMALE_PUPPIES,TOTAL_PUPPIES');
    litters.forEach(litter => {
        lines.push(`${litter.data.kennel},${litter.colors[0]} & ${litter.colors[1]},${litter.data.date},${litter.data.urosCount},${litter.data.narttuCount},${litter.data.totalCount}`);
    });
    return lines;
}
}