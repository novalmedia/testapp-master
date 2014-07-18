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
			var styledMap = new google.maps.StyledMapType(styles,{name: "Styled Map"});
			
			var itemid = jQuery.getQuery('itemid');
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
				var marker = new google.maps.Marker({ 
					position: placeLatlng, 
					map: map, 
					title: data.title,
					icon: '../img/markers/'+data.catid+'.png'				
				});
					  
			});
	}			
		
	
	function fillProfile(data){
		$('#place').css('background-image','url(http://miflamencoplace.com'+data.img+')');
		$('#place .title').html(data.title);
		$('#place .author').html('By '+data.personname);
		$('#place .personface img').attr('src','http://miflamencoplace.com'+data.personface);
		if (langid == 'en'){
			$('#place .introtext').html(data.placeintrotexten);
			$('#place .fulltext').html(data.placefulltexten);
			$('#person .authortext').html(data.persontexten);
			$('#story .downloada').attr('href','http://miflamencoplace.com/media/k2/attachments/'+data.audioen);
		} else {
			$('#place .introtext').html(data.placeintrotext);
			$('#place .fulltext').html(data.placefulltext);
			$('#person .authortext').html(data.persontext);
			$('#story .downloada').attr('href','http://miflamencoplace.com/media/k2/attachments/'+data.audioes);
		}
		$('#person').css('background','url(http://miflamencoplace.com/media/k2/items/cache/'+data.personpicture+') no-repeat center top');
		$('#person .authorname').html(data.personname);
		$('#story .placetitle').html(data.title);
		$('#story .persontitle').html('By '+data.personname);
		$('#story .right img').attr('src','http://miflamencoplace.com'+data.img);
		$('#story .authorname').html(data.personname);
		$('#story #onyoutube').attr('href',data.onyoutube);
		var galContent = '';
		data.placegallery.forEach(function(galpic) {
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