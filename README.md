# Weather Service Application

This program:
* Has user select a city from a dropdown
* Maps that city and displays a map using Googlemaps
* Displays current real time weather information including temperature, dewpoint, wind direction and speed, as well as a summary of the weather

**Controller code**

```

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


```
**GoogleGeolocationService factory code**

```

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


```
**DarkSkyWeatherService factory code**

```

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
    


```

**Directive code**
```

.directive('myConditionsSpecial', ['$sce', function($sce){
        
        
        return{
            restrict: 'E',
            scope: true,
            templateUrl: $sce.trustAsResourceUrl('currentConditions.html')
        };
    }])


```


**filters code**
```

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


```
**Directive html code**

```

<p><img src="{{wsc.google_static_maps_url}}" /></p>
<div class="panel panel-default">
    <div class="panel-body">
        <table class="table table-condensed">
            <tr>
                <td>
                    <span class="label label-info">Report Time:</span>
                </td>
                <td>
                    <span class="badge">{{wsc.observation_time | date : 'medium'}}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <span class="label label-info">Temperature:</span>
                </td>
                <td>
                    <span class="badge">{{wsc.temperature | fahrenheit}}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <span class="label label-info">Dewpoint:</span>
                </td>
                <td>
                    <span class="badge">{{wsc.dewpoint | fahrenheit}}</span>
                </td>
            </tr>
            <tr>
                <td>
                    <span class="label label-info">Wind:</span>
                </td>
                <td>
                    <span class="badge">{{wsc.windBearing | windDirection}} at {{wsc.windSpeed | speed}}</span>
                </td>
            </tr>            
            <tr>
                <td>
                    <span class="label label-info">Current Conditions:</span>
                </td>
                <td>
                    <span class="badge">{{wsc.summary}}</span>
                </td>
            </tr>
            
        </table>
    </div>                                
</div>


```

**Html code**
```

<!doctype html>
<html ng-app="ForecastApp">
	<head>
        
        <!-- Latest compiled and minified CSS -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        
        <!-- Optional theme -->
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">
        
        <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
        
        <!-- Latest compiled and minified JavaScript -->
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>        

		<meta charset="utf-8">
	</head>
	<body>
		<div ng-controller="WeatherServiceController as wsc">
		    <h1>Weather Service Application</h1></br>
             <select ng-model="wsc.selected_city" ng-options="city.name for city in wsc.cities" ng-change=" wsc.getLatLonForSelected()"></select>
            
            <my-conditions-special></my-conditions-special>
            
            
		</div>
        
		<script src="https://code.angularjs.org/1.6.2/angular.min.js"></script>
		<script src="app.js"></script>	        
        
	</body>
</html>



```