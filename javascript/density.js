
var margin = {top: 30, right: 30, bottom: 30, left: 50},
    width = 800 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#arc_div")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var xScale = d3.scaleLinear();
var yScale = d3.scaleLinear();

// get the data
function load_density(data) {

    sorted_data = _.sortBy(_.pluck(data, 'total_applications'));
    // Compute kernel density estimation

    var_max_appl = 1.2*_.max(sorted_data);

    // add the x Axis
    // var x = d3.scaleLinear()
    xScale
        .domain([0, var_max_appl])
        .range([0, width]);

    // Compute kernel density estimation
    var kde = kernelDensityEstimator(kernelEpanechnikov(12), xScale.ticks(40));
    var density =  kde( data.map(function(d){  return d.total_applications; }) );

    density[0][1] = 0;

    new_y_max = 1.2*_.max(_.pluck(density,1));

    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    svg.append("text")
        .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top) + ")")
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .style("text-anchor", "middle")
        .text("Applications");

    // add the y Axis
    // var y = d3.scaleLinear()
    yScale
        .range([height, 0])
        .domain([0, new_y_max]);

    svg.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(yScale));

    // Plot the area
    svg
        .append('g')
        .append("path")
        .attr("class", "mypath")
        .datum(density)
        .attr("fill", "#335075")
        .attr("opacity", ".8")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d[0]); })
            .y(function(d) { return yScale(d[1]); })
        );

}


// Function to compute density
function kernelDensityEstimator(kernel, X) {
    // debugger;
    return function(V) {
        // debugger;
        return X.map(function(x) {
            // debugger
            return [x, d3.mean(V, function(v) { return kernel(x - v); })];
        });
    };
}

function kernelEpanechnikov(k) {
    // debugger;
    return function(v) {
        // debugger;
        return Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };
}

function updateChart(new_data) {

        // recompute density estimation
    var new_x_max = 1.2*_.max(_.pluck(new_data, 'total_applications'));

    if (new_data.length < 10) {
        new_x_max = _.max(_.pluck(new_data, 'total_applications'))*3
    }

    if (new_data.length < 2) {
        new_x_max = 0
    }


    xScale
        .domain([0, new_x_max]);

    svg.select(".xaxis")
        .transition()
        .call(d3.axisBottom(xScale));


    kde = kernelDensityEstimator(kernelEpanechnikov(12), xScale.ticks(40));
    var density =  kde( new_data.map(function(d){  return d.total_applications; }) );
    density[0][1] = 0;
    density[density.length-1][1] = 0


    //need to calculate max Y and max X

    new_y_max = 1.2*_.max(_.pluck(density,1));

    yScale
        .domain([0, new_y_max]);

    svg.select(".yaxis")
        .transition()
        .call(d3.axisLeft(yScale));

    // update the chart
    svg.select(".mypath")
        .datum(density)
        .transition()
        .duration(1000)
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d[0]); })
            .y(function(d) { return yScale(d[1]); })
        );
}
