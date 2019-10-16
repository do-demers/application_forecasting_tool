function init() {
    // This will be assigned to rows, once the data is ready.
    var data = null;
    var tbl_data = null;
    var pred_data = null;

    //load data
    d3.csv((document.documentElement.lang === "en" ? "raw_data/v5_data_en.csv" : "raw_data/final_data_fr.csv" ))
        .row(function (d) {
            d.total_applications = +d.total_applications;
            d.predicted = +d.predicted;
            d.lower = +d.lower;
            d.upper = +d.upper;

            return d;
        })
        .get(function (error, rows) {

            data = rows;// Now you can assign it

            tbl_data = _.filter(data, function (row, i) {

                return (start_dept === all_depts_var ? row.Department !== all_depts_var : _.contains([row.Department], start_dept))    //Department filter
                    && (start_aca === all_aca_var ? row.ACDMC_LVL_CD !== all_aca_var : _.contains([row.ACDMC_LVL_CD], start_aca))    //Academic Level filter
                    && _.contains([row.group], start_grp) //Group filter
                    && _.contains([row.level], start_lvl) //Level filter
                    && (start_lang === all_lang_var ? row.Language_requirement !== all_lang_var : _.contains([row.Language_requirement], start_lang)) //Language filter
                    && (start_reg === all_reg_var ? row.Locality !== all_reg_var : _.contains([row.Locality], start_reg)) //Region filter
                    && _.contains([row.Positions], start_one) //Position filter
                    && (start_aos === all_aos_var ? row.process_type !== start_aos : _.contains([row.process_type], start_aos))    //Aos filter
                    && _.contains([row.ee_restricted], start_ee)  //ee filter
                    && row._TYPE_ !== "11111111" //Remove "ALL" filter
                    ;
            });

            pred_data = _.filter(data, function (row, i) {
                return _.contains([row.Department], start_dept)
                    && _.contains([row.group], start_grp)
                    && _.contains([row.level], start_lvl)
                    && _.contains([row.Language_requirement], start_lang)
                    && _.contains([row.Locality], start_reg)
                    && _.contains([row.Positions], start_one)
                    && _.contains([row.process_type], start_aos)//AoS filter
                    && _.contains([row.ee_restricted], start_ee)  //ee filter
                    && _.contains([row.ACDMC_LVL_CD], start_aca);
            });

            call();
        });

    function call() {
        load_choice(data);
        load_table(tbl_data, _.without(data.columns, "predicted", "upper", "lower", "DEPT_CD", "_TYPE_", "POSTER_URL", "group", "level",
            // "ACDMC_LVL_CD",
            "ee_restricted"), pred_data);


        load_density(tbl_data)
        // load_viz(pred_data,tbl_data);

        disable_option("select_lang", tbl_data, "Language_requirement");
        disable_option("select_reg", tbl_data, "Locality");
        disable_option("select_one", tbl_data, "Positions");
        disable_option("select_aos", tbl_data, "process_type");
        disable_option("select_aca", tbl_data, "ACDMC_LVL_CD");
        disable_option("select_ee", tbl_data, "ee_restricted");
    }
}
