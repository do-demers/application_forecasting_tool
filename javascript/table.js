function load_table(tbl_data, columns, pred_data) {

    var max_appl = _.max(_.pluck(tbl_data, "total_applications"));
    var min_appl = _.min(_.pluck(tbl_data, "total_applications"));
    var min_est_appl = _.pluck(pred_data, "lower");
    var max_est_appl = _.pluck(pred_data, "upper");

    //Display number of ads
    d3.select('#ad_count')
        .html(function () {
            return '<p>Between April 1st 2015 and March 31st 2019'
                + ', there were<b> '
                + tbl_data.length
                + '</b> advertisement(s) that generated between <b>'
                + min_appl
                + '</b> and <b>'
                + max_appl
                + '</b> applications. We estimate that for these characteristics, similar advertisements will receive between <b>'
                + format(min_est_appl)
                + '</b> and <b>'
                + format(max_est_appl)
                + '</b> applications</b>'

        })
        .style("text-align", "center")
        .attr("class", "alert alert-info")
        .style("display", "inline-flex");


    var table = d3.select('#tbl_div')
        .append('table')
        .attr("id", "adv_tbl")
        .attr("class", "table table-striped table-hover");

    var thead = table.append('thead');

    var tbody = table.append('tbody');

    thead.append('tr')
        .attr("class", "active")
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
        .data(tbl_data)
        .enter()
        .append('tr')
    ;

    // create a cell in each row for each column
    rows_grp
        .selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                return {
                    column: column,
                    value: row[column],
                    link: row["POSTER_URL"]
                };
            });
        })
        .enter()
        .append('td')
        .html(function (d) {
            if (d.column === "SELECTION_PROCESS_NUMBER") {
                var new_sel_proc = "<a href=" + d.link + " target=\"_blank\">" + d.value + "</a>";
                return new_sel_proc;
            }
            else {
                return d.value;
            }
        });

    $('#adv_tbl').DataTable({
        paging: true,
        searching: true,
        orderCellsTop: true,
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel', {
                extend: 'pdfHtml5',
                orientation: 'landscape',
                pageSize: 'LEGAL'
            }
        ],
        columnDefs: [
            { width: 80, targets: 3 }
        ]
    });
}

function tbl_change(tbl_data, columns, new_pred_data) {

    //Display number of ads
    var max_appl = _.max(_.pluck(tbl_data, "total_applications"));
    var min_appl = _.min(_.pluck(tbl_data, "total_applications"));
    var min_est_appl = _.pluck(new_pred_data, "lower");
    var max_est_appl = _.pluck(new_pred_data, "upper");

    d3.select('#ad_count')
        .html(function () {
            return '<p>Between April 1st 2015 and March 31st 2019'
                + ", there were <b>'
                + tbl_data.length
                + '</b> advertisement(s) that generated between <b>'
                + min_appl
                + '</b> and <b>'
                + max_appl
                + '</b> applications. We estimate that for these characteristics, similar advertisements will receive between <b>
                + format(min_est_appl)
                + '</b> and <b>'
                + format(max_est_appl)
                + '</b> applications</p>'
        })
        .style("text-align", "center")
        .attr("class", "alert alert-info")
        .style("display", "inline-flex");

    //Hide warning if it's up from previous data
    d3.select("#low_response").style("display", "none");

    if (0 < tbl_data.length && tbl_data.length <= 10) {
        console.log("Warning");
        d3.select("#low_response")
            .text("Less than 10 observations, please use estimates with caution.")
            .style("display", "inline-flex");
    }

    if (tbl_data.length == 0) {
        console.log("Warning");
        d3.select("#ad_count").style("display", "none");
        d3.select("#low_response")
            .text("No data available")
            .style("display", "inline-flex");
    }

    $('#adv_tbl').DataTable().destroy();

    var sorted_data = _.sortBy(tbl_data, 'total_applications');

    var table_u = d3.select('#adv_tbl');

    var tbody_u = table_u.select('tbody');

    var rows_grp_u = tbody_u.selectAll('tr').data(sorted_data);

    rows_grp_u.exit().remove();

    var rows_grp_enter_u = rows_grp_u.enter().append('tr');

    var new_tds = rows_grp_u.merge(rows_grp_enter_u).selectAll('td').data(function (row) {
        return columns.map(function (column) {
            return {
                column: column,
                value: row[column],
                link: row["POSTER_URL"]
            };
        });
    });

    new_tds.html(function (d) {
        if (d.column === "SELECTION_PROCESS_NUMBER") {
            var new_sel_proc = "<a href=" + d.link + " target=\"_blank\">" + d.value + "</a>";
            return new_sel_proc;
        } else {
            return d.value;
        }
    });

    new_tds.enter().append('td').html(function (d) {
        if (d.column === "SELECTION_PROCESS_NUMBER") {
            var new_sel_proc = "<a href=" + d.link + " target=\"_blank\">" + d.value + "</a>";
            return new_sel_proc;
        } else {
            return d.value;
        }
    });


    $('#adv_tbl').DataTable({
        paging: true,
        searching: true,
        orderCellsTop: true,
        dom: 'Bfrtip',
        buttons: [
            'csv', 'excel', {
                extend: 'pdfHtml5',
                orientation: 'landscape',
                pageSize: 'LEGAL'
            }
        ],
        columnDefs: [
            { width: 80, targets: 3 }
        ]
    });
}

