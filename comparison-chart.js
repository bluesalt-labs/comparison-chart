var comparisonChart = function(jsonUrl, chartDivID) {
	this.jsonUrl	= jsonUrl;
	this.chartDivID	= (typeof chartDivID !== 'undefined') ?  chartDivID : 'chart-container';
	this.data		= {};
	this.config		= {};
	
	
	this.init = function() {
		this.getJsonFile( this.parseJsonFileObj.bind(this) );
	};
	
	
	this.getJsonFile = function(callback) {
	    var xhr = new XMLHttpRequest();
	    xhr.open('GET', this.jsonUrl, true);
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
	    }

		xhr.send();
	};
	
	
	this.parseJsonFileObj = function(obj) {
		if(obj !== '' && "config" in obj) {
			this.config = obj.config;
			delete obj.config;
			this.data = obj;	
			
			this.createInitialTable();			
		} else {
			console.log('error parsing JSON data. Stopping.');
		}
	};
	
	
	this.createInitialTable = function() {
		var mainTable = document.createElement('table');
		
		// Create the Table Head
		var thead = document.createElement('thead');
		var theadRow = document.createElement('tr');
		
		// Create the Table Body
		var tbody = document.createElement('tbody');
		

		// Attach the new elements to the document
		mainTable.appendChild(thead);
		mainTable.appendChild(tbody);
		document.getElementById(this.chartDivID).appendChild(mainTable);
	};
	
	
	this.onPackageSelectionChange = function() {
		
	};
	
	
	this.init();
};
