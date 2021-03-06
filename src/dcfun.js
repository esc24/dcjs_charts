import crossfilter from 'crossfilter';

var data = [
    { date: '2011-11-14T16:17:54Z', quantity: 2, total: 190, tip: 100, type: 'tab' },
    { date: '2011-11-14T16:20:19Z', quantity: 2, total: 190, tip: 100, type: 'tab' },
    { date: '2011-11-14T16:28:54Z', quantity: 1, total: 300, tip: 200, type: 'visa' },
    { date: '2011-11-14T16:30:43Z', quantity: 2, total: 90, tip: 0, type: 'tab' },
    { date: '2011-11-14T16:48:46Z', quantity: 2, total: 90, tip: 0, type: 'tab' },
    { date: '2011-11-14T16:53:41Z', quantity: 2, total: 90, tip: 0, type: 'tab' },
    { date: '2011-11-14T16:54:06Z', quantity: 1, total: 100, tip: 0, type: 'cash' },
    { date: '2011-11-14T16:58:03Z', quantity: 2, total: 90, tip: 0, type: 'tab' },
    { date: '2011-11-14T17:07:21Z', quantity: 2, total: 90, tip: 0, type: 'tab' },
    { date: '2011-11-14T17:22:59Z', quantity: 2, total: 90, tip: 0, type: 'tab' },
    { date: '2011-11-14T17:25:45Z', quantity: 2, total: 200, tip: 0, type: 'cash' },
    { date: '2011-11-14T17:29:52Z', quantity: 1, total: 200, tip: 100, type: 'visa' }
];

export function printFilter (f) {
    if (typeof (f.length) !== 'undefined') { } else { }
    if (typeof (f.top) !== 'undefined') { f = f.top(Infinity); } else { }
    if (typeof (f.dimension) !== 'undefined') { f = f.dimension(function (d) { return ''; }).top(Infinity); } else { }
    console.log('filter' + '(' + f.length + ') = ' + JSON.stringify(f).replace('[', '[\n\t').replace(/}\,/g, '},\n\t').replace(']', '\n]'));
}

function calcTotal () {
    var ndx = crossfilter(data);
    var totalDim = ndx.dimension(d => d.total);
    var typeDim = ndx.dimension(d => d.type);

    // Print full data set.
    printFilter(ndx);

    // Apply one or more cumulative filters.
    totalDim.filter([0, 100]);
    typeDim.filter('tab');
    printFilter(ndx);

    // Calculate total via reduce on groupAll.
    var total = ndx.groupAll().reduceSum(d => d.total).value();
    console.log(`Filtered total (tab < 100) = ${total}`);

    // Clear filters and apply a new one
    typeDim.filterAll();
    totalDim.filterAll();
    printFilter(ndx);
    typeDim.filter(d => { if (d === 'cash' || d === 'visa') { return d } });
    printFilter(ndx);
    total = ndx.groupAll().reduceSum(d => d.total).value();
    console.log(`Filtered total (cash and visa) = ${total}`);
}

export default calcTotal;
