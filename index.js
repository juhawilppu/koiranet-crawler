const fs = require('fs');
const { parseYear } = require('./parse_data');
const { calculateAvgPuppies } = require('./calculate_avg_puppies');

const files = [
    'data/2018/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2017/KoiraNet-jalostustietojärjestelmä.htm',
    'data/2016/KoiraNet-jalostustietojärjestelmä.htm'
];

const contents = fs.readFileSync(files[2], 'utf8');
const litters = parseYear(contents);

calculateAvgPuppies(litters);