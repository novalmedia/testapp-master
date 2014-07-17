$(function() {

	jQuery.getJSON( "http://miflamencoplace.com/rpc/get_routes.php?callback=jsonp1122334455", function( data ) {
	
			jQuery.each( data, function( key, val ) {
				addRoute(val);
			});
	
		});	

	
});

function addRoute(val){
	var path = val.img;
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