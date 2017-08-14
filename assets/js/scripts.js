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
        console.log("invalid");
      }
    }
  },

  //these are the functions for our search types, the search by name function ended up being huge;

  searchByName: function() {
    this.firstName = this.inputValidation($("#first-name-bar").val().trim());
    this.lastName = this.inputValidation($("#last-name-bar").val().trim());
    this.senList.url = this.senURL + "115/Senate/members.json";
    $.ajax(this.senList).done(function(response) {
      var senMem = response.results[0].members;
      if (searchMethod.firstName !== undefined && searchMethod.lastName == undefined) {
        $.each(senMem, function(i) {
          if (senMem[i].first_name.toLowerCase() == searchMethod.firstName.toLowerCase()) {
            searchMethod.senIdArr.push(senMem[i].id);
            searchMethod.renderSearch(senMem[i].first_name, senMem[i].last_name, senMem[i].party, senMem[i].state, senMem[i].id);
          }
        });
      } else if (searchMethod.lastName !== undefined && searchMethod.firstName == undefined) {
        $.each(senMem, function(i) {
          if (senMem[i].last_name.toLowerCase() == searchMethod.lastName.toLowerCase()) {
            searchMethod.senIdArr.push(senMem[i].id);
            searchMethod.renderSearch(senMem[i].first_name, senMem[i].last_name, senMem[i].party, senMem[i].state, senMem[i].id);
          }
        });
      } else if (searchMethod.firstName !== undefined && searchMethod.lastName !== undefined) {
        $.each(senMem, function(i) {
          if (senMem[i].first_name.toLowerCase() == searchMethod.firstName.toLowerCase() && senMem[i].last_name.toLowerCase() == searchMethod.lastName.toLowerCase()) {
            searchMethod.senIdArr.push(senMem[i].id);
            searchMethod.renderSearch(senMem[i].first_name, senMem[i].last_name, senMem[i].party, senMem[i].state, senMem[i].id);
          }
        });
      } else if (searchMethod.firstName == undefined && searchMethod.lastName == undefined) {
        console.log("your field is empty, please type something");
      }
    });
  },
  searchByState: function() {
    this.state = $("#state-bar").text();
    console.log(this.state);
    this.senList.url = this.senURL + "members/senate/" + this.state + "/current.json";
    if(this.state !== "States"){
      $.ajax(this.senList).done(function(response) {
        var senMem = response.results;
        $.each(senMem, function(i) {
          searchMethod.senIdArr.push(senMem[i].id);
          searchMethod.renderSearch(senMem[i].first_name, senMem[i].last_name, senMem[i].party, senMem[i].state, senMem[i].id);
        });
      });
    } else{
      console.log("specify a state first")
    }
  },
  searchByParty: function(){
    this.party = $("#party-bar").val();
    console.log(this.party);
    this.senList.url = this.senURL + "115/Senate/members.json";
    $.ajax(this.senList).done(function(response) {
      var senMem = response.results[0].members;
      $.each(senMem, function(i) {
        if (senMem[i].party == searchMethod.party) {
          searchMethod.senIdArr.push(senMem[i].id);
          searchMethod.renderSearch(senMem[i].first_name, senMem[i].last_name, senMem[i].party, senMem[i].state, senMem[i].id);
        }
      });
    });
  },
  displayFavorites: function(senArr){
    $("#search-results").empty();
    this.senList.url = this.senURL + "115/Senate/members.json";
    $.ajax(this.senList).done(function(response) {
      var senMem = response.results[0].members;
      $.each(senMem, function(i) {
        if ($.inArray(senMem[i].id, senArr) != -1) {
          searchMethod.senIdArr.push(senMem[i].id);
          searchMethod.renderSearch(senMem[i].first_name, senMem[i].last_name, senMem[i].party, senMem[i].state, senMem[i].id);
        }
      });
    });    

  },
  //this will determine what kind of endpoint we're using and based on that will populate senIdArr with all the IDs of all the senators it finds that match the search criteria
  setSenId: function() {
    this.senIdArr = [];
    $("#search-results").empty();
    if ($("#name-button").hasClass("active")) {
      this.searchByName();
    } else if ($("#states-button").hasClass("active")) {
      this.searchByState();
    } else if ($("#party-button").hasClass("active")) {
      this.searchByParty();
    }
  },
  renderSearch: function(firstname, lastname, party, state, id){
    $("#search-results").append('<div class="card col-sm-3" id="' + id + 
    '"><img class="img-fluid img-responsive" src="assets/images/senpics/' +
    id + '.jpg" alt="Card image cap"><div class="card-body"><h4 class="card-title">' + 
    firstname + ' ' + lastname + '</br>(' + party + '-' + state + ')</h4></div></div>')
  }

}

