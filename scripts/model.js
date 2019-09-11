var model = new Object();

//code for generating the model on page load

function populateModel(){
	model.images = [];
	$("img").each(function(){
		model.images.push(this);
	});


	model.headers = [];
	$("h1").each(function(){
		model.headers.push(this);
	});
	$("h2").each(function(){
		model.headers.push(this);
	});
	$("h3").each(function(){
		model.headers.push(this);
	});


}


$(document).ready(function(){
	populateModel();
	

});

