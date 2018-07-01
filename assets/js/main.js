$(document).ready(function () {
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyDteKbz_RDhCD7CY7VMVNoHsNw12K3-Bfw",
        authDomain: "api-project-1-74db9.firebaseapp.com",
        databaseURL: "https://api-project-1-74db9.firebaseio.com",
        projectId: "api-project-1-74db9",
        storageBucket: "api-project-1-74db9.appspot.com",
        messagingSenderId: "885079935218"
    };
    firebase.initializeApp(config)
    var database = firebase.database()

    // form listener for user inputs
    $("form").on("submit", function () {
        event.preventDefault()

        // Grab user input
        let trainName = $("#inputName").val().trim()
        let destination = $("#inputDestination").val().trim()
        // convert to unix time
        let firstTime = moment($("#inputFirstTT").val().trim(), "HH:mm").subtract(10, "years"). format("X")
        let frequency = $("#inputFrequency").val().trim()

        //Create local object for holding data
        let newTrain = {
            name: trainName,
            destin: destination,
            time: firstTime,
            freq: frequency
        }

        // Upload schedule data to the database
        database.ref().push(newTrain)

        console.log(newTrain.name)
        console.log(newTrain.destin)
        console.log(newTrain.time)
        console.log(newTrain.freq)

        // Clear all of the text-boxes
        $("#inputName").val("")
        $("#inputDestination").val("")
        $("#inputFirstTT").val("")
        $("#inputFrequency").val("")
    })

    // Create Firebase event for train add to the
    // database and a row in the html when a user adds an entry
    database.ref().on("child_added", function (childSnapshot, prevChildKey) {
        console.log(childSnapshot.val())

        let trainName = childSnapshot.val().name
        let destination = childSnapshot.val().destin
        let firstTime = childSnapshot.val().time
        let frequency = childSnapshot.val().freq

        console.log(trainName)
        console.log(destination)
        console.log(firstTime)
        console.log(frequency)

        // Calculate when next train will arrive
        //diffTime is in unix time
        let diffTime = moment().diff(moment.unix(firstTime), "minutes")

        //mod diffTime by frequency to calculate minutes away
        let timeRem = diffTime % frequency

        //subtract frequency from time remaining to calculate minutes to next arrival
        let minutesToNext = frequency - timeRem

        // add minutesToNext and format 
        let nextArrival = moment().add(minutesToNext, "m").format("hh:mm A")

        console.log(diffTime+" unix time")
        console.log(timeRem)
        console.log(minutesToNext)
        console.log(nextArrival)

        // add train data into the table
        $("#train-table > tbody").append("<tr><td>" + trainName + "</td><td>" +
            destination + "</td><td>" + frequency + "</td><td>" + nextArrival +
            "</td><td>" + minutesToNext + "</td></tr>")
    })  
})