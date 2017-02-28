$(document).ready(function(){

//
//
// Getting City/Zip Input
//
//
var zipCode;
const getZipCode = (code) => {
  zipCode = code;
};

const getCityZip = () => {
let userZip = $('#zipInput').val()
let unZip = userZip.replace(/\s/g, "");
let city = userZip.substring(0, userZip.indexOf(','));
let state = unZip.substring(unZip.indexOf(',')+1);

$.ajax({
        method: 'GET',
        url:`https://www.zipcodeapi.com/rest/GQpeCrOK38mouQAzxZ3n5xVujiyUped54CjG37r7gOvKE5kc5ozaWuFfNd9csmhw/city-zips.json/${city}/${state}`,
        dataType: "JSON",
        success: function(data) {
          var code = data.zip_codes[0]
          getZipCode(code)
          getZipLocation()
      },
        error: function() {
            console.log('error')
        },
    })


}
$('#zipBtn').click(getCityZip)


var zipLocation;
const getZiploc = (loc) => {
  zipLocation = loc;
};

const getZipLocation = () => {
  $.ajax({
          method: 'GET',
          url:`https://www.zipcodeapi.com/rest/GQpeCrOK38mouQAzxZ3n5xVujiyUped54CjG37r7gOvKE5kc5ozaWuFfNd9csmhw/info.json/${zipCode}/degrees`,
          dataType: "JSON",
          success: function(data) {
            let loc = {lat: data.lat, lng: data.lng}
            getZipLoc(loc)
        },
          error: function() {
              console.log('error')
          },
      })
}


var userLocation;
const getUCords = (cords) => {
  userLocation = cords;
};
//
//
// Getting User location
//
//
const getUserLocation = (() => {
  let userCords;
  let pos;
  var output = document.getElementById("map");

    if (navigator.geolocation) {

      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      }

      function success(pos) {
        userCords = pos.coords;
        var ulocation = {lat: userCords.latitude, lng: userCords.longitude}
        getUCords(ulocation)
        let marker = new google.maps.Marker({
           position: userLocation,
           map: map,
           title: 'You are here!'
         });
      }

      output.innerHTML = "<p id='loc'>Locating…</p>";

      navigator.geolocation.getCurrentPosition(success, error);

    } else {
      alert('Geolocation is not supported in your browser');
    }

  })()

//
//
// Creating Map with Google Search Box
//
//

    const createMap = (() => {
// Create Basic Map
      var mapOptions = {
          zoom: 5,
          center: new google.maps.LatLng(37.09024, -100.712891),
          panControl: false,
          panControlOptions: {
              position: google.maps.ControlPosition.BOTTOM_LEFT
          },
          zoomControl: true,
          zoomControlOptions: {
              style: google.maps.ZoomControlStyle.LARGE,
              position: google.maps.ControlPosition.RIGHT_CENTER
          },
          scaleControl: false

      };

         map = new google.maps.Map(document.getElementById('map'), mapOptions);

         // Create the search box and link it to the UI element.
       var input = document.getElementById('pac-input');
       var searchBox = new google.maps.places.SearchBox(input);
       map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

       // Bias the SearchBox results towards current map's viewport.
       map.addListener('bounds_changed', function() {
         searchBox.setBounds(map.getBounds());
       });

       var markers = [];
       // Listen for the event fired when the user selects a prediction and retrieve
       // more details for that place.
       searchBox.addListener('places_changed', function() {
         var places = searchBox.getPlaces();

         if (places.length == 0) {
           return;
         }

         // Clear out the old markers.
         markers.forEach(function(marker) {
           marker.setMap(null);
         });
         markers = [];

         // For each place, get the icon, name and location.
         var bounds = new google.maps.LatLngBounds();
         places.forEach(function(place) {
           if (!place.geometry) {
             console.log("Returned place contains no geometry");
             return;
           }
           var icon = {
             url: place.icon,
             size: new google.maps.Size(71, 71),
             origin: new google.maps.Point(0, 0),
             anchor: new google.maps.Point(17, 34),
             scaledSize: new google.maps.Size(25, 25)
           };

           // Create a marker for each place.
           markers.push(new google.maps.Marker({
             map: map,
             icon: icon,
             title: place.name,
             position: place.geometry.location
           }));

           if (place.geometry.viewport) {
             console.log(place.geometry.viewport);
             // Only geocodes have viewport.
             bounds.union(place.geometry.viewport);
           } else {
             bounds.extend(place.geometry.location);
           }
         });
         map.fitBounds(bounds);
       });


        //  $('map').appendTo('<input id="pac-input" class="controls" type="text" placeholder="Search Box">');

        //  new AutocompleteDirectionsHandler(map);


       })()

//
//
// Create markers
//
//

const currentLocationMarkers = () => {
   var latitude = userLocation.lat;
   var longitude = userLocation.lng;
   var allLatlng = [];

   $.ajax({
           method: 'GET',
           url:`https://ridb.recreation.gov/api/v1/facilities?latitude=${latitude}&longitude=${longitude}&radius=25&activity=9&apikey=725A64096BA04570B60195D572ED5E38`,
           dataType: "JSON",
           success: function(data) {
             console.log(data);
             let results = data.RECDATA;
             for (var i = 0; i < results.length; i++) {
             for (let unit of results){
               let lat = unit.FacilityLatitude;
               let lng = unit.FacilityLongitude;
                 var latLng = new google.maps.LatLng(lat,lng);
                 allLatlng.push(latLng);
                 var marker = new google.maps.Marker({
                   position: latLng,
                   map: map,
                   title: (unit.FacilityName[0].toUpperCase())+(unit.FacilityName.toLowerCase().slice(1))

                 });

             }
           }
               var bounds = new google.maps.LatLngBounds ();
               //  Go through each...
               for (var i = 0, LtLgLen = allLatlng.length; i < LtLgLen; i++) {
                 //  And increase the bounds to take this point
                 bounds.extend (allLatlng[i]);
               }
               //  Fit these bounds to the map
               map.fitBounds (bounds);

         },
           error: function() {
               console.log('error')
           },
       })
}

$('#currLocBtn').click(currentLocationMarkers)

//

// recreation.gov key = 725A64096BA04570B60195D572ED5E38

// facilities results with 25 miles of buolder 'https://ridb.recreation.gov/api/v1/facilities?latitude=40.0167138&longitude=-105.2817749&radius=25&activity="CLIMBING", "CAMPING", "HIKING", "WINTER SPORTS","WILDERNESS", "FIRE LOOKOUTS/CABINS OVERNIGHT", "PADDLING"apikey=725A64096BA04570B60195D572ED5E38',
// ActivityName:"BIKING"-5, "CLIMBING"-7, "CAMPING"-9, "FISHING"-11 "HIKING"-14, "WINTER SPORTS"-22,"WILDERNESS"-28, "FIRE LOOKOUTS/CABINS OVERNIGHT"-30, "PADDLING"-105, "SWIMMING SITE"-34,

// https://ridb.recreation.gov/api/v1/facilities?latitude=40.0167138&longitude=-105.2817749&radius=25&activity=13&apikey=725A64096BA04570B60195D572ED5E38

// https://ridb.recreation.gov/api/v1/activities?apikey=725A64096BA04570B60195D572ED5E38






})
