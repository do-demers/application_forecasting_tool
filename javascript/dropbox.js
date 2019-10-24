function load_choice(data) {

    var drop_box = function drop_box(sel_data, variable, prefix, start_var, label) {

        var var_list = _.uniq(_.pluck(sel_data, variable)).sort();

        if (variable === "level") {
            var current_group = d3.select("#select_grp").property("value");

            var temp_data = _.filter(sel_data, function (row, i) {
                return _.contains([row.group], current_group);
            });

            var_list = _.uniq(_.pluck(temp_data, variable)).sort();

        } else if (variable === "Department") {
            var_list = _.without(var_list, all_depts_var);
            var_list.unshift(all_depts_var)
        } else if (variable === "Locality") {
            var_list = _.without(var_list, all_reg_var, NCR_Multi_reg);
            var_list.unshift(NCR_Multi_reg[0])
            var_list.unshift(NCR_Multi_reg[1])
            var_list.unshift(all_reg_var)
        } else if (variable === "process_type") {
            var_list = _.without(var_list, all_aos_var);
            var_list.unshift(all_aos_var)

        } else if (variable === "ACDMC_LVL_CD") {
            var_list = _.without(var_list, all_aca_var);
            var_list.unshift(all_aca_var)
        }

        var var_select = d3.select("#select_div")
            .append("label")
            .attr("id", "sel_lbl")
            .attr("for", "select" + prefix)
            .text(function () {
                return label;
            })
            .style("width", "100%")
            .append("select")
            .attr("id", "select" + prefix)
            .attr("class", "select_class")
            .style("width", "100%");

        var_select
            .selectAll("option")
            .data(var_list)
            .enter()
            .append("option")
            .attr("value", function (d) {
                return d;
            })
            .text(function (d) {
                return d;
            });
        // .attr("disable", function(d) {
        //     // debugger;
        //     return false;
        // })
        var_select.property("value", start_var);


    };

    //Modify for FR and EN
    if (document.documentElement.lang == "en") {

        drop_box(data, "Department", "_dept", start_dept, "Organization:");
        drop_box(data, "group", "_grp", start_grp, "Group:");
        drop_box(data, "level", "_lvl", start_lvl, "Level:");
        drop_box(data, "Language_requirement", "_lang", start_lang, "Language:");
        drop_box(data, "Locality", "_reg", start_reg, "Work Location:");
        drop_box(data, "Positions", "_one", start_one, "Positions:");
        drop_box(data, "process_type", "_aos", start_aos, "Area of selection:");
        drop_box(data, "ACDMC_LVL_CD", "_aca", start_aca, "Education:");
        drop_box(data, "ee_restricted", "_ee", start_ee, "EE restriction:");

    } else {
        drop_box(data, "Department", "_dept", start_dept, "Organisation:");
        drop_box(data, "group", "_grp", start_grp, "Groupe:");
        drop_box(data, "level", "_lvl", start_lvl, "Niveau:");
        drop_box(data, "Language_requirement", "_lang", start_lang, "Langue:");
        drop_box(data, "Locality", "_reg", start_reg, "Lieu de travail:");
        drop_box(data, "Positions", "_one", start_one, "Nombre de postes:");
        drop_box(data, "process_type", "_aos", start_aos, "Zone de sélection:");
        drop_box(data, "ACDMC_LVL_CD", "_aca", start_aca, "Niveau Academic:");
        drop_box(data, "ee_restricted", "_ee", start_ee, "Restriction EME:");
    }

    //add event on selecting new criteria
    d3.selectAll(".select_class").on("change", function(){state_change(data, this);});
}

