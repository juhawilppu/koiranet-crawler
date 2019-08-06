import { Litter } from './parse_data';

interface SizesCounts {
    size: number;
    count: number;
}

export const calculate = (litters : Litter[])  => {
    const sizes = Array.apply(null, {length: 10+1}).map(Number.call, Number);
    
    const sizesCounts = sizes.map((size : number) => {
        return {
            size,
            count: litters.filter(l => l.data.totalCount === size).length
        }
    })

    return sizesCounts as SizesCounts[];
}

export const formatCsv = (sizesCounts : SizesCounts[]) => {
    const lines = [];
    lines.push('NUMBER OF PUPPIES,LITTERS');
    sizesCounts.forEach(s => {
        lines.push(`${s.size},${s.count}`);
    });
    return lines;
}