"use strict"; 
const apiKey = '';
//api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}
var url = 'https://weathertodayapi.herokuapp.com/openweathermap/data/2.5/weather?q=';

function get(url) {
    return new Promise(function(resolve, reject){
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url);
        httpRequest.onload = function() {
            if(httpRequest.readyState === 4){
                if (httpRequest.status === 200) {
                    //success(httpRequest.responseText);
                    resolve(httpRequest.responseText);
                } else {
                    //fail(httpRequest.status);
                    reject(Error(httpRequest.status));
                }
            }
        }
        httpRequest.onerror = function(){
            reject(Error(httpRequest.status));
        }
        httpRequest.send(); 
    });   
};

function tempToC(kelvin) {
    return ((kelvin - 273.15)).toFixed(0);
}

function onSuccess(response) {
    let data = JSON.parse(response);
    console.log(data);
    let weatherFragment = `
        <h2 class="top">
        <img
            src="http://openweathermap.org/img/w/${data.weather[0].icon}.png"
            alt="${data.weather[0].description}"
            width="50"
            height="50"
        />${data.name}
        </h2>
        <p>
        ${tempToC(data.main.temp)}&deg; | ${data.weather[0].description}
        </p>`
    //location.innerHTML = weatherFragment;
    $('#weather').html(weatherFragment); 
    $("#weather").css("color","black");    
    $("#weather").css("font-weight","bold");
}

function onFail(status) {
    console.log(status);    
    $('#weather').text("Invalid Input, Please try again");
    $('#weather').css("color", "red");
    $('#test_form #location').val("");
}

function prepareQueryParams(postcode){
    let query;    
    query = encodeURIComponent(postcode);
    //append the api-key to the query parameter  
    //query += "&appid=";
    //query += apiKey;
    return query;
}

const checkCompletionAndGet = function(form)
{
    var value =  form["location"].value;
    if(value != ""){
        let endpoint = url;
        endpoint += prepareQueryParams(value);
        get(endpoint)
            .then((response)=>onSuccess(response))
            .catch((status)=>onFail(status));
    }
    return false;
}

const clearInput = function(){    
    $('#test_form #location').val("");    
    $('#weather').html(""); 
}