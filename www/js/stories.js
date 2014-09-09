/**
 * @preserve Mi Flamenco Place.
 *
 * @version 1.8.2
 * @copyright Novalmedia Diseño y Comunicacion [All Rights *Reserved]
 * @author Jose Antonio Troitiño
 *
 */

$(function() {
	dbShell = window.openDatabase("miflamenkoplacev2", 1, "miflamenkoplacev2", 50000000);
	dbShell.transaction(function(tx) {
		tx.executeSql("CREATE TABLE IF NOT EXISTS routes(id INTEGER PRIMARY KEY,itemid INTEGER UNIQUE,data)");
	}, dbErrorHandler);
	if (navigator.onLine){
		jQuery.getJSON( "http://miflamencoplace.com/rpc/get_routes.php?callback=jsonp1122334455", function( data ) {
			jQuery.each( data, function( key, val ) {
				addRoute(val);
				saveRoute(val);
			});
		});
	} else {
		
		dbShell.transaction(function(tx) {
					tx.executeSql("SELECT data FROM routes",[],renderEntries,dbErrorHandler);
		}, dbErrorHandler);
	}
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
		+'<span class="subtitle es">'+val.subtitlees+'</span>'
		+'<span class="subtitle en">'+val.subtitleen+'</span>'
		+'<span class="linkroute es">Ver ruta</span>'
		+'<span class="linkroute en">View route</span>'
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