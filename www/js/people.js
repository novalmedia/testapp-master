$(function() {
	startLoading();
	dbShell = window.openDatabase("miflamenkoplace", 1, "miflamenkoplace", 1000000);
	dbShell.transaction(function(tx) {
				tx.executeSql("SELECT data FROM people",[],renderEntries,dbErrorHandler);
		}, dbErrorHandler);

});
function renderEntries(tx,results){

	if (results.rows.length == 0) {
		jQuery.getJSON( "http://miflamencoplace.com/rpc/get_people.php?callback=jsonp1122334455", function( data ) {
			jQuery.each( data, function( key, val ) {
				addThumb(val);
				saveThumb(val);
			});
			endLoading();
		});	
	} else {
		for(var i=0; i<results.rows.length; i++) {
			data = JSON.parse(results.rows.item(i).data);
			addThumb(data);
		}
		endLoading();
	}
}
	

function addThumb(val){
	var path = val.img64;
	var elm = $('<img src="'+ path +'">').load(function() {
		  $(this).appendTo('#mosaic').wrap( "<a href='profile.html?itemid="+val.placeid+"&tab=person'></a>" );
    });

}

	function filterMarkers(catid){
		$('#mosaic').empty();
		if (!catid || catid == 'all'){
			jQuery.getJSON( "http://miflamencoplace.com/rpc/get_people.php", function( data ) {
			  jQuery.each( data, function( key, val ) {
				addThumb(val);
			  });
			});
		} else {
			jQuery.getJSON( "http://miflamencoplace.com/rpc/get_people.php?catid="+catid, function( data ) {
			  jQuery.each( data, function( key, val ) {
				addThumb(val);
			  });
			});
		}
		toggleFilter();
	}
	
	function toggleFilter(){
		if (jQuery('#filter').hasClass('open')) {
			jQuery('#filteropts').slideUp('fast');
			jQuery('#filter').removeClass('open');	
		} else {
			jQuery('#filteropts').slideDown();
			jQuery('#filter').addClass('open');	
		}
		return false;
	}
	
	function dbErrorHandler(err){
		alert("DB Error: "+err.message + "\nCode="+err.code);
	}
	
	function saveThumb(data) {

		var catid = data.catid;
		var itemid = data.id;
		var jsonData = JSON.stringify(data);
		dbShell.transaction(function(tx) {
			tx.executeSql("INSERT OR REPLACE INTO people(catid,itemid,data) values(?,?,?)",[catid,itemid,jsonData]);
		}, dbErrorHandler);
		
	}
	
	
	function startLoading(){
		$('body').append('<div id="bigloading"><p>CARGANDO DATOS<br>LOADING DATA</p></div>');
	}
	function endLoading(){
		$('#bigloading').remove();
	}
	