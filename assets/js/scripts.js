//api params
var senEndpoint = "members";
var senURL = "https://api.propublica.org/congress/v1/";
var senList   = {
  "async": true,
  "crossDomain": true,
  "url": " ",
  "method": "GET",
  "headers": {
    "x-api-key": "mayRUHtP2kt3W1WNxLvumC4K1LJyC89q9PDbKwQl"
  }
}
//object to hold senator data
senObject = {};

//senator search function and API call. 
//If only first name is given will return the last matching senator it finds. Will only return one senator at present
$("#search-button").on("click", function(e) {
  var searchArr = $("#searchbar").val().split(" ");
  senList.url = senURL + "115/Senate/" + senEndpoint + ".json";
  $.ajax(senList).done(function (response) {
    var senMem = response.results[0].members;
    //runs through list checking each senator and producing an object based on first name and last name if included
    $.each(senMem, function(i){
      if(senMem[i].first_name == searchArr[0]){
        if(searchArr[1] != undefined){
          if(senMem[i].last_name == searchArr[1]){
            senId = senMem[i].id;
        }
      }
      else{
        senId = senMem[i].id;
      }
    }
    });
    produceSen(senId);
  });
});

function produceSen(senId){
  senList.url = senURL + senEndpoint + "/" + senId + ".json";
  $.ajax(senList).done(function (response) {
    senObject = response;
    console.log(senList.url);
    console.log(senObject);
  });

}