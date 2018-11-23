
dispatch.on("load_viz.bar", function (viz_data) {

    var margin = { top: 20, right: 20, bottom: 30, left: 40 },
        width = 80 - margin.left - margin.right,
        height = 460 - margin.top - margin.bottom;


    var yScale = d3.scaleLinear()
            .domain([0, d3.max(_.pluck(data, 'predicted'))])
            .rangeRound([height, 0])
            .nice();

    var yAxis = d3
            .axisLeft(yScale)
            .tickFormat(d3.format(".2s"));

    var svg = d3.select("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
        .append("g")
        .attr("class", "yScale axis")
        .call(yAxis);

    var rect = svg
        .append("rect")
        .attr("x", 4)
        .attr("width", width - 4)
        .attr("y", height)
        .attr("height", 0)
        .style("fill", "rgb(51, 80, 117)");

    dispatch.on("viz_change.bar", function (d) {

        var bar_data = _.uniq(d, 'predicted', "lower", "upper");

        var pred_value = _.pluck(bar_data, "predicted");

        yScale.domain([0, d3.max(_.pluck(bar_data, "upper"))]);

        svg.select(".yScale.axis")
            .transition()
            .duration(1500)
            .call(yAxis);

        rect
            .transition()
            .attr("y", yScale(pred_value))
            .attr("height", yScale(0) - yScale(pred_value));


    });
});

dispatch.on("load_viz.numbers", function (viz_data) {

    var numbers = d3.select("#IC_div")
            .data(viz_data)
            .text(function (d) {
                return "1" + " - " + "2";
            });

    dispatch.on("viz_change.numbers", function (d) {

        var num_data = _.uniq(d, 'predicted', "lower", "upper");

        var new_low = _.pluck(num_data, "lower");
        var new_high = _.pluck(num_data, "upper");

        numbers.transition()
            .duration(2500)
            .tween("text", function () {

                var format = d3.format("d");
                var that = d3.select(this);

                var temp = (that.node().innerHTML = "Aucune données") ? [0, 0] : previous_num.match(/^\d+|\d+\b|\d+(?=\w)/g).map(function (v) {
                    return +v;
                });

                var i = d3.interpolateNumber(temp[0], new_low);

                var j = d3.interpolateNumber(temp[1], new_high);

                var text_fct = _.isEmpty(d) ? function (t) {
                    that
                        .html("Aucune données")
                        .style("align-self", "flex-end")
                        .attr("height", "300px");

                    } : function (t) {
                        that.html('<span id="font_intro">Pour les caractéristiques ci-dessus, on estime que vous recevrez entre</span>'
                            + '</br>' + format(i(t)) + ' - ' + format(j(t))
                            + '</br>'
                            + '<span id="font_appl">candidatures</span>'
                        ).style("align-self", "unset");
                    };

            return text_fct;
        });
    });
});