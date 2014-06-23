	var map; 
	var myLatlng; 
	var markersArray = [];
	function initMap() {
		myLatlng = new google.maps.LatLng(37.392864, -5.990077); 
			var mapOptions = { 
				zoom: 14, 
				disableDefaultUI: true,
				center: myLatlng 
			}; 
			map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions); 
			
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
			map.mapTypes.set("map_style",styledMap);
			map.setMapTypeId("map_style");
			
			jQuery.getJSON( "http://miflamencoplace.com/rpc/get_places.php?callback=jsonp1122334455", function( data ) {
				  jQuery.each( data, function( key, val ) {
					addMarker(val,map);
				  });
				});
	}			
		function addMarker(data,map) {
			placeLatlng = new google.maps.LatLng(data.lat, data.long);
			var marker = new google.maps.Marker({ 
				position: placeLatlng, 
				map: map, 
				title: data.title,
				icon: '../img/markers/'+data.catid+'.png'				
			});
			markersArray.push(marker);
			var infowindow = new InfoBubble({
				  content : '<div class="dmk2maps_bubble_image"><img src="http://miflamencoplace.com/media/k2/items/cache/'+data.img+'"></div><a class="dmk2maps_bubble_title" href="profile.html?itemid='+data.id+'">'+data.title+'</a><span class="dmk2maps_bubble_author"> by '+data.personname+'</span><img onclick="document.location.href=\'profile.html?itemid='+data.id+'\';" class="dmk2maps_bubble_arrow" src="http://miflamencoplace.com/images/arrow'+data.catid+'.png">',
				  shadowStyle: 0,
				  padding: 0,
				  backgroundColor: 'rgba(0,0,0,0.8)',
				  borderRadius: 300,
				  borderWidth: 6,
				  borderColor: '#fff',
				  minWidth: 290,
				  minHeight: 290,
				  maxWidth: 290,
				  maxHeight: 290,
				  disableAutoPan: false,
				  hideCloseButton: false,
				  backgroundClassName: 'phoney',
				  arrowSize: 5,
				  arrowPosition: 10,
				  arrowStyle: 3
				});		
			new google.maps.event.addListener(marker, "click", function(){infowindow.open(map,marker);});	
		}

	
	
	function filterMarkers(catid){
		while(markersArray.length) { markersArray.pop().setMap(null); }
		if (!catid || catid == 'all'){
			jQuery.getJSON( "http://miflamencoplace.com/rpc/get_places.php", function( data ) {
			  jQuery.each( data, function( key, val ) {
				addMarker(val,map);
			  });
			});
		} else {
			jQuery.getJSON( "http://miflamencoplace.com/rpc/get_places.php?catid="+catid, function( data ) {
			  jQuery.each( data, function( key, val ) {
				addMarker(val,map);
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
	
	
	var onSuccess = function(position) {
    alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');
};

// onError Callback receives a PositionError object
//
function onError(error) {
    alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}
function getUserPosition(){
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
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

