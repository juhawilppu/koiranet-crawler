const fs = require('fs');
const { parseYear } = require('./parse_data');
const { calculateAvgPuppies } = require('./calculate_avg_puppies');
const { calculateHistogramPuppies } = require('./calculate_histogram_of_puppies');

const files = [
    'data/2018/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2017/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2016/KoiraNet-jalostustietojärjestelmä.htm'
];

const litters2018 = parseYear(2018, fs.readFileSync(files[0], 'utf8'));
const litters2017 = parseYear(2017, fs.readFileSync(files[1], 'utf8'));
const litters2016 = parseYear(2016, fs.readFileSync(files[2], 'utf8'));

const litters = [].concat(litters2018).concat(litters2017).concat(litters2016);

console.log(calculateAvgPuppies(litters));
//calculateHistogramPuppies(litters);