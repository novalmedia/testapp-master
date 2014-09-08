	var map; 
	var myLatlng; 
	var userPosition;
	var selectedDistance;
	var markersArray = [];
	var isUpdateNeeded = 0;
	
	var vpw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	var bubw = 200;
	if (parseInt(vpw) > 400) bubw = 300;
	if (parseInt(vpw) > 1024) bubw = 600;
	var infowindow = new InfoBubble({
	  shadowStyle: 0,
	  padding: 0,
	  backgroundColor: 'rgba(0,0,0,0.8)',
	  borderRadius: Math.floor(bubw+(bubw/3)),
	  borderWidth: 2,
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
	
	function initMap() {

		var viewportHeight = $(window).height();
		var viewportWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var menuH = (viewportWidth > 1024)?465:((viewportWidth < 400)?127:166);
			 $('#map-canvas').height(viewportHeight-menuH);
			 $('#app').height(viewportHeight);
			 $('#menu').css('min-height',(viewportHeight-menuH+16)+'px');
		var mapZoom = (viewportWidth > 1024)?15:14;
		
			if (navigator.onLine) {
				myLatlng = new google.maps.LatLng(37.392864, -5.990077); 
				var mapOptions = { 
					zoom: mapZoom, 
					disableDefaultUI: true,
					draggable: true,
					center: myLatlng 
				}; 
				map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions); 
			}
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
								"featureType": "road.local",
								"elementType": "labels.text.fill",
								"stylers": [
								  { "color": "#808080" }
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
								"featureType": "road.highway",
								"elementType": "geometry.fill",
								"stylers": [
								  { "color": "#565656" }
								]
							  },{
								"featureType": "road.highway",
								"elementType": "geometry",
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
							  },{
								
								"elementType": "labels.text.stroke",
								"stylers": [
								  { "color": "#111111" }
								]
							  },{
								
								"elementType": "labels.text.fill",
								"stylers": [
								  { "color": "#aaaaaa" }
								]
							  }
							];
			if (navigator.onLine) {
				var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
				map.mapTypes.set("map_style",styledMap);
				map.setMapTypeId("map_style");
			}	
			startLoading();	
			filterMarkers('all', true);
	}	


	
	function addMarker(data,map) {
			var sfx = (vpw > 1024)?'hd':((vpw < 400)?'l':'');
		if (navigator.onLine){
			placeLatlng = new google.maps.LatLng(data.lat, data.long);
			var marker = new google.maps.Marker({ 
				position: placeLatlng, 
				map: map, 
				title: data.title,
				icon: '../img/markers/'+sfx+data.catid+'.png'				
			});
			markersArray.push(marker);
			 
			new google.maps.event.addListener(marker, "click", function(){
				infowindow.close();
				infowindow.setContent('<div class="dmk2maps_bubble_image" onclick="document.location.href=\'profile.html?itemid='+data.id+'\';"><img src="http://miflamencoplace.com/media/k2/items/cache/'+data.img+'"></div><a class="dmk2maps_bubble_title" href="profile.html?itemid='+data.id+'">'+data.title+'</a><span class="dmk2maps_bubble_author"> by '+data.personname+'</span><img onclick="document.location.href=\'profile.html?itemid='+data.id+'\';" class="dmk2maps_bubble_arrow" src="http://miflamencoplace.com/images/arrow'+data.catid+'.png">');
				infowindow.open(map,marker);
			});	
			$('#map-canvas-list-hidden').append('<div class="'+data.title.replace(/\s/g,"-").toLowerCase()+' placeEntry cat'+data.catid+'" onclick="document.location.href=\'profile.html?itemid='+data.id+'\';"><div class="img" style="background-image:url(\''+data.img64+'\');"></div><h3>'+data.title+'</h3><h4>By '+data.personname+'</h4></div>');
		} else {
			$('#map-canvas-list-hidden').append('<div class="'+data.title.replace(/\s/g,"-").toLowerCase()+' placeEntry cat'+data.catid+'" onclick="document.location.href=\'profile.html?itemid='+data.id+'\';"><div class="img" style="background-image:url(\''+data.img64+'\');"></div><h3>'+data.title+'</h3><h4>By '+data.personname+'</h4></div>');
		}
	}

	function orderList()
	{
		var elem = jQuery('#map-canvas-list-hidden .placeEntry').each(function(){
			item1 = this;
			flag = false;
			$('#map-canvas-list .placeEntry').each(function(){
				item2 = this;
				if (jQuery(item1).attr('class') < jQuery(item2).attr('class')){
					jQuery(item1).insertBefore(jQuery(item2));
					flag = true;
					return false;
				}
			})
			if (!flag){
				$('#map-canvas-list').append(jQuery(item1));
			}
		});
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
				shadowStyle: 0,padding: 0,backgroundColor: 'rgba(0,0,0,0.8)',borderRadius: Math.floor(bubw+(bubw/3)),borderWidth: 6,
				borderColor: '#fff',minWidth: bubw,minHeight: bubw,maxWidth: bubw,maxHeight: bubw,disableAutoPan: false,
				hideCloseButton: false,backgroundClassName: 'phoney',arrowSize: 5,arrowPosition: 10,arrowStyle: 3
			});		
			new google.maps.event.addListener(marker, "click", function(){infowindow.open(map,marker);});	
		}
	}
	
	
	function filterMarkers(catid, load){
		while(markersArray.length) { markersArray.pop().setMap(null); }
		if (!catid || catid == 'all'){
			dbShell = window.openDatabase("miflamenkoplace", 1, "miflamenkoplace", 50000000);

			dbShell.transaction(setupTable,dbErrorHandler,checkUpdateNeeded);
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
		modales('Error geolocalizacion');
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
		/* alert('code: '    + error.code    + '\n' +
			  'message: ' + error.message + '\n'); */
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

	  	/* 
		tx.executeSql("DROP TABLE places");
		tx.executeSql("DROP TABLE people");
		tx.executeSql("DROP TABLE profiles");  
		tx.executeSql("DROP TABLE config");
		*/
		tx.executeSql("CREATE TABLE IF NOT EXISTS config(id INTEGER PRIMARY KEY,name UNIQUE,value)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS places(id INTEGER PRIMARY KEY,catid INTEGER,itemid INTEGER UNIQUE,data)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS people(id INTEGER PRIMARY KEY,catid INTEGER,itemid INTEGER UNIQUE,data)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS profiles(id INTEGER PRIMARY KEY,itemid INTEGER UNIQUE,data)");
		tx.executeSql("CREATE TABLE IF NOT EXISTS routes(id INTEGER PRIMARY KEY,itemid INTEGER UNIQUE,data)");
	}

	function dbErrorHandler(err){
		//alert("DB Error: "+err.message + "\nCode="+err.code);
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
			//console.log(results);
		jQuery('.placeEntry').remove();
		
		if (!navigator.onLine){
			jQuery('#map-canvas').hide();
			jQuery('#map-canvas-list').show();
			jQuery('a.switch').remove();
			jQuery('a.showfilters').removeClass('showfilters');
		}
		
		if (results.rows.length == 0) {
			
			jQuery.getJSON( "http://miflamencoplace.com/rpc/get_places.php", function( data ) {
			  
			  dbShell.transaction(function(tx) {
			  	tx.executeSql("INSERT OR REPLACE INTO config(name,value) values('lastupdateplaces',?)",[Date.now()]);
			  }, dbErrorHandler);
			  jQuery.each( data, function( key, val ) {
				addMarker(val,map);
				savePlace(val);
			  });
			  orderList();
		      endLoading();	
			});
		} else {
			for(var i=0; i<results.rows.length; i++) {
				data = JSON.parse(results.rows.item(i).data);
			//console.log(data);
				addMarker(data,map);
			}
			orderList();
			endLoading();	
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
		var profileData = data.profile;
		delete data.profile;
		var catid = data.catid;
		var itemid = data.id;
		var jsonData = JSON.stringify(data);
		var jsonProfileData = JSON.stringify(profileData);
		
		dbShell.transaction(function(tx) {
			tx.executeSql("INSERT OR REPLACE INTO places(catid,itemid,data) values(?,?,?)",[catid,itemid,jsonData]);
		}, dbErrorHandler);
		dbShell.transaction(function(tx) {
			tx.executeSql("INSERT OR REPLACE INTO profiles(itemid,data) values(?,?)",[itemid,jsonProfileData]);
		}, dbErrorHandler);
		
	}
	
	function startLoading(){
		$('body').append('<div id="bigloading"><p>CARGANDO DATOS<br>LOADING DATA</p></div>');
	}
	function endLoading(){
		$('#bigloading').remove();
	}
	
	function checkUpdateNeeded(){
		if (navigator.onLine){
			jQuery.getJSON( "http://miflamencoplace.com/rpc/check-updateplaces.php", function( data ) {
			  jQuery.each( data, function( key, modified ) {
				  dbShell.transaction(function(tx) {
					tx.executeSql("SELECT value FROM config WHERE name = 'lastupdateplaces'",[],function(tx,results){
						if (results.rows.length == 0) {
						 dbShell.transaction(function(tx) {
							tx.executeSql("INSERT OR REPLACE INTO config(name,value) values('lastupdateplaces',?)",[Date.now()]);
						  }, dbErrorHandler);
							getEntries();
						} else {
							if (results.rows.item(0).value < modified){
								isUpdateNeeded = results.rows.item(0).value;
							  jQuery.getJSON( "http://miflamencoplace.com/rpc/update_places.php?date="+isUpdateNeeded, function( data ) {
								  jQuery.each( data, function( key, val ) {
									savePlace(val);
								  });
								  dbShell.transaction(function(tx) {
									tx.executeSql("INSERT OR REPLACE INTO config(name,value) values('lastupdateplaces',?)",[Date.now()]);
								  }, dbErrorHandler);
								  if (langid='en')
									modales('Data updated');
								  else
									modales('Datos actualizados');
								  
								  getEntries();
							  });
								
							} else {
								getEntries();
							}
						}
					},dbErrorHandler);
				  }, dbErrorHandler);
			  });
			});
		} else {
			getEntries();
		}
	}
	function switchView()
	{
		jQuery('#map-canvas').toggle();
		jQuery('#map-canvas-list').toggle();
	}
	
	function modales(text)
	{
		jQuery.modal('<p>'+text+'</p><a class="btnClose simplemodal-close" href="#">Cerrar/Close</a>',{overlayClose:true});
	}