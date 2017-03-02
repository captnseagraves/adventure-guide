$(document).ready(function() {

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
        let state = unZip.substring(unZip.indexOf(',') + 1);

        $.ajax({
            method: 'GET',
            url: `https://www.zipcodeapi.com/rest/GQpeCrOK38mouQAzxZ3n5xVujiyUped54CjG37r7gOvKE5kc5ozaWuFfNd9csmhw/city-zips.json/${city}/${state}`,
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
    //
    $('#zipBtn').click(function() {
        console.log($('#zipInput').val());
        if (isNaN(parseInt($('#zipInput').val()))) {
            getCityZip();
        }
        if (!isNaN(parseInt($('#zipInput').val()))) {
            zipCode = $('#zipInput').val()
            getZipLocation()
        }
    })
    // $('#zipBtn').click(getCityZip)



    var zipLocation;
    const getZipLoc = (loc) => {
        zipLocation = loc;
    };

    const getZipLocation = () => {
        $.ajax({
            method: 'GET',
            url: `https://www.zipcodeapi.com/rest/GQpeCrOK38mouQAzxZ3n5xVujiyUped54CjG37r7gOvKE5kc5ozaWuFfNd9csmhw/info.json/${zipCode}/degrees`,
            dataType: "JSON",
            success: function(data) {
                let loc = {
                    lat: data.lat,
                    lng: data.lng
                }
                getZipLoc(loc)
                zipMarkers()
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
                var ulocation = {
                    lat: userCords.latitude,
                    lng: userCords.longitude
                }
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

        // // Create the search box and link it to the UI element.
        // var input = document.getElementById('pac-input');
        // var searchBox = new google.maps.places.SearchBox(input);
        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        //
        // // Bias the SearchBox results towards current map's viewport.
        // map.addListener('bounds_changed', function() {
        //     searchBox.setBounds(map.getBounds());
        // });
        //
        // var markers = [];
        // // Listen for the event fired when the user selects a prediction and retrieve
        // // more details for that place.
        // searchBox.addListener('places_changed', function() {
        //     var places = searchBox.getPlaces();
        //
        //     if (places.length == 0) {
        //         return;
        //     }
        //
        //     // Clear out the old markers.
        //     markers.forEach(function(marker) {
        //         marker.setMap(null);
        //     });
        //     markers = [];
        //
        //     // For each place, get the icon, name and location.
        //     var bounds = new google.maps.LatLngBounds();
        //     places.forEach(function(place) {
        //         if (!place.geometry) {
        //             console.log("Returned place contains no geometry");
        //             return;
        //         }
        //         var icon = {
        //             url: place.icon,
        //             size: new google.maps.Size(71, 71),
        //             origin: new google.maps.Point(0, 0),
        //             anchor: new google.maps.Point(17, 34),
        //             scaledSize: new google.maps.Size(25, 25)
        //         };
        //
        //         // Create a marker for each place.
        //         markers.push(new google.maps.Marker({
        //             map: map,
        //             icon: icon,
        //             title: place.name,
        //             position: place.geometry.location
        //         }));
        //
        //         if (place.geometry.viewport) {
        //             console.log(place.geometry.viewport);
        //             // Only geocodes have viewport.
        //             bounds.union(place.geometry.viewport);
        //         } else {
        //             bounds.extend(place.geometry.location);
        //         }
        //     });
        //     map.fitBounds(bounds);
        // });


        //  $('map').appendTo('<input id="pac-input" class="controls" type="text" placeholder="Search Box">');

        //  new AutocompleteDirectionsHandler(map);


    })()

    //
    //
    // Create markers
    //
    //
    const currentLocationMarkers = () => {
      var range = $(':selected').val()
        var latitude = userLocation.lat;
        var longitude = userLocation.lng;
        var allLatLng = [];
        var deferred = [];
        if ($('#camping').prop('checked') === true) {
          deferred.push($.ajax({
              method: 'GET',
              url: `https://ridb.recreation.gov/api/v1/facilities?latitude=${latitude}&longitude=${longitude}&radius=${range}&activity=9&apikey=725A64096BA04570B60195D572ED5E38`,
              dataType: "JSON",
              success: function(data) {
                  // console.log(data);
                  let results = data.RECDATA;
                  for (var i = 0; i < results.length; i++) {
                    let unit = results[i]
                      // for (let unit of results) {
                          let lat = unit.FacilityLatitude;
                          let lng = unit.FacilityLongitude;
                          var latLng = new google.maps.LatLng(lat, lng);
                          allLatLng.push([latLng.lat(), latLng.lng()]);
                          let title = toTitleCase(unit.FacilityName)
                          let phone = unit.FacilityPhone ? unit.FacilityPhone : "No Phone Number Provided";
                          // Create our info window content
                          var infoWindowContent = '<div class="info_content">' +
                              `<h3>${title}</h3>`
                          // `<p>Phone: ${phone}`
                          '</div>';

                          // Initialise the inforWindow
                          var infoWindow = new google.maps.InfoWindow({
                              content: infoWindowContent
                          });

                          var marker = new google.maps.Marker({
                              position: latLng,
                              map: map,
                              title: title,
                              icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                          });

                          // Display our info window when the marker is clicked
                          (function(theMarker, theInfoWindow) {
                              google.maps.event.addListener(marker, 'click', function() {
                                  theInfoWindow.open(map, theMarker)
                              });
                              google.maps.event.addListener(map, "click", function() {
                                  theInfoWindow.close();
                              });
                          })(marker, infoWindow);


                      };
                  // }

              },
                error: function() {
                    console.log('error')
                },
            }))
        }


        if ($('#mtnBiking').prop('checked') === true) {
            deferred.push($.ajax({
                method: 'GET',
                url: `https://ridb.recreation.gov/api/v1/facilities?latitude=${latitude}&longitude=${longitude}&radius=${range}&activity=5&apikey=7${range}A64096BA04570B60195D572ED5E38`,
                dataType: "JSON",
                success: function(data) {
                    // console.log(data);
                    let results = data.RECDATA;
                    for (var i = 0; i < results.length; i++) {
                      let unit = results[i]
                        // for (let unit of results) {
                            let lat = unit.FacilityLatitude;
                            let lng = unit.FacilityLongitude;
                            var latLng = new google.maps.LatLng(lat, lng);
                            allLatLng.push([latLng.lat(), latLng.lng()]);
                            let title = toTitleCase(unit.FacilityName)
                            let phone = unit.FacilityPhone ? unit.FacilityPhone : "No Phone Number Provided";
                            // Create our info window content
                            var infoWindowContent = '<div class="info_content">' +
                                `<h3>${title}</h3>`
                            // `<p>Phone: ${phone}`
                            '</div>';

                            // Initialise the inforWindow
                            var infoWindow = new google.maps.InfoWindow({
                                content: infoWindowContent
                            });

                            var marker = new google.maps.Marker({
                                position: latLng,
                                map: map,
                                title: title,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                            });

                            // Display our info window when the marker is clicked
                            (function(theMarker, theInfoWindow) {
                                google.maps.event.addListener(marker, 'click', function() {
                                    theInfoWindow.open(map, theMarker)
                                });
                                google.maps.event.addListener(map, "click", function() {
                                    theInfoWindow.close();
                                });
                            })(marker, infoWindow);


                        };
                    // }

                },
                error: function() {
                    console.log('error')
                },
            }))
        }

        if ($('#hiking').prop('checked') === true) {
            deferred.push($.ajax({
                method: 'GET',
                url: `https://ridb.recreation.gov/api/v1/facilities?latitude=${latitude}&longitude=${longitude}&radius=${range}&activity=14&apikey=7${range}A64096BA04570B60195D572ED5E38`,
                dataType: "JSON",
                success: function(data) {
                    // console.log(data);
                    let results = data.RECDATA;
                    for (var i = 0; i < results.length; i++) {
                      let unit = results[i]
                        // for (let unit of results) {
                            let lat = unit.FacilityLatitude;
                            let lng = unit.FacilityLongitude;
                            var latLng = new google.maps.LatLng(lat, lng);
                            allLatLng.push([latLng.lat(), latLng.lng()]);
                            let title = toTitleCase(unit.FacilityName)
                            let phone = unit.FacilityPhone ? unit.FacilityPhone : "No Phone Number Provided";
                            // Create our info window content
                            var infoWindowContent = '<div class="info_content">' +
                                `<h3>${title}</h3>`
                            // `<p>Phone: ${phone}`
                            '</div>';

                            // Initialise the inforWindow
                            var infoWindow = new google.maps.InfoWindow({
                                content: infoWindowContent
                            });

                            var marker = new google.maps.Marker({
                                position: latLng,
                                map: map,
                                title: title,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                            });

                            // Display our info window when the marker is clicked
                            (function(theMarker, theInfoWindow) {
                                google.maps.event.addListener(marker, 'click', function() {
                                    theInfoWindow.open(map, theMarker)
                                });
                                google.maps.event.addListener(map, "click", function() {
                                    theInfoWindow.close();
                                });
                            })(marker, infoWindow);


                        };
                    // }

                },
                error: function() {
                    console.log('error')
                },
            }))
        }

        if ($('#climbing').prop('checked') === true) {
            deferred.push($.ajax({
                method: 'GET',
                url: `https://ridb.recreation.gov/api/v1/facilities?latitude=${latitude}&longitude=${longitude}&radius=${range}&activity=7&apikey=7${range}A64096BA04570B60195D572ED5E38`,
                dataType: "JSON",
                success: function(data) {
                    // console.log(data);
                    let results = data.RECDATA;
                    for (var i = 0; i < results.length; i++) {
                      let unit = results[i]
                        // for (let unit of results) {
                            let lat = unit.FacilityLatitude;
                            let lng = unit.FacilityLongitude;
                            var latLng = new google.maps.LatLng(lat, lng);
                            allLatLng.push([latLng.lat(), latLng.lng()]);
                            let title = toTitleCase(unit.FacilityName)
                            let phone = unit.FacilityPhone ? unit.FacilityPhone : "No Phone Number Provided";
                            // Create our info window content
                            var infoWindowContent = '<div class="info_content">' +
                                `<h3>${title}</h3>`
                            // `<p>Phone: ${phone}`
                            '</div>';

                            // Initialise the inforWindow
                            var infoWindow = new google.maps.InfoWindow({
                                content: infoWindowContent
                            });

                            var marker = new google.maps.Marker({
                                position: latLng,
                                map: map,
                                title: title,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                            });

                            // Display our info window when the marker is clicked
                            (function(theMarker, theInfoWindow) {
                                google.maps.event.addListener(marker, 'click', function() {
                                    theInfoWindow.open(map, theMarker)
                                });
                                google.maps.event.addListener(map, "click", function() {
                                    theInfoWindow.close();
                                });
                            })(marker, infoWindow);


                        };
                    // }

                },
                error: function() {
                    console.log('error')
                },
            }))
        }

        if ($('#meteor').prop('checked') === true) {
          $.ajax({
                method: 'GET',
                url: `https://data.nasa.gov/resource/y77d-th95.json`,
                dataType: "JSON",
                success: function(data) {
                    for (let set of data) {

                        let name = set.name;
                        let mass = set.mass;
                        let year = set.year ? set.year.substring(0, 4) : "No Year Data"
                        let lat = set.reclat;
                        let lng = set.reclong;

                        var latLng = new google.maps.LatLng(lat, lng);

                        // allLatLng.push([latLng.lat(), latLng.lng()]);

                        let image = 'meteor.png';

                        // Create our info window content
                        var infoWindowContent = '<div class="info_content">' +
                            `<h3>Meteor Name: ${name}</h3>` +
                            `<p>Mass: ${mass}g </p>` +
                            `<p>Year Meteor Fell: ${year} </p>` +
                            '</div>';

                        // Initialise the inforWindow
                        var infoWindow = new google.maps.InfoWindow({
                            content: infoWindowContent
                        });

                        var marker = new google.maps.Marker({
                            position: latLng,
                            map: map,
                            title: `Meteor name: ${name}`,
                            icon: image
                        });

                        // Display our info window when the marker is clicked
                        (function(theMarker, theInfoWindow) {
                            google.maps.event.addListener(marker, 'click', function() {
                                theInfoWindow.open(map, theMarker)
                            });
                            google.maps.event.addListener(map, "click", function() {
                                theInfoWindow.close();
                            });
                        })(marker, infoWindow);


                    }

                },
                error: function() {
                    console.log('error')
                },
            })
        }


const createBounds = (() => {
  if (($('#camping').prop('checked') === false && $('#mtnBiking').prop('checked') === false && $('#climbing').prop('checked') === false && $('#hiking').prop('checked') === false && $('#meteor').prop('checked') === true)) {
    return null;
}
        var bounds = new google.maps.LatLngBounds();
        //  Go through each...
        for (var i = 0; i < allLatLng.length; i++) {
            //  And increase the bounds to take this point
            bounds.extend({lat: allLatLng[i][0], lng: allLatLng[i][1]});
        }
        //  Fit these bounds to the map
        map.fitBounds(bounds);
      })

      $.when.apply($, deferred).then(createBounds)
    }

    $('#currLocBtn').click(currentLocationMarkers)

    const zipMarkers = () => {

        console.log(zipLocation);
        var range = $(':selected').val()
        var latitude = zipLocation.lat;
        var longitude = zipLocation.lng;
        var allLatLng1 = [];
        var deferred1 = [];
        if ($('#camping').prop('checked') === true) {
          deferred1.push($.ajax({
              method: 'GET',
              url: `https://ridb.recreation.gov/api/v1/facilities?latitude=${latitude}&longitude=${longitude}&radius=${range}&activity=9&apikey=7${range}A64096BA04570B60195D572ED5E38`,
              dataType: "JSON",
              success: function(data) {
                  // console.log(data);
                  let results = data.RECDATA;
                  for (var i = 0; i < results.length; i++) {
                    let unit = results[i]
                      // for (let unit of results) {
                          let lat = unit.FacilityLatitude;
                          let lng = unit.FacilityLongitude;
                          var latLng = new google.maps.LatLng(lat, lng);
                          allLatLng1.push([latLng.lat(), latLng.lng()]);
                          let title = toTitleCase(unit.FacilityName)
                          let phone = unit.FacilityPhone ? unit.FacilityPhone : "No Phone Number Provided";
                          // Create our info window content
                          var infoWindowContent = '<div class="info_content">' +
                              `<h3>${title}</h3>`
                          // `<p>Phone: ${phone}`
                          '</div>';

                          // Initialise the inforWindow
                          var infoWindow = new google.maps.InfoWindow({
                              content: infoWindowContent
                          });

                          var marker = new google.maps.Marker({
                              position: latLng,
                              map: map,
                              title: title,
                              icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                          });

                          // Display our info window when the marker is clicked
                          (function(theMarker, theInfoWindow) {
                              google.maps.event.addListener(marker, 'click', function() {
                                  theInfoWindow.open(map, theMarker)
                              });
                              google.maps.event.addListener(map, "click", function() {
                                  theInfoWindow.close();
                              });
                          })(marker, infoWindow);


                      };
                  // }

              },
                error: function() {
                    console.log('error')
                },
            }))
        }


        if ($('#mtnBiking').prop('checked') === true) {
            deferred1.push($.ajax({
                method: 'GET',
                url: `https://ridb.recreation.gov/api/v1/facilities?latitude=${latitude}&longitude=${longitude}&radius=${range}&activity=5&apikey=7${range}A64096BA04570B60195D572ED5E38`,
                dataType: "JSON",
                success: function(data) {
                    // console.log(data);
                    let results = data.RECDATA;
                    for (var i = 0; i < results.length; i++) {
                      let unit = results[i]
                        // for (let unit of results) {
                            let lat = unit.FacilityLatitude;
                            let lng = unit.FacilityLongitude;
                            var latLng = new google.maps.LatLng(lat, lng);
                            allLatLng1.push([latLng.lat(), latLng.lng()]);
                            let title = toTitleCase(unit.FacilityName)
                            let phone = unit.FacilityPhone ? unit.FacilityPhone : "No Phone Number Provided";
                            // Create our info window content
                            var infoWindowContent = '<div class="info_content">' +
                                `<h3>${title}</h3>`
                            // `<p>Phone: ${phone}`
                            '</div>';

                            // Initialise the inforWindow
                            var infoWindow = new google.maps.InfoWindow({
                                content: infoWindowContent
                            });

                            var marker = new google.maps.Marker({
                                position: latLng,
                                map: map,
                                title: title,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
                            });

                            // Display our info window when the marker is clicked
                            (function(theMarker, theInfoWindow) {
                                google.maps.event.addListener(marker, 'click', function() {
                                    theInfoWindow.open(map, theMarker)
                                });
                                google.maps.event.addListener(map, "click", function() {
                                    theInfoWindow.close();
                                });
                            })(marker, infoWindow);


                        };
                    // }

                },
                error: function() {
                    console.log('error')
                },
            }))
        }

        if ($('#hiking').prop('checked') === true) {
            deferred1.push($.ajax({
                method: 'GET',
                url: `https://ridb.recreation.gov/api/v1/facilities?latitude=${latitude}&longitude=${longitude}&radius=${range}&activity=14&apikey=7${range}A64096BA04570B60195D572ED5E38`,
                dataType: "JSON",
                success: function(data) {
                    // console.log(data);
                    let results = data.RECDATA;
                    for (var i = 0; i < results.length; i++) {
                      let unit = results[i]
                        // for (let unit of results) {
                            let lat = unit.FacilityLatitude;
                            let lng = unit.FacilityLongitude;
                            var latLng = new google.maps.LatLng(lat, lng);
                            allLatLng1.push([latLng.lat(), latLng.lng()]);
                            let title = toTitleCase(unit.FacilityName)
                            let phone = unit.FacilityPhone ? unit.FacilityPhone : "No Phone Number Provided";
                            // Create our info window content
                            var infoWindowContent = '<div class="info_content">' +
                                `<h3>${title}</h3>`
                            // `<p>Phone: ${phone}`
                            '</div>';

                            // Initialise the inforWindow
                            var infoWindow = new google.maps.InfoWindow({
                                content: infoWindowContent
                            });

                            var marker = new google.maps.Marker({
                                position: latLng,
                                map: map,
                                title: title,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
                            });

                            // Display our info window when the marker is clicked
                            (function(theMarker, theInfoWindow) {
                                google.maps.event.addListener(marker, 'click', function() {
                                    theInfoWindow.open(map, theMarker)
                                });
                                google.maps.event.addListener(map, "click", function() {
                                    theInfoWindow.close();
                                });
                            })(marker, infoWindow);


                        };
                    // }

                },
                error: function() {
                    console.log('error')
                },
            }))
        }

        if ($('#climbing').prop('checked') === true) {
            deferred1.push($.ajax({
                method: 'GET',
                url: `https://ridb.recreation.gov/api/v1/facilities?latitude=${latitude}&longitude=${longitude}&radius=${range}&activity=7&apikey=7${range}A64096BA04570B60195D572ED5E38`,
                dataType: "JSON",
                success: function(data) {
                    // console.log(data);
                    let results = data.RECDATA;
                    for (var i = 0; i < results.length; i++) {
                      let unit = results[i]
                        // for (let unit of results) {
                            let lat = unit.FacilityLatitude;
                            let lng = unit.FacilityLongitude;
                            var latLng = new google.maps.LatLng(lat, lng);
                            allLatLng1.push([latLng.lat(), latLng.lng()]);
                            let title = toTitleCase(unit.FacilityName)
                            let phone = unit.FacilityPhone ? unit.FacilityPhone : "No Phone Number Provided";
                            // Create our info window content
                            var infoWindowContent = '<div class="info_content">' +
                                `<h3>${title}</h3>`
                            // `<p>Phone: ${phone}`
                            '</div>';

                            // Initialise the inforWindow
                            var infoWindow = new google.maps.InfoWindow({
                                content: infoWindowContent
                            });

                            var marker = new google.maps.Marker({
                                position: latLng,
                                map: map,
                                title: title,
                                icon: 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png'
                            });

                            // Display our info window when the marker is clicked
                            (function(theMarker, theInfoWindow) {
                                google.maps.event.addListener(marker, 'click', function() {
                                    theInfoWindow.open(map, theMarker)
                                });
                                google.maps.event.addListener(map, "click", function() {
                                    theInfoWindow.close();
                                });
                            })(marker, infoWindow);


                        };
                    // }

                },
                error: function() {
                    console.log('error')
                },
            }))
        }

        if ($('#meteor').prop('checked') === true) {
          $.ajax({
                method: 'GET',
                url: `https://data.nasa.gov/resource/y77d-th95.json`,
                dataType: "JSON",
                success: function(data) {
                    for (let set of data) {

                        let name = set.name;
                        let mass = set.mass;
                        let year = set.year ? set.year.substring(0, 4) : "No Year Data"
                        let lat = set.reclat;
                        let lng = set.reclong;

                        var latLng = new google.maps.LatLng(lat, lng);

                        // allLatLng1.push([latLng.lat(), latLng.lng()]);

                        let image = 'meteor.png';

                        // Create our info window content
                        var infoWindowContent = '<div class="info_content">' +
                            `<h3>Meteor Name: ${name}</h3>` +
                            `<p>Mass: ${mass}g </p>` +
                            `<p>Year Meteor Fell: ${year} </p>` +
                            '</div>';

                        // Initialise the inforWindow
                        var infoWindow = new google.maps.InfoWindow({
                            content: infoWindowContent
                        });

                        var marker = new google.maps.Marker({
                            position: latLng,
                            map: map,
                            title: `Meteor name: ${name}`,
                            icon: image
                        });

                        // Display our info window when the marker is clicked
                        (function(theMarker, theInfoWindow) {
                            google.maps.event.addListener(marker, 'click', function() {
                                theInfoWindow.open(map, theMarker)
                            });
                            google.maps.event.addListener(map, "click", function() {
                                theInfoWindow.close();
                            });
                        })(marker, infoWindow);


                    }

                },
                error: function() {
                    console.log('error')
                },
            })
        }


const createBounds2 = (() => {
  if (($('#camping').prop('checked') === false && $('#mtnBiking').prop('checked') === false && $('#climbing').prop('checked') === false && $('#climbing').prop('checked') === false && $('#meteor').prop('checked') === true)) {
    return null;
}
        var bounds = new google.maps.LatLngBounds();
        //  Go through each...
        for (var i = 0; i < allLatLng1.length; i++) {
            //  And increase the bounds to take this point
            bounds.extend({lat: allLatLng1[i][0], lng: allLatLng1[i][1]});
        }
        //  Fit these bounds to the map
        map.fitBounds(bounds);
      })

      $.when.apply($, deferred1).then(createBounds2)
    }

    function toTitleCase(str) {
        return str.replace(/\w\S*/g, function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    //

    // recreation.gov key = 725A64096BA04570B60195D572ED5E38

    // facilities results with 25 miles of buolder 'https://ridb.recreation.gov/api/v1/facilities?latitude=40.0167138&longitude=-105.2817749&radius=25&activity="CLIMBING", "CAMPING", "HIKING", "WINTER SPORTS","WILDERNESS", "FIRE LOOKOUTS/CABINS OVERNIGHT", "PADDLING"apikey=725A64096BA04570B60195D572ED5E38',
    // ActivityName:"BIKING"-5, "CLIMBING"-7, "CAMPING"-9, "FISHING"-11 "HIKING"-14, "WINTER SPORTS"-22,"WILDERNESS"-28, "FIRE LOOKOUTS/CABINS OVERNIGHT"-30, "PADDLING"-105, "SWIMMING SITE"-34,

    // https://ridb.recreation.gov/api/v1/facilities?latitude=40.0167138&longitude=-105.2817749&radius=25&activity=13&apikey=725A64096BA04570B60195D572ED5E38

    // https://ridb.recreation.gov/api/v1/activities?apikey=725A64096BA04570B60195D572ED5E38






})
