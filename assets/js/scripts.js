var senObject = {};
var searchTerm = "";
var senURL = "https://api.propublica.org/congress/v1/";
var senList = {
  "async": true,
  "crossDomain": true,
  "url": "",
  "method": "GET",
  "headers": {
    "x-api-key": "mayRUHtP2kt3W1WNxLvumC4K1LJyC89q9PDbKwQl"
  }
}

var senEndpoint = "";

function setEndpoints(searchTerm) {
  if ($("#search-by-name").hasClass("active")) {
    searchTerm = senId;
    senEndpoint = "115/Senate/" + searchTerm + ".json";
  } else if ($("#search-by-state").hasClass("active")) {
    senEndpoint = "members/Senate/" + searchTerm + "/current.json";
  }
}

$("#search-by-name").on("click", function() {
  $("button").removeClass("active");
  $(this).addClass("active");
});

$("#search-by-state").on("click", function() {
  $("button").removeClass("active");
  $(this).addClass("active");
});

$("#search-button").on("click", function() {
  searchTerm = $("#searchbar").val();
  setSenId(searchTerm);
  setEndpoints(searchTerm);
  senList.url = senURL + senEndpoint;
  console.log(senList.url);
});

var senId;

function setSenId(searchTerm) {
  var searchArr = searchTerm.split(" ");
  senList.url = senURL + "115/Senate/members.json";
  $.ajax(senList).done(function(response) {
    var senMem = response.results[0].members;
    $.each(senMem, function(i){
      if(senMem[i].first_name == searchArr[0]){
        if(searchArr[1] != undefined){
          if(senMem[i].last_name == searchArr[1]){
            senId = senMem[i].id;
          }
        }
      } else{
        senId = senMem[i].id;
      }
    });
  });
}