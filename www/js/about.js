/**
 * @preserve Mi Flamenco Place.
 *
 * @version 1.8.2
 * @copyright Novalmedia Diseño y Comunicacion [All Rights *Reserved]
 * @author Jose Antonio Troitiño
 *
 */
 
$(function() {
	if (navigator.onLine){
		jQuery.get( "http://miflamencoplace.com/rpc/get_about.php?callback=jsonp1122334455", function( data ) {
			jQuery('#colab').html(data);
		});
	}
});
