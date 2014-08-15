	var map; 
	var myLatlng; 
	var userPosition;
	var selectedDistance;
	var markersArray = [];
	function initMap() {
	
		var viewportHeight = $(window).height();
		var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var menuH = (viewportWidth > 1024)?465:166;
			 $('#map-canvas').height(viewportHeight-menuH);
			 $('#app').height(viewportHeight);
			 $('#menu').css('min-height',(viewportHeight-menuH+16)+'px');
		var mapZoom = (viewportWidth > 1024)?15:14;
		myLatlng = new google.maps.LatLng(37.392864, -5.990077); 
			var mapOptions = { 
				zoom: mapZoom, 
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
			
			filterMarkers('all', true);
	}			
	function addMarker(data,map) {
		var vpw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var sfx = (vpw > 1024)?'hd':'';
		placeLatlng = new google.maps.LatLng(data.lat, data.long);
		var marker = new google.maps.Marker({ 
			position: placeLatlng, 
			map: map, 
			title: data.title,
			icon: '../img/markers/'+sfx+data.catid+'.png'				
		});
		markersArray.push(marker);
		  var bubw = 200;
		  if (parseInt(vpw) > 400) bubw = 300;
		  if (parseInt(vpw) > 1024) bubw = 800;
		var infowindow = new InfoBubble({
			  content : '<div class="dmk2maps_bubble_image"><img src="http://miflamencoplace.com/media/k2/items/cache/'+data.img+'"></div><a class="dmk2maps_bubble_title" href="profile.html?itemid='+data.id+'">'+data.title+'</a><span class="dmk2maps_bubble_author"> by '+data.personname+'</span><img onclick="document.location.href=\'profile.html?itemid='+data.id+'\';" class="dmk2maps_bubble_arrow" src="http://miflamencoplace.com/images/arrow'+data.catid+'.png">',
			  shadowStyle: 0,
			  padding: 0,
			  backgroundColor: 'rgba(0,0,0,0.8)',
			  borderRadius: Math.floor(bubw+(bubw/3)),
			  borderWidth: 6,
			  borderColor: '#fff',
			  minWidth: bubw,
			  minHeight: bubw,
			  maxWidth: bubw,
			  maxHeight: bubw,
			  disableAutoPan: false,
			  hideCloseButton: false,
			  backgroundClassName: 'phoney',
			  arrowSize: 5,
			  arrowPosition: 10,
			  arrowStyle: 3
			});		
		new google.maps.event.addListener(marker, "click", function(){infowindow.open(map,marker);});	
	}

	
	function addMarkerByDistance(data,map,distance) {
	
		var vpw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var sfx = (vpw > 1024)?'hd':'';
		var placeLatlng = new google.maps.LatLng(data.lat, data.long);
		
		
		
/* 		alert(userPosition.coords.latitude);
		alert(userPosition.coords.longitude); */

		
		var userLatLng = new google.maps.LatLng(userPosition.coords.latitude, userPosition.coords.longitude);
		var markerDistance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, placeLatlng);
		
		//alert(markerDistance + ' -- ' + distance);
		if (markerDistance < distance) {
			var marker = new google.maps.Marker({ 
				position: placeLatlng, 
				map: map, 
				title: data.title,
				icon: '../img/markers/'+sfx+data.catid+'.png'				
			});
			markersArray.push(marker);
			  var bubw = 200;
			  if (parseInt(vpw) > 400) bubw = 300;
			  if (parseInt(vpw) > 1024) bubw = 800;
			var infowindow = new InfoBubble({
				  content : '<div class="dmk2maps_bubble_image"><img src="http://miflamencoplace.com/media/k2/items/cache/'+data.img+'"></div><a class="dmk2maps_bubble_title" href="profile.html?itemid='+data.id+'">'+data.title+'</a><span class="dmk2maps_bubble_author"> by '+data.personname+'</span><img onclick="document.location.href=\'profile.html?itemid='+data.id+'\';" class="dmk2maps_bubble_arrow" src="http://miflamencoplace.com/images/arrow'+data.catid+'.png">',
				  shadowStyle: 0,
				  padding: 0,
				  backgroundColor: 'rgba(0,0,0,0.8)',
				  borderRadius: Math.floor(bubw+(bubw/3)),
				  borderWidth: 6,
				  borderColor: '#fff',
				  minWidth: bubw,
				  minHeight: bubw,
				  maxWidth: bubw,
				  maxHeight: bubw,
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
	
	
	function filterMarkers(catid, load){
		while(markersArray.length) { markersArray.pop().setMap(null); }
		if (!catid || catid == 'all'){
			dbShell = window.openDatabase("miflamenkoplace", 1, "miflamenkoplace", 1000000);
			dbShell.transaction(setupTable,dbErrorHandler,getEntries);
		} else {
			getEntries(catid);
		}
		toggleFilter(load);
	}
	
	function toggleFilter(load){
		if (!load) {
			if (jQuery('#filter').hasClass('open')) {
				jQuery('#filteropts').slideUp('fast');
				jQuery('#filter').removeClass('open');	
			} else {
				jQuery('#filteropts').slideDown();
				jQuery('#filter').addClass('open');	
			}
		}
		return false;
	}
	
	
	function onGEOSuccess(position) {
		getEntriesByDistance(selectedDistance);
		userPosition = position;
		/*  alert(
			'Latitude: '          + position.coords.latitude          + '\n' +
			'Longitude: '         + position.coords.longitude         + '\n' +
			'Altitude: '          + position.coords.altitude          + '\n' +
			'Accuracy: '          + position.coords.accuracy          + '\n' +
			'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
			'Heading: '           + position.coords.heading           + '\n' +
			'Speed: '             + position.coords.speed             + '\n' +
			'Timestamp: '         + position.timestamp                + '\n'
		);   */
	};
	function onGEOError(position) {
		//var userPosition = position;
		alert('Error geolocalizacion');
	};
	
	function getAroundMe(distance){
		//alert(distance);
		while(markersArray.length) { markersArray.pop().setMap(null); }
		selectedDistance = distance;
		navigator.geolocation.getCurrentPosition(onGEOSuccess, onGEOError);
		jQuery('#aroundmenu').removeClass('open');
	}
	function alertDismissed(){}
	// onError Callback receives a PositionError object
	//
	function onError(error) {
		alert('code: '    + error.code    + '\n' +
			  'message: ' + error.message + '\n');
	}
/* 	function getUserPosition(){
		navigator.geolocation.getCurrentPosition(onSuccess, onError);
	} */


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


	// DB Actions

	function setupTable(tx){

	 	/* tx.executeSql("DROP TABLE places");
		tx.executeSql("DROP TABLE people");
		tx.executeSql("DROP TABLE profiles"); */
		tx.executeSql("CREATE TABLE IF NOT EXISTS places(id INTEGER PRIMARY KEY,catid INTEGER,data)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS people(id INTEGER PRIMARY KEY,catid INTEGER,data)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS profiles(id INTEGER PRIMARY KEY,itemid INTEGER,data)");
	}

	function dbErrorHandler(err){
		alert("DB Error: "+err.message + "\nCode="+err.code);
	}

	function getEntries(catid) {
		dbShell.transaction(function(tx) {
			if (!catid)
				tx.executeSql("SELECT data FROM places",[],renderEntries,dbErrorHandler);
			else 
				tx.executeSql("SELECT data FROM places WHERE catid = ?",[ catid ],renderEntries,dbErrorHandler);
		}, dbErrorHandler);
	}
	
	function getEntriesByDistance(distance, catid) {
		dbShell.transaction(function(tx) {
			if (!catid)
				tx.executeSql("SELECT ? as distance, data FROM places",[distance],renderEntriesByDistance,dbErrorHandler);
			else 
				tx.executeSql("SELECT ? as distance, data FROM places WHERE catid = ?",[ distance,catid ],renderEntriesByDistance,dbErrorHandler);
		}, dbErrorHandler);
	}

	function renderEntries(tx,results){
	//		console.log(results);
		if (results.rows.length == 0) {
			jQuery.getJSON( "http://miflamencoplace.com/rpc/get_places.php", function( data ) {
			  jQuery.each( data, function( key, val ) {
				addMarker(val,map);
				savePlace(val);
			  });
			});
		} else {
			for(var i=0; i<results.rows.length; i++) {
				data = JSON.parse(results.rows.item(i).data);
			//console.log(data);
				addMarker(data,map);
			}
		}
	}
	
	function renderEntriesByDistance(tx,results){
	//		console.log(results);
		
		//alert(results.rows.length);
		
		for(var i=0; i<results.rows.length; i++) {
			data = JSON.parse(results.rows.item(i).data);
			distance = results.rows.item(i).distance;
		//console.log(data);
		
			addMarkerByDistance(data,map,distance);
		}

	}

	function savePlace(data) {
		var catid = data.catid;
		var itemid = data.id;
		var jsonData = JSON.stringify(data);
		dbShell.transaction(function(tx) {
			tx.executeSql("INSERT INTO places(catid,data) values(?,?)",[catid,jsonData]);
		}, dbErrorHandler);
		jQuery.getJSON( "http://miflamencoplace.com/rpc/get_profile.php?itemid="+itemid, function( profileData ) {
			var jsonProfileData = JSON.stringify(profileData);
			dbShell.transaction(function(tx) {
				tx.executeSql("INSERT INTO profiles(itemid,data) values(?,?)",[itemid,jsonProfileData]);
			}, dbErrorHandler);
		});
	}