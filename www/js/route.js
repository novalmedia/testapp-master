	var map; 
	var myLatlng; 
	var markers = [];
	
	var bubw =200;
	var vpw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
	if (parseInt(vpw) > 400) bubw = 250;
	if (parseInt(vpw) > 1024) bubw = 650;
	var infowindows = new InfoBubble({
							shadowStyle: 0,padding: 0,backgroundColor: 'rgba(0,0,0,0.8)',borderRadius: Math.floor(bubw+(bubw/3)),borderWidth: 6,
							borderColor: '#fff',minWidth: bubw/1.2,minHeight: bubw/2.8,maxWidth: bubw/1.25,maxHeight: bubw/2.8,disableAutoPan: false,
							hideCloseButton: false,backgroundClassName: 'phoney',arrowSize: 5,arrowPosition: 10,arrowStyle: 3
						});	
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
			
	function initProfile() {
	
		var itemid = jQuery.getQuery('itemid');
		
		dbShell = window.openDatabase("miflamenkoplace", 1, "miflamenkoplace", 50000000);

		dbShell.transaction(function(tx) {	
			tx.executeSql("SELECT data FROM routes WHERE itemid = ? ",[itemid],fillProfileNC,dbErrorHandler);
		}, dbErrorHandler);
			
			
	}			
		
	function dbErrorHandler(err){
		alert("DB Error: "+err.message + "\nCode="+err.code);
	}
	
	function fillProfileNC(tx,results){
	
		if (results.rows.length == 0) {
			if (navigator.onLine){
				
				jQuery.getJSON( "http://miflamencoplace.com/rpc/get_route.php?itemid="+itemid, function( data ) {
					fillProfile(data);
					saveRoute(data);
				});
			}else {
				alert('Error de conexión/Connection error');
			}
		} else {
				jsondata = data = JSON.parse(results.rows.item(0).data);
			if (navigator.onLine){
				fillProfile(jsondata);
			} else {
				fillProfile(jsondata);
			}
			return true;
		}
	}
	
	function fillProfile(data){
		$('#route .title').html(data.title);
		$('#route .subtitle').html(data.subtitle);
		$('#route .routeimg .img').css('background-image',"url('"+data.img64+"')");
		$('#route .introtext').html(data.introtext);
		$('#playlistes').css('background',' url(../img/overlay.png) repeat,url(\''+data.img64+'\') no-repeat center top')
		.css('background-size', 'cover');
		if (navigator.onLine){
		
			var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
			center = new google.maps.LatLng(37.392864, -5.990077); 
			var mapOptions = { 
						zoom: 14, 
						disableDefaultUI: true,
						center: center,
						scrollwheel: false
					}; 
			map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions); 
			map.mapTypes.set("map_style",styledMap);
			map.setMapTypeId("map_style");
			var placeLatlng = [];

			var bounds = new google.maps.LatLngBounds();
		} else {
			jQuery('#map-canvas').remove();
		}

		var ies = 1;
		var ien = 1;
		for (i=0;i<data.routeitems.length;i++){
				item = data.routeitems[i];
				if (item.audioes != '' && langid == 'es') {
					isDownloadedFile(item.audioes,item.title, ies++, i);
				}
				if (item.audioen != '' && langid == 'en') {
					isDownloadedFile(item.audioen,item.title, ien++, i);
				}
				if (navigator.onLine){
					placeLatlng[i] = new google.maps.LatLng(item.lat, item.long); 
					var sfx = (vpw > 1024)?'hd':'';
					markers[i] = new google.maps.Marker({ 
						position: placeLatlng[i], 
						url : 'profile.html?itemid='+item.id,
						map: map, 
						item: item,
						icon: '../img/markers/'+sfx+item.catid+'.png'				
					});
					
					
					
					new google.maps.event.addListener(markers[i], "click", function(){
						infowindows.close();
						infowindows.setContent('<a class="dmk2maps_bubble_title" href="profile.html?itemid='+this.item.id+'">'+this.item.title+'</a><img onclick="document.location.href=\'profile.html?itemid='+this.item.id+'\';" class="dmk2maps_bubble_arrow" src="http://miflamencoplace.com/images/arrow'+this.item.catid+'.png">');
						infowindows.open(map,this);
					});	
					bounds.extend(placeLatlng[i]);
					map.fitBounds(bounds);
				}
		}

	}
	

	
	function saveRoute(data) {

		var itemid = data.id;
		var jsonData = JSON.stringify(data);
		dbShell.transaction(function(tx) {
			tx.executeSql("INSERT OR REPLACE INTO routes(itemid,data) values(?,?)",[itemid,jsonData]);
		}, dbErrorHandler);
		
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


	function isDownloadedFile(nameFile,title, id, markerId)
	{
		 	 /*  $("#playlistes").append(
							'<div class="download a'+id+'">'
							+'<a onclick="manageFile(\'http://miflamencoplace.com/media/k2/attachments/'+nameFile+'\',\''+nameFile+'\', '+id+', \''+markerId+'\');return false;" href="#" class="downloada pause"><span class="placetitle">'+i+'   '+title+'</span><span class="audio_position">0:00</span></a>'
							+'<a onclick="stopAudio('+id+');return false;" href="#" class="playing"><span class="placetitle">'+i+'   '+title+'</span><span class="audio_position"></span></a>'
							+'</div>');
			return true;    */
	 	   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
			function onFileSystemSuccess(fileSystem) {
				var folderName = 'miflamencoplace'
				var directoryEntry = fileSystem.root; 
				directoryEntry.getDirectory(folderName, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
				function onDirectorySuccess(parent) {
					var directoryReader = parent.createReader();
					directoryReader.readEntries(successReader,fail); 
				}
				function successReader(entries) {
					var i;
					var found = false;
					for (i=0; i<entries.length; i++) {
						
						if (entries[i].name == nameFile){
							found = true;
							$("#playlistes").append(
							'<div class="download a'+id+'">'
							+'<a onclick="manageFile(\'http://miflamencoplace.com/media/k2/attachments/'+nameFile+'\',\''+nameFile+'\', '+id+', \''+markerId+'\');return false;" href="#" class="downloada pause"><span class="placetitle">'+id+'   '+title+'</span><span class="audio_position">0:00</span></a>'
							+'<a onclick="stopAudio('+id+');return false;" href="#" class="playing"><span class="placetitle">'+id+'   '+title+'</span><span class="audio_position"></span></a>'
							+'</div>');
						}
					}
					if (!found)
						$("#playlistes").append(
						'<div class="download a'+id+'">'
						+'<a onclick="manageFile(\'http://miflamencoplace.com/media/k2/attachments/'+nameFile+'\',\''+nameFile+'\', '+id+', \''+markerId+'\');return false;" href="#" class="downloada"><span class="placetitle">'+id+'   '+title+'</span><span class="audio_position"></span></a>'
						+'<a onclick="stopAudio('+id+');return false;" href="#" class="playing"><span class="placetitle">'+id+'   '+title+'</span><span class="audio_position"></span></a>'
						+'</div>');
						
				}
			},
			onError
		);    
	}

function manageFile(file, nameFile, id, markerId){
/* google.maps.event.trigger(markers[markerId], 'click');
return true; */
window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
    function onFileSystemSuccess(fileSystem) {
			var folderName = 'miflamencoplace'
			var directoryEntry = fileSystem.root; // to get root path of directory
			directoryEntry.getDirectory(folderName, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
			
			function onDirectorySuccess(parent) {
				 var directoryReader = parent.createReader();
				directoryReader.readEntries(successReader,fail);
			}

			function successReader(entries) {
					var i;
					var fileFound = false;
					for (i=0; i<entries.length; i++) {
					   if (entries[i].name == nameFile){
						fileFound = true;
						google.maps.event.trigger(markers[markerId], 'click');
						playAudio(entries[i],id);
					   }
					}
					if (!fileFound){
						jQuery('.download.a'+id+' .downloada').addClass('loading');
						var fp = directoryEntry.toURL(); // Returns Fulpath of local directory
						fp = fp + folderName + "/" + nameFile; 		
						var fileTransfer = new FileTransfer();
						fileTransfer.download(
							file,
							fp,
							function(theFile) {
								//alert("download complete: " + theFile.toURI());
								jQuery('.download.a'+id+' .downloada').removeClass('loading').addClass('pause');
								setAudioPosition(0);
								alert('Descarga completada/Download complete');
								//playAudio(theFile);
							},
							function(error) {
								alert("download error");
								
							}
						);
					
					}
				}; 
			
      
    }, onError);
};
function onDirectorySuccess(parent) {
    // Directory created successfuly
	//alert('folder created');
}

function onDirectoryFail(error) {
    //Error while creating directory
    alert("Error: " + error.code);
}
 function fail(error) { alert(error.code); } 

 
 	var my_media = [];
	var mediaTimer = [];
	
	function playAudio(src, id) {
		$('.download.a'+id+' .downloada').css('display','none');
		$('.download.a'+id+' .playing').css('display','table');
		if (my_media[id] == null) {
			my_media[id] = new Media(src.toNativeURL(), onSuccess, onError);
		}
		my_media[id].play();
		
		 // Update my_media position every second
            if (mediaTimer[id] == null) {
                mediaTimer[id] = setInterval(function() {
                    // get my_media position
                    my_media[id].getCurrentPosition(
                        // success callback
                        function(position) {
                            if (position > -1) {
                                setAudioPosition(position, id);
                            }
                        },
                        // error callback
                        function(e) {
                           
                            setAudioPosition("", id);
                        }
                    );
                }, 1000);
            }
		
		
	}
	function stopAudio(id) {
		if (my_media[id]) {
			$('.download.a'+id+' .downloada').css('display','table');
			$('.download.a'+id+' .playing').css('display','none');
			my_media[id].pause();
		}
	}

	function setAudioPosition(position, id) {
		if (position <= 0){
			jQuery('.download.a'+id+' .audio_position').html("0:00");
		} else if (position < 10){
			jQuery('.download.a'+id+' .audio_position').html(Math.floor(position/60)+':0'+Math.floor(position));
		} else {
			jQuery('.download.a'+id+' .audio_position').html(Math.floor(position/60)+':'+Math.floor(position));
		}
    }
function onSuccess() {
	//alert("playAudio():Audio Success");
}

// onError Callback 
//
function onError(error) {
	alert('code: '    + error.code    + '\n' + 
		  'message: ' + error.message + '\n');
}