
       // This example displays an address form, using the autocomplete feature
      // of the Google Places API to help users fill in the information.

      // This example requires the Places library. Include the libraries=places
      // parameter when you first load the API. For example:
      // <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
      var map, marker;
      var placeSearch, autocomplete;
      var addressTableDisplayed = false;
      var isnightMode = false;
      var componentForm = {
        street_number: 'short_name',
        route: 'long_name',
        locality: 'long_name',
        administrative_area_level_1: 'short_name',
        country: 'long_name',
        postal_code: 'short_name'
      };
      var latitude;
      var longitude;

      function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
            {types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', fillInAddress);
      }

      function fillInAddress() {
         animateAddressTable();
  
         
          //transition: visibility 1s, opacity 2.5s ease-in;
        // Get the place details from the autocomplete object.
        var place = autocomplete.getPlace();
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17); // Why 17? Because it looks good.
        }
        if (!marker) {
          marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
          });
        } else marker.setMap(null);
        marker.setOptions({
          position: place.geometry.location,
          map: map
        });
        for (var component in componentForm) {
          document.getElementById(component).value = '';
          document.getElementById(component).disabled = false;
        }

        // Get each component of the address from the place details
        // and fill the corresponding field on the form.
        for (var i = 0; i < place.address_components.length; i++) {
          var addressType = place.address_components[i].types[0];
          if (componentForm[addressType]) {
            var val = place.address_components[i][componentForm[addressType]];
            document.getElementById(addressType).value = val;
          }
        }
        //store address in local storage
       latitude = place.geometry.location.lat();
       longitude = place.geometry.location.lng(); 
       
      saveLocal();
     getuseraddress();
      setwindycoordinates();
        //tell user address has been stored
      }
      function animateAddressTable(){
       var address = document.getElementById("address");
        address.style.display= "table";
         address.style.width = "100%";
        address.style.height= "100%";
        var addressdiv = document.getElementById("addressdiv");
        addressdiv.style.display= "table";
        addressdiv.style.width = "480px";
        addressdiv.style.height= "100px";
        addressdiv.style.background= "lightblue";
        addressdiv.style.color= "white";
        addressdiv.style.WebkitTransform= "rotate(360deg)"; /* Safari */
        addressdiv.style.transform= "rotate(360deg)";
        var addressTable =document.getElementById("address");
        addressTable.style.WebkitAnimationName = "initialTable";
        addressTable.style.WebkitAnimationDuration = "4s";
        addressTable.style.animation= "initialTable 4s linear 0.5s 1 forwards";
        addressTableDisplayed =true;
      }
      function saveLocal(){
        //localStorage.setItem('penColor', penColor);
        var streetnumber = document.getElementById('street_number');
        var route = document.getElementById('route');
        var city = document.getElementById('locality');
        var state= document.getElementById('administrative_area_level_1');
        var postal_code = document.getElementById('postal_code');
        var country = document.getElementById('country');
        
        var useraddress = {
          "streetnumber": streetnumber.value, 
          "route": route.value,
          "city": city.value,
          "state": state.value,
          "postal_code": postal_code.value,
          "country": country.value,
          "latitude": latitude,
          "longitude": longitude
        }
        
        localStorage.setItem ("address", JSON.stringify(useraddress));
       
      }
      function getuseraddress(){
        var data = localStorage.getItem("address");
        var useraddress;
          if (data){
            useraddress = JSON.parse(data);
            
            latitude=useraddress["latitude"];
            longitude=useraddress["longitude"];
            
          }
          else{
            var streetnumber = document.getElementById('street_number');
            var route = document.getElementById('route');
            var city = document.getElementById('locality');
            var state= document.getElementById('administrative_area_level_1');
            var postal_code = document.getElementById('postal_code');
            var country = document.getElementById('country');
            
            useraddress = {
              "streetnumber": streetnumber.value, 
              "route": route.value,
              "city": city.value,
              "state": state.value,
              "postal_code": postal_code.value,
              "country": country.value,
              "latitude": latitude,
              "longitude": longitude
            }
            
          }
          return useraddress;
      }

      function restoreLocal(){
        var useraddress=getuseraddress();
      
        var streetnumber = document.getElementById('street_number');
        var route = document.getElementById('route');
        var city = document.getElementById('locality');
        var state= document.getElementById('administrative_area_level_1');
        var postal_code = document.getElementById('postal_code');
        var country = document.getElementById('country');
        streetnumber.value=useraddress["streetnumber"];
        route.value=useraddress["route"];
        city.value=useraddress["city"];
        state.value=useraddress["state"];
        postal_code.value=useraddress["postal_code"];
        country.value=useraddress["country"];
        var ac=document.getElementById('autocomplete');
        var address_value="";
        address_value+=streetnumber.value;
        if(route.value){
          address_value+=" "+route.value;
        }
        if(city.value){
          address_value+=", "+city.value;
        }
        if(state.value){
          address_value+=", "+state.value;
        }
        if(postal_code.value){
          address_value+=", "+postal_code.value;
        }
        if(country.value){
          address_value+=" "+country.value;
        }
        ac.value= address_value;

      setwindycoordinates();
      if (streetnumber.value || route.value || city.value || state.value || postal_code.value || country.value){
        animateAddressTable();
      }
     

      }
      function setwindycoordinates(){
               
        if (latitude&&longitude){
          var windymap=document.getElementById("windymap");
          windymap.src="https://embed.windy.com/embed2.html?lat="+latitude+"&lon="+longitude+
          "&zoom=5&level=surface&overlay=wind&menu=&message=true&marker=true&calendar="+
          "&pressure=true&type=map&location=coordinates&detail=true&detailLat="+latitude+
          "&detailLon="+longitude+"&metricWind=default&metricTemp=default";
        }
      }

      // Bias the autocomplete object to the user's geographical location,
      // as supplied by the browser's 'navigator.geolocation' object.
      function geolocate() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            if (!latitude||!longitude){
                latitude=position.coords.latitude;
                longitude=position.coords.longitude;
            }
            
            var geolocation = {
              lat: latitude,
              lng: longitude
            };
            var circle = new google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            });
            autocomplete.setBounds(circle.getBounds());
          });
        }
      }
       function initMap() {
        useraddress=getuseraddress();
        if (useraddress){
          latitude=useraddress["latitude"];
          longitude=useraddress["longitude"];
        }
       if (!latitude||!longitude){
                latitude=20;
                longitude=-160;
            }
        map = new google.maps.Map(document.getElementById('map'), {
          center: { lat: latitude, lng: longitude},
          zoom: 2,
          styles: mapStyle, 
          mapTypeId: 'terrain'
        });

        //set earthquake style
       map.data.setStyle(styleFeature);

        // Add a style-selector control to the map.
        var styleControl = document.getElementById('style-selector-control');
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(styleControl);

        // Set the map's style to the initial value of the selector.
        var styleSelector = document.getElementById('style-selector');
        map.setOptions({styles: styles[styleSelector.value]});

        // Apply new JSON when the user selects a different style.
        styleSelector.addEventListener('change', function() {
         
          
           if (styleSelector.value=="night") {

            isnightMode = true;
            if (addressTableDisplayed){
            //map.setOptions({styles: styles[styleSelector.value]}
            //set game options to night mode
          //set address table to night mode
              var addressdiv = document.getElementById("addressdiv");
              addressdiv.style.width = addressdiv.style.width -1;
              addressdiv.style.height = addressdiv.style.height -1;

              addressdiv.style.WebkitTransform= "rotate(360deg)"; /* Safari */
              addressdiv.style.transform= "rotate(360deg)";

              var addressTable =document.getElementById("address");
              addressTable.style.WebkitAnimationName = "nightmodeTable";
              addressTable.style.WebkitAnimationDuration = "2s";
              addressTable.style.animation = "nightmodeTable 2s linear 0.5s 1 forwards";
            }
            var body=document.getElementById("container");
           // body.style.backgroundColor= "black";
            body.style.WebkitAnimationName="nightmodebody";
            body.style.WebkitAnimationDuration="2s";
            body.style.animation = "nightmodebody 2s linear 0.5s 1 forwards";
          //set address bar to night mode
          //set body to night mode

           }
           else{
            if (addressTableDisplayed){
              isnightMode = false;
              var addressdiv = document.getElementById("addressdiv");
              addressdiv.style.width = addressdiv.style.width +1;
              addressdiv.style.height = addressdiv.style.height +1;

              addressdiv.style.WebkitTransform= "rotate(360deg)"; /* Safari */
              addressdiv.style.transform= "rotate(360deg)";
              var addressTable =document.getElementById("address");

              addressTable.style.backgroundColor= "darkgrey";
              addressTable.style.WebkitAnimationName = "restoreTable";
              addressTable.style.WebkitAnimationDuration = "2s";
              addressTable.style.animation = "restoreTable 2s linear 0.5s 1 forwards";
            }
              var body =document.getElementById("container");

              //body.style.backgroundColor= "white";
              body.style.WebkitAnimationName = "restorebody";
              body.style.WebkitAnimationDuration = "2s";
              body.style.animation = "restorebody 2s linear 0.5s 1 forwards";
             
           }
        
        map.setOptions({styles: styles[styleSelector.value]});
       
         
        });

        // Get the earthquake data (JSONP format)
        // This feed is a copy from the USGS feed, you can find the originals here:
        //   http://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
        var script = document.createElement('script');
        script.setAttribute(
            'src',
            'https://storage.googleapis.com/mapsdevsite/json/quakes.geo.json');
        document.getElementsByTagName('head')[0].appendChild(script);
        var trafficLayer = new google.maps.TrafficLayer();
        trafficLayer.setMap(map);

      
         var elevator = new google.maps.ElevationService;
        var infowindow = new google.maps.InfoWindow({map: map});

        // Add a listener for the click event. Display the elevation for the LatLng of
        // the click inside the infowindow.
        map.addListener('click', function(event) {
          displayLocationElevation(event.latLng, elevator, infowindow);
        });



        //enable the game
         //(new PuzzleDemo).init(map);


      }

       function displayLocationElevation(location, elevator, infowindow) {
        // Initiate the location request
        elevator.getElevationForLocations({
          'locations': [location]
        }, function(results, status) {
          infowindow.setPosition(location);
          if (status === 'OK') {
            // Retrieve the first result
            if (results[0]) {
              // Open the infowindow indicating the elevation at the clicked position.
              infowindow.setContent('The elevation at this point <br>is ' +
                  results[0].elevation + ' meters.');
            } else {
              infowindow.setContent('No results found');
            }
          } else {
            infowindow.setContent('Elevation service failed due to: ' + status);
          }
        });
      }
      // Defines the callback function referenced in the jsonp file.
      function eqfeed_callback(data) {
        map.data.addGeoJson(data);
      }

      function styleFeature(feature) {
        var low = [151, 83, 34];   // color of mag 1.0
        var high = [5, 69, 54];  // color of mag 6.0 and above
        var minMag = 1.0;
        var maxMag = 6.0;

        // fraction represents where the value sits between the min and max
        var fraction = (Math.min(feature.getProperty('mag'), maxMag) - minMag) /
            (maxMag - minMag);

        var color = interpolateHsl(low, high, fraction);

        return {
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            strokeWeight: 0.5,
            strokeColor: '#fff',
            fillColor: color,
            fillOpacity: 2 / feature.getProperty('mag'),
            // while an exponent would technically be correct, quadratic looks nicer
            scale: Math.pow(feature.getProperty('mag'), 2)
          },
          zIndex: Math.floor(feature.getProperty('mag'))
        };
      }

      function interpolateHsl(lowHsl, highHsl, fraction) {
        var color = [];
        for (var i = 0; i < 3; i++) {
          // Calculate color based on the fraction.
          color[i] = (highHsl[i] - lowHsl[i]) * fraction + lowHsl[i];
        }

        return 'hsl(' + color[0] + ',' + color[1] + '%,' + color[2] + '%)';
      }

      var mapStyle = [{
        'featureType': 'all',
        'elementType': 'all',
        'stylers': [{'visibility': 'off'}]
      }, {
        'featureType': 'landscape',
        'elementType': 'geometry',
        'stylers': [{'visibility': 'on'}, {'color': '#fcfcfc'}]
      }, {
        'featureType': 'water',
        'elementType': 'labels',
        'stylers': [{'visibility': 'off'}]
      }, {
        'featureType': 'water',
        'elementType': 'geometry',
        'stylers': [{'visibility': 'on'}, {'hue': '#5f94ff'}, {'lightness': 60}]
      }];
 
     


