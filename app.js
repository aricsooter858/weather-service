angular.module("ForecastApp", [])
    .filter('fahrenheit', [function(){
        return function(temp){
            var c = (temp - 32) * 5/9;
            var roundc = Math.round(c * 10) / 10;
            var roundtemp = Math.round(temp * 10) / 10;
            return roundtemp + '°F' + ' (' + roundc + '°C' + ')';
        };
    }])
    
    .filter('windDirection', [function(){
        return function(direction){
          if(direction >= 348 && direction <=11){
              return 'From the N';
          }
          else if(direction >= 12 && direction <=33){
              return 'From the NNE';
          }
          else if(direction >= 33 && direction <=56){
              return 'From the NE';
          }
          else if(direction >= 56& direction <=78){
              return 'From the ENE';
          }
          else if(direction >= 78 && direction <=101){
              return 'From the E';
          }
          else if(direction >= 101 && direction <=123){
              return 'From the ESE';
          }
          else if(direction >= 123 && direction <=146){
              return 'From the SE';
          }
          else if(direction >= 146 && direction <=168){
              return 'From the SSE';
          }
          else if(direction >= 168 && direction <=191){
              return 'From the S';
          }
          else if(direction >= 191 && direction <=213){
              return 'From the SSW';
          }
          else if(direction >= 213 && direction <=236){
              return 'From the SW';
          }
          else if(direction >= 236 && direction <=258){
              return 'From the WSW';
          }
          else if(direction >= 258 && direction <=281){
              return 'From the W';
          }
          else if(direction >= 281 && direction <=303){
              return 'From the WNW';
          }
          else if(direction >= 303 && direction <=326){
              return 'From the NW';
          }
          else{
              return 'From the NNW';
          }
        };
    }])
    
    .filter('speed', [function(){
        return function(speed){
            return speed + ' MPH';
        };
    }])
    .controller("WeatherServiceController", ["$scope", "$http", 
        "GoogleGeolocationService", "DarkSkyWeatherService",
        function($scope, $http, 
                 GoogleGeolocationService,
                 DarkSkyWeatherService){
	   
            var wsc = this;
            
            wsc.selected_lat = 0;
            wsc.selected_lon = 0;
            
            wsc.app_name = "Weather App";
        
             wsc.cities = 
            [
                {
                    name: "Amarillo",
                    url_name: "Amarillo",
                    state: "TX",
                    lat: 0,
                    lon: 0
                }, 
                {
                    name: "Lubbock",
                    url_name: "Lubbock",
                    state: "TX",
                    lat: 0,
                    lon: 0
                },
                {
                    name: "Dallas",
                    url_name: "Dallas",
                    state: "TX",
                    lat: 0,
                    lon: 0
                },
                {
                    name: "Angel Fire",
                    url_name: "Angel Fire",
                    state: "NM",
                    lat: 0,
                    lon: 0
                },
                {
                    name: "Tulsa",
                    url_name: "Tulsa",
                    state: "OK",
                    lat: 0,
                    lon: 0
                }
            ];
            
            wsc.getLatLonForSelected = function(){
                GoogleGeolocationService.geoLocate(wsc.selected_city)
                    .then(function(res){
                        wsc.selected_lat = res.data.results[0].geometry.location.lat;
                        wsc.selected_lon = res.data.results[0].geometry.location.lng;
                        
                       wsc.selected_city.lat = wsc.selected_lat;
                       wsc.selected_city.lon = wsc.selected_lon;
                        

                        var google_static_maps_key = "AIzaSyC4tT_4VUXDbiSLz_AJVuTLDOzewjj7O9A";
                        
                        wsc.google_static_maps_url = "https://maps.googleapis.com/maps/api/staticmap?center=" +
                                                     wsc.selected_lat + "," +
                                                     wsc.selected_lon + 
                                                     "&zoom=10&size=600x300&key=" +
                                                     google_static_maps_key;
                                                     
                        console.log("Google Static Map API URL");
                        console.log(wsc.google_static_maps_url);                        
                        
                        
                        
                        wsc.getCurrentConditions();        
                        
                    })
                    .catch(function(err){
                        console.log(err);
                    });
            };
            
            wsc.getCurrentConditions = function(){
                DarkSkyWeatherService.getCurrentConditions(wsc.selected_city)
                    .then(function(res){
                        console.log(res);
                        
                        wsc.observation_time = new Date(res.data.currently.time * 1000);
                        wsc.temperature      = res.data.currently.temperature;
                        wsc.dewpoint         = res.data.currently.dewPoint;
                        wsc.windBearing      = res.data.currently.windBearing;
                        wsc.windSpeed        = res.data.currently.windSpeed;
                        wsc.summary          = res.data.currently.summary;
                        
                    })
                    .catch(function(err){
                        
                    });
            };
            
            wsc.selected_city = wsc.cities[0];
            wsc.getLatLonForSelected();

            
    }])
    .directive('myConditionsSpecial', ['$sce', function($sce){
        
        
        return{
            restrict: 'E',
            scope: true,
            templateUrl: $sce.trustAsResourceUrl('currentConditions.html')
        };
    }])
    .factory('GoogleGeolocationService', ['$sce', '$http', 
        function($sce, $http){
            //https://docs.angularjs.org/api/ng/service/$sce
            
            var geolocationService = {};
            
            var key = "AIzaSyDWoJlviagvqEXUi3s04rkKHCbfSIzkTZw";
            
            geolocationService.geoLocate = function(location){

                var address = "+" + location.name + ",+" + location.state;
                var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" +
                          address + "&key=" + key;

                var trustedurl = $sce.trustAsResourceUrl(url);
                return $http.get(trustedurl);
            };
            
            return geolocationService;            
            
        }])
    .factory('DarkSkyWeatherService',['$sce', '$http', 
        function($sce, $http){
            
            var darkSkyWeatherService = {};
            
            var key = "7d6b840a8882bb9b82bdb940fe731e14";
            
            darkSkyWeatherService.getCurrentConditions = function(location){
                
                var url = "https://api.darksky.net/forecast/" +
                          key + "/" + location.lat + "," + location.lon;
                          
                console.log("DarkSky API URL:");
                console.log(url);
                
                var trustedurl = $sce.trustAsResourceUrl(url);
                return $http.jsonp(trustedurl, {jsonpCallbackParam: 'callback'});
                
            };
            
            return darkSkyWeatherService;
        }
    ]);
    