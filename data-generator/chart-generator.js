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

        td.appendChild( getExportLinkHTML() );
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
                isEdited(true);
                // Now that we have an initial package, we can add package items.
                addPackageItem(null, true);
            }

            // Now create a package item data cell for each package item row.
            var numPackageItems = document.getElementById(tableID).rows.length - 2;
            for(var i = 0; i < numPackageItems; i++) {
                td = document.createElement('td');
                td.id = 'item-' + packageID + '-' + i;
                td.className = 'item-data';

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
            itemRow.id = 'item-' + itemID;

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

    var isEdited = function(setEditedTo) {
        edited = !!setEditedTo;

        if(edited) {
            window.onbeforeunload = function (e) {
                // If we haven't been passed the event get the window.event
                e = e || window.event;
                var message = 'You have not exported your changes! You will loose your changes if you leave this page. ';

                // For IE6-8 and Firefox prior to version 4
                if (e) { e.returnValue = message; }

                // For Chrome, Safari, IE8+ and Opera 12+
                return message;
            };
        } else {
            window.onbeforeunload = null;
        }
    };

    var getPlusIconHTML = function() {
        var i = document.createElement('i');
        i.className = 'fa fa-plus';
        i.setAttribute('aria-hidden', 'true');
        return i;
    };

    var getExportLinkHTML = function() {
        var link = document.createElement('a');
        link.href = '#';
        link.onclick = function(event) { outputDataAsFile(event); };
        link.innerText = 'Export';
        return link;
    };

    var getCellInputHTML = function(item) {
        var input = document.createElement('input');
        switch (item.className) {
            case 'package-head':    input.placeholder = 'Package Name...'; break;
            case 'item-head':       input.placeholder = 'Item Name...'; break;
            case 'item-data':       input.placeholder = 'Item Value...'; break;
        }

        input.id = 'input-' + item.id;
        input.oninput = function(event) { chartGenerator.onTextEntered(event); };

        return input;
    };

    var onTextEntered = function(event) {
        if(!edited) { isEdited(true); }

        var inputEl = event.target;

        var packageID, itemID;

        switch (inputEl.parentNode.className) {
            case 'package-head':
                // input id format is "input-package-head-{packageID}"
                // This is the name of the package
                packageID = parseInt( (inputEl.id).replace('input-package-head-', '') );
                data.packages[packageID]['package_name'] = inputEl.value;
                break;
            case 'item-head': // input id format is "input-item-head-{itemID}", but we don't need this yet
                //itemID = parseInt( (inputEl.id).replace('input-item-head-', '') );
                break;
            case 'item-data':
                // input id format is "input-item-{packageID}-{itemID}"
                var temp = ( (inputEl.id).replace('input-item-', '') ).split('-');
                packageID = temp[0];
                itemID = temp[1];

                // Get the value of the package item name
                var itemNameInput = document.getElementById('input-item-head-' + itemID);

                // if the package item has a name, add the value of this item to the package.
                if(itemNameInput && itemNameInput.value != '') {
                    data.packages[packageID][itemNameInput.value] = inputEl.value;
                }
                break;
        }
    };

    var updateDataObj = function() {
        var ret = false;
        var table = document.getElementById(tableID);

        var numPackages = table.rows[0].cells.length - 2;
        var numPackageItems = table.rows.length - 2;

        if(numPackages > 0 && numPackageItems > 0) {
            for(var pkgID = 0; pkgID < numPackages; pkgID++) {
                data.packages[pkgID]['package_name'] = document.getElementById('input-package-head-' + pkgID).value.trim();

                for(var itemID = 0; itemID < numPackageItems; itemID++) {
                    var packageItemName = document.getElementById('input-item-head-' + itemID).value;

                    if(packageItemName.length > 0) {
                        var packageItemValue = document.getElementById('input-item-' + pkgID + '-' + itemID).value.trim();
                        if( (packageItemValue).toLower() == 'true') { packageItemValue = true; }

                        if(packageItemValue.length > 0) {
                            data.packages[pkgID][packageItemName] = packageItemValue;
                            ret = true;
                        }
                    }
                }
            }
        }

        return ret;
    };

    var outputDataAsFile = function(event) {
        if( updateDataObj() ) {
            var targetEl = event.target;
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
            targetEl.setAttribute("href",     dataStr     );
            targetEl.setAttribute("download", "package-data.json");

            isEdited(false);
        }
    };

	return {
	    init: function(containerID) {
            data.config = {};
            data.packages = {};
            createInitialTable(containerID);
        },
        addPackage: addPackage,
        addPackageItem: addPackageItem,
        onTextEntered: onTextEntered,
        outputDataAsFile: outputDataAsFile
	};
}());
