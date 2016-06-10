/*feather script*/
var featherEditor = new Aviary.Feather({
    apiKey: '7821528c-aaf6-4f46-9d29-6e1e72348875',
    theme: 'dark', // Check out our new 'light' and 'dark' themes!
    tools: 'all',
    appendTo: '',
    onSave: function(imageID, newURL) {
        var img = document.getElementById(imageID);
        img.src = newURL;


        if($("#"+imageID).parents(".pix:first").find(".downloadButton").length > 0 ){
          $("#"+imageID).parents(".pix:first").find(".downloadButton").attr({"href":newURL, "download":newURL});
        }   
        else{
          var downloadButton= "<a class='downloadButton' download='"+newURL+"'href='"+newURL+"'title='ImageName'>Download</a>";
          $("#"+imageID).parents(".pix:first").append(downloadButton);
        }   
       
        var tweetButton = $("#"+imageID).parents(".pix:first").find(".tweetButton");
        //console.log(tweetButton);
        var tweetHref = tweetButton.attr("href");
        console.log(tweetHref);

        var editedURL = tweetHref.split("dpla:")[0]+"dpla:"+newURL+"&hashtags"+tweetHref.split("&hashtags")[1];

        console.log(editedURL);

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
    console.log(data.count);
    $("h3").text("There are currently " + data.count + " free to use images from the DPLA available");
});
$(function() {

    var searchTerm = "";
    var subject="";
    $("form").submit(function(e) {
        e.preventDefault();
        searchTerm = $("#subject").val();
        console.log(searchTerm);

        $.getJSON('http://api.dp.la/v2/items?&sourceResource.type=%22image%22&sourceResource.subject=' + searchTerm + '&sourceResource.rights=%22No%20known%20copyright&api_key=9772d1f08da11321921643124e86205b', function(data) {

            console.log(data);
            var image = data.docs;
            $.each(image, function(i, value) {
                var link = data.docs[i].isShownAt;
                var dataProvider = data.docs[i].dataProvider;
                 if (searchTerm.indexOf(" ")>0){
                  subject = searchTerm.replace(" ", "");
                }
                else{
                subject = searchTerm;
              }
              console.log(subject);
                console.log(link);
               
                var tweetButton = "<a class='tweetButton' href='https://twitter.com/intent/tweet?text=No copyright photo via the " + dataProvider + " and dpla:" + link + "&hashtags=" + subject + ", dpla'>Tweet This</a>";
                console.log(subject);
               
                $("#injection_site").append("<div class='pix'><a href="+link+"><img id='image" + i + "'src=" + data.docs[i].object + "></a><button id='button" + i + "'>Edit</button>" + tweetButton + "</div>")
                $("#button" + i).click(function() {
                    launchEditor("image" + i, data.docs[i].object);

                });

            });
        });
    });
});



