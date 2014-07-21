	var map; 
	var myLatlng; 
	function initProfile() {
		updateMedia();
		var styles = [
							{
								"elementType": "labels.icon",
								"stylers": [
								  { "visibility": "off" }
								]
							  },
							{
								"elementType": "geometry.stroke",
								"stylers": [
								  { "color": "#343434" }
								]
							  },
							{
								"elementType": "geometry.fill",
								"stylers": [
								  { "color": "#232323" }
								]
							  },
							  {
								"featureType": "landscape",
								"elementType": "geometry.fill",
								"stylers": [
								  { "color": "#232323" }
								]
							  },{
								"featureType": "road.local",
								"elementType": "geometry.stroke",
								"stylers": [
								  { "color": "#313131" }
								]
							  },{
								"featureType": "road.local",
								"elementType": "geometry.fill",
								"stylers": [
								  { "color": "#313131" }
								]
							  },{
								"featureType": "road.arterial",
								"elementType": "geometry.fill",
								"stylers": [
								  { "color": "#121212" }
								]
							  },{
								"featureType": "road.arterial",
								"elementType": "geometry.stroke",
								"stylers": [
								  { "color": "#121212" }
								]
							  },{
								"featureType": "water",
								"elementType": "geometry.fill",
								"stylers": [
								  { "color": "#292929" }
								]
							  },{
								"featureType": "poi",
								"stylers": [
								  { "visibility": "off" }
								]
							  },{
								"featureType": "transit",
								"stylers": [
								  { "visibility": "off" }
								]
							  },{
								"featureType": "road.local",
								"elementType": "labels.text",
								"stylers": [
								  { "visibility": "off" }
								]
							  },{
								"featureType": "road.highway",
								"elementType": "geometry.fill",
								"stylers": [
								  { "color": "#565656" }
								]
							  },{
								"featureType": "road.highway",
								"elementType": "labels",
								"stylers": [
								  { "visibility": "off" }
								]
							  },{
								"featureType": "road.highway",
								"elementType": "geometry",
								"stylers": [
								  { "color": "#565656" }
								]
							  },{
								
								"elementType": "labels.text.stroke",
								"stylers": [
								  { "color": "#111111" }
								]
							  },{
								"featureType": "administrative",
								"elementType": "labels.text.stroke",
								"stylers": [
								  { "color": "#333333" }
								]
							  },{
								"featureType": "administrative",
								"elementType": "labels.text.fill",
								"stylers": [
								  { "color": "#808080" }
								]
							  },
							  {
								"featureType": "landscape.man_made",
								"stylers": [
								  { "visibility": "off" }
								]
							  }
							];
			var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
			
			var itemid = jQuery.getQuery('itemid');
			jQuery.getJSON( "http://miflamencoplace.com/rpc/get_route.php?itemid="+itemid, function( data ) {
				fillProfile(data,styledMap);
				
				
				
					  
			});
	}			
		
	
	function fillProfile(data,styledMap){
		
		$('#route .title').html(data.title);
		$('#route .subtitle').html(data.subtitle);
		$('#route .routeimg img').attr('src',data.img);
		$('#route .introtext').html(data.introtext);
		
		
		center = new google.maps.LatLng(37.392864, -5.990077); 
		var mapOptions = { 
					zoom: 14, 
					disableDefaultUI: true,
					center: center,
					scrollwheel: false,
					draggable: false
				}; 
		map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions); 
		map.mapTypes.set("map_style",styledMap);
		map.setMapTypeId("map_style");
		var placeLatlng = [];
		var bounds = new google.maps.LatLngBounds();
		for (i=0;i<data.routeitems.length;i++){
				item = data.routeitems[i];
				if (item.audioes != '')
					$("#playlistes").append('<option value="http://miflamencoplace.com/media/k2/attachments/'+item.audioes+'">'+item.audioes+'</option>');
				
				if (item.audioen != '')
					$("#playlisten").append('<option value="http://miflamencoplace.com/media/k2/attachments/'+item.audioen+'">'+item.audioen+'</option>');
				
				placeLatlng[i] = new google.maps.LatLng(item.lat, item.long); 
				
				var marker = new google.maps.Marker({ 
					position: placeLatlng[i], 
					map: map, 
					icon: '../img/markers/'+item.catid+'.png'				
				});
				bounds.extend(placeLatlng[i]);
				map.fitBounds(bounds);
		}
	}
	
	
(function($){
    $.getQuery = function( query ) {
        query = query.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
        var expr = "[\\?&]"+query+"=([^&#]*)";
        var regex = new RegExp( expr );
        var results = regex.exec( window.location.href );
        if( results !== null ) {
            return results[1];
            return decodeURIComponent(results[1].replace(/\+/g, " "));
        } else {
            return false;
        }
    };
})(jQuery);



var myMedia = null;
var playing = false;

function playAudio() {
	if (!playing) {
		myMedia.play();	
		document.getElementById('play').src = "images/pause.png";
		playing = true;	
	} else {
		myMedia.pause();
		document.getElementById('play').src = "images/play.png";    
		playing = false; 
	}
}

function stopAudio() {
	myMedia.stop();
	playing = false;
	document.getElementById('play').src = "images/play.png";    
	document.getElementById('audio_position').innerHTML = "0.000 sec";
}




function updateMedia(src) {
	// Clean up old file
	if (myMedia != null) {
		myMedia.release();
	}
	
	// Get the new media file
	var yourSelect = document.getElementById('playlist');		
			myMedia = new Media(yourSelect.options[yourSelect.selectedIndex].value, stopAudio, null);

	// Update media position every second
		var mediaTimer = setInterval(function() {
		// get media position
		myMedia.getCurrentPosition(
			// success callback
			function(position) {
				if (position > -1) {
					document.getElementById('audio_position').innerHTML = (position/1000) + " sec";
				}
			},
			// error callback
			function(e) {
				console.log("Error getting pos=" + e);
			}
		);
	}, 1000);
}

function setAudioPosition(position) {
   document.getElementById('audio_position').innerHTML =position;
}