function produceSen(senId){
  senList.url = senURL + senEndpoint + "/" + senId + ".json";
  $('#senmodal').modal('show');
  $("#cardlocation").empty();
  $("#newsdisplay").empty();
  $("#follow").val(senId);
  $.ajax(senList).done(function (response) {
    //console.log(response);
    senObject = response;
    $("#notcurrentlyused").html("<u><b>Basic Information:</b></u>");
    $("#sub_commitees").html("<u><b>Current Committee Memberships:</b></u><ul></ul>");
    $("#notcurrentlyused").append("<h6>Full title and rank: " + senObject.results[0].roles[0].title + " (" + senObject.results[0].roles[0].state_rank + ")</h6>");
    $("#notcurrentlyused").append("<h6>Date of birth: " + senObject.results[0].date_of_birth + "</h6>");
    $("#notcurrentlyused").append("<h6>Current term end date: " + senObject.results[0].roles[0].end_date + "</h6>");
    $("#notcurrentlyused").append("<h6>Phone number: " + senObject.results[0].roles[0].phone + "</h6>");
    $("#notcurrentlyused").append("<h6>Fax number: " + senObject.results[0].roles[0].fax + "</h6>");
    // $("#notcurrentlyused").append("<h6>Bills sponsored: " + senObject.results[0].roles[0].bills_sponsored + "</h6>");
    // $("#notcurrentlyused").append("<h6>Bills co-sponsored: " + senObject.results[0].roles[0].bills_cosponsored + "</h6>");
    $("#notcurrentlyused").append("<h6>Most recent vote: " + senObject.results[0].most_recent_vote + "</h6>");
    $("#notcurrentlyused").append("<h6>Missed vote percentage: " + senObject.results[0].roles[0].missed_votes_pct + "%</h6>");
    $("#notcurrentlyused").append("<h6>Votes with party percentage: " + senObject.results[0].roles[0].votes_with_party_pct + "%</h6>");

    
    for(var i = 0; i < senObject.results[0].roles[0].committees.length; i++){
      $("#sub_commitees").append("<li>" + senObject.results[0].roles[0].committees[i].name +  " (" + senObject.results[0].roles[0].committees[i].code + ")</li>");
    }


    $("#cardlocation").append('<div class="card"><img class="img-fluid img-responsive" src="assets/images/senpics/' +
    senObject.results[0].member_id + '.jpg" alt="Card image cap"><div class="card-body"><h4 class="card-title">' + 
    senObject.results[0].first_name + ' ' + senObject.results[0].last_name + '</h4></div></div>');
    timesHandler.apiCall(senObject.results[0].first_name, senObject.results[0].last_name);
    getTweets(senObject.results[0].twitter_account);
  });

      senList.url = "https://api.propublica.org/congress/v1/members/" + senId + "/bills/introduced.json";
    $.ajax(senList).done(function (response) {
      $("#recent_bills").html("<u><b>Recent Bills:</b></u>");
      $("#resolutions").html("<u><b>Further Resolutions:</b></u>");
      console.log(response);
      for(var i = 0; i < response.results[0].bills.length; i++){
        var link = response.results[0].bills[i].govtrack_url;
        var ID = "href" + i;
        if(response.results[0].bills[i].bill_type == "s"){
          $("#recent_bills").append("<li><a id=" + ID + ">" + response.results[0].bills[i].title +  "</a> (" + response.results[0].bills[i].number + ")</li>");
          $("#" + ID).attr('href', link);
        }
        else{
          $("#resolutions").append("<li><a id=" + ID + ">" + response.results[0].bills[i].title +  "</a> (" + response.results[0].bills[i].number + ")</li>");
          $("#" + ID).attr('href', link);
        }
      }

    });
}

