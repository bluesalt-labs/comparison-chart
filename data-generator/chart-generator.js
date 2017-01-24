window.chartGenerator = (function() {
	function chartGenerator(containerID) {
		
	}
}());

var chartGenerator = function(containerID) {
	this.containerID = (typeof containerID !== 'undefined') ?  containerID : 'gen-container';
	this.tableID = 'main-gen-table';
	this.edited = false;
	this.data = {};
	
	
	this.init = function() {
		this.data.config = {};
		this.createInitialTable();

		//console.log(this.data); // debug
	};
	
	this.createInitialTable = function() {
		// Create the initial header
		var table = document.createElement('table');
		table.id = this.tableID;

		// Create table header and body elements
		var thead = document.createElement('thead');
		var tbody = document.createElement('tbody');
		
		// Create initial header row/column and attach
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		
		tr.id = 'row-head';
		tr.appendChild(td);
		thead.appendChild(tr);
		
		// Build the initial table and attach it to the body,
		table.appendChild(thead);
		table.appendChild(tbody);
		document.getElementById(this.containerID).appendChild(table);
		
		// Then create the initial package header and feature add rows
		this.addPackage.bind(this);
		this.addPackageItem.bind(this);
	}
	
	
	this.outputDataAsFile = function(formatted) {
		var dataString = '';
		
		if(formatted) { dataString = JSON.stringify(this.data, undefined, 2); }
		else { dataString = JSON.stringify(this.data); }
		
		//var link = document.getElementById('dl-link');
		var link = document.createElement('a');
		link.download = 'data.json';
		link.target = '_blank'; // may or may not be needed?
		
		var blob = new Blob([dataString], {type: 'text/plain'});
		link.href = window.URL.createObjectURL(blob);
		link.click();		
	};
	
	
	this.addPackage = function(thisObj) {
		
		console.log(this);
		
		/*
		var headTD = document.createElement('td');

//		if(isInitial) {
		if(thisObj) {
			headTD.id = 'col-head-0';
			headTD.className = 'add-package';
			
			var addBtn = document.createElement('button');
			console.log(thisObj);
//			var onClickFunct = .bind(this);
			addBtn.onClick = function() {
				
			};

			
			
			headTD.appendChild(addBtn);
			
			document.getElementById(this.tableID).querySelector('#row-head').appendChild(headTD);
		} else {
			this.edited = true;
	
			//this.data[(_.size(this.data) - 1)] = {};
		}

		
		*/
		
	};
	
	
	this.addPackageItem = function(isInitial) {
		if(isInitial) {
			
		} else {
			this.edited = true;
			
		}
		
		
		
	};
	
	
	
	this.init();
};