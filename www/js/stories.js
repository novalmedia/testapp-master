$(function() {
	dbShell = window.openDatabase("miflamenkoplace", 1, "miflamenkoplace", 1000000);
	dbShell.transaction(function(tx) {
				tx.executeSql("SELECT data FROM routes",[],renderEntries,dbErrorHandler);
		}, dbErrorHandler);
	
});

function renderEntries(tx,results){

	if (results.rows.length == 0) {
		jQuery.getJSON( "http://miflamencoplace.com/rpc/get_routes.php?callback=jsonp1122334455", function( data ) {
			jQuery.each( data, function( key, val ) {
				addRoute(val);
				saveRoute(val);
			});
		});
	} else {
		for(var i=0; i<results.rows.length; i++) {
			data = JSON.parse(results.rows.item(i).data);
			addRoute(data);

		}
	}
}

function addRoute(val){
	var path = val.img64;
	$('<div class="route">'
		+'<a href="route.html?itemid='+val.id+'">'
		+'<img src="'+ path +'" />'
		+'<div class="routedata">'
		+'<span class="title">'+val.title+'</span>'
		+'<span class="subtitle">'+val.subtitle+'</span>'
		+'<span class="linkroute">Ver ruta</span>'
		+'</div></a></div>')
		.appendTo('#routelist');
    
}

function dbErrorHandler(err){
		alert("DB Error: "+err.message + "\nCode="+err.code);
	}
	
function saveRoute(data) {

	var itemid = data.id;
	var jsonData = JSON.stringify(data);
	dbShell.transaction(function(tx) {
		tx.executeSql("INSERT OR REPLACE INTO routes(itemid,data) values(?,?)",[itemid,jsonData]);
	}, dbErrorHandler);
	
}