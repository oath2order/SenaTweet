
$("#search-button").on("click", function(e) {
  var searchTerm = $("#searchbar").val();
  var senators = getSens(searchTerm);
  console.log(senators);
});

function getSens(searchTerm) {
  var senObject = {};
  var senEndpoint = "congress/v1/members/senate/" + searchTerm + "/current";
  var senURL = "https://api.propublica.org/congress/v1/";
  var senList = {
    "async": true,
    "crossDomain": true,
    "url": senURL + senEndpoint + ".json",
    "method": "GET",
    "headers": {
      "x-api-key": "mayRUHtP2kt3W1WNxLvumC4K1LJyC89q9PDbKwQl"
    }
  }

  $.ajax(senList).done(function(response) {
    var senMem = response.results;
    $.each(senMem, function(i) {
        senObject.append(senMem[i]);
        });
    });
  return senObject;
}