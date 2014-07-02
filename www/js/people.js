$(function() {

	jQuery.getJSON( "http://miflamencoplace.com/rpc/get_people.php?callback=jsonp1122334455", function( data ) {
	
			jQuery.each( data, function( key, val ) {
				addThumb(val);
			});
	
		});	

	
});

function addThumb(val){
	var path = val.img;
	var elm = $('<img src="'+ path +'">').load(function() {
		  $(this).appendTo('#mosaic').wrap( "<a href='profile.html?itemid="+val.placeid+"'></a>" );
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
	