module.exports = {};

module.exports.calculateHistogramPuppies = litters => {

    const sizes = Array.apply(null, {length: 15+1}).map(Number.call, Number);
    
    const sizesCounts = sizes.map(size => {
        return {
            size,
            count: litters.filter(l => l.data.totalCount === size).length
        }
    })

    console.log('NUMBER OF PUPPIES,LITTERS');
    sizesCounts.map(s => {
        console.log(`${s.size},${s.count}`);
    });
}

return module.exports;