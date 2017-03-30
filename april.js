$(function () {
	var currentHash = "#picture1";

	$(document).scroll(function () {
		$('.image').each(function () {

			var top = window.pageYOffset;
		    var distance = top - $(this).offset().top;
		    var hash = $(this).attr('id');

        	if (distance < 30 && distance > -30 && currentHash != hash) {
        		var title = $(this).attr('title');
        		var description = $(this).find("p").text();
            	document.getElementById('title').innerHTML = title;
		        document.getElementById('description').innerHTML = description;
		        currentHash = hash;
		    }
		});
	});
});