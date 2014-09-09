/**
 * @preserve Mi Flamenco Place.
 *
 * @version 1.8.2
 * @copyright Novalmedia Diseño y Comunicacion [All Rights *Reserved]
 * @author Jose Antonio Troitiño
 *
 */
 
$(function() {
	if (checkConnection()){
		jQuery.get( "http://miflamencoplace.com/rpc/get_about.php?callback=jsonp1122334455", function( data ) {
			jQuery('#colab').html(data);
		});
	}
});
function checkConnection() {
		var x = new XMLHttpRequest,
			s;
		x.open(
			"HEAD",
			"http://miflamencoplace.com/rpc/check.php?rand=" + Math.random(),
			false
		);
		try {
			x.send();
			s = x.status;
			return ( s >= 200 && s < 300 || s === 304 );
		} catch (e) {
			return false;
		}
    }