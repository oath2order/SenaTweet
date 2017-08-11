var searchMethod = {

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

  senIdArr: [],

  state: "",

  setEndpoints: function() {},

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

  searchButtonMethod: function() {
    this.firstName = $("#first-name-bar").val();
    this.lastName = $("#last-name-bar").val();
    this.setSenId(this.firstName, this.lastName);
  },

  setSenId: function(firstName, lastName) {
    this.senIdArr = [];
    if ($("#search-by-name").hasClass("active")) {
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
            //PLEASE replace this
            alert("your search did not return any results");
          }
        });
      });
    } else if ($("#search-by-state").hasClass("active")) {
      this.state = ;
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

$("#search-button").on("click", function() {
  searchMethod.searchButtonMethod();
});