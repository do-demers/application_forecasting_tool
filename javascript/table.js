function load_table(data) {

    var columns = _.without(data.columns, "predicted", "upper", "lower", "Dept_Code", "_TYPE_", "url");

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
        .data(data);

    var rows_grp_enter = rows_grp
        .enter()
        .append('tr')
    ;

    rows_grp_enter.merge(rows_grp);

    // create a cell in each row for each column
    rows_grp_enter
        .selectAll('td')
        .data(function (row) {
            return columns.map(function (column) {
                return {column: column, value: row[column], link: row["url"]};
            });
        })
        .enter()
        .append('td')
        .html(function (d) {
            if (d.column === "Sel_Process_Nbr") {
                var new_sel_proc = "<a href=" + d.link + " target=\"_blank\">" + d.value + "</a>";
                return new_sel_proc;
            }
            else {
                return d.value;
            }
        });

    console.log("Load table");
/*
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
            {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function (data, type, row) {
                    return data + '-' + row[2];
                },
                "targets": 1
            },
            {"visible": false, "targets": [2]}
        ]

    });
    */
}

function tbl_change(data) {

    console.log("change table");

   /* $('#adv_tbl').DataTable().destroy();*/

    var sorted_data = _.sortBy(data, 'applications');

    var columns = _.without(data.columns, "predicted", "upper", "lower", "Dept_Code", "_TYPE_", "url");

    var table_u = d3.select('table');

    var tbody_u = table_u.select('tbody');

    var rows_grp_u = tbody_u.selectAll('tr').data(sorted_data);

    rows_grp_u.exit().remove();

    var rows_grp_enter_u = rows_grp_u.enter().append('tr');

    var new_tds = rows_grp_u.merge(rows_grp_enter_u).selectAll('td').data(function (row) {

        return columns.map(function (column) {
            return {column: column, value: row[column], link: row["url"]};
        });
    });

    new_tds.html(function (d) {
        if (d.column === "Sel_Process_Nbr") {
            var new_sel_proc = "<a href=" + d.link + " target=\"_blank\">" + d.value + "</a>";
            return new_sel_proc;
        } else {
            return d.value;
        }
    });

    new_tds.enter().append('td').html(function (d) {
        if (d.column === "Sel_Process_Nbr") {
            var new_sel_proc = "<a href=" + d.link + " target=\"_blank\">" + d.value + "</a>";
            return new_sel_proc;
        } else {
            return d.value;
        }
    });

/*
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
            {
                // The `data` parameter refers to the data for the cell (defined by the
                // `data` option, which defaults to the column being worked with, in
                // this case `data: 0`.
                "render": function (data, type, row) {
                    return data + '-' + row[2];
                },
                "targets": 1
            },
            {"visible": false, "targets": [2]},
            {"width": "9%", "targets": [9, 10]}
        ]
    });*/
}

