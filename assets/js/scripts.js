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
        console.log("invalid");
      }
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
        });
      for (var i = 0; i < searchMethod.senIdArr.length; i++) {
        produceSen(searchMethod.senIdArr[i]);
      }
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
        }
      });
      for (var i = 0; i < searchMethod.senIdArr.length; i++) {
        produceSen(searchMethod.senIdArr[i]);
      }
    });
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

function produceSen(senId){
  senList.url = senURL + senEndpoint + "/" + senId + ".json";
  $.ajax(senList).done(function (response) {
    senObject = response;
    console.log(senList.url);
    console.log(senObject);
    timesHandler.apiCall(senObject.results[0].first_name, senObject.results[0].last_name);
  });
}

//handles all firebasee account and database functions
var accHandler = {
  //user and database object variables
  userDatabase : firebase.database(),
  userArr : [],
  uid : "",
  //event listener for follow button leads here
  senFollow : function(){
    var senId = senObject.results[0].member_id;
    console.log(this); 
    if($.inArray(senId, accHandler.userArr) === -1){
      accHandler.userDatabase.ref(accHandler.uid).push(senId);
      accHandler.buildSenList();
    }
    else{
      alert('Senator Already Followed');
    }
  },
  //Will be used to render the senator bios for the user page
  buildSenList : function(){
  accHandler.userDatabase.ref(accHandler.uid).on("value", function(snapShot){
      accHandler.userArr = Object.values(snapShot.val());
      for (var i = 0; i < accHandler.userArr.length; i++) {
        produceSen(accHandler.userArr[i]);
      }
    });
  },
  //creates user when sign up button is pressed
  createUser: function(){
  var email = $("#email").val();
  var password = $("#password").val();
  //handles error returning
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }
  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }
  // Sign in with email and pass.
  // [START createwithemail]
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode == 'auth/weak-password') {  
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  });
    // [END createwithemail]
    console.log(firebase.auth().currentUser);
},
  //handles user sign in functionality
  signIn: function(){
  var email = $("#email").val();
  var password = $("#password").val();
  firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
    // Handle Errors here.
    console.log("test1");
    var errorCode = error.code;
    var errorMessage = error.message;
    // [START_EXCLUDE]
    if (errorCode === 'auth/wrong-password') {
      alert('Wrong password.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
    // [END_EXCLUDE]
  })
  console.log(firebase.auth().currentUser);
  },
  //handles user sign out functionality
  signOut: function(){
    firebase.auth().signOut();
  },
  //handles user sign out functionality
  initApp: function(){
    firebase.auth().onAuthStateChanged(function(user) {
      accHandler.uid = user.uid;
      accHandler.buildSenList();
    });
  }
};

timesHandler = {
 apiCall : function(firstName, lastName){
  var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json"
  url += '?' + $.param({
    'api-key': "4ef882df201e419684d1da14f37e8634",
    'q': firstName + " " + lastName,
    'fl': "web_url, snippet, headline"
  });
  console.log(url);
  $.ajax({
    url: url,
    method: 'GET',
  }).done(function(result) {
    timesHandler.renderArticles(result.response.docs);
  }).fail(function(err) {
    throw err;
  });
 },
 renderArticles: function(list){
    $("#newsdisplay").empty();
    for (var i = 0; i <= 2; i++) {
      console.log(list[i])
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

document.getElementById('sign-up').addEventListener('click', accHandler.createUser, false);
document.getElementById('sign-in').addEventListener('click', accHandler.signIn, false);
document.getElementById('sign-out').addEventListener('click', accHandler.signOut, false);
document.getElementById('follow').addEventListener('click', accHandler.senFollow, false);
window.onload = function() {
  accHandler.initApp();
};