// //handles all firebasee account and database functions
// var accHandler = {
//   //user and database object variables
//   userDatabase : firebase.database(),
//   userArr : [],
//   uid : "",
//   //event listener for follow button leads here
//   senFollow : function(){
//     var senId = $("#follow").val();
//     console.log(senId);
//     if($.inArray(senId, accHandler.userArr) === -1){
//       accHandler.userDatabase.ref(accHandler.uid).push(senId);
//     }
//     else{
//       alert('Senator Already Followed');
//     }
//   },
//   //Will be used to render the senator bios for the user page
//   buildSenList : function(){
//   accHandler.userDatabase.ref(accHandler.uid).on("value", function(snapShot){
//       accHandler.userArr = Object.values(snapShot.val());
//       searchMethod.displayFavorites(accHandler.userArr);
//     })
//   },
//   //creates user when sign up button is pressed
//   createUser: function(){
//   var email = $("#email-signup").val();
//   var password = $("#password-signup").val();
//   //handles error returning
//   if (email.length < 4) {
//     alert('Please enter an email address.');
//     return;
//   }
//   if (password.length < 4) {
//     alert('Please enter a password.');
//     return;
//   }
//   // Sign in with email and pass.
//   // [START createwithemail]
//   firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // [START_EXCLUDE]
//     if (errorCode == 'auth/weak-password') {  
//       alert('The password is too weak.');
//     } else {
//       alert(errorMessage);
//     }
//     console.log(error);
//     // [END_EXCLUDE]
//   });
//     // [END createwithemail]
//     console.log(firebase.auth().currentUser);
// },
//   //handles user sign in functionality
//   signIn: function(){
//   var email = $("#email-signin").val();
//   var password = $("#password-signin").val();
//   firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // [START_EXCLUDE]
//     if (errorCode === 'auth/wrong-password') {
//       alert('Wrong password.');
//     } else {
//       alert(errorMessage);
//     }
//     console.log(error);
//     // [END_EXCLUDE]
//   })
//   console.log(firebase.auth().currentUser);
//   },
//   //handles user sign out functionality
//   signOut: function(){
//     firebase.auth().signOut();
//     accHandler.uid = "";
//     accHandler.userArr = [];
//     $("#search-results").empty();
//   },
//   //handles user sign out functionality
//   initApp: function(){
//     firebase.auth().onAuthStateChanged(function(user) {
//       accHandler.uid = user.uid;
//       accHandler.buildSenList();
//     });
//   }
// };

//handles API calls for the NYTimes
var timesHandler = {
 apiCall : function(firstName, lastName){
  var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json"
  url += '?' + $.param({
    'api-key': "4ef882df201e419684d1da14f37e8634",
    'q': firstName + " " + lastName,
    'fl': "web_url, snippet, headline"
  });
  //console.log(url);
  $.ajax({
    url: url,
    method: 'GET',
  }).done(function(result) {
    timesHandler.renderArticles(result.response.docs);
  }).fail(function(err) {
    throw err;
  });
 },
 //renders the articles to the senator modal
 renderArticles: function(list){
    $("#newsdisplay").empty();
    for (var i = 0; i <= 2; i++) {
      //console.log(list[i])
      $("#newsdisplay").append("<a href='" + list[i].web_url + "' target='blank'><h4 class='headline'>" 
      + list[i].headline.main + "</h4></a><p clas='snippet'>" + list[i].snippet + "</p>")
    }
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
  $("#state-bar").text($(this).text())
  $("#state-bar").val($(this).attr("value"));
});

$("#search-button").on("click", function() {
  searchMethod.setSenId();
});
$("#party-button").on("click", function() {
  searchMethod.activatePartyButton(this);
});
$("#party-menu li a").on("click", function() {
  $("#party-bar").text($(this).text())
  $("#party-bar").val($(this).attr("value"));
});
$("#openmodal").on("click", function() {
  $('#loginmodal').modal('show');
});
$("#showfaves").on("click", function() {
  accHandler.buildSenList();
});
$("#search-results").on("click", ".card", function() {
  produceSen(this.id);
  $("#twitterArea").html("");   // clears twitter area, or it will continually append tweets
});
// document.getElementById('sign-up').addEventListener('click', accHandler.createUser, false);
// document.getElementById('sign-in').addEventListener('click', accHandler.signIn, false);
// document.getElementById('sign-out').addEventListener('click', accHandler.signOut, false);
// document.getElementById('follow').addEventListener('click', accHandler.senFollow, false);
$('#Signup').tab('show')
$('#Signin').tab('show')
window.onload = function() {
  // accHandler.initApp();
};

function getTweets(handle){
  twttr.widgets.createTimeline({sourceType: "profile", screenName: handle}, document.getElementById('twitterArea'),{tweetLimit: 5});
}

window.twttr = (function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0],
    t = window.twttr || {};
  if (d.getElementById(id)) return t;
  js = d.createElement(s);
  js.id = id;
  js.src = "https://platform.twitter.com/widgets.js";
  fjs.parentNode.insertBefore(js, fjs);

  t._e = [];
  t.ready = function(f) {
    t._e.push(f);
  };

  return t;
}(document, "script", "twitter-wjs"));
