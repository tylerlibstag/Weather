//

var apiKey = "463b3c960f5b108262171de55f875148";
var searchBtn = $("#search-button");




searchBtn.on("click", function (e) {

    var city = $("#search-value").val();

    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;



    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {


        
        var wTemp = (response.main.temp - 273.15) * 1.80 + 32;
        var wWind = (response.wind.speed * (3600 / 1609.344))
        $(".tempF").text("Temperature (F) " + wTemp.toFixed(2));
        $(".wind").text("Wind Speed: (MPH) " + wWind.toFixed(2));
        $(".humidity").text("Humidity: " + response.main.humidity);
        var wImg = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.weather[0].icon + ".png");
        var cName = $(".cName")
        $("#forecast").append(wImg);
        cName.text(response.name + " (" + new Date().toLocaleDateString() + ")").css({ 'color': 'grey', 'font-size': '150%' });;
        uvIndex(response.coord.lat, response.coord.lon);
        multiDay();


    });



});
function uvIndex(lat, lon) {
    var uvURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely, hourly&appid=" + apiKey;
    $.ajax({
        url: uvURL,
        method: "GET"
    }).then(function (response) {
        $(".UV").text("UV: " + response.current.uvi);

        if (response.current.uvi.value < 3) {
            $(".UV").text("UV: " + response.current.uvi).css('color', 'green');

        }
        else if (response.current.uvi.value < 7) {
            $(".UV").text("UV: " + response.current.uvi).css('color', 'yellow');

        }
        else {
            $(".UV").text("UV: " + response.current.uvi).css('color', 'red');
        }

    });



}
function multiDay() {
    var city = $("#search-value").val();
    var forecastURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        for(var i = 0; i < response.list.length; i++) {

             if (response.list[i].dt_txt.indexOf("12:00:00") !== -1){ 
                var wTemps = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                var wImgs = $("<img>").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                var wHumid = (response.list[i].main.humidity)
                
                //$(".temp5").text("Temperature (F) " + wTemps.toFixed(i));
                $("#forecast5").append(wImgs, wTemps);
                $(".humidity5").append(wHumid)
                console.log(wHumid);
             }
            


           
        }
    });

}

// narrow down the response data to exactly what you need (ex. 5 week forcast)
         // response.forecast

         // loop 

