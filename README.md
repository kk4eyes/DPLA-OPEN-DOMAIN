# DPLA-OPEN-DOMAIN
A single page web app that connects to the Digital Public Library of America's API


This was a very fun project. I have a master's degree in Library Science and at the time I was developing this app, I was just starting to learn more about API's and connecting to third party data in my own applications but I was also working as a Reference Librarian in Worcester. So I did a little research and I found that the Digital Public Library of America has an awesome open API that's available to everyone. So I thought it would be cool to create something where people can see all the publicly available and unlicensed photos from the DPLA's api.

I originally set up my API request to just load images from the api based on a search query and in the app, give people the ability to tweet links to the content on their twitter account. But then I stumbled across this image editor called [Feather](https://developers.aviary.com/docs/web/setup-guide) from Aviary.

What is really cool about Feather is that once an image is saved with new colors, or stickers etc. the image gets saved to Aviary's servers!! So you can actually tweet out a link to the edited image! Normally this would be a huge copyright problem for most images but not the DPLA's content I was pulling in for my app! I also created a a download button that uses HTML's "download" attribute but I'm hiding that button until after a user saves and edits an image in the photo editor. Pretty cool, right? :-)



