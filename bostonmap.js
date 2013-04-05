function initialize() {
	
		var latitude = 42.4048;
		var longitude = -71.1217;
			var myOptions = {
						zoom: 13,
						center: new google.maps.LatLng(latitude,longitude),
						mapTypeId: google.maps.MapTypeId.ROADMAP
					};
		map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
		getMyLocation(map, latitude, longitude);			
}

function getMyLocation(map, latitude, longitude) {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(function(position) {
						latitude = position.coords.latitude;
						longitude = position.coords.longitude;
						renderMap(map, latitude, longitude);
					});
				}
				else {
					alert("Geolocation is not supported by this web browser.");
				}
}			
			
function renderMap(map, latitude, longitude) {
				myposition = new google.maps.LatLng(latitude, longitude);
				stations = tStops(map);
				wheresWaldoAndCarmen(myposition, map);
				closestInfo = findClosestStation(myposition, stations);
				map.panTo(myposition);
				fullLat = myposition.lat();
				myLat = fullLat.toPrecision(6);
				fullLng = myposition.lng();
				myLng = fullLng.toPrecision(6);
				var marker = new google.maps.Marker({
					position: myposition,
					title: "I am here at " + myLat + ", " + myLng +"!"
				});
				marker.setMap(map);
				var infowindow = new google.maps.InfoWindow();
				contentMy = marker.title + "<br />" + "The closest station to me is " 
										 + closestInfo[1] + " Station and is " 
										 + closestInfo[0] + " miles away.";
				google.maps.event.addListener(marker, 'click', function() {
					infowindow.setContent(contentMy);
					infowindow.open(map, marker);
				});
}

function findClosestStation(myposition, stations) {
		var closestInfo = [];
		closestInfo[0] = calculateDistance(myposition, stations[0].lat, stations[0].lng);
		for (i = 1; i < stations.length; i++) {
			dist = calculateDistance(myposition, stations[i].lat, stations[i].lng)
			if (dist < closestInfo[0]) {
				closestInfo[0] = dist;
				closestInfo[1] = stations[i].name;
			}
		}
		return closestInfo;
}			

function wheresWaldoAndCarmen(myposition, map) {
	var request;

	try {
 		request = new XMLHttpRequest();
	}
	catch (ms1) { // yes, exception handling is supported in JavaScript
  		try {
    		request = new ActiveXObject("Msxml2.XMLHTTP");
  		}
  		catch (ms2) {
    		try {
      			request = new ActiveXObject("Microsoft.XMLHTTP");
    		}
    		catch (ex) {
      			request = null;
    		}
  		}
	}
	if (request == null) {
  		alert("Error creating request object --Ajax not supported?");
	}
		request.open("GET", "http://messagehub.herokuapp.com/a3.json", false);
		request.send();
		str = request.responseText;
    	parsed = JSON.parse(str);
    	for (i = 0; i < parsed.length; i++) {
			if (parsed[i].name === "Waldo") {
				var location = new google.maps.LatLng(parsed[i].loc.latitude, parsed[i].loc.longitude);
				var Wmarker = new google.maps.Marker({
  					position: location,
  					map: map,
  					title: parsed[i].loc.note,
  					zindex: 2,
  					icon: 'waldo.png'
				});
				Wmarker.setMap(map);
				distWaldo = calculateDistance(myposition, parsed[i].loc.latitude, parsed[i].loc.longitude);
				contentW = "<p>" + parsed[i].loc.note + "<br />" +
						"You are " + distWaldo + " miles away from Waldo." + "</p>";
				var infowindowW = new google.maps.InfoWindow();
				
				google.maps.event.addListener(Wmarker, 'click', function() {
					infowindowW.setContent(contentW);
					infowindowW.open(map, Wmarker);
				});
			}
			if (parsed[i].name === "Carmen Sandiego") {
				var location = new google.maps.LatLng(parsed[i].loc.latitude, parsed[i].loc.longitude);
				var Cmarker = new google.maps.Marker({
					position: location,
					map: map,
					title: parsed[i].loc.note,
					zindex: 2,
					icon: 'carmen.png'
				});
				
				Cmarker.setMap(map);
				distCarmen = calculateDistance(myposition, parsed[i].loc.latitude, parsed[i].loc.longitude);
				contentC = "<p>" + parsed[i].loc.note + "<br />" +
						"You are " + distCarmen + " miles away from Carmen Sandiego." + "</p>";
				var infowindowC = new google.maps.InfoWindow();
				google.maps.event.addListener(Cmarker, 'click', function() {
					infowindowC.setContent(contentC);
					infowindowC.open(map, Cmarker);
				});
			}
		}
}
								
