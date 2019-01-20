module.exports = {};

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

module.exports.calculateAvgPuppies = litters => {
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
}

return module.exports;