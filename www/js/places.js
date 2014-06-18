	var map; 
	var myLatlng; 
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
			
		function addMarker(data,map) {
					console.log(data.lat);
			placeLatlng = new google.maps.LatLng(data.lat, data.long);
			var marker = new google.maps.Marker({ 
				position: placeLatlng, 
				map: map, 
				title: data.title,
				icon: '../img/markers/'+data.catid+'.png'				
			});
			var infowindow = new InfoBubble({
				  content : '<div class="dmk2maps_bubble_image"><img src="http://miflamencoplace.com/media/k2/items/cache/9415f9bcd76598f9c08127db1641b596_S.jpg"></div><a class="dmk2maps_bubble_title" href="http://miflamencoplace.com/index.php?option=com_k2&amp;view=item&amp;id=63:pila-del-pato-by-eusebia-lopez">Pila del Pato </a><span class="dmk2maps_bubble_author"> by Eusebia López</span><img onclick="document.location.href=\'/index.php?option=com_k2&amp;view=item&amp;id=63:pila-del-pato-by-eusebia-lopez\';" class="dmk2maps_bubble_arrow" src="http://miflamencoplace.com/images/arrow7.png">',
				  shadowStyle: 0,
				  padding: 0,
				  backgroundColor: 'rgba(0,0,0,0.8)',
				  borderRadius: 400,
				  borderWidth: 6,
				  borderColor: '#fff',
				  minWidth: 390,
				  minHeight: 390,
				  maxWidth: 390,
				  maxHeight: 390,
				  disableAutoPan: false,
				  hideCloseButton: false,
				  backgroundClassName: 'phoney',
				  arrowSize: 5,
				  arrowPosition: 10,
				  arrowStyle: 3
				});		
			new google.maps.event.addListener(marker, "click", function(){infowindow.open(map,marker);});	
		}
	}