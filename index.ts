const { readFile } = require ('./file_reader');
const { saveToDisk } = require ('./save_to_disk');
const { parseYear, formatLitterCsv } = require('./parse_data');
const { calculateAvgPuppies, formatAvgPuppiesCsv } = require('./calculate_avg_puppies');
const { calculateHistogram, formatHistogramCsv } = require('./calculate_histogram_of_puppies');

const files = [
    'data/2018/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2017/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2016/KoiraNet-jalostustietojärjestelmä.htm'
];

const litters2018 = parseYear(2018, readFile(files[0]));
const litters2017 = parseYear(2017, readFile(files[1]));
const litters2016 = parseYear(2016, readFile(files[2]));
const litters = [].concat(litters2018).concat(litters2017).concat(litters2016);


const littersCsv = formatLitterCsv(litters);
saveToDisk('./results/litters.txt', littersCsv);

const avgPuppies = calculateAvgPuppies(litters);
const avgPuppiesCsv = formatAvgPuppiesCsv(avgPuppies);
saveToDisk('./results/avg_puppies.txt', avgPuppiesCsv);

const puppyHistogram = calculateHistogram(litters);
const puppyHistogramCsv = formatHistogramCsv(puppyHistogram);
saveToDisk('./results/puppy_histogram.txt', puppyHistogramCsv);