var styles = {
        default: null,
      

        night: [
          {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
          {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
          {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'geometry',
            stylers: [{color: '#263c3f'}]
          },
          {
            featureType: 'poi.park',
            elementType: 'labels.text.fill',
            stylers: [{color: '#6b9a76'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [{color: '#38414e'}]
          },
          {
            featureType: 'road',
            elementType: 'geometry.stroke',
            stylers: [{color: '#212a37'}]
          },
          {
            featureType: 'road',
            elementType: 'labels.text.fill',
            stylers: [{color: '#9ca5b3'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry',
            stylers: [{color: '#746855'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'geometry.stroke',
            stylers: [{color: '#1f2835'}]
          },
          {
            featureType: 'road.highway',
            elementType: 'labels.text.fill',
            stylers: [{color: '#f3d19c'}]
          },
          {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [{color: '#2f3948'}]
          },
          {
            featureType: 'transit.station',
            elementType: 'labels.text.fill',
            stylers: [{color: '#d59563'}]
          },
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{color: '#17263c'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [{color: '#515c6d'}]
          },
          {
            featureType: 'water',
            elementType: 'labels.text.stroke',
            stylers: [{color: '#17263c'}]
          }
        ],
          terrain: [
            {featureType: ''}
          ],

        

        hiding: [
          {
            featureType: 'poi.business',
            stylers: [{visibility: 'off'}]
          },
          {
            featureType: 'transit',
            elementType: 'labels.icon',
            stylers: [{visibility: 'off'}]
          }
        ]
      };








     /**
 * @constructor @struct @final
 */
function PuzzleDemo() {
  /** @private {!Array<google.maps.Polygon>} */
  this.polys_ = [];
  /** @private {string} */
  this.difficulty_ = 'easy';
  /** @private {number} */
  this.count_ = 0;
  /** @private {?Element} */
  this.pieceDiv_ = null;
  /** @private {?Element} */
  this.timeDiv_ = null;
}

/**
 * @private {number}
 */
PuzzleDemo.NUM_PIECES_ = 10;

/**
 * @private {string}
 */
PuzzleDemo.START_COLOR_ = '#3c79de';

/**
 * @private {string}
 */
PuzzleDemo.END_COLOR_ = '#037e29';

/**
 * @param {!google.maps.Map} map
 */
PuzzleDemo.prototype.init = function(map) {
  this.map_ = map;
  this.createMenu_(map);
  this.setDifficultyStyle_();
 this.loadData_();
};

/**
 * @param {!google.maps.Map} map
 */
PuzzleDemo.prototype.createMenu_ = function(map) {
  var menuDiv = document.createElement('div');
  menuDiv.style.cssText =
      'margin: 40px 10px; border-radius: 8px; height: 320px; width: 180px;' +
      'background-color: white; font-size: 14px; font-family: Roboto;' +
      'text-align: center; color: grey;line-height: 32px; overflow: hidden';
  var titleDiv = document.createElement('div');
  titleDiv.style.cssText =
      'width: 100%; background-color: #4285f4; color: white; font-size: 20px;' +
      'line-height: 40px;margin-bottom: 24px';
  titleDiv.innerText = 'Game Options';
  var pieceTitleDiv = document.createElement('div');
  pieceTitleDiv.innerText = 'PIECE:';
  pieceTitleDiv.style.fontWeight = '800';
  var pieceDiv = this.pieceDiv_ = document.createElement('div');
  pieceDiv.innerText = '0 / ' + PuzzleDemo.NUM_PIECES_;
  var timeTitleDiv = document.createElement('div');
  timeTitleDiv.innerText = 'TIME:';
  timeTitleDiv.style.fontWeight = '800';
  var timeDiv = this.timeDiv_ = document.createElement('div');
  timeDiv.innerText = '0.0 seconds';
  var difficultyTitleDiv = document.createElement('div');
  difficultyTitleDiv.innerText = 'DIFFICULTY:';
  difficultyTitleDiv.style.fontWeight = '800';
  var difficultySelect = document.createElement('select');
  ['Easy', 'Moderate', 'Hard', 'Extreme'].forEach(function(level) {
    var option = document.createElement('option');
    option.value = level.toLowerCase();
    option.innerText = level;
    difficultySelect.appendChild(option);
  });
  difficultySelect.style.cssText =
      'border: 2px solid lightgrey; background-color: white; color: #4275f4;' +
      'padding: 6px;';
  difficultySelect.onchange = function() {
    this.setDifficulty_(difficultySelect.value);
    this.resetGame_();
  }.bind(this);
  var resetDiv = document.createElement('div');
  resetDiv.innerText = 'Reset';
  resetDiv.style.cssText =
      'cursor: pointer; border-top: 1px solid lightgrey; margin-top: 18px;' +
      'color: #4275f4; line-height: 40px; font-weight: 800';
  resetDiv.onclick = this.resetGame_.bind(this);
  menuDiv.appendChild(titleDiv);
  menuDiv.appendChild(pieceTitleDiv);
  menuDiv.appendChild(pieceDiv);
  menuDiv.appendChild(timeTitleDiv);
  menuDiv.appendChild(timeDiv);
  menuDiv.appendChild(difficultyTitleDiv);
  menuDiv.appendChild(difficultySelect);
  menuDiv.appendChild(resetDiv);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(menuDiv);
};

/**
 * @param {!google.maps.Map} map
 */
PuzzleDemo.prototype.render = function(map) {

  if (!this.dataLoaded_) {
    return;
  }
  this.start_();
};

/**
 * @private
 */
PuzzleDemo.prototype.loadData_ = function() {
  var xmlhttpRequest = new XMLHttpRequest;
  xmlhttpRequest.onreadystatechange = function() {
    if (xmlhttpRequest.status != 200 ||
        xmlhttpRequest.readyState != XMLHttpRequest.DONE) return;
    this.loadDataComplete_(JSON.parse(xmlhttpRequest.responseText));
  }.bind(this);
  xmlhttpRequest.open(
      'GET', 'https://storage.googleapis.com/mapsdevsite/json/puzzle.json',
      true);
  xmlhttpRequest.send(null);
};

/**
 * @param {!Array<{
 *     bounds: !Array<!Array<number>>,
 *     name: string,
 *     start: !Array<string>,
 *     end: !Array<string>
 * }>} data
 * @private
 */
PuzzleDemo.prototype.loadDataComplete_ = function(data) {
  this.dataLoaded_ = true;
  this.countries_ = data;
  this.start_();
};

/**
 * @param {string} difficulty
 * @private
 */
PuzzleDemo.prototype.setDifficulty_ = function(difficulty) {
  this.difficulty_ = difficulty;

  if (this.map_) {
    this.setDifficultyStyle_();
  }
};

/**
 * @private
 */
PuzzleDemo.prototype.setDifficultyStyle_ = function() {
  var styles = {
    'easy': [
      {
        stylers: [
          { visibility: 'off' }
        ]
      },{
        featureType: 'water',
        stylers: [
            { visibility: 'on' },
            { color: '#d4d4d4' }
        ]
      },{
        featureType: 'landscape',
        stylers: [
          { visibility: 'on' },
          { color: '#e5e3df' }
        ]
      }, {
        featureType: 'administrative.country',
        elementType: 'labels',
        stylers: [
         { visibility: 'on' }
        ]
      }, {
        featureType: 'administrative.country',
        elementType: 'geometry',
        stylers: [
         { visibility: 'on' },
         { weight: 1.3 }
        ]
      }
    ],
    'moderate': [
      {
        stylers: [
          { visibility: 'off' }
        ]
      },{
        featureType: 'water',
        stylers: [
            { visibility: 'on' },
            { color: '#d4d4d4' }
        ]
      },{
        featureType: 'landscape',
        stylers: [
          { visibility: 'on' },
          { color: '#e5e3df' }
        ]
      }, {
        featureType: 'administrative.country',
        elementType: 'labels',
        stylers: [
         { visibility: 'on' }
        ]
      }
    ],
    'hard': [
      {
        stylers: [
          { visibility: 'off' }
        ]
      },{
        featureType: 'water',
        stylers: [
            { visibility: 'on' },
            { color: '#d4d4d4' }
        ]
      },{
        featureType: 'landscape',
        stylers: [
          { visibility: 'on' },
          { color: '#e5e3df' }
        ]
      }
    ],
    'extreme': [
      {
        elementType: 'geometry',
        stylers: [
          { visibility: 'off' }
        ]
      }
    ]
  };

  this.map_.set('styles', styles[this.difficulty_]);
};

/**
 * @private
 */
PuzzleDemo.prototype.resetGame_ = function() {
  this.removeCountries_();
  this.count_ = 0;
  this.setCount_();
  this.startClock_();

  this.addRandomCountries_();
};

/**
 * @private
 */
PuzzleDemo.prototype.setCount_ = function() {
  this.pieceDiv_.innerText = this.count_ + ' / ' + PuzzleDemo.NUM_PIECES_;

  if (this.count_ == PuzzleDemo.NUM_PIECES_) {
    this.stopClock_();
  }
};

/**
 * @private
 */
PuzzleDemo.prototype.stopClock_ = function() {
  window.clearInterval(this.timer_);
};

/**
 * @private
 */
PuzzleDemo.prototype.startClock_ = function() {
  this.stopClock_();

  var timeDiv = this.timeDiv_;
  if (timeDiv) timeDiv.textContent = '0.0 seconds';
  var t = new Date;

  this.timer_ = window.setInterval(function() {
    var diff = new Date - t;
    if (timeDiv) timeDiv.textContent = (diff / 1000).toFixed(2) + ' seconds';
  }, 100);
};

/**
 * @private
 */
PuzzleDemo.prototype.addRandomCountries_ = function() {
  // Shuffle countries
  this.countries_.sort(function() {
    return Math.round(Math.random()) - 0.5;
  });

  var countries = this.countries_.slice(0, PuzzleDemo.NUM_PIECES_);
  for (var i = 0, country; country = countries[i]; i++) {
    this.addCountry_(country);
  }
};

/**
 * @param {{
 *   bounds: !Array<!Array<number>>,
 *   name: string,
 *   start: !Array<string>,
 *   end: !Array<string>
 * }} country
 * @private
 */
PuzzleDemo.prototype.addCountry_ = function(country) {
  var options = {
    strokeColor: PuzzleDemo.START_COLOR_,
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: PuzzleDemo.START_COLOR_,
    fillOpacity: 0.35,
    geodesic: true,
    map: this.map_,
    draggable: true,
    zIndex: 2,
    paths: country.start.map(google.maps.geometry.encoding.decodePath),
  };

  var poly = new google.maps.Polygon(options);
  google.maps.event.addListener(poly, 'dragend', function() {
    this.checkPosition_(poly, country);
  }.bind(this));

  this.polys_.push(poly);
};

/**
 * Checks that every point in the polygon is inside the bounds.
 * @param {!Array<number>} bounds
 * @param {!google.maps.Polygon} poly
 * @returns {boolean}
 */
PuzzleDemo.prototype.boundsContainsPoly_ = function(bounds, poly) {
  var b = new google.maps.LatLngBounds(
      new google.maps.LatLng(bounds[0][0], bounds[0][1]),
      new google.maps.LatLng(bounds[1][0], bounds[1][1]));
  var paths = poly.getPaths().getArray();
  for (var i = 0; i < paths.length; i++) {
    var p = paths[i].getArray();
    for (var j = 0; j < p.length; j++) {
      if (!b.contains(p[j])) {
        return false;
      }
    }
  }
  return true;
};

/**
 * Replace a poly with the correct 'end' position of the country.
 * @param {google.maps.Polygon} poly
 * @param {Object} country
 * @private
 */
PuzzleDemo.prototype.replacePiece_ = function(poly, country) {
  var options = {
    strokeColor: PuzzleDemo.END_COLOR_,
    fillColor: PuzzleDemo.END_COLOR_,
    draggable: false,
    zIndex: 1,
    paths: country.end.map(google.maps.geometry.encoding.decodePath),
  };

  poly.setOptions(options);
  this.count_++;
  this.setCount_();
};

/**
 * @param {google.maps.Polygon} poly
 * @param {Object} country
 * @private
 */
PuzzleDemo.prototype.checkPosition_ = function(poly, country) {
  if (this.boundsContainsPoly_(country.bounds, poly)) {
    this.replacePiece_(poly, country);
  }
};

/**
 * @private
 */
PuzzleDemo.prototype.start_ = function() {
  this.setDifficultyStyle_();
  this.resetGame_();
};

/**
 * @private
 */
PuzzleDemo.prototype.removeCountries_ = function() {
  for (var i = 0, poly; poly = this.polys_[i]; i++) {
    poly.setMap(null);
  };

  this.polys_ = [];
};

function initialize (){
  initMap();
  initAutocomplete();
}

 function clearaddress(){
  localStorage.clear();
   var streetnumber = document.getElementById('street_number');
        var route = document.getElementById('route');
        var city = document.getElementById('locality');
        var state= document.getElementById('administrative_area_level_1');
        var postal_code = document.getElementById('postal_code');
        var country = document.getElementById('country');
        streetnumber.value="";
        route.value="";
        city.value="";
        state.value="";
        postal_code.value="";
        country.value="";
        var ac=document.getElementById('autocomplete');
       ac.value="";
 }     