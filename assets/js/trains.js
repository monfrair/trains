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
//        frequency = $("#frequency").val().trim();
        frequency = $("#frequency").val().trim();
        
    


        var unixTime = moment().format("X");



        //push the data into the DB
        database.ref().push({
            trainName: trainName,
            destination: destination,
            trainTime: trainTime,
            frequency: frequency,
            unixTime: unixTime


        });

        console.log(trainName);
        console.log(destination);
        console.log(trainTime);
        console.log(frequency);

    });
    
    // Update minutes away by triggering change in firebase children
   
    function updateTime() {
      
      database.ref().on("value", function(snapshot){
        snapshot.forEach(function(childSnapshot){
          fbTime = moment().format('X');
          database.ref(childSnapshot.key).update({
          currentTime: fbTime,
          })
        })    
      })
    };
     
    setInterval(updateTime, 5000);
    
    
    database.ref().on("value", function (snapshot) {
            // storing the snapshot.val() in a variable for convenience

            

            $("#tablebody").empty();


            snapshot.forEach(function (childSnapshot) {
                var sv = childSnapshot.val();

                var trainClass = sv.key;
                


                console.log(sv);
                
                console.log(sv.trainTime);
                console.log(sv.frequency);


                //convert first train time into UNIX time
                var firstTimeConverted = moment.unix(sv.trainTime);
                console.log("first time converted: " + firstTimeConverted);

                //calculate the difference between the current time and the first train time
                var diffTime = moment().diff(moment(firstTimeConverted, "hh:mm"), "minutes");
                console.log(diffTime);

                console.log(sv.frequency);
                //Time apart get the remainder
                var timeRemainder = diffTime % parseInt(sv.frequency);
                console.log("Time Remainder: " + timeRemainder);
                // Calcualte minutes until next train subtracting the frequency of the train by the remainder of diffTime % frequency
                var minutesAway = sv.frequency - timeRemainder;
                console.log("Minutes until next train: " + minutesAway);

                //  calculate when the next train comes in minutes
                
//                if (minutesAway <= 60) {
                nextArrival = moment().add(minutesAway, "minutes");
                console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));
//                } else { 
//                nextArrival = moment().Math.abs(minutesAway, "minutes")
//                };
//                
                
                

                if (diffTime >= 0) {  // remainder is 7 for my example
                    nextTrain = null;  //next train cleared out
                    console.log(minutesAway); //NaN because of frequency?
                    nextTrain = moment().add(minutesAway, "minutes").format("hh:mm A");
                    console.log(nextTrain) + "next train";
                } else {
                    nextTrain = null;
                    nextTrain = firstTimeConverted.format("hh:mm A");
                    diffTime = Math.abs(diffTime - 1);
                    console.log(nextTrain) + "next train";
                };


                //                nextArrival = moment.diff((sv.trainTime, "X"), "hh:mm");
                //                console.log(nextTrain) + "next arrival";

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
                //                var column4 = $("<td>").text(moment(nextTrain).format("hh:mm A"));
                var column4 = $("<td>").text(nextTrain);
                var column5 = $("<td>").text(minutesAway);

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
