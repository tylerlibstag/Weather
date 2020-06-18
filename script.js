//

var apiKey = "463b3c960f5b108262171de55f875148";
var searchBtn = $("#search-button");


function displayHistory(){
    var history = localStorage.getItem("history");
    
    if(history){
    history = JSON.parse(history);
    for(var i = 0; i < history.length; i++){
        var hBtn = $("<button>").text(history[i]).attr("class", "history-search");
        $(".history").append(hBtn);
    }
}
}
displayHistory();

searchBtn.on("click", function (city) {
    var city = $("#search-value").val();
    initialWeather(city)
});
$(".history-search").on("click", function(){
    console.log('u got clicked')
    var cityToSearch = $(this).text()
    initialWeather(cityToSearch)
})

function initialWeather(city){
    
    saveHistory(city);
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
        multiDay(city);


    });
}


function saveHistory(city){
   
    var pastHistory = JSON.parse(localStorage.getItem("history"));
   if(pastHistory){
    pastHistory.push(city);
    // console.log("is working", pastHistory)
    
    var strHistory = JSON.stringify(pastHistory);
   
    localStorage.setItem("history", strHistory);
   } 
}

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

function multiDay(city) {
    //var city = $("#search-value").val();
    var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;

    $.ajax({
        url: forecastURL,
        method: "GET"
    }).then(function (response) {
        console.log(response);
        $("#forecast5").empty()
        for (var i = 0; i < response.list.length; i++) {



            if (response.list[i].dt_txt.indexOf("12:00:00") !== -1) {
                
                var wCol = $("<div>").addClass("col-md-3");
                var wImgs = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                var wTemps = (response.list[i].main.temp - 273.15) * 1.80 + 32;
                var wTitle = $("<h3>").addClass("wName").text(response.city.name + new Date(response.list[i].dt_txt).toLocaleDateString());

                
                var wHumid = (response.list[i].main.humidity)
               
                //$("#forecast5").text("Temperature (F) " + wTemps.toFixed(2));
                //$("#forecast5").append(wImgs, wTemps);
                //$(".humidity5").append(wHumid)
                wCol.append(wTitle,wTemps,wImgs,wHumid)
                $("#forecast5").append(wCol)
                console.log(response.list[i]);

            }


           

        }
    });

}

// narrow down the response data to exactly what you need (ex. 5 week forcast)
         // response.forecast

         // loop 

