import { Litter } from './parse_data';

interface AvgPuppies {
    colors: string[];
    litters: number;
    totalPuppies: number;
    avgPuppies: number;
}

export const calculate = (litters : Litter[]) => {
    // Find unique color-combinations from the data
    const colorCombinations = litters
        .map(litter => litter.colors)
        .filter(onlyUniqueColors);

    // Merge data for the color-combinations between multiple litters
    const counts = colorCombinations
    .filter(combination => !combination.includes(null))
    .map(combination => {
        const matchingLitters = litters
            .filter(litter => isSameColorCombination(litter.colors, combination));

        return {
            colors: combination,
            avgPuppies: matchingLitters
                .map(m => m.data.totalCount)
                .reduce((count, total) => total + count, 0) / matchingLitters.length || null,
            totalPuppies: matchingLitters.map(m => m.data.totalCount)
                .reduce((count, total) => total + count, 0) || 0,
            litters: matchingLitters.length
        };

    });

    const sortedAndFiltered = counts.sort((a, b) => b.avgPuppies - a.avgPuppies);
    return sortedAndFiltered;
}

export const formatCsv = (sortedAndFiltered : AvgPuppies[]) => {
    const lines = [];
    lines.push('COLOR COMBINATION,NUM. OF LITTERS,TOTAL PUPPIES,AVG. PUPPIES PER LITTER');
    sortedAndFiltered.forEach(s => {
        lines.push(`${s.colors[0]} & ${s.colors[1]},${s.litters},${s.totalPuppies},${s.avgPuppies.toFixed(2)}`);
    });
    return lines;
}

/**
 * The color-combination list contains duplicates. We need to filter duplicates away.
 * 
 * Only keep the first instances of every color-combination.
 */
const onlyUniqueColors = (currentColorObjected : string[], currentIndex : number, list : string[][]) => {
    const firstInstanceOfColorCombination = list.find(colors => isSameColorCombination(colors, currentColorObjected));
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
 * Note: Colors are sorted alphabetically. It is not possible to have:
 * colors1 = ['bluemerle', 'tricolour']
 * colors2 = ['tricolour', 'bluemerle']
 */
const isSameColorCombination = (colors1 : string[], colors2 : string[]) => {
    return colors1[0] === colors2[0] &&

        colors1[1] === colors2[1]
}