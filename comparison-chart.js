var comparisonChart = (function() {
    var jsonUrl = '/package-data.json';
    var chartDivID = 'chart-container';
    var config = {};
    var packages = {};

    var getJsonFile = function(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', jsonUrl, true);
        xhr.responseType = 'json';
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                    callback(xhr.response);
                } else {
                    console.log('Request failed.  Returned status of ' + xhr.status);
                    callback('');
                }
            }
        };

        xhr.send();
    };

    var parseJsonFileObj = function(obj) {
        if(obj !== '' && "config" in obj && "packages" in obj) {
            packages = obj.packages;
            setConfig(obj.config);

            createInitialTable();
        } else {
            console.log('error parsing JSON data. Stopping.');
        }
    };

    var setConfig = function(configObj) {
        // Check if config in parsed JSON file exist or set to default
        config.showInit     = ( "showInit" in configObj && parseInt(configObj.showInit) ) ? parseInt(configObj.showInit) : 3;
        config.showMin      = ( "showMin" in configObj && parseInt(configObj.showMin) ) ? parseInt(configObj.showMin) : 1;
        config.showMax      = ( "showMax" in configObj && parseInt(configObj.showMax) ) ? parseInt(configObj.showMax) : 3;

        // Make sure the number of packages available conforms with the data above
        var numPackages = _.size(packages);

        config.showInit = (numPackages < config.showInit) ? numPackages : config.showInit;
        config.showMax  = (numPackages < config.showMax) ? numPackages : config.showMax;
    };

    var createInitialTable = function() {
        var mainTable = document.createElement('table');

        // Create the Table Head and Body elements
        var thead = document.createElement('thead');
        var theadRow = document.createElement('tr');
        var tbody = document.createElement('tbody');

        // Create initial column headers for packages shown
        if(config.showInit > 0) {
            var td;
            for(var i = 0; i < config.showInit; i++) {
                td = document.createElement('td');
                td.innerHTML = packages[i].package_name;
                theadRow.appendChild(td);
            }
        }

        // Attach the new head elements to the table, then to the document
        thead.appendChild(theadRow);
        mainTable.appendChild(thead);
        mainTable.appendChild(tbody);
        document.getElementById(chartDivID).appendChild(mainTable);
    };

    var getPackageDDHTML = function(selectID, options, onchange) {
        var dd = document.createElement('select');
        dd.id = selectID;
        dd.onchange = onchange;
        var numOptions = _.size(options);

        if(numOptions > 0) {
            var op;
            for(var i = 0; i < numOptions; i++) {
                op = document.createElement('option');
                op.value = options[i].value;
                op.text = options[i].text;
                if(options[i].selected) { op.selected = 'selected'; }
                dd.appendChild(op);
            }
        }

        return dd;
    };

    var onPackageSelectionChange = function() {

    };

    return {
        init: function(jsonUrl, chartDivID) {
            jsonUrl     = (typeof jsonUrl !== 'undefined') ?  jsonUrl : '/package-data.json';
            chartDivID  = (typeof chartDivID !== 'undefined') ?  chartDivID : 'chart-container';

            getJsonFile( parseJsonFileObj );
        },
        onPackageSelectionChange: onPackageSelectionChange
    };
}());
