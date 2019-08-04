exports.calculate = litters => {
    const sizes = Array.apply(null, {length: 10+1}).map(Number.call, Number);
    
    const sizesCounts = sizes.map(size => {
        return {
            size,
            count: litters.filter(l => l.data.totalCount === size).length
        }
    })

    return sizesCounts;
}

exports.formatCsv = sizesCounts => {
    const lines = [];
    lines.push('NUMBER OF PUPPIES,LITTERS');
    sizesCounts.forEach(s => {
        lines.push(`${s.size},${s.count}`);
    });
    return lines;
}