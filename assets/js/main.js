$(function() {
  var submitButton = $("#search");
  var addressField = $("#address");
  var clearAllButton = $("#clear_all");

  function loadJSONData(path, callback) {
    $.getJSON(window.location.href + 'data/' + path + '.json', function(data) {
      callback(data);
    });
  }

  function searchQueryUrl(name) {
      var query = "https://www.google.com/search?q=";
      var split_words = name.split(" ");
      for(var i = 0; i < split_words.length; i++) {
          if (i != split_words.length - 1) {
              query += split_words[i] + "+";
          } else {
              query += split_words[i];
          }
      }
      return query;
  }

  function googleMapsSearchQuery(name) {
      var query = "https://www.google.com/maps/place/";
      var split_words = name.split(" ");
      for(var i = 0; i < split_words.length; i++) {
          if (i != split_words.length - 1) {
              query += split_words[i] + "+";
          } else {
              query += split_words[i];
          }
      }
      return query;
  }

  function handleContent(type, place) {

      var website_url = place['Website'] != undefined ? place['Website'] : searchQueryUrl(place['Name']);
      var content = '';


      var factype_color_classes = {
          "soup_kitchens": "orange-color",
          "senior_centers": "red-color",
          "snap_centers": "green-color",
          "food_pantries": "yellow-color",
          "food_scraps": "blue-color",
          "clothing_charities": "pink-color",
          "homeless_shelters": "purple-color",
          "volunteer": "lightblue-color",
          "medical_centers": "hospital-color"
      };

      var factype_display_names = {
          "soup_kitchens": "Soup Kitchen",
          "senior_centers": "Senior Center",
          "snap_centers": "SNAP Center",
          "food_pantries": "Food Pantry",
          "food_scraps": "Food Scrap Drop-off Site",
          "clothing_charities": "Clothing Charity",
          "homeless_shelters": "Homeless Shelter",
          "volunteer": "Community Service Center",
          "medical_centers": place['Type']
      }

      var factype_gif_images = {
          "soup_kitchens": "soupkitchen.gif",
          "senior_centers": "seniorcenter.gif",
          "snap_centers": "snapcenter.gif",
          "food_pantries": "foodpantry.gif",
          "food_scraps": "foodscrapdropoffcenter.gif",
          "clothing_charities": "clothingshelter.gif",
          "homeless_shelters": "homelessshelter.gif",
          "volunteer": "volunteer.png",
          "medical_centers": "health.png"
      }

      var factype_marker_images = {
          "soup_kitchens": "orange-dot.png",
          "senior_centers": "red-dot.png",
          "snap_centers": "green-dot.png",
          "food_pantries": "yellow-dot.png",
          "food_scraps": "blue-dot.png",
          "clothing_charities": "pink-dot.png",
          "homeless_shelters": "purple-dot.png",
          "volunteer": "lightblue-dot.png",
          "medical_centers": "hospital.png"
      }

      var opening_div_tag = '<div class="place_info ' + factype_color_classes[type] + '">';
      content += opening_div_tag;
      content += '<a target="_blank" href="' + website_url + '">' + '<h4 class="firstHeading">' + place['Name'] +               '</h4></a><hr>' +
                '<div id="bodyContent">' +
                    '<ul>';

      var factype = factype_display_names[type];

      content += '<li> Type: <br /><img src="assets/icons/' + factype_gif_images[type] + '" /> <strong>' + factype + '</strong> - <img src="assets/icons/' + factype_marker_images[type] + '" /></li><br />';
      content += '<li> Address: <br /> <strong>' + place['Address'] + '</strong> - <a target="_blank" href="' + googleMapsSearchQuery(place['Address']) + '"> Directions </a></li><br />';

      
      
      if(type === "volunteer") {
        content += '<li> Website: <br /><strong>' + place['URL'] + '</strong></li><br />';
        content += '<li> Phone Number: <br /><strong>' + place['Phone'] + '</strong></li><br />';
        content += '<li> Description: <br /><strong>' + place['Description'] + '</strong></li><br />';
      }
      if (type === "clothing_charities" || type === "homeless_shelters" || type === "snap_centers") {
          content += '<li> Phone Number: <br /> <strong>' + place['Phone Number'] + '</strong></li><br />';
      }

      if (type === "homeless_shelters" || type === "clothing_charities") {
          var website = place['Website'];
          content += '<li> Website: <br /> <strong><a target="_blank" href="' + website + '">' + website + '</a></strong></li><br />';
       }

      if (type === "clothing_charities"){
          content += '<li> Hours: <br /> <strong>' + place['Hours'] + '</strong></li><br />';
      }

      if (type === "food_scraps") {
          var website = place['Website'];
          content += '<li> Website: <br /> <strong><a target="_blank" href="' + website + '">' + website + '</a></strong></li><br />';
          content += '<li> Open Months: <br /> <strong>' + place['MONTH_'] + '</strong></li><br />';
          content += '<li> Days Open: <br /> <strong>' + place['DAYS'] + '</strong></li><br />';
          content += '<li> Hours: <br /> <strong>' + place['STARTTIME'] + ' - ' + place['ENDTIME'] + '</strong></li><br />';
      }

      content += '<li> Borough: <br /> <strong>' + place['Borough'] + '</strong></li><br />';
      content += '<li> Zip Code: <br /> <strong>' + place['Zip Code'] + '</strong></li><br />';

      if (type === "food_pantries" || type === "soup_kitchens") {
          content += '<li> Council District: <br /> <strong>' + place['council district'] + '</strong></li><br />';
      }

      content += '</ul>' +
                 '</div>' +
                    '</div>' +
                        '</span>';

      return content;
  }

  function displayMarkers(map, filename, color) {
    loadJSONData(filename, function(data) {
      data.forEach(function(place) {
        var content = handleContent(filename, place);
        var latitude = place['lat'];
        var longitude = place['lng'];
        map.addMarker({
          lat: latitude,
          lng: longitude,
          icon: 'assets/icons/' + color + '-dot.png',
          click: function(e) {
            $("#panel").html(content);
            map.setCenter(latitude, longitude);
          }
        });
    });
  });
  }
    
  function displayMedicalCenters(map) {
      loadJSONData("medical_centers", function(data) {
         data.forEach(function(place) {
            var content = handleContent("medical_centers", place);
            var latitude = place['lat'];
            var longitude = place['lng'];
            map.addMarker({
            lat: latitude,
            lng: longitude,
            icon: 'assets/icons/hospital.png',
            click: function(e) {
                $("#panel").html(content);
                map.setCenter(latitude, longitude);
            }
            });
        });
      }); 
  }

  function displayCheckedItems(map) {
      $("input:checkbox:checked").each(function(box) {
        var id = $(this).attr("id");
        if(id === "soup_kitchens_checkbox") {
          displayMarkers(map, 'soup_kitchens', 'orange');
        }
        if(id === "senior_centers_checkbox") {
          displayMarkers(map, 'senior_centers', 'red');
        }
        if(id === "snap_centers_checkbox") {
          displayMarkers(map, 'snap_centers', 'green');
        }
        if(id === "food_pantries_checkbox") {
          displayMarkers(map, 'food_pantries', 'yellow');
        }
        if(id === "food_scraps_checkbox") {
          displayMarkers(map, 'food_scraps', 'blue');
        }
        if(id === "homeless_shelters_checkbox") {
            displayMarkers(map, 'homeless_shelters', 'purple');
        }
        if(id === "clothing_charities_checkbox") {
          displayMarkers(map, 'clothing_charities', 'pink');
        }
        if(id === "volunteer_checkbox") {
          displayMarkers(map, 'volunteer', 'lightblue');
        }
        if(id === "medical_centers_checkbox") {
           displayMedicalCenters(map);
        }
      });
  }

  function handleSubmit(map) {
    submitButton.click(function() {
      GMaps.geocode({
        address: addressField.val().trim(),
        callback: function(results, status) {
          if (status == 'OK') {
            var latlng = results[0].geometry.location;
            map.setCenter(latlng.lat(), latlng.lng());
            map.setZoom(14);
            map.addMarker({
            lat: latlng.lat(),
            lng: latlng.lng()
            });
          }
        }
      });
      map.removeMarkers();
      displayCheckedItems(map);
    });
  }

  function init() {
      var map = new GMaps({
        el: '#map',
        lat: 40.7128,
        lng: -74.0060,
        zoom: 11
      });
      displayMarkers(map, 'senior_centers', 'red');
      displayMarkers(map, 'snap_centers', 'green');
      displayMarkers(map, 'soup_kitchens', 'orange');
      displayMarkers(map, 'food_pantries', 'yellow');
      displayMarkers(map, 'food_scraps', 'blue');
      displayMarkers(map, 'homeless_shelters', 'purple');
      displayMarkers(map, 'clothing_charities', 'pink');
      displayMarkers(map, 'volunteer', 'lightblue');
      displayMedicalCenters(map);
      handleSubmit(map);
  }

  init();
});
