//searchMethod is the object in which all the variables and functions for our search bar, search types, and submit button are held

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

  valid: false,

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

  //function for input validation, kept separate so that it can be called when needed
  inputValidation: function(variable, text){
    console.log(variable);
    console.log(text);
    if (text !== "") {
      console.log("there is text")
      if(/^[a-zA-Z]+/.test(text)){
        variable = text;
        console.log(variable);
        this.valid = true;
      } else{
        console.log("invalid");
      }
    }
    //this.state = $("#states").val($(text).html);
  },

  //the most powerful function in searchMethod, this will determine what kind of endpoint we're using, and based on that will populate senIdArr with all the IDs of all the senators it finds that match the search criteria; some parts need to be replaced (see below)
  setSenId: function(firstName, lastName) {
    this.senIdArr = [];
    if ($("#name-button").hasClass("active")) {
      this.senList.url = this.senURL + "115/Senate/members.json";
      $.ajax(this.senList).done(function(response) {
        var senMem = response.results[0].members;
        $.each(senMem, function(i) {
          if (senMem[i].first_name == firstName && searchMethod.lastName == "") {
            searchMethod.senIdArr.push(senMem[i].id);
          } else if (senMem[i].last_name == lastName && searchMethod.firstName == "") {
            searchMethod.senIdArr.push(senMem[i].id);
          } else if (senMem[i].first_name == firstName && senMem[i].last_name == lastName) {
            searchMethod.senIdArr.push(senMem[i].id);
          } else {
            //someone PLEASE replace this
            alert("your search did not return any results");
            return false;
          }
        });
      });
    } else if ($("#states-button").hasClass("active")) {
      this.senList.url = this.senURL + "members/senate/" + this.state + "/current.json";
      $.ajax(this.senList).done(function(response) {
        var senMem = response.results;
        $.each(senMem, function(i) {
          searchMethod.senIdArr.push(senMem[i].id);
        });
      });
    }
    console.log(this.senIdArr);
  }

}



$("#name-button").on("click", function() {
  searchMethod.activateNameButton(this);
});

$("#states-button").on("click", function() {
  searchMethod.activateStatesButton(this);
});

$("#states-menu li a").on("click", function(){
  searchMethod.inputValidation(this);
  console.log(searchMethod.state);
});

$("#search-button").on("click", function() {
  searchMethod.inputValidation(searchMethod.firstName, $("#first-name-bar").val());
  searchMethod.inputValidation(searchMethod.lastName, $("#last-name-bar").val());
  if(searchMethod.valid == true){
    console.log("good to go")
    console.log(searchMethod.firstName, searchMethod.lastName);
    // searchMethod.setSenId(searchMethod.firstName, searchMethod.lastName);
  }
});