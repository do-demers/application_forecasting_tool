
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

var xScale = d3.scaleLinear()
var yScale = d3.scaleLinear()

// get the data
function load_density(data) {

    sorted_data = _.sortBy(_.pluck(data, 'total_applications'))
    // Compute kernel density estimation

    var q1 = sorted_data[Math.floor((data.length / 4))];
    // Likewise for q3.
    var q3 = sorted_data[Math.ceil((data.length * (3 / 4)))];
    var iqr = q3 - q1;
    var max =_.max(sorted_data);
    // var_max_appl = q3 + 10*iqr;
    var_max_appl = 1.2*max;

    // add the x Axis
    // var x = d3.scaleLinear()
    xScale
        .domain([0, var_max_appl])
        .range([0, width]);

    // Compute kernel density estimation
    var kde = kernelDensityEstimator(kernelEpanechnikov(12), xScale.ticks(40))
    var density =  kde( data.map(function(d){  return d.total_applications; }) )

    density[0][1] = 0

    svg.append("g")
        .attr("class", "xaxis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale));

    // add the y Axis
    // var y = d3.scaleLinear()
    yScale
        .range([height, 0])
        .domain([0, 0.02]);

    svg.append("g")
        .attr("class", "yaxis")
        .call(d3.axisLeft(yScale));


    // Plot the area
    var curve = svg
        .append('g')
        .append("path")
        .attr("class", "mypath")
        .datum(density)
        .attr("fill", "#69b3a2")
        .attr("opacity", ".8")
        .attr("stroke", "#000")
        .attr("stroke-width", 1)
        .attr("stroke-linejoin", "round")
        .attr("d",  d3.line()
            .curve(d3.curveBasis)
            .x(function(d) { return xScale(d[0]); })
            .y(function(d) { return yScale(d[1]); })
        );

};


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
    kde = kernelDensityEstimator(kernelEpanechnikov(3), xScale.ticks(40))
    var density =  kde( new_data.map(function(d){  return d.total_applications; }) )
    density[0][1] = 0

    //need to calculate max Y and max X
    new_x_max = 1.1*_.max(_.pluck(new_data, 'total_applications'))
    new_y_max = 1.1*_.max(_.pluck(density,1))

    yScale
        .domain([0, new_y_max]);

    svg.select(".yaxis")
        .transition()
        .call(d3.axisLeft(yScale));

    xScale
        .domain([0, new_x_max]);

    svg.select(".xaxis")
        .transition()
        .call(d3.axisBottom(xScale));

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