$(document).ready(function(){
    console.log('good morning');
//
//
// Getting User location
//
//
const getUserLocation = (() => {
  let userCords;
  let pos;
    if (navigator.geolocation) {

      function error(err) {
        console.warn('ERROR(' + err.code + '): ' + err.message);
      }

      function success(pos) {
        console.log('also here');
        let userCords = pos.coords;
        var location = {lat: userCords.latitude, lng: userCords.longitude}
        console.log(location);
        createMap()
      }

      navigator.geolocation.getCurrentPosition(success, error);

    } else {
      alert('Geolocation is not supported in your browser');
    }
  })()

//
//
// Creating Map
//
//

    const createMap = () => {
      let infowindow = null;
      console.log(location;
   //
  //     let marker = new google.maps.Marker({
  //    position: ,
  //    map: map,
  //    title: 'You be here!',
  //  })
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

      infowindow = new google.maps.InfoWindow({
          content: "holding..."
      });

        map = new google.maps.Map(document.getElementById('map'), mapOptions);

// console.log(userCords);


    };

})
