var Movie = Backbone.Model.extend({

});

var MovieList = Backbone.Collection.extend({
    model: Movie
})

//Marker information for movie locations
var markersArray = [];
var colorArray = ["FE7569", "4C1BE0", "11F2E7", "705242"];
var colorIndex = 0;


//The View
var AppView = Backbone.View.extend({
    el: $('#rapstar'),

    events: {
        'click #search_btn': 'add_movie_locations',
        'click #remove_movies_btn': 'remove_movie_locations'
    },

    /*******************
      Controller Functions
     *******************/
    codeAddress: function(address, movie, color, map){
        var pinImage = new google.maps.MarkerImage("http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|" + color,
        new google.maps.Size(21, 34),
        new google.maps.Point(0,0),
        new google.maps.Point(10, 34));

        geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          var marker = new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
              animation: google.maps.Animation.DROP,
              title: movie,
              icon: pinImage,
              zIndex: colorIndex
          });
            markersArray.push(marker);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
            });
     },


    add_movie_locations: function(){
        var that = this;
        var movie = $('#search_input').val();
        var pinColor = colorArray[colorIndex];
        if(colorIndex == colorArray.length - 1) colorIndex = 0;
        else colorIndex++;

        $.getJSON( "/" + movie, function( json ) {

            for(var i= 0; i < json.length; i++)
                that.codeAddress(json[i] + ", San Francisco, CA", movie, pinColor, that.map);

            that.add_movie_to_container(movie);
        });
    },

    add_movie_to_container: function(movie){
        $('#movies_container').append('<li class="movie_item">' + movie + '</li>');
    },

    remove_movie_locations: function(){
        if (markersArray) {
            for (var i in markersArray) {
              markersArray[i].setMap(null);
            }
            markersArray.length = 0;
        }

        $('li').remove();
    },

    /**************************
     *  END CONTROLLER FUNCTIONS
     *************************/

   _initialize_map : function(){
        var styles = [
		          {
		            elementType: "geometry",
		            stylers: [
		              { lightness: 33 },
		              { saturation: -90 }
		            ]
		          }
		        ];

	    var mapOptions = {
            center: new google.maps.LatLng(37.765,-122.41),
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: styles
        };

	    this.map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
    },

   _initialize_autocomplete : function(){
        var movietitles = [];

        $.getJSON('/titles', function( json ){
           for(var i=0; i<json.length; i++){
             movietitles.push(json[i]);
           }
        });

        $('#search_input').autocomplete({
            source: movietitles,
            messages: {
                noResults: '',
                results: function() {}
            }
        });
   },


   initialize : function(){
       this._initialize_map();
       this._initialize_autocomplete();
       geocoder = new google.maps.Geocoder();
   }

});

var App = null;

$(function(){
  App = new AppView();
});