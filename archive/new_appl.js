// var dispatch = d3.dispatch("load_viz", "load_tbl", "load_choice", "statechange", "select_change", "viz_change", "tbl_change");
//
// var start_dept = "Public Service Commission of Canada";
// debugger;
// var start_grp = "EC";
// var start_lvl = "04";
// var start_lang = "Various language requirements and/or profiles";
// var start_reg = "NCR";
// var start_one = "Multiple";
// var start_int = "internal";
//
//
// d3.dsv(",", "raw_data/raw_data.csv", function(d) {
//     d.applications = +d.applications;
//     d.predicted = +d.predicted;
//     d.lower = +d.lower;
//     d.upper = +d.upper;
//     d.days_open = +d.days_open;
//     return d;
// }).then(function(data) {
//
//     dispatch.call("load_choice", undefined,data);
//     dispatch.call("load_viz", undefined, data);
//     dispatch.call("load_tbl", undefined, data);
//     dispatch.call("statechange", undefined, data);
//
// });
//
