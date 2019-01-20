const cheerio = require('cheerio')
const fs = require('fs');

const files = [
    'data/2018/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2017/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2016/KoiraNet-jalostustietojärjestelmä.htm'
];

const parseYear = (file) => {

    fs.readFile(file, 'utf8', function(err, contents) {
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

        // Find unique color-combinations from the data
        const colorCombinations = litters
            .map(litter => litter.colors)
            .filter(onlyUniqueColors);

        // Merge data for the color-combinations between multiple litters
        const counts = colorCombinations.map(combination => {
            const matchingLitters = litters
                .filter(litter => isSameColorCombination(litter.colors, combination));

            return {
                colors: combination,
                avgPuppies: matchingLitters
                    .map(m => m.data.totalCount)
                    .reduce((count, total) => total + count, 0) / matchingLitters.length,
                litters: matchingLitters.length
            };

        });

        const sortedAndFiltered = counts.sort((a, b) => b.avgPuppies - a.avgPuppies);

        console.log('COLOR1,COLOR2,NUM. OF LITTERS,AVG. PUPPIES PER LITTER');
        sortedAndFiltered.map(s => {
            console.log(s.colors[0] + "," + s.colors[1] + "," + s.litters + "," + s.avgPuppies.toFixed(2))
        });

    });
}

/**
 * Parse KoiraNet HTML
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
 * Parse KoiraNet HTML
 */
const parseDogColor = tr => {
    const $ = cheerio;
    return $(tr.children[5]).text()
}

/**
 * The color-combination list contains duplicates. We need to filter duplicates away.
 * 
 * Only keep the first instances of every color-combination.
 */
const onlyUniqueColors = (currentColorObjected, currentIndex, list) => {    
    const firstInstanceOfColorCombination = list
        .find(colors => isSameColorCombination(colors, currentColorObjected));
    return list.indexOf(firstInstanceOfColorCombination) === currentIndex;
}

/**
 * Checks if colors1 and colors2 are the same color-combination.
 * 
 * For example:
 * colors1 = ['bluemerle', 'tricolour']
 * colors2 = ['sable', 'tricolour']
 * -> Not the same
 * 
 * Note: Colors are sorted alphabetically. It is NOT possible to have:
 * colors1 = ['bluemerle', 'tricolour']
 * colors2 = ['tricolour', 'bluemerle']
 */
const isSameColorCombination = (colors1, colors2) => {
    return colors1[0] === colors2[0] &&
        colors2[1] === colors2[1]
}

parseYear(files[2]);