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
				if (item.audioes != '')
					$("#playlistes").append('<a href="http://miflamencoplace.com/media/k2/attachments/'+item.audioes+'" onclick="downloadFile(this.href, \''+item.audioes+'\');return false;" class="audio">Audio de '+item.title+'</a>');
				
				if (item.audioen != '')
					$("#playlisten").append('<a href="http://miflamencoplace.com/media/k2/attachments/'+item.audioen+'" onclick="downloadFile(this.href, \''+item.audioen+'\');return false;" class="audio">'+item.title+' audio</a>');
				
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

function downloadFile(file, nameFile){

window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, 
    function onFileSystemSuccess(fileSystem) {
        fileSystem.root.getFile(
        "dummy.html", {create: true, exclusive: false}, 
        function gotFileEntry(fileEntry) {
			var folderName = 'miflamencoplace'
			var directoryEntry = fileSystem.root; // to get root path of directory
			directoryEntry.getDirectory(folderName, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
			
			var fp = directoryEntry.fullPath; // Returns Fulpath of local directory
			fp = fp + "/" + folderName + "/" + nameFile; 
			var fileTransfer = new FileTransfer();
            fileTransfer.download(
                file,
                fp,
                function(theFile) {
                    alert("download complete: " + theFile.toURI());
                    //showLink(theFile.toURI());
                },
                function(error) {
                    alert("download error source " + error.source);
                    alert("download error target " + error.target);
                    alert("upload error code: " + error.code);
                }
            );
        }, fail);
    }, fail);
};
function onDirectorySuccess(parent) {
    // Directory created successfuly
	alert('folder created');
}

function onDirectoryFail(error) {
    //Error while creating directory
    alert("Unable to create new directory: " + error.code);
}
 function fail(error) { alert(error.code); } 
