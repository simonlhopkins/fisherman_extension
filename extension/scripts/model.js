var model = new Object();

//each page has its own model
model.modifiedContent = new Object();
model.modifiedContent.images = new Set();
model.modifiedContent.headers = new Set();
model.modifiedContent.hyperlinks = new Set();


//code for generating the model on page load



function populateModel(){
	model.images = new Set();
	$("img").each(function(){
		model.images.add(this);
	});


	model.headers = new Set();
	$("h1").each(function(){
		model.headers.add(this);
	});
	$("h2").each(function(){
		model.headers.add(this);
	});
	$("h3").each(function(){
		model.headers.add(this);
	});
	$("h4").each(function(){
		model.headers.add(this);
	});

	model.hyperlinks = new Set();
	$("a").each(function(){
		model.hyperlinks.add(this);
	});

}


$(document).ready(function(){
	populateModel();
	

});

