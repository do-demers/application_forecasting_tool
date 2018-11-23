
var dispatch = d3.dispatch("load_viz", "load_tbl", "load_choice", "state_change", "viz_change", "tbl_change");

var start_dept = "Tous les départements";
var start_grp = "EC";
var start_lvl = "03";
var start_lang = "Toutes les exigences";
var start_reg = "RCN";
var start_one = "Plusieurs postes";
var start_int = "Processus Interne";

// This will be assigned to rows, once the data is ready.
var data = null;

d3.csv("raw_data/final_raw_data_fr.csv")
    .row(function(d) {
        d.applications = +d.applications;
        d.predicted = +d.predicted;
        d.lower = +d.lower;
        d.upper = +d.upper;
        // d.Class_Lvl = "0" + d.Class_Lvl;

        return d;
    })
    .get(function(error, rows) {

        data = rows;// Now you can assign it

        var tbl_data = _.filter(data, function (row, i) {

            return (start_dept === "Tous les départements" ? row.Department_F !== "Tous les départements" : _.contains([row.Department_F], start_dept))
                && _.contains([row.Class_Group], start_grp)
                && _.contains([row.Class_Lvl], start_lvl)
                &&  (start_lang === "Toutes les exigences" ? row.Language !== "Toutes les exigences" : _.contains([row.Language], start_lang))
                &&  (start_reg === "Toutes les régions" ? row.Region_NCR !== "Toutes les régions" : _.contains([row.Region_NCR], start_reg))
                && _.contains([row.one_position], start_one)
                && _.contains([row.int_process], start_int);
        });

        var pred_data = _.filter(data, function (row, i) {
            return _.contains([row.Department_F], start_dept)
                && _.contains([row.Class_Group], start_grp)
                && _.contains([row.Class_Lvl], start_lvl)
                && _.contains([row.Language], start_lang)
                && _.contains([row.Region_NCR], start_reg)
                && _.contains([row.one_position], start_one)
                && _.contains([row.int_process], start_int);
        });

        // myDataIsReady()// Now you can draw it

        dispatch.call("load_choice", undefined, data);

        dispatch.call("load_viz", undefined, pred_data);

        dispatch.call("load_tbl", undefined, tbl_data);

        dispatch.call("state_change", undefined, data);

    });


// function myDataIsReady() {
//     console.log(data);// will trace the data that was loaded
// }


// var raw_data = d3.csvParse(temp_raw_data, function (i) {
//     i.applications = +i.applications;
//     return i;
// });
//
// var pred_data = d3.csvParse(temp_pred_data, function (i) {
//
//     i.predicted = +i.predicted;
//     i.lower = +i.lower;
//     i.upper = +i.upper;
//
//     return i;
// });

