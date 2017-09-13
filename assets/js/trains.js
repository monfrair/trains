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
    var frequency = "";
    var nextTrain = "";
    var currentTime = "";

    var nextArrival = "";

    //button to add trains to scheduler
    $("#addTrain").on("click", function () {
        //grab the values of the entered data and store in variable
        event.preventDefault();
        trainName = $("#trainName").val().trim();
        destination = $("#destination").val().trim();
        trainTime = moment($("#trainTime").val().trim(), "HH:mm").format("X");
        frequency = $("#frequency").val().trim();



        //        //firstTime (pushed back 1 year to make sure it comes before current time)
        //        firstTimeConverted = moment.unix(trainTime).subtract(1, "years");
        //        console.log(firstTimeConverted);
        //
        //        //get the current time
        //        currentTime = moment();
        //        
        var unixTime = moment().format("X");
        //
        //        //calculate the difference between the times
        //        diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        //        console.log("Difference in times: " + diffTime);
        //
        //        //Time apart (get the remainder)
        //        timeRemainder = diffTime % frequency;
        //        console.log(timeRemainder);
        //
        //        // Calcualte minutes until next train
        //        minutesAway = frequency - timeRemainder;
        //        console.log("Minutes until next train: " + minutesAway);
        //
        //        //calculate when the next train comes
        //        nextArrival = moment().add(minutesAway, "minutes");
        //        console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));
        //        
        //        nextTrainCalculated = moment(nextArrival).format("hh:mm");


        //push the data into the DB
        database.ref().push({
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
            unixTime: unixTime
        });

    });
    database.ref().on("value", function (snapshot) {
            // storing the snapshot.val() in a variable for convenience
            $("tbody").empty();

            snapshot.forEach(function (childSnapshot) {
                var sv = childSnapshot.val();
                
                var trainClass = sv.key;
                var firstTimeConverted = moment.unix(sv.trainTime);
                var diffTime = moment().diff(moment(firstTimeConverted, "HH:mm"), "minutes");
                var timeRemainder = diffTime % frequency;
                var  minutesAway = frequency - timeRemainder;
             
                if (diffTime >= 0) {
                    nextTrain = null;
                    nextTrain =  moment().add(minutesAway, "minutes").format("hh:mm A");
                    console.log(nextTrain) + "next train";
                } else {
                    nextTrain = null;
                    nextTrain = firstTimeConverted.format("hh:mm A");
                    diffTime = Math.abs(diffTime -1);
                    console.log(nextTrain) + "next train";
                }
            
                 nextArrival = moment().add(minutesAway, "minutes");
                
                
                

                // Console.loging the last user's data
                console.log(sv.trainName) + "train name";
                console.log(sv.destination) + "destination";
                console.log(sv.trainTime) + "train time";
                console.log(sv.frequency) + "frequency";
                console.log(nextTrain) + "next train";
                console.log(moment(nextArrival).format("hh:mm"));
//                console.log(moment(nextTrain).format("hh:mm"));
//                console.log(sv.minutesAway);


                //send data out to the table
                var tableRow = $("<tr>");
                var column1 = $("<td>").text(sv.trainName);
                var column2 = $("<td>").text(sv.destination);
                var column3 = $("<td>").text(sv.frequency);
                //        var column4 = $("<td>").text(moment.unix(sv.nextArrival).format("hh:mm"));
                //                    
                var column4 = $("<td>").text(nextTrain);
                var column5 = $("<td>").text(nextArrival);

                //            var column5 = $("<td>").text(moment.unix(sv.minutesAway).format("hh:mm"));

                tableRow.append(column1).append(column2).append(column3).append(column4).append(column5);




                $("#tableBody").append(tableRow);

            })

            // Handle the errors
        },
        function (errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });



})
