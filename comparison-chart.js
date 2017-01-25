var comparisonChart = (function() {
    var jsonUrl = '/package-data.json';
    var chartDivID = 'chart-container';
    var config = {};
    var data = {};

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
            config = obj.config;
            data = obj.packages;

            console.log(data); // debug
            createInitialTable();
        } else {
            console.log('error parsing JSON data. Stopping.');
        }
    };

    var createInitialTable = function() {
        var mainTable = document.createElement('table');

        // Create the Table Head
        var thead = document.createElement('thead');
        var theadRow = document.createElement('tr');

        // Create the Table Body
        var tbody = document.createElement('tbody');

        // Attach the new elements to the document
        thead.appendChild(theadRow);
        mainTable.appendChild(thead);
        mainTable.appendChild(tbody);
        document.getElementById(chartDivID).appendChild(mainTable);
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
