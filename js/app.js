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
            //once the image has been edited and saved give it the new url and show it 
            $("#" + imageID).parents(".pix:first").find(".downloadButton").attr({ "href": newURL, "download": newURL }).show();
            
        //find the tweet button in the first px div that has the imageID we are looking for
        var tweetButton = $("#" + imageID).parents(".pix:first").find(".tweetButton");
        //get the href url from tweetButton
        var tweetHref = tweetButton.attr("href");
        console.log(tweetHref);
        //edit the original tweetHref url and replace it with the original text before "dpla:" and after after "&hashtags" and in between add the newURL parameter
        var editedURL = tweetHref.split("dpla:")[0] + "dpla: " + newURL + "&hashtags" + tweetHref.split("&hashtags")[1];

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

getNumOfTotalImages();

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


                    var tweetButton = "<a class='tweetButton' href='https://twitter.com/intent/tweet?text=No copyright photo via the " + dataProvider + " and dpla: " + link + "&hashtags=" + subject + ", dpla' target='_blank'><i class='fa fa-twitter fa-2x'></i></a>";

                        var imageId= ""+numOfPages+"-"+i;
                        console.log(imageId);

                    $("#injection_site").append("<div class='card pix'><a href='" + link + "'target='_blank''><img class='card-image-top' id='image"  +imageId + "'src=" + data.docs[i].object + "></a><div class='card-block'><span class='pull-left'><a class='editButton' id='button" + imageId + "'><span class='glyphicon glyphicon-edit gi-2x'></span></a></span><span class='text-center'><a class='downloadButton' title='ImageName'><span class='glyphicon glyphicon-download gi-2x'></span></a></span><span class='pull-right'>" + tweetButton + "</span></div></div>");
                   
                    $("#button" + imageId).click(function() {
                        launchEditor("image" + imageId, data.docs[i].object);


                    });

                });
              loadButtons();

            });
        }
    });
   
    $("form").submit(function(e) {
        e.preventDefault();
        searchTerm = $("#subject").val();
        console.log(searchTerm);
        $("#injection_site").html("");
        $(".searchCount").html("");

                getFirstResults(searchTerm);
      
        });
  
  });

function loadButtons(){
  
  $(".editButton, .downloadButton").css("cursor", "pointer");
  $(".editButton, .tweetButton").fadeIn(20000);
};


function getNumOfTotalImages(){
    var params = {
        "sourceResource.type":"image",
        "sourceResource.rights":"No known copyright",
        "api_key":"9772d1f08da11321921643124e86205b"
    };
    var url= "http://api.dp.la/v2/items";
    $.getJSON(url, params, function(data){
        $(".totalImages").text("There are currently " + data.count + " free to use images from the DPLA available");
    })
};

function getFirstResults(searchTerm){
    var params = {
        "sourceResource.type":"image",
        "sourceResource.subject":searchTerm,
        "sourceResource.rights":"No known copyright",
        "page_size":"10",
        "api_key":"9772d1f08da11321921643124e86205b"

    };
     var url= "http://api.dp.la/v2/items";
     $.getJSON(url, params, function(data){

        if (data.count > 0) {
                $(".searchCount").text(data.count + " results returned for " + searchTerm);
            } else {
                $(".searchCount").text("Your search term " + searchTerm + " returned " + data.count + " results. Please try again.");
            }
     showFirstResults(data.docs);

     });

};

function showFirstResults(results){
    var html="";
    $.each(results, function(i, value){
        var link = results[i].isShownAt;
                //grab where document originates
                var dataProvider = results[i].dataProvider;
                if (searchTerm.indexOf(" ") > 0) {
                    subject = searchTerm.replace(" ", "");
                } else {
                    subject = searchTerm;
                }

    var tweetButton = "<a class='tweetButton' href='https://twitter.com/intent/tweet?text=No copyright photo via the " + dataProvider + " and dpla:" + link + "&hashtags=" + subject + ", dpla' target='_blank'><i class='fa fa-twitter fa-2x'></i></a>";

    html+= "<div class='card pix'>"+
              "<a href='" + link + "'target='_blank''>"+
                "<img class='card-image-top' id='image" + i + "'src=" + results[i].object + ">"+
              "</a>"+
              "<div class='card-block'>"+
                 "<span class='pull-left'>"+
                    "<a class='editButton' id='button" + i + "'>"+
                      "<span class='glyphicon glyphicon-edit gi-2x'></span>"+
                    "</a>"+
                 "</span>"+
                 "<span class='text-center'>"+
                    "<a class='downloadButton' title='ImageName'>"+
                      "<span class='glyphicon glyphicon-download gi-2x'>"+
                      "</span>"+
                    "</a>"+
                 "</span>"+
                 "<span class='pull-right'>" + tweetButton + 
                 "</span>"+
              "</div>"+
        "</div>";

        $("#injection_site").append(html);
        $("#button" + i).click(function() {
                    launchEditor("image" + i, results[i].object);


        });

    });
    loadButtons();

}