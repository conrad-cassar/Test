var lastTweet = '-1'; //Last loaded tweet
var batchAmount = 5; //Amount of tweets on each load

$(function() {
	var dragSrcEl = null;
	
	function handleDragStart(e) {
		dragSrcEl = this;

		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text', this.innerHTML);
	  
		$(this).fadeTo('fast', 0.6, function() {});
	}

	function handleDragOver(e) {
	  if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	  }

	  e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

	  return false;
	}

	function handleDragEnter(e) {
		// this / e.target is the current hover target.
		this.classList.add('dragover');
	}

	function handleDragLeave(e) {
	  this.classList.remove('dragover');  // this / e.target is previous target element.
	}
	
	function handleDrop(e) {
	  // this / e.target is current target element.
	  if (e.stopPropagation) {
		e.stopPropagation(); // stops the browser from redirecting.
	  }
	  // See the section on the DataTransfer object.
	  
	  if (dragSrcEl != this) {
		// Set the source column's HTML to the HTML of the column we dropped on.
		dragSrcEl.innerHTML = this.innerHTML;
		this.innerHTML = e.dataTransfer.getData('text');
	  }
	  
		$('.draggable').fadeTo('fast', 1.0, function() {});
		document.getElementById("tweets_container").removeEventListener('scroll', widgetScrolled, false);
	  document.getElementById("tweets_container").addEventListener('scroll', widgetScrolled, false);
	  
	  return false;
	}
	
	function handleDragEnd(e) {
	  // this/e.target is the source node.

	  [].forEach.call(cols, function (col) {
		col.classList.remove('dragover');
	  });
	  $('.draggable').fadeTo('fast', 1.0, function() {});
	}

	var cols = document.querySelectorAll('.draggable');
	[].forEach.call(cols, function(col) {
		col.addEventListener('dragstart', handleDragStart, false);
		col.addEventListener('dragenter', handleDragEnter, false);
		col.addEventListener('dragover', handleDragOver, false);
		col.addEventListener('dragleave', handleDragLeave, false);
		col.addEventListener('drop', handleDrop, false);
		col.addEventListener('dragend', handleDragEnd, false);
	});
	
	document.getElementById("tweets_container").addEventListener('scroll', widgetScrolled, false);
	
	loadMoreTweets(lastTweet, batchAmount);
});

function widgetScrolled(e) {
	var container = document.getElementById("tweets_container");
	if (container.offsetHeight + container.scrollTop >= container.scrollHeight-2) {
		loadMoreTweets(lastTweet, batchAmount);
	}
}

function showOverflow(element){
	if(element.scrollHeight > element.offsetHeight){
		$(element.parentNode).animate({
			height: element.parentNode.offsetHeight + element.scrollHeight - element.offsetHeight
		}, 200);
		
		$(element).animate({
			height: element.scrollHeight
		}, 300);
	}
	
	element.style.cursor = 'default';
	$('.fadeout', $(element.parentNode)).animate({
		height: '0em'
	}, 200);
}

function loadMoreTweets(lastShown, amount){	
	var count = 1;
	var currentTweet = '-1';
	var add = (lastShown == "-1");
	
	var container = document.getElementById("tweets_container");
	
	for (var i = 0; i < tweets.length; i++) {
		currentTweet = $.trim(tweets[i]['id_str']);
		
		if(add){
			container.innerHTML += 
			"<div id='" + tweets[i]['id_str'] + "' class='tweet'>"
			+ "<img src='" + tweets[i]['user']['profile_image_url_https'] + "' alt=''></image>"
			+ "<div class='content' onclick='showOverflow(this);'>" 
			+ "<span class='link alt_color'>" + tweets[i]['user']['screen_name'] + "</span></br>"
			+ tweets[i]['text']
			+ "<div class='fadeout'></div>"
			+ "</div>"
			+ "<div class='alt_color link small'>yesterday - reply - retweet - favourite</div>"
			+ "</div>"
			+ "<div class='seperator'></div>";
			
			count++;
			lastTweet = currentTweet;
		}
		
		if(count > amount){
			return;
		}
		
		if(lastShown == currentTweet && add == false){
			add = true;
		}
	}
}