function tStops(map) {

var stations = [
	{"name":"Alewife", "lat":42.395428, "lng":-71.142483, "key1":"RALEN"},
	{"name":"Davis", "lat":42.39674, "lng":-71.121815, "key1":"RDAVN", "key2":"RDAVS"},
	{"name":"Porter", "lat":42.3884, "lng":-71.119149, "key1":"RPORN", "key2":"RPORS"},
	{"name":"Harvard", "lat":42.373362, "lng":-71.118956, "key1":"RHARN", "key2":"RHARS"},
	{"name":"Central", "lat":42.365486, "lng":-71.103802, "key1":"RCENN", "key2":"RCENS"},
	{"name":"Kendall/MIT", "lat":42.36249079, "lng":-71.08617653, "key1":"RKENN", "key2":"RKENS"},
	{"name":"Charles/MGH", "lat":42.361166, "lng":-71.070628, "key1":"RMGHN", "key2":"RMGHS"},
	{"name":"Park St.", "lat":42.35639457, "lng":-71.0624242, "key1":"RPRKN", "key2":"RPRKS"},
	{"name":"Downtown Crossing", "lat":42.355518, "lng":-71.060225, "key1":"RDTCN", "key2":"RDTCS"},
	{"name":"South", "lat":42.352271, "lng":-71.055242, "key1":"RSOUN", "key2":"RSOUS"},
	{"name":"Broadway", "lat":42.342622, "lng":-71.056967, "key1":"RBRON", "key2":"RBROS"},
	{"name":"Andrew", "lat":42.330154, "lng":-71.057655, "key1":"RANDN", "key2":"RANDS"},
	{"name":"JFK/UMass", "lat":42.320685, "lng":-71.052391, "key1":"RJFKN", "key2":"RJFKS"},
	{"name":"Savin Hill", "lat":42.31129, "lng":-71.053331, "key1":"RSAVN", "key2":"RSAVS"},
	{"name":"Fields Corner", "lat":42.300093, "lng":-71.061667, "key1":"RFIEN", "key2":"RFIES"},
	{"name":"Shawmut", "lat":42.29312583, "lng":-71.06573796, "key1":"RSHAN", "key2":"RSHAS"},
	{"name":"Ashmont", "lat":42.284652, "lng":-71.064489, "key2":"RASHS"},
	{"name":"North Quincy", "lat":42.275275, "lng":-71.029583, "key1":"RNQUN", "key2":"RNQUS"},
	{"name":"Wollaston", "lat":42.2665139, "lng":-71.0203369, "key1":"RWOLN", "key2":"RWOLS"},
	{"name":"Quincy Center", "lat":42.251809, "lng":-71.005409, "key1":"RQUCN", "key2":"RQUCS"},
	{"name":"Quincy Adams", "lat":42.233391, "lng":-71.007153, "key1":"RQUAN", "key2":"RQUAS"},
	{"name":"Braintree", "lat":42.2078543, "lng":-71.0011385, "key2":"RBRAS"}
];	
	for (j = 0; j < stations.length; j++) {
		var location = new google.maps.LatLng(stations[j].lat, stations[j].lng);
		var Tmarker = new google.maps.Marker({
				position: location,
				map: map,
				title: stations[j].name,
				zindex: 1,
				icon: 'MBTA2.png'
			});
		Tmarker.setMap(map);
		MarkerInfoWindow(map, Tmarker, stations, j);
	}
	drawRedLine(map, stations);
	return stations;
}			

