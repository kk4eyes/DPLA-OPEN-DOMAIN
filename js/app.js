

/*feather script*/
var featherEditor = new Aviary.Feather({
	apiKey: '7821528c-aaf6-4f46-9d29-6e1e72348875',
	theme: 'dark', // Check out our new 'light' and 'dark' themes!
	tools: 'all',
	appendTo: '',
	onSave: function(imageID, newURL) {
		var img = document.getElementById(imageID);
		img.src = newURL;
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


$(function(){
var searchTerm="";
  $("form").submit(function(e){
    e.preventDefault();
    searchTerm=$("#subject").val();
    console.log(searchTerm);
  
  
 $.getJSON('http://api.dp.la/v2/items?&sourceResource.type=%22image%22&sourceResource.subject='+searchTerm+'&sourceResource.rights=%22No%20known%20copyright&api_key=9772d1f08da11321921643124e86205b', function(data){
   //nsole.log(data);
   console.log(searchTerm);
   var image = data.docs;
   $.each(image, function (i, value){
     
   $("#injection_site").append("<div class='pix'><img id='image"+i+"'src="+data.docs[i].object+"><button id='button"+i+"'>Edit</button></div>")
     $("#button"+i).click(function(){
       launchEditor("image"+i, data.docs[i].object);
     });
   });
   //
 
 $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c036e70027cf801e81682de8824fe9ca&tags=soccer,garden, &min_taken_date=2016&format=json&nojsoncallback=1', function(Fdata){

   var image = (Fdata.photos.photo);
  
   $(".images").append("<img src='https://farm"+image[0].farm+".staticflickr.com/"+image[0].server+"/"+image[0].id+"_"+image[0].secret+"_m.jpg'>");
 });
});




});


//DPLA getRequest example usage
//http://api.dp.la/v2/items?&sourceResource.type=%22image%22&sourceResource.subject.name=%22football%22&sourceResource.date.before=1988&api_key=9772d1f08da11321921643124e86205b

//Flickr getRequest example usage
//https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=c036e70027cf801e81682de8824fe9ca&tags=garden&min_taken_date=2016&lat=42.2788&lon=-71.4435&format=json


//flickr api and secret
//Key:
//c036e70027cf801e81682de8824fe9ca

//Secret:
//1c7c416868c17f51