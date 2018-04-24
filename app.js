var config = {
    apiKey: "AIzaSyAWKst7y9MQZasdzDNOIRC4RrIz8hZAKcY",
    authDomain: "train-scheduler-2fd3c.firebaseapp.com",
    databaseURL: "https://train-scheduler-2fd3c.firebaseio.com",
    projectId: "train-scheduler-2fd3c",
    storageBucket: "train-scheduler-2fd3c.appspot.com",
    messagingSenderId: "478076671073"
  };
firebase.initializeApp(config);

var database = firebase.database();

var currentTime = "";
var trainName = "";
var trainDest = "";
var trainTime = "";
var trainFreq = 0;
var timeDiff = 0;
var timeRemainder = 0;
var nextArrival = 0;
var minAway = 0;
var newTrain = {
    name: trainName,
    dest: trainDest,
    freq: trainFreq,
    firstTrain: trainTime,
}
var firstTrainInput = "";

$("#add-train-data").on("click", function (event) {
    event.preventDefault();

    firstTrainInput = moment($("#train-time").val().trim(), "HH:mm").format("HH:mm");

    if (firstTrainInput !== "Invalid date") {
        newTrain.name = $("#train-name").val().trim();
        newTrain.dest = $("#train-destination").val().trim();
        newTrain.firstTrain = firstTrainInput;
        newTrain.freq = $("#train-freq").val().trim();
    } else {
        alert("Please enter a valid First Train Time");
        clearInput();
    }

    database.ref().push(newTrain);

    clearInput();
})

function clearInput() {
    $("#train-name").val("");
    $("#train-destination").val("");
    $("#train-time").val("");
    $("#train-freq").val("");
}

database.ref().on("child_added", function (snapshot) {
    if (firstTrainInput !== "Invalid date") {
        trainName = snapshot.val().name;
        trainDest = snapshot.val().dest;
        trainTime = moment(snapshot.val().firstTrain, "HH:mm");
        trainFreq = snapshot.val().freq;

        var trainTimeConverted = moment(trainTime, "HH:mm").subtract(1, "years");
        currentTime = moment().format("HH:mm");
        timeDiff = moment().diff(moment(trainTimeConverted), "minutes");
        timeRemainder = timeDiff % trainFreq;
        minAway = trainFreq - timeRemainder;
        nextArrival = moment().add(minAway, "minutes").format("HH:mm");

        $("#trainData").append("<tr><td>" + trainName + "</td><td>" + trainDest + "</td><td>" + trainFreq + "</td><td>" + nextArrival + "</td><td>" + minAway + "</td></tr>");
    }
});

