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

jQuery( window ).unload(function() {
  stopAudio();
});

	var map; 
	var myLatlng; 
	var placeLatlng; 
	var itemid = jQuery.getQuery('itemid');
	var showTab = jQuery.getQuery('tab');
	var historyPages = [];
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
							  }
							];
	
	
	//var deviceType = (navigator.userAgent.match(/iPad/i))  == "iPad" ? "iPad" : (navigator.userAgent.match(/iPhone/i))  == "iPhone" ? "iPhone" : (navigator.userAgent.match(/Android/i)) == "Android" ? "Android" : (navigator.userAgent.match(/BlackBerry/i)) == "BlackBerry" ? "BlackBerry" : "null";
	var deviceType = "iPhone";
	
	function initProfile() {
	
			//startLoading();
		
				dbShell = window.openDatabase("miflamenkoplace", 1, "miflamenkoplace", 50000000);
				dbShell.transaction(function(tx) {
					tx.executeSql("CREATE TABLE IF NOT EXISTS profiles(id INTEGER PRIMARY KEY,itemid INTEGER UNIQUE,data)");
				}, dbErrorHandler);
				dbShell.transaction(function(tx) {	
					tx.executeSql("SELECT data FROM profiles WHERE itemid = ? ",[itemid],fillProfileNC,dbErrorHandler);
				}, dbErrorHandler);

			if (showTab){
				switch(showTab){
					case 'person':
						showPerson(true);
						break;
					case 'story':
						showStory(true);
						break;
					case 'place':
						showPlace(true);
						break;
				}
			} else {
				showPlace(true);
			}
	}			
	
	function dbErrorHandler(err){
		//alert("DB Error: "+err.message + "\nCode="+err.code);
	}

	
	function fillProfileNC(tx,results){
	
		if (results.rows.length == 0) {
			startLoading();
			if (navigator.onLine){
				jQuery.getJSON( "http://miflamencoplace.com/rpc/get_profile.php?itemid="+itemid, function( data ) {
						fillProfile(data);
						saveProfile(data);
						
						endLoading();	  
					});
			} else {
				modales('Error de conexión/Connection error');
				endLoading();	  
			}
		
		} else {
			jsondata = data = JSON.parse(results.rows.item(0).data);
			fillProfile(jsondata);
			return true;
		}
	}
	function fillProfile(data){
		$('#placebg').css('background',' url(../img/overlay.png) repeat,url('+data.img64+') no-repeat center top');
		$('#place .title').html('<span class="spacertit">&nbsp;</span>'+data.title+'<img src="../img/cat'+data.catid+'.png"/><img src="../img/cat'+data.personcatid+'.png"/>');
		
		$('#place .author').html('By '+data.personname);
		$('#place .personface .img').css('background-image',"url('"+data.personface64+"')");
		$('#place .street').html(data.street);
		$('#place .address').html(data.address);
		if (langid == 'en'){
			$('#place .introtext').html(data.placeintrotexten);
			$('#place .fulltext').html(data.placefulltexten);
			$('#person .authortext').html(data.persontexten);
			if (data.audioen != null && data.audioen != ''){
				$('#story .downloada').click(function(){manageFile('http://miflamencoplace.com/media/k2/attachments/'+data.audioen, data.audioen )});
				$('#story .playing').click(function(){stopAudio()});
				$('#headphones').click(function(){manageFile('http://miflamencoplace.com/media/k2/attachments/'+data.audioen, data.audioen )});
				isDownloadedFile(data.audioen);
			}else{
				$('#story .downloada').hide();
			} 
		} else {
			$('#place .introtext').html(data.placeintrotext);
			$('#place .fulltext').html(data.placefulltext);
			$('#person .authortext').html(data.persontext);
			if (data.audioes != null && data.audioes != ''){
				$('#story .downloada').click(function(){manageFile('http://miflamencoplace.com/media/k2/attachments/'+data.audioes,data.audioes )});
				$('#story .playing').click(function(){stopAudio()});
				$('#headphones').click(function(){manageFile('http://miflamencoplace.com/media/k2/attachments/'+data.audioes, data.audioes )});
				isDownloadedFile(data.audioes);
			}else{
				$('#story .downloada').hide();
			} 
		}
		$('#personbg').css('background','url('+data.personpicture64+') no-repeat center top');
		$('#person .authorname').html(data.personname+'<img src="../img/cat'+data.catid+'.png"/><img src="../img/cat'+data.personcatid+'.png"/>');
		var vpw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
		var sfx = (vpw > 1024)?'hd':((vpw < 400)?'l':'');
		$('#person .toplace').attr('src','../img/markers/'+sfx+data.catid+'.png');
		$('#story .placetitle').html(data.title);
		$('#story .persontitle').html('By '+data.personname);
		$('#story .icons').html('<img src="../img/cat'+data.personcatid+'.png"/><img src="../img/cat'+data.catid+'.png"/>');
		$('#story .right .img').css('background-image',"url('"+data.img64+"')");
		$('#story .authorname').html(data.personname);
		$('#video iframe').attr('src',data.onyoutube).css('height',(vpw/100)*56);
		
		if (navigator.onLine){
		
			var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
			placeLatlng = new google.maps.LatLng(data.lat, data.long);
			var mapOptions = { 
				zoom: 17, 
				disableDefaultUI: true,
				draggable: false,
				 zoomControl: true,
				center: placeLatlng,
				scrollwheel: false
			}; 
			map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions); 
			map.mapTypes.set("map_style",styledMap);
			map.setMapTypeId("map_style");
			
			var marker = new google.maps.Marker({ 
				position: placeLatlng, 
				map: map, 
				title: data.title,
				icon: '../img/markers/'+sfx+data.catid+'.png'				
			});

		
			var galContent = '';
			data.placegallery.forEach(function(galpic) {
				galContent += '<div class="swiper-slide"><img width="115" src="'+galpic+'" /></div>';
			});
			$('#place .gallery .swiper-wrapper').html(galContent);
				 if (showTab == '' || showTab == 'place') {
				jQuery('#place .gallery').show();
				var mySwiper = $('#place .gallery').swiper({
						mode:'horizontal',
						calculateHeight: true,
						loop: true
				 }); 
				 jQuery('#place').height(
					jQuery('#place .fulltext').height()+
					jQuery('#place .addressinfo').height()+
					jQuery('#map-canvas').height()+
					jQuery('#place .gallery').height()
					);
			  } 
		} else {
			$('#place .gallery').remove();
			$('#map-canvas').remove();
		}
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
	




	function showPlace(open){
		
		jQuery('#person').fadeOut('fast');
		jQuery('#story').fadeOut('fast');
		jQuery('#place').fadeIn('fast', function(){
 			if (showTab == 'person' || showTab == 'story') { 
				jQuery('#place .gallery').show();
				var mySwiper = $('#place .gallery').swiper({
						mode:'horizontal',
						calculateHeight: true,
						loop: true
				 }); 
				 jQuery('#place').height(
					jQuery('#place .fulltext').height()+
					jQuery('#place .addressinfo').height()+
					jQuery('#map-canvas').height()+
					jQuery('#place .gallery').height()
					);
			} 
		
		});
		jQuery('#filteropts a').show();
		jQuery('#filteropts .place').hide();
		historyPages.push('place');
	
		if (!open){
			toggleFilter();
		}
		if (showTab == 'person' || showTab == 'story') {
			if (navigator.onLine){
				var center = map.getCenter(); 
				google.maps.event.trigger(map, 'resize'); 
				map.setCenter(center); 
			}
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
		historyPages.push('person');
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
		historyPages.push('story');
		return false;
	}
	
	function goBack()
	{
		if (historyPages.length <= 1){
			history.go(-1);
		} else {
			historyPages.pop();
			section = historyPages.pop();
			switch(section){
				case 'story':
					showStory(true);
					break;
				case 'person':
					showPerson(true);
					break;
				case 'place':
				default:
					showPlace(true);
					break;
			}
		}
	}
	
	function isDownloadedFile(nameFile)
	{
		if (deviceType == 'Android') {
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
					for (i=0; i<entries.length; i++) {
						
						if (entries[i].name == nameFile){
							$('#story .downloada').addClass('pause');
							setAudioPosition(0);
						}
					}
				}
			},
			onError
			);   
		} else {
			$('#story .downloada').addClass('pause');
			setAudioPosition(0);
		}		
	}
	
