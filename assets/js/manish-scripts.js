//api params
var senEndpoint = "members";
var senURL = "https://api.propublica.org/congress/v1/";
var senList = {
  "async": true,
  "crossDomain": true,
  "url": " ",
  "method": "GET",
  "headers": {
    "x-api-key": "mayRUHtP2kt3W1WNxLvumC4K1LJyC89q9PDbKwQl"
  }
}
//object to hold senator data
var senObject = {};

var senObjectArr = [];

//senator search function and API call. 
//If only first name is given will return the last matching senator it finds. Will only return one senator at present
// $("#search-button").on("click", function(e) {
//   var searchArr = $("#searchbar").val().split(" ");
//   senList.url = senURL + "115/Senate/" + senEndpoint + ".json";
//   $.ajax(senList).done(function (response) {
//     var senMem = response.results[0].members;
//     //runs through list checking each senator and producing an object based on first name and last name if included
//     $.each(senMem, function(i){
//       if(senMem[i].first_name == searchArr[0]){
//         if(searchArr[1] != undefined){
//           if(senMem[i].last_name == searchArr[1]){
//             senId = senMem[i].id;
//         }
//       }
//       else{
//         senId = senMem[i].id;
//       }
//     }
//     });
//     produceSen(senId);
//   });
// });


var searchMethod = {

  //all the variables are kept on top
  senURL: "https://api.propublica.org/congress/v1/",
  senList: {
    "async": true,
    "crossDomain": true,
    "url": "",
    "method": "GET",
    "headers": {
      "x-api-key": "mayRUHtP2kt3W1WNxLvumC4K1LJyC89q9PDbKwQl"
    }
  },

  //this is what we'll need to use for our populate function outside of the search function, these are eventually what get passed into the members API; Josh, hopefully this is what you're looking for
  senIdArr: [],

  firstName: "",

  lastName: "",

  state: "",

  party: "",

  //there are functions added for every button for every search type we are doing
  activateNameButton: function(button) {
    $("button").removeClass("active");
    $(button).addClass("active");
    $("#states").hide();
    $("#party").hide();
    $("#first-name").show();
    $("#last-name").show();
  },

  activateStatesButton: function(button) {
    $("button").removeClass("active");
    $(button).addClass("active");
    $("#first-name").hide();
    $("#last-name").hide();
    $("#party").hide();
    $("#states").show();
  },

  activatePartyButton: function(button) {
    $("button").removeClass("active");
    $(button).addClass("active");
    $("#first-name").hide();
    $("#last-name").hide();
    $("#states").hide();
    $("#party").show();
  },

  //function for input validation, kept separate so that it can be called when needed, I'm using console logs in place of actual alerts for now just to test functionality, someone PLEASE replace them with modals like they're supposed to be (see below)
  inputValidation: function(input) {
    if (input !== "") {
      if (/^[a-zA-Z]+/.test(input)) {
        return input;
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  },

  //these are the functions for our search types, the search by name function ended up being huge;

  searchByName: function() {
    this.firstName = this.inputValidation($("#first-name-bar").val());
    this.lastName = this.inputValidation($("#last-name-bar").val());
    this.senList.url = this.senURL + "115/Senate/members.json";
    $.ajax(this.senList).done(function(response) {
      var senMem = response.results[0].members;
      if (searchMethod.firstName !== undefined && searchMethod.lastName == undefined) {
        $.each(senMem, function(i) {
          if (senMem[i].first_name.toLowerCase() == searchMethod.firstName.toLowerCase()) {
            searchMethod.senIdArr.push(senMem[i].id);
          }
        });
        for (var i = 0; i < searchMethod.senIdArr.length; i++) {
          produceSen(searchMethod.senIdArr[i]);
        }
      } else if (searchMethod.lastName !== undefined && searchMethod.firstName == undefined) {
        $.each(senMem, function(i) {
          if (senMem[i].last_name.toLowerCase() == searchMethod.lastName.toLowerCase()) {
            searchMethod.senIdArr.push(senMem[i].id);
          }
        });
        for (var i = 0; i < searchMethod.senIdArr.length; i++) {
          produceSen(searchMethod.senIdArr[i]);
        }
      } else if (searchMethod.firstName !== undefined && searchMethod.lastName !== undefined) {
        $.each(senMem, function(i) {
          if (senMem[i].first_name.toLowerCase() == searchMethod.firstName.toLowerCase() && senMem[i].last_name.toLowerCase() == searchMethod.lastName.toLowerCase()) {
            searchMethod.senIdArr.push(senMem[i].id);
          }
        });
        for (var i = 0; i < searchMethod.senIdArr.length; i++) {
          produceSen(searchMethod.senIdArr[i]);
        }
      } else if (searchMethod.firstName == undefined && searchMethod.lastName == undefined) {
        console.log("your field is either empty or invalid, please try again");
      }
    });
  },

  searchByState: function() {
    this.state = $("#state-bar").text();
    console.log(this.state);
    this.senList.url = this.senURL + "members/senate/" + this.state + "/current.json";
    if (this.state !== "") {
      $.ajax(senList).done(function(response) {
        var senMem = response.results;
        $.each(senMem, function(i) {
          searchMethod.senIdArr.push(senMem[i].id);
        });
        console.log(searchMethod.senIdArr);
      });
      for (var i = 0; i < searchMethod.senIdArr.length; i++) {
        produceSen(searchMethod.senIdArr[i]);
      }
    } else {
      console.log("specify a state first");
    }
  },

  searchByParty: function() {
    this.party = $("#party-bar").val();
    console.log(this.party);
    this.senList.url = this.senURL + "115/Senate/members.json";
    if (this.party !== "") {
      $.ajax(senList).done(function(response) {
        var senMem = response.results[0].members;
        $.each(senMem, function(i) {
          if (senMem[i].party == searchMethod.party) {
            searchMethod.senIdArr.push(senMem[i].id);
          }
        });
        console.log(searchMethod.senIdArr);
      });
    } else {
      console.log("specify a party first");
    }
  },

  //this will determine what kind of endpoint we're using and based on that will populate senIdArr with all the IDs of all the senators it finds that match the search criteria
  setSenId: function() {
    this.senIdArr = [];
    if ($("#name-button").hasClass("active")) {
      this.searchByName();
    } else if ($("#states-button").hasClass("active")) {
      this.searchByState();
    } else if ($("#party-button").hasClass("active")) {
      this.searchByParty();
    }
  }

}

function produceSen(senId) {
  senList.url = senURL + senEndpoint + "/" + senId + ".json";
  $.ajax(senList).done(function(response) {
    senObject = response;
    console.log(senList.url);
    console.log(senObject);
  });
}


//all the event listeners/callbacks are down here, again, once we start integrating this whole method into the rest of the project, we will need to replace all the id and class tags either here or in the html file
$("#name-button").on("click", function() {
  searchMethod.activateNameButton(this);
});

$("#states-button").on("click", function() {
  searchMethod.activateStatesButton(this);
});

$("#party-button").on("click", function() {
  searchMethod.activatePartyButton(this);
});

$("#states-menu li a").on("click", function() {
  $("#state-bar").text($(this).text())
  $("#state-bar").val($(this).attr("value"));
});

$("#party-menu li a").on("click", function() {
  $("#party-bar").text($(this).text())
  $("#party-bar").val($(this).attr("value"));
});

$("#search-button").on("click", function() {
  searchMethod.setSenId();
  searchMethod.produceSen();
});