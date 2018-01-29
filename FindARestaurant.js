var express = require('express');
var http = require('http');
var app = express();

// Start server and listen on http://localhost:3000/
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("app listening at http://%s:%s", host, port)
});

var Request = require("request");
app.get('/getMealPlaces/:placeName/:query', function(req, res){
var coords="";
var arr = [];
// requesting latlon from google geocoding API
Request.get("https://maps.googleapis.com/maps/api/geocode/json?address="+req.params.placeName+"&key=<<Insert google GEOCODE API KEY HERE (WITHOUT QUOTES)>>", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    obj=JSON.parse(body);
	var latitude="";
	var longitude="";
	var shortlat="";
	var shortlng="";
    latitude=(obj.results['0'].geometry.location.lat)+"";
	longitude=(obj.results['0'].geometry.location.lng)+"";
	console.log(typeof(latitude));
	//handling input for foursquare api(format of latlong is xx.yy)
	if (latitude.slice(0,1)=='-')
	{
		shortlat=latitude.slice(0,6);
	}
	else{
		shortlat=latitude.slice(0,5);
	}
	if (longitude.slice(0,1)=='-')
	{
		shortlng=longitude.slice(0,6);
	}
	else{
		shortlng=longitude.slice(0,5);
	}
	coords =shortlat+","+shortlng;
	console.log(coords);
    // finding restaurantName , adddress and image based on foursquare API
    console.log(coords);
    Request.get("https://api.foursquare.com/v2/venues/explore/?ll="+coords+"&query="+req.params.query+"&client_id=<<InsertClientId(WITHOUT QUOTES)>>&client_secret=<<InsertClientSecret(WITHOUT QUOTES)>>&v=20131124", (error, response, body) => {
    if(error) {
        return console.dir(error);
    }
    obj1=JSON.parse(body);
	console.log(obj1.response.groups[0].items[0].venue);
	if(obj1!=null)
	{
    // total results
	var tr = obj1.response.totalResults;
	console.log(tr);
	// displaying top 5 results or the total results fetched whichever is less
	for(var i=0; i< 5 &&  i < tr;i++)
	{
	   var restName=obj1.response.groups[0].items[i].venue.name;
	   var restAddress=obj1.response.groups[0].items[i].venue.location.formattedAddress[0]+" "+obj1.response.groups[0].items[i].venue.location.formattedAddress[1]+" "+obj1.response.groups[0].items[i].venue.location.formattedAddress[2];
       var imageURL=obj1.response.groups[0].items[i].venue.categories[0].icon.prefix;	
       var imagetype=obj1.response.groups[0].items[i].venue.categories[0].icon.suffix;
	   if(restName!=null){
	console.log(obj1.response.groups[0].items[i].venue.name);
	   }
	   else{
		   console.log("Unavailable");
	   }
	   if(restAddress!=null){
	console.log(obj1.response.groups[0].items[i].venue.location.formattedAddress[0]);
	}
	   else{
		   console.log("Unavailable");
	   }
		if(imageURL!=null){
	console.log(obj1.response.groups[0].items[i].venue.categories[0].icon.prefix);
		}
	   else{
		   console.log("Unavailable");
	   }
		if(imagetype!=null){
	console.log(obj1.response.groups[0].items[i].venue.categories[0].icon.suffix);
	}
	   else{
		   console.log("Unavailable");
	   }
	     //creating an object to save the data
		 var obj = '{'
       +'"RestaurantName" : '+restName+','
       +'"RestaurantAddress"  : '+restAddress+','
       +'"RestaurantImage" : '+imageURL+imagetype
       +'}';
	   
       arr.push(obj);

	}
	//creating an array of objects with these parameters and send that back in response
	
	res.send(arr);
	
	}
	else{
		console.log("hello");
		res.end("whatever");
	}
	});

  });

});



