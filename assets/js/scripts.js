//searchMethod is the object in which all the variables and functions for our search bar, search types, and submit button are held; one major problem is that all the id and class identifiers are interspersed throught the method rather than defined up top within a bunch of variables, so when it comes time to integrate this into the rest of the project someone will have to go through and replace every single tag with the correct one, either here or in the html file

var searchMethod = {

  //all the variables are kept on top
  firstName: "",
  lastName: "",
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

  senEndpoint: "",

  //this is what we'll need to use for our populate function outside of the search function, these are eventually what get passed into the members API; Josh, hopefully this is what you're looking for
  senIdArr: [],

  state: "",

  //there are functions added for every button for every search type we are doing
  activateNameButton: function(button) {
    $("button").removeClass("active");
    $(button).addClass("active");
    $("#states").hide();
    $("#first-name").show();
    $("#last-name").show();
  },

  activateStatesButton: function(button) {
    $("button").removeClass("active");
    $(button).addClass("active");
    $("#first-name").hide();
    $("#last-name").hide();
    $("#states").show();
  },

  //function for input validation, kept separate so that it can be called when needed, I'm using alerts for now just to test functionality, someone PLEASE replace them with modals like they're supposed to be (see below)
  inputValidation: function(input) {
    if (input !== "") {
      if (/^[a-zA-Z]+/.test(input)) {
        return input;
      } else {
        alert("invalid");
      }
    } else if ($("input").val() == "") {
      //someone PLEASE change this
      alert("your field is empty, please type something");
    }
  },

  //these are the functions for our search types, the search by name function ended up being huge;

  searchByName: function() {
    this.firstName = this.inputValidation($("#first-name-bar").val());
    this.lastName = this.inputValidation($("#last-name-bar").val());
    this.senList.url = this.senURL + "115/Senate/members.json";
    $.ajax(this.senList).done(function(response) {
      var senMem = response.results[0].members;
      if (searchMethod.firstName !== "" && searchMethod.lastName == "") {
        $.each(senMem, function(i) {
          if (senMem[i].first_name == searchMethod.firstName) {
            searchMethod.senIdArr.push(senMem[i].id);
          }
        });
      } else if (searchMethod.lastName !== "" && searchMethod.firstName == "") {
        $.each(senMem, function(i) {
          if (senMem[i].last_name == searchMethod.lastName) {
            searchMethod.senIdArr.push(senMem[i].id);
          }
        });
      } else if (searchMethod.firstName !== "" && searchMethod.lastName !== "") {
        $.each(senMem, function(i) {
          if (senMem[i].first_name == searchMethod.firstName && senMem[i].last_name == searchMethod.lastName) {
            searchMethod.senIdArr.push(senMem[i].id);
          }
        });
      }
    });
  },

  searchByState: function() {
    this.state = $("#state-bar").text();
    console.log(this.state);
    this.senList.url = this.senURL + "members/senate/" + this.state + "/current.json";
    $.ajax(this.senList).done(function(response) {
      var senMem = response.results;
      $.each(senMem, function(i) {
        searchMethod.senIdArr.push(senMem[i].id);
      });
    });
  },

  //this will determine what kind of endpoint we're using and based on that will populate senIdArr with all the IDs of all the senators it finds that match the search criteria
  setSenId: function() {
    this.senIdArr = [];
    if ($("#name-button").hasClass("active")) {
      this.searchByName();
    } else if ($("#states-button").hasClass("active")) {
      this.searchByState();
    }
    console.log(this.senIdArr);
  }

}


//all the event listeners/callbacks are down here, again, once we start integrating this whole method into the rest of the project, we will need to replace all the id and class tags either here or in the html file
$("#name-button").on("click", function() {
  searchMethod.activateNameButton(this);
});

$("#states-button").on("click", function() {
  searchMethod.activateStatesButton(this);
});

$("#states-menu li a").on("click", function() {
  $("#state-bar").text($(this).attr("value"));
});

$("#search-button").on("click", function() {
  searchMethod.setSenId();
});