function manageFile(file, nameFile){

	if (deviceType == 'Android') {
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
										modales('Descarga completada/Download complete');
										//playAudio(theFile);
									},
									function(error) {
									/* alert('file'+file);
									alert('fp'+fp); */
										jQuery('#story .downloada').removeClass('loading');
										modales("Download error");
										
									}
								);
							
							}
						}; 
					
			  
		}, onError);
	} else {
		playAudio(file);
	}
}


function onDirectoryFail(error) {
    //Error while creating directory
    modales("Error 10F");
}


	var my_media = null;
	var mediaTimer = null;
	function playAudio(src) {
		$('#story .downloada').css('display','none');
		$('#story .playing').css('display','table');
		if (my_media == null) {
			if (deviceType == 'Android') {
				my_media = new Media(src.toNativeURL(), onSuccess, onError);
			} else {
				my_media = new Media(src, onSuccess, onError);
			}
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
		} else {
			if ( position > 60 ){
				secs = position - (60*Math.floor(position/60));
			} else {
				secs = position;
			}
			if (secs < 10){
				jQuery('.audio_position').html(Math.floor(position/60)+':0'+Math.floor(secs));
			} else {
				jQuery('.audio_position').html(Math.floor(position/60)+':'+Math.floor(secs));
			}
		}
    }
	
function onSuccess() {
	//alert("playAudio():Audio Success");
}

// onError Callback 
//
function fail(){}
function onError(error) {
	/* alert('code: '    + error.code    + '\n' + 
		  'message: ' + error.message + '\n'); */
}


	function startLoading(){
		$('body').append('<div id="bigloading"><p>CARGANDO DATOS<br>LOADING DATA</p></div>');
	}
	function endLoading(){
		$('#bigloading').remove();
	}
	
	
	function saveProfile(data) {
		var jsonData = JSON.stringify(data);
		
		dbShell.transaction(function(tx) {
			tx.executeSql("INSERT OR REPLACE INTO profiles(itemid,data) values(?,?)",[itemid,jsonData]);
		}, dbErrorHandler);
		
	}
	
	function modales(text)
	{
		jQuery.modal('<p>'+text+'</p><a class="btnClose simplemodal-close" href="#">Cerrar/Close</a>',{overlayClose:true});
	}