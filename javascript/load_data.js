
var dispatch = d3.dispatch("load_viz", "load_tbl", "load_choice", "state_change", "viz_change", "tbl_change");

// This will be assigned to rows, once the data is ready.
var data = null;

d3.csv((document.documentElement.lang === "en" ? "raw_data/final_raw_data.csv" : "raw_data/final_raw_data_fr.csv" ))
    .row(function(d) {
        d.applications = +d.applications;
        d.predicted = +d.predicted;
        d.lower = +d.lower;
        d.upper = +d.upper;

        return d;
    })
    .get(function(error, rows) {

        data = rows;// Now you can assign it

        var tbl_data = _.filter(data, function (row, i) {

            return (start_dept === all_depts_var ? row.Department !== all_depts_var : _.contains([row.Department], start_dept))
                && _.contains([row.Class_Group], start_grp)
                && _.contains([row.Class_Lvl], start_lvl)
                &&  (start_lang === all_lang_var ? row.Language !== all_lang_var : _.contains([row.Language], start_lang))
                &&  (start_reg === all_reg_var ? row.Region_NCR !== all_reg_var : _.contains([row.Region_NCR], start_reg))
                && _.contains([row.one_position], start_one)
                && _.contains([row.int_process], start_int);
        });

        var pred_data = _.filter(data, function (row, i) {
            return _.contains([row.Department], start_dept)
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
