/*feather script*/
var featherEditor = new Aviary.Feather({
    apiKey: '7821528c-aaf6-4f46-9d29-6e1e72348875',
    theme: 'dark', // Check out our new 'light' and 'dark' themes!
    tools: 'all',
    appendTo: '',
    //the onSave method is holding our edited image url
    onSave: function(imageID, newURL) {
        var img = document.getElementById(imageID);
        img.src = newURL;
        //change the link of the download button to the newURL of the image after finished saving
        //using propertiers from <a download>
        $("#" + imageID).parents(".pix:first").find(".downloadButton").attr({ "href": newURL, "download": newURL });
        $("#" + imageID).parents(".pix:first").find(".fa-download").show();
        //find the tweet button in the first px div that has the imageID we are looking for
        var tweetButton = $("#" + imageID).parents(".pix:first").find(".tweetButton");
        //get the href url from tweetButton
        var tweetHref = tweetButton.attr("href");
        console.log(tweetHref);
        //edit the original tweetHref url and replace it with the original text before "dpla:" and after after "&hashtags" and in between add the newURL parameter
        var editedURL = tweetHref.split("dpla:")[0] + "dpla:" + newURL + "&hashtags" + tweetHref.split("&hashtags")[1];

        console.log(editedURL);
        //store the edited url in tweetButton
        tweetButton.attr("href", editedURL);
    },
    onError: function(errorObj) {
        console.log(errorObj.args);
        alert(errorObj.message);
    }
});

function launchEditor(id, src) {
    featherEditor.launch({
        image: id,
        url: src
    });
    return false;
}

var numOfPages = 0;
var searchTerm = "";
var subject = "";
var loading = false;
var tweetButton="";

$(function() {
    getTotalNumberImages();
    var win = $(window);
    $(window).scroll(function() {
        if ($(document).height() - win.height() == win.scrollTop() && !loading) {
            loading = true;
            numOfPages++;
            getSubsequentRequests(searchTerm, numOfPages);
        }
    });

    $("form").submit(function(e) {
        searchTerm = $("#subject").val();
        if(searchTerm.length < 3 || searchTerm.indexOf(" ")>0 && searchTerm.indexOf(" ")<=2){
            alert("Enter a valid search term!");
            return false;
        } 
        else {
            e.preventDefault();
            $("#injection_site").html("");
            $(".searchCount").html("");
        }
        getFirstRequest(searchTerm);

    });

});

//displays total number of no copyright images from the DPLA
function getTotalNumberImages(){
    var params={
        "sourceResource.type":"image",
        "sourceResource.rights":"No known copyright",
        "api_key":"9772d1f08da11321921643124e86205b"
    }
    url = "http://api.dp.la/v2/items?";
    $.getJSON(url, params, function(data){
        $(".totalImages").text("There are currently " + data.count + " free to use images from the DPLA available");
    });
}

//get first request for JSON data from DPLA usin the search term and 
//use showFirstResults() function to display the data
function getFirstRequest(searchTerm){
            var params = {
                "sourceResource.type":"image",
                "sourceResource.subject":searchTerm,
                "sourceResource.rights":"No known copyright",
                "page_size":10,
                "api_key":"9772d1f08da11321921643124e86205b"
            };
            url = "http://api.dp.la/v2/items?";
            $.getJSON(url, params, function(data){
                showFirstResults(data);
            });
}

//gather all of the data from the getRequest and show all images related to search term

function showFirstResults(data){
    if (data.count > 0) {
                $(".searchCount").text(data.count + " results returned for " + searchTerm);
            } else {
                $(".searchCount").text("Your search term " + searchTerm + " returned " + data.count + " results. Please try again.");
            }
            var image = data.docs;
            $.each(image, function(i, value) {
                //grab link of document's url
                var link = data.docs[i].isShownAt;
                //grab where document originates
                var dataProvider = data.docs[i].dataProvider;
                if (searchTerm.indexOf(" ") > 0) {
                    subject = searchTerm.replace(" ", "");
                } else {
                    subject = searchTerm;
                }
                //create our tweetbuttons and 
                //append our pix div with all content into the injection site.
                 createTweetButton(dataProvider, link, subject);
                 appendToInjectionSite(link, i, data.docs[i].object, tweetButton);
                 //when the download button is clicked launch the aviary editor
                 //by passing the editor the imageid and the actual image object
                 //from the JSON call
                $("#button" + i).click(function() {
                    launchEditor("image" + i, data.docs[i].object);
                });
            });  
            showCardPix();
}

function getSubsequentRequests(searchTerm, numOfPages){
                var params = {
                    "sourceResource.type":"image",
                    "sourceResource.subject":searchTerm,
                    "sourceResource.rights":"No known copyright",
                    "page_size":10,
                    "page":numOfPages,
                    "api_key":"9772d1f08da11321921643124e86205b"
                }
                url ="http://api.dp.la/v2/items?";
                $.getJSON(url, params, function(data){
                    loading = false;
                    showSubsequentImages(data);

                })
}

//this function will take the data from the subsequentRequest function and display it on the page
function showSubsequentImages(data){
     if (data.count > 0) {
                    $(".searchCount").text(data.count + " results returned for " + searchTerm);
                } else {
                    $(".searchCount").text("Your search term " + searchTerm + " returned " + data.count + " results. Please try again.");
                }
                var image = data.docs;
                $.each(image, function(i, value) {

                    //grab link of document's url
                    var link = data.docs[i].isShownAt;
                    //grab where document originates
                    var dataProvider = data.docs[i].dataProvider;
                    if (searchTerm.indexOf(" ") > 0) {
                        subject = searchTerm.replace(" ", "");
                    } else {
                        subject = searchTerm;
                    }

                    createTweetButton(dataProvider, link, subject);

                    //imageId gives each image a unique id so the editor will 
                    //open it properly and each edit button will have a unique
                    //id
                    var imageId = "" + numOfPages + "-" + i;

                    appendToInjectionSite(link, imageId, data.docs[i].object, tweetButton);
                    $("#button" + imageId).click(function() {
                        launchEditor("image" + imageId, data.docs[i].object);

                    });

                });
                showCardPix();

}
//shows the image automatically in it's .pix div once the image is loaded 
//so there is no lag time between when the image loads and when the .pix div shows.

function showCardPix(){
    console.log("test");
    $(".pix img").load(function(){
        $(this).parents(".pix").show();
    });
}

//this function creates our pix div that will contain our edit button, download button, tweetbutton and image
function appendToInjectionSite(link, imageId, imageSrc, tweetButton){
     $("#injection_site").append("<div class='card pix' style='display:none'><a href='" + link + "'target='_blank''><img class='card-image-top' id='image" + imageId + "'src=" + imageSrc + "></a><div class='card-block'><span class='pull-left'><a class='editButton' id='button" + imageId + "'><i class='fa fa-pencil-square-o fa-2x'></i></a></span><span class='text-center'><a class='downloadButton' title='ImageName'><i class='fa fa-download fa-2x'></i></a></span><span class='pull-right'>" + tweetButton + "</span></div></div>");

}
//this function creates our tweetbutton by takng the url of the dataProvider, the subject entered by the user and the link to the image's location
function createTweetButton(dataProvider, link, subject){
    tweetButton = "<a class='tweetButton' href='https://twitter.com/intent/tweet?text=No copyright photo via the " + dataProvider + " and dpla: " + link + "&hashtags=" + subject + ", dpla' target='_blank'><i class='fa fa-twitter fa-2x'></i></a>";
    
}

