$(document).ready(function() {

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
            var nextArrival = "";
            var nextArrivalcalculated = "";


            //button to add trains to scheduler
            $("#addTrain").on("click", function () {
                //grab the values of the entered data and store in variable
                event.preventDefault();
                trainName = $("#trainName").val().trim();
                destination = $("#destination").val().trim();
                trainTime = $("#trainTime").val().trim();
                frequency = $("#frequency").val().trim();



                //firstTime (pushed back 1 year to make sure it comes before current time)
                var firstTimeConverted = moment(trainTime, "hh:mm").subtract(1, "years");
                console.log(firstTimeConverted);

                //get the current time
                var currentTime = moment();

                //calculate the difference between the times
                var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
                console.log("Difference in times: " + diffTime);

                //Time apart (get the remainder)
                var timeRemainder = diffTime % frequency;
                console.log(timeRemainder);

                // Calcualte minutes until next train
                var minutesAway = frequency - timeRemainder;
                console.log("Minutes until next train: " + minutesAway);

                //calculate when the next train comes
                var nextArrivalcalculated = moment().add(minutesAway, "minutes");
                console.log("ARRIVAL TIME: " + moment(nextArrivalcalculated).format("hh:mm"));


                //push the data into the DB
                database.ref().push({
                    trainName: trainName,
                    destination: destination,
                    trainTime: trainTime,
                    frequency: frequency,
                    nextArrival: nextArrival,
                    minutesAway: minutesAway
                });

            });
                database.ref().on("child_added", function (snapshot) {
                    // storing the snapshot.val() in a variable for convenience
                    var sv = snapshot.val();

                    // Console.loging the last user's data
                    console.log(sv.trainName);
                    console.log(sv.destination);
                    console.log(sv.trainTime);
                    console.log(sv.frequency);


                    //send data out to the table
                    var tableRow = $("<tr>");
                    var column1 = $("<td>").text(sv.trainName);
                    var column2 = $("<td>").text(sv.destination);
                    var column3 = $("<td>").text(sv.frequency);
                    var column4 = $("<td>").text(sv.nextArrivalcalculated);
                    var column5 = $("<td>").text(sv.minutesAway);

                    //        var column3 = $("<td>").text(moment.unix(sv.trainTime).format("hh:mm"));
                    //        var column4 = $("<td>").text("");
                    //       
                    //        var column6 = $("<td>").text("");

                    tableRow.append(column1).append(column2).append(column3).append(column4).append(column5);




                    $("#tableBody").append(tableRow);

                    // Handle the errors
                }, function (errorObject) {
                    console.log("Errors handled: " + errorObject.code);
                });



            })
