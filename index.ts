import { readFile } from './src/file_reader';
import { saveToDisk } from './src/save_to_disk';
import { parseContents, formatCsv as formatParseDataToCsv } from './src/parse_data';
import { calculate, formatCsv as formatAvgPuppiesToCsv } from './src/calculate_avg_puppies';
import { calculate as calculateHistogram, formatCsv as formatHistogramToCsv } from './src/calculate_histogram_of_puppies';

const files = [
    'data/2018/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2017/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2016/KoiraNet-jalostustietojärjestelmä.htm'
];

const litters = files
    .map(file => parseContents(readFile(file)))
    .reduce((acc, val) => acc.concat(val));

const littersCsv = formatParseDataToCsv(litters);
saveToDisk('./results/litters.txt', littersCsv);

const avgPuppies = calculate(litters);
const avgPuppiesCsv = formatAvgPuppiesToCsv(avgPuppies);
saveToDisk('./results/avg_puppies.txt', avgPuppiesCsv);

const puppyHistogram = calculateHistogram(litters);
const puppyHistogramCsv = formatHistogramToCsv(puppyHistogram);
saveToDisk('./results/puppy_histogram.txt', puppyHistogramCsv);

