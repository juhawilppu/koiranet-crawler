const fileReader = require ('./file_reader');
const { saveToDisk } = require ('./save_to_disk');
const parseData = require('./parse_data');
const calculateAvgPuppies = require('./calculate_avg_puppies');
const calculateHistogramPuppies = require('./calculate_histogram_of_puppies');

const files = [
    'data/2018/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2017/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2016/KoiraNet-jalostustietojärjestelmä.htm'
];

const litters2018 = parseData.parseYear(2018, fileReader.read(files[0]));
const litters2017 = parseData.parseYear(2017, fileReader.read(files[1]));
const litters2016 = parseData.parseYear(2016, fileReader.read(files[2]));
const litters = [].concat(litters2018).concat(litters2017).concat(litters2016);

const littersCsv = parseData.formatCsv(litters);
saveToDisk('./results/litters.txt', littersCsv);

const avgPuppies = calculateAvgPuppies.calculate(litters);
const avgPuppiesCsv = calculateAvgPuppies.formatToCsv(avgPuppies);
saveToDisk('./results/avg_puppies.txt', avgPuppiesCsv);

const puppyHistogram = calculateHistogramPuppies.calculate(litters);
const puppyHistogramCsv = calculateHistogramPuppies.formatToCsv(puppyHistogram);
saveToDisk('./results/puppy_histogram.txt', puppyHistogramCsv);

