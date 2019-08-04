const { readFile } = require ('./file_reader');
const { saveToDisk } = require ('./save_to_disk');
const parseData = require('./parse_data');
const calculateAvgPuppies = require('./calculate_avg_puppies');
const calculateHistogram = require('./calculate_histogram_of_puppies');

const files = [
    'data/2018/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2017/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2016/KoiraNet-jalostustietojärjestelmä.htm'
];

const litters2018 = parseData.parseYear(readFile(files[0]));
const litters2017 = parseData.parseYear(readFile(files[1]));
const litters2016 = parseData.parseYear(readFile(files[2]));
const litters = [].concat(litters2018).concat(litters2017).concat(litters2016);


const littersCsv = parseData.formatCsv(litters);
saveToDisk('./results/litters.txt', littersCsv);

const avgPuppies = calculateAvgPuppies.calculate(litters);
const avgPuppiesCsv = calculateAvgPuppies.formatCsv(avgPuppies);
saveToDisk('./results/avg_puppies.txt', avgPuppiesCsv);

const puppyHistogram = calculateHistogram.calculate(litters);
const puppyHistogramCsv = calculateHistogram.formatCsv(puppyHistogram);
saveToDisk('./results/puppy_histogram.txt', puppyHistogramCsv);

