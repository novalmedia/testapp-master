	var map; 
	var myLatlng; 
	function initProfile() {
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
				if (item.audioes != '' && langid == 'es') {
					isDownloadedFile(item.audioes,item.title, i);
				}
				if (item.audioen != '' && langid == 'en') {
					isDownloadedFile(item.audioen,item.title, i);
				}
				placeLatlng[i] = new google.maps.LatLng(item.lat, item.long); 
				var vpw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
				var sfx = (vpw > 1024)?'hd':'';
				var marker = new google.maps.Marker({ 
					position: placeLatlng[i], 
					map: map, 
					icon: '../img/markers/'+sfx+item.catid+'.png'				
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


	function isDownloadedFile(nameFile,title, id)
	{
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
							+'<a onclick="manageFile(\'http://miflamencoplace.com/media/k2/attachments/'+nameFile+'\',\''+nameFile+'\', '+id+');return false;" href="#" class="downloada pause"><span class="placetitle">'+title+'</span><span class="audio_position"></span></a>'
							+'<a onclick="stopAudio('+id+');return false;" href="#" class="playing"><span class="placetitle">'+title+'</span><span class="audio_position"></span></a>'
							+'</div>');
						}
					}
					if (!found)
						$("#playlistes").append(
						'<div class="download a'+id+'">'
						+'<a onclick="manageFile(\'http://miflamencoplace.com/media/k2/attachments/'+nameFile+'\',\''+nameFile+'\', '+id+');return false;" href="#" class="downloada"><span class="placetitle">'+title+'</span><span class="audio_position"></span></a>'
						+'<a onclick="stopAudio('+id+');return false;" href="#" class="playing"><span class="placetitle">'+title+'</span><span class="audio_position"></span></a>'
						+'</div>');
						
				}
			},
			onError
		);   
	}

function manageFile(file, nameFile, id){

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
	var mediaTimer = null;
	
	function playAudio(src, id) {
		$('.download.a'+id+' .downloada').hide();
		$('.download.a'+id+' .playing').show();
		if (my_media[id] == null) {
			my_media[id] = new Media(src.toNativeURL(), onSuccess, onError);
		}
		my_media[id].play();
		
		 // Update my_media position every second
            if (mediaTimer == null) {
                mediaTimer = setInterval(function() {
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
			$('.download.a'+id+' .downloada').hide();
			$('.download.a'+id+' .playing').show();
			my_media[id].pause();
		}
	}

	function setAudioPosition(position, id) {
		if (position <= 0){
			jQuery('.a'+id+' .audio_position').html("0:00");
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