import crossfilter from 'crossfilter';
import * as d3 from 'd3';
import dc from 'dc';
import 'dc/dc.css';

import { printFilter } from './dcfun';

var data = [
    { date: '12/27/2012', http_404: 2, http_200: 190, http_302: 100 },
    { date: '12/28/2012', http_404: 2, http_200: 10, http_302: 100 },
    { date: '12/29/2012', http_404: 1, http_200: 300, http_302: 200 },
    { date: '12/30/2012', http_404: 2, http_200: 90, http_302: 0 },
    { date: '12/31/2012', http_404: 2, http_200: 90, http_302: 0 },
    { date: '01/01/2013', http_404: 2, http_200: 90, http_302: 0 },
    { date: '01/02/2013', http_404: 1, http_200: 10, http_302: 1 },
    { date: '01/03/2013', http_404: 2, http_200: 90, http_302: 0 },
    { date: '01/04/2013', http_404: 2, http_200: 90, http_302: 0 },
    { date: '01/05/2013', http_404: 2, http_200: 90, http_302: 0 },
    { date: '01/06/2013', http_404: 2, http_200: 200, http_302: 1 },
    { date: '01/07/2013', http_404: 1, http_200: 200, http_302: 100 }
];

function plot () {
    var ndx = crossfilter(data);
    var parseDate = d3.timeParse('%m/%d/%Y');

    data.forEach(d => {
        d.date = parseDate(d.date);
        d.total = d.http_404 + d.http_200 + d.http_302;
        d.year = d.date.getFullYear();
    });
    printFilter(data);

    var dateDim = ndx.dimension(d => d.date);
    var minDate = dateDim.bottom(1)[0].date;
    var maxDate = dateDim.top(1)[0].date;
    var status200 = dateDim.group().reduceSum(d => d.http_200);
    var status302 = dateDim.group().reduceSum(d => d.http_302);
    var status404 = dateDim.group().reduceSum(d => d.http_404);

    var lineChart = dc.lineChart('#chart-line-hitsperday');
    lineChart
        .width(500).height(200)
        .dimension(dateDim)
        .group(status200, '200')
        .stack(status302, '302')
        .stack(status404, '404')
        .renderArea(true)
        .x(d3.scaleTime().domain([minDate, maxDate]))
        .legend(dc.legend().x(50).y(10).itemHeight(13).gap(5))
        .brushOn(false)
        .yAxisLabel('Hits per day');

    var yearDim = ndx.dimension(d => d.year);
    var yearTotal = yearDim.group().reduceSum(d => d.total);
    var yearRingChart = dc.pieChart('#chart-ring-year');
    yearRingChart
        .width(150).height(150)
        .dimension(yearDim)
        .group(yearTotal)
        .innerRadius(30);

    dc.renderAll();
}

export default plot;
