var map,
  pinColors = ['8a2be2', 'f6546a', 'ffa500', 'ccff00', 'ffd700', '0099cc', 'c6e2ff', '8b0000', 'f5f5dc', '808080'],
  pinImages = [],
  pinShadow,
  markers = [];



function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -23.1858327, lng: -45.8856327}, // bilac sjc
    zoom: 17
  });

  /**
   * Google Maps pin colors
   */
  for (var i in pinColors){
    pinImages.push(new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + pinColors[i],
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34)));
  }

  pinShadow = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_shadow",
      new google.maps.Size(40, 37),
      new google.maps.Point(0, 0),
      new google.maps.Point(12, 35));

  _getMarkers();
}


/*
 * Socket implementation
 */
io().on('new point', _addMarker);

function _getMarkers(){

  var xmlHttp = new XMLHttpRequest();
  xmlHttp.onreadystatechange = function() {
      if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
        var result = JSON.parse(xmlHttp.responseText).result;
        for (var i in result)
          _addMarker(result[i]);
      }
  }
  xmlHttp.open("GET", '/api/ocorrencias', true); // true for asynchronous
  xmlHttp.send(null);
}

function _addMarker(model){

  var marker = new google.maps.Marker({
    position: {
      lat: model.coordinates[1],
      lng: model.coordinates[0] },
    animation: google.maps.Animation.DROP,
    map: map,
    title: model.description,
    icon: pinImages[parseInt(model.team)],
    shadow: pinShadow
  });

  marker.addListener('click', function() {
    new google.maps.InfoWindow({
      content: model.description
    }).open(map, marker);
  });
  map.panTo(marker.position);
  markers.push(marker);
}

function _removeMarkers(){
  for(var i in markers)
    markers[i].setMap(null);

  markers = [];
}
