const assert = require('assert');
const nassert = require('n-assert');

describe('ParseData (unit tests)', function () {

    it('should parse dog amounts', function () {
        const parseData = require('../parse_data');
        nassert.assert({urosCount: 1, narttuCount: 1, totalCount: 2}, parseData.count("1 uros, 1 narttu"));
        nassert.assert({urosCount: 2, narttuCount: 4, totalCount: 6}, parseData.count("2 urosta, 4 narttua"));
        nassert.assert({urosCount: 1, narttuCount: 0, totalCount: 1}, parseData.count("1 uros"));
        nassert.assert({urosCount: 2, narttuCount: 0, totalCount: 2}, parseData.count("2 urosta"));
        nassert.assert({urosCount: 0, narttuCount: 1, totalCount: 1}, parseData.count("1 narttu"));
        nassert.assert({urosCount: 0, narttuCount: 3, totalCount: 3}, parseData.count("3 narttua"));
    });

    it('should map dog colors', function () {
        const parseData = require('../parse_data');
        assert.equal("black and white", parseData.mapDogColor("musta-valkoinen"));
        assert.equal("black and white", parseData.mapDogColor("mustavalkoinen"));
        assert.equal("blue merle", parseData.mapDogColor("blue merle"));
        assert.equal("sable", parseData.mapDogColor("soopeli"));
        assert.equal("sable", parseData.mapDogColor("soopeli-valkoinen"));
        assert.equal("sable", parseData.mapDogColor("soopeli valkoisin merkein"));
    });

    it('should parse date', function () {
        const parseData = require('../parse_data');
        assert.equal("10.12.2018", parseData.parseDate("synt. 10.12.2018"));
    });

});

describe('ParseData (read from a file tests)', function () {
    it('should parse all litters', function () {
        const { readFile } = require ('../file_reader');
        const parseData = require('../parse_data');
        const litters = parseData.parseContents(readFile('./test/test_data/test_data.htm'));

        assert.equal(litters.length, 259);
    });

    it('should contain correct litter information', function () {
        const { readFile } = require ('../file_reader');
        const parseData = require('../parse_data');
        const litters = parseData.parseContents(readFile('./test/test_data/test_data.htm'));
        const litter = litters[0];

        assert.equal(litter.data.kennel, "NEW SPICES");
        assert.equal(litter.data.date, "24.11.2016");
        assert.equal(litter.colors[0], "blue merle");
        assert.equal(litter.colors[1], "tricolour");
        assert.equal(litter.data.urosCount, 2);
        assert.equal(litter.data.narttuCount, 2);
        assert.equal(litter.data.totalCount, 4);
    });
})