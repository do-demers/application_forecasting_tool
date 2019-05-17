//Globals for ease of update
//pie math
var width = 800;
var height = 300;

var format = d3.format("d");

var pie = d3.pie()
    .startAngle(-0.66 * Math.PI)
    .endAngle(0.66 * Math.PI)
    .sort(null);

var paths = d3.arc()
    .innerRadius(100)
    .outerRadius(150)
    .cornerRadius(4);

var label = d3.arc()
    .innerRadius(180)
    .outerRadius(180);

var svg = d3.select("#arc_div")
    .append("svg")
    .attr("id", "arc_svg")
    .attr("width", width)
    .attr("height", height);

var g = svg
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height * 2 / 3 + ")");

//Make initial pie
function load_viz(pred_data) {

    //various vars
    var num_data = _.uniq(pred_data, 'predicted', "lower", "upper");

    var new_low = _.pluck(num_data, "lower")[0];
    var new_high = _.pluck(num_data, "upper")[0];

    if (new_high == undefined)
        new_high = 0;
    if (new_low == undefined)
        new_low = 0;

    var table_max = 0;
    var table_min = 0;

    //max could be very large
    if (new_high >= 100)
        table_max = format(new_high);
    else
        table_max = 100;

    var range = new_high - new_low;
    var lrange = new_low - table_min;
    var hrange = table_max - new_high;

    var data = [lrange, range, hrange];

    var arcData = pie(data);

    // Create a pie
    var arc = g
        .selectAll(".arc")
        .data(arcData)
        .enter()
        .append("g")
        .attr("class", "arc");

    arc.append('path')
        .attr('d', paths)
        .attr("fill", function (d) {
            if (d.index == 1) {
                return "#3c7397";
            }
            else {
                return "#b4d5e0";
            }
        })
        .each(function (d) {
            this._current = d;
        });

    arc.append("text")
        .attr("class", "pieText")
        .attr("transform", function (d) {
            if (d.index == 0) {
                return "translate(-100,75)";
            }
            else if (d.index == 1) {
                return "translate(" + label.centroid(d) + ")";
            }
            else {
                return "translate(100,75)";
            }
        })
        .attr("fill", "black")
        .text(function (d) {
            if (d.index == 0) {
                return table_min;
            }
            else if (d.index == 1) {
                return format(new_low) + " - " + format(new_high);
            }
            else {
                return table_max;
            }
        })
        .each(function (d) {
            this._current = d;
        });

    //Add number text
    doNums(pred_data, new_low, new_high);
}

function viz_change(pred_data) {

    //various vars
    var num_data = _.uniq(pred_data, 'predicted', "lower", "upper");

    var new_low = _.pluck(num_data, "lower")[0];
    var new_high = _.pluck(num_data, "upper")[0];

    if (new_high === undefined)
        new_high = 0;
    if (new_low === undefined)
        new_low = 0;

    var table_max = 0;
    var table_min = 0;

    if (new_high >= 100)
        table_max = format(new_high);
    else
        table_max = 100;

    var range = new_high - new_low;
    var lrange = new_low - table_min;
    var hrange = table_max - new_high;

    var data = [lrange, range, hrange];

    var arcData = pie(data);

    var arc = g
        .selectAll("path")
        .data(arcData);

    arc.transition()
        .duration(2000)
        .attrTween("d", arcTween);

    d3.selectAll(".pieText")
        .data(arcData)
        .transition()
        .duration(2000)
        .attrTween("d", arcTween)
        .attr("transform", function (d) {
            if (d.index == 0) {
                return "translate(-100,75)";
            }
            else if (d.index == 1) {
                return "translate(" + label.centroid(d) + ")";
            }
            else {
                return "translate(100,75)";
            }
        })
        .text(function (d) {
            if (d.index == 0) {
                return table_min;
            }
            else if (d.index == 1) {
                return format(new_low) + " - " + format(new_high);
            }
            else {
                return table_max;
            }
        });

    //Add number text
    doNums(pred_data, new_low, new_high);
}

function doNums(pred_data, new_low, new_high) {

    //Add estimate numbers
    var numbers = d3.select("#IC_div")
        .data(pred_data)
        .text("0 - 0");

    if (new_high === 0) {
        d3.select("#IC_div")
            .text(function () {
                if (document.documentElement.lang === "en") {
                    return "No data";
                }
                else {
                    return "Aucune données";
                }
            });
    }

    else {
        numbers.transition()
            .duration(2500)
            .tween("text", function (d) {
                var that = d3.select(this);

                if (document.documentElement.lang === "en") {
                    var temp = (that.node().innerHTML = "No data") ? [0, 0] : previous_num.match(/^\d+|\d+\b|\d+(?=\w)/g).map(function (v) {
                        return +v;
                    });
                } else {
                    var temp = (that.node().innerHTML = "Aucune données") ? [0, 0] : previous_num.match(/^\d+|\d+\b|\d+(?=\w)/g).map(function (v) {
                        return +v;
                    });
                }

                var i = d3.interpolateNumber(temp[0], new_low);
                var j = d3.interpolateNumber(temp[1], new_high);

                if (document.documentElement.lang === "en") {
                    var text_fct = function (t) {
                        that.html('<span id="font_intro">For the above characteristics, it is estimated that you will receive between</span>'
                            + '</br>'
                            + '<span id="nums">' + format(i(t)) + ' - ' + format(j(t)) + '</span>'
                            + '</br>'
                            + '<span id="font_appl">applications</span>'
                        ).style("align-self", "unset");
                    };
                } else {
                    var text_fct =  function (t) {
                        that.html('<span id="font_intro">Pour les caractéristiques ci-dessus, on estime que vous recevrez entre</span>'
                            + '</br>'
                            + '<span id="nums">' + format(i(t)) + ' - ' + format(j(t)) + '</span>'
                            + '</br>'
                            + '<span id="font_appl">candidatures</span>'
                        ).style("align-self", "unset");

                    };
                }
                return text_fct;
            });
    }

}
function arcTween(a) {

    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function (t) {
        return paths(i(t));
    };
}