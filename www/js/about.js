$(function() {
	if (navigator.onLine){
		jQuery.get( "http://miflamencoplace.com/rpc/get_about.php?callback=jsonp1122334455", function( data ) {
			jQuery('#colab').html(data);
		});
	}
});
