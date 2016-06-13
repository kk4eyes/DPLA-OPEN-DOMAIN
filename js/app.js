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
        //if the download button already exists in the div
        if ($("#" + imageID).parents(".pix:first").find(".downloadButton").length > 0) {
            //change the link of the download button to the newURL of the image after finished saving
            //using propertiers from <a download>
            $("#" + imageID).parents(".pix:first").find(".downloadButton").attr({ "href": newURL, "download": newURL });
            //if it doesnt already exist create a new downloadbutton
        } else {
            var downloadButton = "<a class='downloadButton' download='" + newURL + "'href='" + newURL + "'title='ImageName'>Download</a>";
            //append the new download button to the first pix div that is the parent of the specific imageID
            //we are working with
            $("#" + imageID).parents(".pix:first").append(downloadButton);
        }
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

$.getJSON('http://api.dp.la/v2/items?&sourceResource.type=%22image%22&sourceResource.rights=%22No%20known%20copyright&api_key=9772d1f08da11321921643124e86205b', function(data) {

    $(".totalImages").text("There are currently " + data.count + " free to use images from the DPLA available");
});
var numOfPages = 0;
var searchTerm = "";
var subject = "";
var loading= false;
$(function() {

    var win = $(window);
    $(window).scroll(function() {
        if ($(document).height() - win.height() == win.scrollTop() && !loading) {
            loading=true;
            numOfPages++;
            $.getJSON('http://api.dp.la/v2/items?&sourceResource.type=%22image%22&sourceResource.subject=' + searchTerm + '&sourceResource.rights=%22No%20known%20copyright&page_size=10&page=' + numOfPages + '&api_key=9772d1f08da11321921643124e86205b', function(data) {
                loading = false;

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


                    var tweetButton = "<a class='tweetButton btn btn-primary' href='https://twitter.com/intent/tweet?text=No copyright photo via the " + dataProvider + " and dpla: " + link + "&hashtags=" + subject + ", dpla' target='_blank'>Tweet This</a></button>";

                        var imageId= ""+numOfPages+"-"+i;
                        console.log(imageId);

                    $("#injection_site").append("<div class='card pix'><a href=" + link + "><img class='card-image-top' id='image"  +imageId + "'src=" + data.docs[i].object + "></a><div class='card-block'><button class='btn btn-primary' id='button" + imageId + "'>Edit</button>" + tweetButton + "</div></div>")
                    $("#button" + imageId).click(function() {
                        launchEditor("image" + imageId, data.docs[i].object);


                    });

                });

            });


        }
    });

    $("form").submit(function(e) {
        e.preventDefault();
        searchTerm = $("#subject").val();
        console.log(searchTerm);
        $("#injection_site").html("");
        $(".searchCount").html("");


        $.getJSON('http://api.dp.la/v2/items?&sourceResource.type=%22image%22&sourceResource.subject=' + searchTerm + '&sourceResource.rights=%22No%20known%20copyright&page_size=10&api_key=9772d1f08da11321921643124e86205b', function(data) {

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


                var tweetButton = "<a class='tweetButton btn btn-primary' href='https://twitter.com/intent/tweet?text=No copyright photo via the " + dataProvider + " and dpla:" + link + "&hashtags=" + subject + ", dpla' target='_blank'>Tweet This</a></button>";


                $("#injection_site").append("<div class='card pix'><a href=" + link + "><img class='card-image-top' id='image" + i + "'src=" + data.docs[i].object + "></a><div class='card-block'><button class='btn btn-primary' id='button" + i + "'>Edit</button>" + tweetButton + "</div></div>")
                $("#button" + i).click(function() {
                    launchEditor("image" + i, data.docs[i].object);


                });

            });

        });

    });

});
