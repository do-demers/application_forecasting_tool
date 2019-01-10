
dispatch.on("load_tbl.table", function (tbl_data) {

    var headers = ["Organisation", "Groupe", "Niveau", "Langue", "Région", "nombre de Postes", "Zone de sélection",
                        "Numéro de processus", "Titre", "Date de fermeture","Nombre de candidatures"];

    var columns = _.without(data.columns,"predicted","upper","lower","Dept_Code", "Department_E", "Adv_Name_E", "_TYPE_", "url");

    var table = d3.select('#tbl_div')
            .append('table')
            .attr("class","table table-striped")

    var thead = table
            .append('thead')


    var tbody = table
            .append('tbody');

    thead
        .append('tr')
        .attr("class","active")
        .selectAll('th')
        .data(headers)
        .enter()
        .append('th')
        .text(function (column) {
            return column;
        });

    // create a row for each object in the data
    var rows_grp = tbody
        .selectAll('tr')
        .data(tbl_data);

    var rows_grp_enter = rows_grp
        .enter()
        .append('tr');

    rows_grp_enter.merge(rows_grp);

    // create a cell in each row for each column

    rows_grp_enter
            .selectAll('td')
            .data(function (row) {
                return columns.map(function (column) {
                        return { column: column, value: row[column], link:row["url"] };
                });
            })
            .enter()
            .append('td')
            .html(function (d) {
               if(d.column === "Sel_Process_Nbr"){
                    var new_sel_proc = "<a href=" + d.link + " target=\"_blank\">"+ d.value+ "</a>";
                    return new_sel_proc;
                }
                else {
                    return d.value;
                }
            });


    dispatch.on("tbl_change.table", function (d) {

        var sorted_data = _.sortBy(d, 'applications');

        var columns = _.without(data.columns,"predicted","upper","lower","Dept_Code", "Department_E", "Adv_Name_E", "_TYPE_","url");

        var table_u = d3.select('table')

        var tbody_u = table_u.select('tbody');

        var rows_grp_u = tbody_u.selectAll('tr').data(sorted_data);

        rows_grp_u.exit().remove();

        var rows_grp_enter_u = rows_grp_u.enter().append('tr');

        var new_tds = rows_grp_u.merge(rows_grp_enter_u).selectAll('td').data(function (row) {
            return columns.map(function (column) {
                return { column: column, value: row[column], link:row["url"] };
            });
        });

        new_tds.html(function (d) {
            if(d.column === "Sel_Process_Nbr"){
                var new_sel_proc = "<a href=" + d.link + " target=\"_blank\">"+ d.value+ "</a>";
                return new_sel_proc;
            }else {
                return d.value;
            }
        });

        new_tds.enter().append('td').html(function (d) {
            if(d.column === "Sel_Process_Nbr"){
                var new_sel_proc = "<a href=" + d.link + " target=\"_blank\">"+ d.value+ "</a>";
                return new_sel_proc;
            }else {
                return d.value;
            }
        });

        var table_max =  _.isEmpty(_.pluck(d, "applications")) ? 0 : _.max(_.pluck(d, "applications")) ;
        var table_min = _.isEmpty(_.pluck(d, "applications")) ? 0 : _.min(_.pluck(d, "applications")) ;

        //Update descriptive Stats
        d3.select("#min_div")
            .text("Minimum (réel): " + table_min);

        d3.select("#max_div")
            .text("Maximum (réel): " + table_max);

        d3.select("#exp_data")
            .on("click", function() {

                var csv_headers = ["Organization", "Group", "Level", "Language", "Region", "Number of Positions", "Internal Process", "Process Number","Title", "Close Date", "Number of Applications", "url"];

                let csvContent = "";

                csvContent += csv_headers.join(",") + "\r\n";

                let csv_data = _.map(d, function(row){
                    temp_var = _.pick(row, columns, "url");
                    return temp_var
                });

                _.map(csv_data, function(row){
                    let row_array = _.map(row, function(x){
                        return "\"" + x +"\"";
                    }).join(",");
                    csvContent += row_array + "\r\n";
                });

                if (window.navigator.msSaveOrOpenBlob) {

                    var blob = new Blob(["\ufeff", decodeURIComponent(encodeURI(csvContent))], {
                        type: "text/csv;charset=utf-8"
                    });
                    navigator.msSaveBlob(blob, "candidatures.csv");

                }else {

                   d3.select("#exp_data")
                        .attr("href", "data:text/csv;charset=utf-8,%EF%BB%BF" + encodeURI(csvContent))
                        .attr("download", "candidatures.csv")

                }

            });


    });
});