function MarkerInfoWindow(map, Tmarker, stations, j) {
	content = "<strong>" + Tmarker.title + " Station" + "</strong>" + "<br />";
	var request;

	try {
 		request = new XMLHttpRequest();
	}
	catch (ms1) { // yes, exception handling is supported in JavaScript
  		try {
    		request = new ActiveXObject("Msxml2.XMLHTTP");
  		}
  		catch (ms2) {
    		try {
      			request = new ActiveXObject("Microsoft.XMLHTTP");
    		}
    		catch (ex) {
      			request = null;
    		}
  		}
	}
	if (request == null) {
  		alert("Error creating request object --Ajax not supported?");
	}
		request.open("GET", "http://mbtamap.herokuapp.com/mapper/redline.json", false);
		request.send();
		str = request.responseText;
    	parsed = JSON.parse(str);
    	var northTrains = "<strong>" + "Northbound Trains" + "</strong>" + "<br />";  
    	var southTrains = "<strong>" + "Southbound Trains" + "</strong>" + "<br />";
    	tNP = 0;	
    	tSP = 0;
		for (i = 0; i < parsed.length; i++) {
			if (parsed[i].PlatformKey === stations[j].key1) {
					northTrains += parsed[i].TimeRemaining + "<br />";
					tNP = tNP + 1;	
			}
			if (parsed[i].PlatformKey === stations[j].key2) {
					southTrains += parsed[i].TimeRemaining + "<br />";
					tSP = tSP + 1;
			}
		}
		if ((tNP === 0) && (tSP === 0)) {
			content += "There are no trains currently scheduled to arrive at this station.";
		}
		else if ((tNP > 0) && (tSP === 0)) {
			content += northTrains + " " + southTrains + "None scheduled at this time";
		}
		else if ((tNP === 0) && (tSP > 0)) {
			content += northTrains + "None scheduled at this time" + "<br />"+ southTrains;
		}
		else {
			content += northTrains + southTrains;
		}
		listenMarker(Tmarker, map, content);			
}

function listenMarker (Tmarker, map, content) {
	var infowindow = new google.maps.InfoWindow();
		google.maps.event.addListener(Tmarker, 'click', function() {
			infowindow.setContent(content);
			infowindow.open(map, Tmarker);
			});	
}		
			
function drawRedLine(map, stations) {

		var locationsA = [];
 		for (k = 0; k < 17; k++) {
 			locationsA[k] = new google.maps.LatLng(stations[k].lat, stations[k].lng);
 		}
 		
		var lineOptionsA = {
			clickable: true,
			draggable: false,
			path: locationsA,
			strokeColor: "red",
			strokeOpacity: 1,
			map: map,
			strokeWeight: 9
		};
	
		var locationsB = [];
 		for (k = 0; k < 13; k++) {
 			locationsB[k] = new google.maps.LatLng(stations[k].lat, stations[k].lng);
 		}
 		for (l = 17; l < stations.length; l++){
 			locationsB[k] = new google.maps.LatLng(stations[l].lat, stations[l].lng);
 			k++;
 		}
		var lineOptionsB = {
			clickable: true,
			draggable: false,
			path: locationsB,
			strokeColor: "red",
			strokeOpacity: 1,
			map: map,
			strokeWeight: 9
		};
		var redLine = new google.maps.Polyline(lineOptionsA);
		var redLine2 = new google.maps.Polyline(lineOptionsB);
}

Number.prototype.toRad = function() {
  return this * Math.PI / 180;
}

function calculateDistance(myposition, othLat, othLng) {
	myLat = myposition.lat();
	myLng = myposition.lng();		
	var R = 3959; // mi
	var dLat = (othLat-myLat).toRad();
	var dLon = (othLng-myLng).toRad();
	var myLat = myLat.toRad();
	var othLat = othLat.toRad();

	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        	Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(myLat) * Math.cos(othLat); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c;
	dist = d.toPrecision(3);
	return dist;
}
