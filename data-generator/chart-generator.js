var chartGenerator = (function() {
    var containerID = 'gen-container';
	var tableID = 'main-gen-table';
	var headerRowID = 'row-head';
	var edited = false;
	var data = {};

    var createInitialTable = function() {
        containerID = (typeof containerID !== 'undefined') ?  containerID : 'gen-container';
        // Create the initial header
        var table = document.createElement('table');
        table.id = tableID;

        // Create table header and body elements
        var thead = document.createElement('thead');
        var tbody = document.createElement('tbody');

        // Create initial header row/column and attach
        var tr = document.createElement('tr');
        var td = document.createElement('td');

        tr.id = headerRowID;
        tr.appendChild(td);
        thead.appendChild(tr);

        // Build the initial table and attach it to the body,
        table.appendChild(thead);
        table.appendChild(tbody);
        document.getElementById(containerID).appendChild(table);

        // Then create the initial 'add-package' header row
        addPackage(null, true);
    };

	var addPackage = function(event, isInitial) {
        var td;
        if(isInitial) {
            // Create the 'add-package' column.
            td = document.getElementById(headerRowID).insertCell(-1);
            td.id = 'package-head-add';
            td.className = 'add-package';

            var addBtn = document.createElement('button');
            addBtn.id = 'btn-add-package';
            addBtn.title = 'Add New Package';
            addBtn.appendChild( getPlusIconHTML() );

            addBtn.onclick = chartGenerator.addPackage.bind(this);

            td.appendChild(addBtn);
        } else {
            var packageID = (_.size(data.packages));

            // Create a new header cell for this package after the last package cell
            // (or after the top-left corner cell if this is the first package being added)
            td = document.getElementById(headerRowID).insertCell(packageID + 1);

            data.packages[packageID] = {};

            td.id = 'package-head-' + (packageID);
            td.className = 'package-head';
            td.appendChild( getCellInputHTML(td) );

            if(!edited) {
                isEdited();
                // Now that we have an initial package, we can add package items.
                addPackageItem(null, true);
            }

            // Now create a package item data cell for each package item row.
            var numPackages = document.getElementById(tableID).rows.length - 2;
            for(var i = 0; i < numPackages; i++) {
                td = document.createElement('td');
                td.id = 'row-' + packageID + '-' + i;

                td.appendChild( getCellInputHTML(td) );
                document.getElementById(tableID).rows[i + 1].appendChild(td);
            }
        }
	};

    var addPackageItem = function(event, isInitial) {
        var itemRow, td;

        if(isInitial) {
            // Create the 'add-package-item' row.
            itemRow = document.getElementById(tableID).insertRow(-1);
            itemRow.id = 'item-add';
            td = document.createElement('td');
            td.id = 'item-add-head';
            td.className = 'add-package-item';

            var addBtn = document.createElement('button');
            addBtn.id = 'btn-add-package-item';
            addBtn.title = 'Add New Package Item';
            addBtn.appendChild( getPlusIconHTML() );

            addBtn.onclick = function () {
                chartGenerator.addPackageItem();
            };

            td.appendChild(addBtn);
            itemRow.appendChild(td);
        } else {
            var itemID = document.getElementById(tableID).rows.length - 2;
            itemRow = document.getElementById(tableID).insertRow(itemID + 1);

            // Create the package-item column header cell.
            td = document.createElement('td');
            td.id = 'item-head-' + itemID;
            td.className = 'item-head';

            td.appendChild( getCellInputHTML(td) );
            itemRow.appendChild(td);

            // Now create a package item data cell for each package column
            for(var i = 0; i < _.size(data.packages); i++) {
                td = document.createElement('td');
                td.id = 'item-' + i + '-' + itemID;
                td.className = 'item-data';

                td.appendChild( getCellInputHTML(td) );
                itemRow.appendChild(td);
            }
        }
    };

    var isEdited = function() {
        edited = true;
        // todo: add event listener for window close event, show "page is edited, are you sure" type message.
    };

    var getPlusIconHTML = function() {
        var i = document.createElement('i');
        i.className = 'fa fa-plus';
        i.setAttribute('aria-hidden', 'true');
        return i;
    };

    var getCellInputHTML = function(item) {
        var input = document.createElement('input');
        switch (item.className) {
            case 'package-head':    input.placeholder = 'Package Name...'; break;
            case 'item-head':       input.placeholder = 'Item Name...'; break;
            case 'item-data':       input.placeholder = 'Item Value...'; break;
        }

        input.id = 'input-' + item.id;
        input.oninput = function(event) {
            chartGenerator.onTextEntered(event);
        };

        return input;
    };

    var onTextEntered = function(event) {
        var output = '';
        switch (event.target.parentNode.className) {
            case 'package-head':    output = 'Package Name...'; break;
            case 'item-head':       output = 'Item Name...'; break;
            case 'item-data':       output = 'Item Value...'; break;
        }
        console.log(output);

        //console.log(data); // debug
    };

    /*
    var outputDataAsFile = function(formatted) {
        var dataString = '';

        if(formatted) { dataString = JSON.stringify(this.data, undefined, 2); }
        else { dataString = JSON.stringify(this.data); }

        //var link = document.getElementById('dl-link');
        var link = document.createElement('a');
        link.download = 'data.json';
        link.target = '_blank'; // may or may not be needed?

        var blob = new Blob([dataString], {type: 'text/plain'});
        link.href = URL.createObjectURL(blob);
        link.click();
    };
    */

	return {
	    init: function(containerID) {
            data.config = {};
            data.packages = {};
            createInitialTable(containerID);
        },
        addPackage: addPackage,
        addPackageItem: addPackageItem,
        onTextEntered: onTextEntered

        //outputDataAsFile: outputDataAsFile


	};
}());
