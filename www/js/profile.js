
	var map; 
	var myLatlng; 
	function initProfile() {
	
			
					
			var showTab = jQuery.getQuery('tab');
			switch(showTab){
				case 'person':
					showPerson(true);
					break;
				case 'story':
					showStory(true);
					break;
				case 'place':
				default:
					showPlace(true);
					break;
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
			if (navigator.onLine)
				var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
			
			var itemid = jQuery.getQuery('itemid');
			if (navigator.onLine) {
				jQuery.getJSON( "http://miflamencoplace.com/rpc/get_profile.php?itemid="+itemid, function( data ) {
					fillProfile(data);
					placeLatlng = new google.maps.LatLng(data.lat, data.long);
					var mapOptions = { 
						zoom: 14, 
						disableDefaultUI: true,
						center: placeLatlng,
						scrollwheel: false,
						draggable: false
					}; 
					map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions); 
					map.mapTypes.set("map_style",styledMap);
					map.setMapTypeId("map_style");
					var vpw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
					var sfx = (vpw > 1024)?'hd':'';
					var marker = new google.maps.Marker({ 
						position: placeLatlng, 
						map: map, 
						title: data.title,
						icon: '../img/markers/'+sfx+data.catid+'.png'				
					});
						  
				});
			} else {
				dbShell = window.openDatabase("miflamenkoplace", 1, "miflamenkoplace", 1000000);
				dbShell.transaction(function(tx) {	
					
					tx.executeSql("SELECT data FROM profiles WHERE itemid = ? ",[itemid],fillProfileNC,dbErrorHandler);
				}, dbErrorHandler);
//				fillProfileNC(data);
			}
	}			
	
	function dbErrorHandler(err){
		alert("DB Error: "+err.message + "\nCode="+err.code);
	}
	
	function fillProfileNC(tx,results){
		jsondata = data = JSON.parse(results.rows.item(0).data);
		fillProfile(jsondata);
		return true;
	}
	function fillProfile(data){
		$('#place').css('background',' url(../img/overlay.png) repeat,url('+data.img64+') no-repeat center top')
		.css('background-size','auto,cover');
		$('#place .title').html('<span class="spacertit">&nbsp;</span>'+data.title+'<img src="../img/cat'+data.catid+'.png"/><img src="../img/cat'+data.personcatid+'.png"/>');
		
		$('#place .author').html('By '+data.personname);
		$('#place .personface img').attr('src',data.personface64);
		$('#place .street').html(data.street);
		$('#place .address').html(data.address);
		if (langid == 'en'){
			$('#place .introtext').html(data.placeintrotexten);
			$('#place .fulltext').html(data.placefulltexten);
			$('#person .authortext').html(data.persontexten);
			if (data.audioen != null){
				$('#story .downloada').click(function(){manageFile('http://miflamencoplace.com/media/k2/attachments/'+data.audioen, data.audioen )});
				$('#story .playing').click(function(){stopAudio()});
				//isDownloadedFile(data.audioen);
			}else{
				$('#story .downloada').hide();
			} 
		} else {
			$('#place .introtext').html(data.placeintrotext);
			$('#place .fulltext').html(data.placefulltext);
			$('#person .authortext').html(data.persontext);
			if (data.audioes != null){
				$('#story .downloada').click(function(){manageFile('http://miflamencoplace.com/media/k2/attachments/'+data.audioes,data.audioes )});
				$('#story .playing').click(function(){stopAudio()});
				//isDownloadedFile(data.audioes);
			}else{
				$('#story .downloada').hide();
			} 
		}
		$('#person').css('background','url('+data.personpicture64+') no-repeat center top');
		$('#person .authorname').html(data.personname+'<img src="../img/cat'+data.catid+'.png"/><img src="../img/cat'+data.personcatid+'.png"/>');
		$('#story .placetitle').html(data.title);
		$('#story .persontitle').html('By '+data.personname);
		$('#story .icons').html('<img src="../img/headp.png"/><img src="../img/cat'+data.personcatid+'.png"/><img src="../img/cat'+data.catid+'.png"/>');
		$('#story .right img').attr('src',data.img64);
		$('#story .authorname').html(data.personname);
		$('#story #onyoutube').attr('href',data.onyoutube);
		var galContent = '';
		data.placegallery64.forEach(function(galpic) {
			galContent += '<a href="#" onclick="zoomPicture(\''+galpic+'\');" ><img width="115" src="'+galpic+'" /></a>';
		});
		$('#place .gallery').html(galContent);
	}
	
	function zoomPicture(picture){
		$('#zoom').css('background-image','url('+picture+')');
		$('.md-modal').removeClass('md-hide');
		return false;
	}
	
	function closeZoom(){
		$('.md-modal').addClass('md-hide');
		$('#zoom').css('background-image','');
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


	function showPlace(open){
		
		jQuery('#person').fadeOut('fast');
		jQuery('#story').fadeOut('fast');
		jQuery('#place').fadeIn('slow');
		jQuery('#filteropts a').show();
		jQuery('#filteropts .place').hide();
		if (!open){
			toggleFilter();
		}
		return false;
	}
	function showPerson(open){
		
		jQuery('#story').fadeOut('fast');
		jQuery('#place').fadeOut('fast');
		jQuery('#person').fadeIn('slow');
		jQuery('#filteropts a').show();
		jQuery('#filteropts .person').hide();
		if (!open){
			toggleFilter();
		}
		return false;
	}
	function showStory(open){
		
		jQuery('#person').fadeOut('fast');
		jQuery('#place').fadeOut('fast');
		jQuery('#story').fadeIn('slow');
		jQuery('#filteropts a').show();
		jQuery('#filteropts .story').hide();
		if (!open){
			toggleFilter();
		}
		return false;
	}
	
	
	function isDownloadedFile(nameFile)
	{
	/* 	   window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
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
					for (i=0; i<entries.length; i++) {
						
						if (entries[i].name == nameFile){
							$('#story .downloada').addClass('pause');
							setAudioPosition(0);
						}
					}
				}
			},
			onError
		);    */
	}
	
function manageFile(file, nameFile){

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
						playAudio(entries[i]);
					   }
					}
					if (!fileFound){
						jQuery('#story .downloada').addClass('loading');
						var fp = directoryEntry.toURL(); // Returns Fulpath of local directory
						fp = fp + folderName + "/" + nameFile; 		
						var fileTransfer = new FileTransfer();
						fileTransfer.download(
							file,
							fp,
							function(theFile) {
								//alert("download complete: " + theFile.toURI());
								jQuery('#story .downloada').removeClass('loading').addClass('pause');
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


function onDirectoryFail(error) {
    //Error while creating directory
    alert("Error: " + error.code);
}


	var my_media = null;
	var mediaTimer = null;
	function playAudio(src) {
		$('#story .downloada').css('display','none');
		$('#story .playing').css('display','table');
		if (my_media == null) {
			my_media = new Media(src.toNativeURL(), onSuccess, onError);
		}
		my_media.play();
		
		 // Update my_media position every second
            if (mediaTimer == null) {
                mediaTimer = setInterval(function() {
                    // get my_media position
                    my_media.getCurrentPosition(
                        // success callback
                        function(position) {
                            if (position > -1) {
                                setAudioPosition(position);
                            }
                        },
                        // error callback
                        function(e) {
                           
                            setAudioPosition("");
                        }
                    );
                }, 1000);
            }
		
		
	}
	function stopAudio() {
		if (my_media) {
			$('#story .downloada').css('display','table');
			$('#story .playing').css('display','none');
			my_media.pause();
		}
	}

	function setAudioPosition(position) {
		if (position <= 0){
			jQuery('.audio_position').html("0:00");
		} else if (position < 10){
			jQuery('.audio_position').html(Math.floor(position/60)+':0'+Math.floor(position));
		} else {
			jQuery('.audio_position').html(Math.floor(position/60)+':'+Math.floor(position));
		}
    }
function onSuccess() {
	//alert("playAudio():Audio Success");
}

// onError Callback 
//
function fail(){}
function onError(error) {
	alert('code: '    + error.code    + '\n' + 
		  'message: ' + error.message + '\n');
}
	