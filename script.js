//Lines up to 60 deal with the topic buttons
//Lines after 60 deal with the gifs

var topics = ["Spinning Top", "Rubik's Cube", "Gyroscope", "Newton's Cradle", "Magnetic Sculpture", "Growing Crystals"];

var showButtons = function () {
    $("#buttons-area").html("");
    topics.forEach(subject => {
        // Create a new variable that will hold a "<button>" tag.
        var top = $("<button>");
        top.attr("class", "topic btn btn-success");
        top.text(subject + "  ");
        top.attr("style", "margin: 5px");

        //Create a button that will remove the topic
        var button = $("<button>");
        button.attr("class", "removal btn btn-sm btn-outline-danger");
        // Lastly add the letter X inside.
        button.text("X");

        // Append the button to the to do item
        top.append(button);

        // Add the topic to the buttons area
        $("#buttons-area").append(top);
    });
}
showButtons(); //Actually show the buttons

//  On Click event associated with the add-to-do function
$("#add-topic").on("click", function (event) {
    // prevent refresh
    event.preventDefault();

    var to = $("#new-topic").val().trim();
    //Update the locally stored topics
    topics.push(to);

    // Clear the textbox and show all buttons
    $("#new-topic").val("");
    showButtons();
});

$(document.body).on("click", ".removal", function (event) {
    event.stopPropagation();
    var par = $(this).parent();
    //Remove the topic from the array
    for (let i = 0; i < topics.length; i++) {
        // par.text incudes the X from the button
        if (topics[i] + "  X" === par.text()) {
            topics.splice(i, 1);
        }
    }
    //Remove the topic's button from the DOM
    par.remove();
});

//Dealing with Gif display

var apiKey = "gvhErkMdJ0jAInY1QMmgytVNwwAGAo88";
var limit = 10; //We want to show 10 gifs to start with
var prevTopic = ""; //Use this to show more if client is interested

//Changing between still and animate gifs
var switchAnimated = function (image) {
    if (image.attr("data-state") === "still") {
        image.attr("src", image.attr("data-animate"));
        image.attr("data-state", "animated");
    } else {
        image.attr("src", image.attr("data-still"));
        image.attr("data-state", "still");
    }
}

var makeQuery = function (topic) {
    //If this is a repeat request, increase the number of gifs retrived
    if (prevTopic === topic) {
        limit += 5;
    } else { //Otherwise, get 10
        limit = 10;
    }
    prevTopic = topic;
    var gifArray;
    //Create a url based on GIPHY API, using the topic and limit
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=" + apiKey + "&limit=" + limit + "&rating=g";
    //Make the ajax call and return the array
    $.ajax({ url: queryURL, method: "GET" }).then(function (response) {
        //Clear the gifs area
        $("#gifs-area").html("");
        //Fill the gifs area with new content
        response.data.forEach(gif => {
            //Create holder for gif and give it the gif's info
            var card = buildCard(gif);

            //Attatch the fully made card to the gifs area
            $("#gifs-area").append(card);
        });
    });
}

var buildCard = function (gif) {
    var article = $("<article>");
    article.attr("display", "inline");
    article.attr("class", "card");
    article.attr("style", "margin: 5px");
    //Give the card a header with the gif's title
    var title = $("<h5>");
    title.attr("class", "card-header");
    title.text(gif.title);
    article.append(title);

    //Give the card a subheader with the website where the gif was first found
    var body = $("<div>").attr("class", "card-body");
    var subheader = $("<h6>");
    subheader.attr("class", "card-subtitle mb-2 text-muted");
    subheader.text("Found on: " + gif.source_tld);
    body.append(subheader);

    //Create image that holds the still and moving gif
    var image = $("<img>");
    image.attr("class", "card-img-top");
    //Using gif.still and gif.moving as a placeholder
    image.attr("data-still", gif.images.original_still.url); 
    image.attr("data-animate", gif.images.original.url);
    //Use the still/animated switch to give the image its original source
    image.attr("data-state", "empty");
    switchAnimated(image);
    //Put the image in the card body
    body.append(image);

    //Put the card body on the card and return it
    article.append(body);
    return article;
}

//Populating the page with appropriate gifs
$(document.body).on("click", ".topic", function () {
    //Get the gifs and display them
    var query = $(this).text().substring(0, $(this).text().length - 3)
    var arrayOfTopicals = makeQuery(query);
});

$(document.body).on("click", ".card-img-top", function () {
    console.log("Switch: " + $(this));
    switchAnimated( $(this) );
})