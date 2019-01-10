
dispatch.on("load_choice", function (data) {


    var drop_box = function drop_box(sel_data, variable, prefix, start_var, label) {

        if (variable === "Class_Lvl"){
            var current_group = d3.select("#select_grp").property("value");
            var temp_data = _.filter(sel_data, function (row, i) {
                return _.contains([row.Class_Group], current_group);
            });
            var var_list = _.uniq(_.pluck(temp_data, variable)).sort();

        }
        else {
            var var_list = _.uniq(_.pluck(sel_data, variable)).sort();
        }

        if (variable === "Department_F"){

            var_list = _.without(var_list, "Tous les départements");
            var_list.unshift("Tous les départements")
        }

         var var_select = d3.select("#select_div")
            .append("label")
            .attr("id", "sel_lbl")
            .attr("for", "select" + prefix).text(label)
            .append("select")
            .attr("id", "select" + prefix)
            .attr("class", "select_class")
            .on("change", function () {
                dispatch.call("state_change", this, data);
            });

        var_select
            .selectAll("option")
            .data(var_list)
            .enter()
            .append("option")
            .attr("value", function (d) {
                return d;
            }).text(function (d) {
                return d;
            })

        var_select.property("value", start_var);
    };


    drop_box(data, "Department_F", "_dept", start_dept, "Organisation:");
    drop_box(data, "Class_Group", "_grp", start_grp, "Groupe:");
    drop_box(data, "Class_Lvl", "_lvl", start_lvl, "Niveau:");
    drop_box(data, "Language", "_lang", start_lang, "Langue:");
    drop_box(data, "Region_NCR", "_reg", start_reg, "Lieu de travail:");
    drop_box(data, "one_position", "_one", start_one, "Nombre de postes:");
    drop_box(data, "int_process", "_int", start_int, "Zone de sélection:");


    dispatch.on("state_change", function (filter_data) {

        var current_dept = d3.select("#select_dept").property("value");
        var current_group = d3.select("#select_grp").property("value");
        var current_lvl = d3.select("#select_lvl").property("value");
        var current_lang = d3.select("#select_lang").property("value");
        var current_reg = d3.select("#select_reg").property("value");
        var current_one = d3.select("#select_one").property("value");
        var current_int = d3.select("#select_int").property("value");

        if(this.id === "select_grp"){

            var new_sel_data = _.filter(data, function (row, i) {
                return _.contains([row.Class_Group], current_group);
            });

            var new_var_list = _.uniq(_.pluck(new_sel_data, "Class_Lvl")).sort();

            var new_var_select = d3.select("#select_lvl")
                     .selectAll("option")
                    .data(new_var_list);

            new_var_select
                .attr("value", function (d) {
                    return d;
                })
                .text(function (d) {
                return d;
                })

            new_var_select.exit().remove()

            new_var_select
                .enter()
                .append("option")
                .attr("value", function (d) {
                    return d;
                })
                .text(function (d) {
                    return d;
                })
                .merge(new_var_select)

            if(!_.contains(new_var_list, current_lvl)){
                d3.select("#select_lvl").property("value", new_var_list[0]);
                current_lvl = d3.select("#select_lvl").property("value");

            }else{
                current_lvl = d3.select("#select_lvl").property("value");
            }

        }

         var new_tbl_data = _.filter(data, function (row, i) {
            return (current_dept === "Tous les départements" ? row.Department_F !== "Tous les départements" : _.contains([row.Department_F], current_dept))
                && _.contains([row.Class_Group], current_group)
                && _.contains([row.Class_Lvl], current_lvl)
                &&  (current_lang === "Toutes les exigences" ? row.Language !== "Toutes les exigences" : _.contains([row.Language], current_lang))
                &&  (current_reg === "Toutes les régions" ? row.Region_NCR !== "Toutes les régions" : _.contains([row.Region_NCR], current_reg))
                && _.contains([row.one_position], current_one)
                && _.contains([row.int_process], current_int);
        });

        var new_pred_data = _.filter(data, function (row, i) {

            return _.contains([row.Department_F], current_dept)
                && _.contains([row.Class_Group], current_group)
                && _.contains([row.Class_Lvl], current_lvl)
                && _.contains([row.Language], current_lang)
                && _.contains([row.Region_NCR], current_reg)
                && _.contains([row.one_position], current_one)
                && _.contains([row.int_process], current_int);
        });

        var obs_data = _.pluck(new_tbl_data, "applications")
        var pred_low = _.pluck(new_pred_data, "lower")[0]
        var pred_up = _.pluck(new_pred_data, "upper")[0]
        var in_interval = _.filter(obs_data, function(num){
            return (pred_low <= num) && (num <= pred_up);
        })

        var accuracy = in_interval.length / obs_data.length;

        dispatch.call("viz_change", this, new_pred_data);
        dispatch.call("tbl_change", this, new_tbl_data);
    });
});
