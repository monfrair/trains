$(document).ready(function () {

    // Initialize Firebase


    var config = {
    apiKey: "AIzaSyCXzWR-5ynd3__bp6WtQQFch7B_KK33rio",
    authDomain: "trains-113f2.firebaseapp.com",
    databaseURL: "https://trains-113f2.firebaseio.com",
    projectId: "trains-113f2",
    storageBucket: "",
    messagingSenderId: "673795486004"
  };
  firebase.initializeApp(config);

    //set variables up for application
    var database = firebase.database();
    var trainName = "";
    var destination = "";
    var trainTime = "";
    var frequency = 0;
    var nextArrival = 0;
    var nextArrivalcalculated = "";
    var minutesAway = 0;
    
    


    //button to add trains to scheduler
    $("#addTrain").on("click", function() {
        //grab the values of the entered data and store in variable
        event.preventDefault();
        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        trainTime = $("#trainTime").val().trim();
        frequency = $("#frequency").val().trim();
        
        //get the current time
        var currentTime = moment();
        
        var nextArrival = moment(trainTime).unix();
        frequency = $("#frequency").val().trim();
        
        
        
        
        
        database.ref().push({
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequncy: frequency
        })
console.log(unixDate);
    })

    database.ref().on("child_added", function (snapshot) {
        // storing the snapshot.val() in a variable for convenience
        var sv = snapshot.val();

        // Console.loging the last user's data
        console.log(sv.trainName);
        console.log(sv.destination);
        console.log(sv.trainTime);
        console.log(sv.frequncy);
        
        
        
        var tableRow = $("<tr>");
        var column1 = $("<td>").text(sv.trainName);
        var column2 = $("<td>").text(sv.destination);
        var column3 = $("<td>").text(moment.unix(sv.trainTime).format("hh:mm"));
        var column4 = $("<td>").text("");
        var column5 = $("<td>").text(sv.monthlyRate);
        var column6 = $("<td>").text("");
        
        tableRow.append(column1).append(column2).append(column3).append(column4).append(column5).append(column6);
        
        
        
        
        $("#tableBody").append(tableRow);

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });



})