function state_change(data, el) {


    if (_.contains(["select_grp", "select_lvl", "select_dept"], el.id)) {
        d3.selectAll("option")
            .property("disabled", false);
    }

    var current_dept = d3.select("#select_dept").property("value");
    var current_group = d3.select("#select_grp").property("value");
    var current_lvl = d3.select("#select_lvl").property("value");
    var current_lang = d3.select("#select_lang").property("value");
    var current_reg = d3.select("#select_reg").property("value");
    var current_one = d3.select("#select_one").property("value");
    var current_aos = d3.select("#select_aos").property("value");
    var current_aca = d3.select("#select_aca").property("value");
    var current_ee = d3.select("#select_ee").property("value");

    if (el.id === "select_grp") {

        var new_sel_data = _.filter(data, function (row, i) {
            return _.contains([row.group], current_group);
        });

        var new_var_list = _.uniq(_.pluck(new_sel_data, "level")).sort();

        var new_var_select = d3.select("#select_lvl")
            .selectAll("option")
            .data(new_var_list);

        new_var_select
            .attr("value", function (d) {
                return d;
            })
            .text(function (d) {
                return d;
            });

        new_var_select.exit().remove();

        new_var_select
            .enter()
            .append("option")
            .attr("value", function (d) {
                return d;
            })
            .text(function (d) {
                return d;
            })
            .merge(new_var_select);

        if (!_.contains(new_var_list, current_lvl)) {

            d3.select("#select_lvl").property("value", new_var_list[0]);
            current_lvl = d3.select("#select_lvl").property("value");

        } else {
            current_lvl = d3.select("#select_lvl").property("value");
        }
    }

    var new_tbl_data = _.filter(data, function (row, i) {
        return ( current_dept === all_depts_var ? row.Department !== all_depts_var : _.contains([row.Department], current_dept))
            && (current_aca === all_aca_var ? row.ACDMC_LVL_CD !== all_aca_var : _.contains([row.ACDMC_LVL_CD], current_aca))
            && _.contains([row.group], current_group)
            && _.contains([row.level], current_lvl)
            && (current_lang === all_lang_var ? row.Language_requirement !== all_lang_var : _.contains([row.Language_requirement], current_lang))
            && (current_reg === all_reg_var ? row.Locality !== all_reg_var : _.contains([row.Locality], current_reg))
            && _.contains([row.Positions], current_one)
            && (current_aos === all_aos_var ? row.process_type !== current_aos : _.contains([row.process_type], current_aos))    //Aos filter
            && row.Department !== all_depts_var
            && _.contains([row.ee_restricted], current_ee)
            && row._TYPE_ !== "11111111"
            // && row._TYPE_ !== "11110111"
            ;
    });

    var new_pred_data = _.filter(data, function (row, i) {

        return _.contains([row.Department], current_dept)
            && _.contains([row.group], current_group)
            && _.contains([row.level], current_lvl)
            && _.contains([row.Language_requirement], current_lang)
            && _.contains([row.Locality], current_reg)
            && _.contains([row.Positions], current_one)
            && _.contains([row.ACDMC_LVL_CD], current_aca)//Academic Level filter
            && _.contains([row.ee_restricted], current_ee)//ee filter
            && _.contains([row.process_type], current_aos);
    });


    if (_.contains(["select_grp", "select_lvl", "select_dept"], el.id)) {

        var disable_data = _.filter(data, function (row, i) {
            return ( current_dept === all_depts_var ? row.Department !== all_depts_var : _.contains([row.Department], current_dept))
                && _.contains([row.group], current_group)
                && _.contains([row.level], current_lvl)
                && row.Department !== all_depts_var
                && row._TYPE_ !== "11111111"
                // && row._TYPE_ !== "11110111"
                ;

        });

        disable_option("select_lang", disable_data, "Language_requirement");
        disable_option("select_reg", disable_data, "Locality");
        disable_option("select_one", disable_data, "Positions");
        disable_option("select_aos", disable_data, "process_type");
        disable_option("select_aca", disable_data, "ACDMC_LVL_CD");
        disable_option("select_ee", disable_data, "ee_restricted");
    }

    //Call datatable and visualisation
    tbl_change(new_tbl_data, _.without(data.columns, "predicted", "upper", "lower", "DEPT_CD", "_TYPE_", "POSTER_URL", "group", "level" ,"ee_restricted" ), new_pred_data);
    updateChart(new_tbl_data)

}

function disable_option(select, option_data, item) {

    var option_list = _.union(_.uniq(_.pluck(option_data, item)).sort(),["ANY", all_depts_var, all_lang_var, all_reg_var, all_aca_var, all_aos_var, NCR_Multi_reg]);

    d3.select("#"+select)
        .selectAll("option")
        .each(function(d) {

            if (!_.contains(option_list, d)) {
                d3.select(this).property("disabled", true)
            }

            if (d3.select(this).property("value") === "ANY") {
                d3.select(this).property("disabled", false)
            }

        })
    ;

}
