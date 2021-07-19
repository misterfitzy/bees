console.log(1);

function notifyExtension(e) {
  console.log("click notifier, content_script");
  
  var target = e.target;
  while ((target.tagName != "A" || !target.href) && target.parentNode) {
    target = target.parentNode;
  }
  if (target.tagName != "A")
    return;

  console.log("content script sending message");
  browser.runtime.sendMessage({"url": target.href});
}

/*
Add notifyExtension() as a listener to click events.
*/
window.addEventListener("click", notifyExtension);

(function() {

  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.hasRun) {
    return;
  }
  window.hasRun = true;


  /**
   * Given a URL to a beast image, remove all existing beasts, then
   * create and style an IMG node pointing to
   * that image, then insert the node into the document.
   */
  function insertBeast(beastURL) {
    removeExistingBeasts();
    let beastImage = document.createElement("img");
    beastImage.setAttribute("src", beastURL);
    beastImage.style.height = "100vh";
    beastImage.className = "beastify-image";
    document.body.appendChild(beastImage);
  }

  function testTreeWalker (callback) {
		var treeWalker = document.createTreeWalker(
			document.body,
			NodeFilter.SHOW_TEXT,
			{ acceptNode: function(node) { return NodeFilter.FILTER_ACCEPT; } },
			false
		);

		var nodeList = [];
		var currentNode = treeWalker.currentNode;

		while(currentNode) {
			nodeList.push(currentNode);
			currentNode = treeWalker.nextNode();
		}

		callback(nodeList);
  }

	function stringToDivs (nodeString) {
		var characters = nodeString.split("");
		var newNodeString = "";

		var charParticlePrefix = '<div id="particle-bee">';
		var charParticleSuffix = '</div>';

		for(var i = 0; i < characters.length; i++) {
			nodeCharacter = characters[i];
			newNodeCharacterDiv = charParticlePrefix + nodeCharacter + charParticleSuffix;	
			newNodeString += newNodeCharacterDiv;
		}

		return newNodeString;
	}

  /**
   * Remove every beast from the page.
   */
  function removeExistingBeasts() {
    let existingBeasts = document.querySelectorAll(".beastify-image");
    for (let beast of existingBeasts) {
      beast.remove();
    }
  }

  /**
   * Listen for messages from the background script.
   * Call "beastify()" or "reset()".
  */
  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "beastify") {
      insertBeast(message.beastURL);
    } else if (message.command === "reset") {
      removeExistingBeasts();
    } else if (message.command === "treewalk") {
			console.log("Walk the tree...");
      testTreeWalker(document.body, a => convertTextInNodeListToDivs(a));
      animateBoxes();

	  ani_promise = animateBoxes();
  
	  ani_promise.then(() => {
		console.log("fin anim 2...")
		animateBoxes().then(() => {
		  console.log("fin anim 3...")
		  animateBoxes();
		});
	  });
      // testTreeWalker(convertTextInNodeListToDivs);
		}
  });

	/*
  select = e => document.querySelector(e);
  selectAll = e => document.querySelectorAll(e);

  // var spans = selectAll("span");
  var output_container = select("div.container");
	*/

  function testTreeWalker (startPoint, callback) {
		var treeWalker = document.createTreeWalker(
			startPoint,
			NodeFilter.SHOW_TEXT,
			{ acceptNode: function(node) { return NodeFilter.FILTER_ACCEPT; } },
			false
		);

		var nodeList = [];
		var currentNode = treeWalker.currentNode;

		while(currentNode) {
			nodeList.push(currentNode);
			currentNode = treeWalker.nextNode();
		}

		callback(nodeList);
  }

  function stringToDivs (nodeString) {
		var characters = nodeString.split("");
		var newNodeString = "";

	    var stringDivs = [];
	
		for(var i = 0; i < characters.length; i++) {
			var newDiv = document.createElement("div");
			
			newDiv.setAttribute('class', 'particle');
			// newDiv.setAttribute('style', 'padding: 0px; background-color: #BCC6CC; display:inline-block; white-space:pre');
			newDiv.setAttribute('style', 'padding: 0px; display:inline-block; white-space:pre; ');
			// debugger;
			nodeCharacter = characters[i];
			var newCharNode = document.createTextNode(nodeCharacter);
			newDiv.append(newCharNode);
			
			stringDivs.push(newDiv);
		}

		return stringDivs;
	}

  var convertTextInNodeListToDivs = function(nodeList) {

	    // Need to delete this node
	    // And then create divs and add them to the same place
		for(var i = 1; i < nodeList.length - 1; i++) {
			// console.log("len: " + nodeList.length);
			// console.log(i + ": " + nodeList[i].textContent.trim());

			var trimmedText = nodeList[i].textContent.trim();
			if (trimmedText.length >= 0) {
        debugger;
				var stringDivs = stringToDivs(trimmedText);
				if (nodeList[i].parentElement) {
					// nodeList[i].parentElement.innerHTML = newNodeString;
					for(var j = 0; j < stringDivs.length; j++) {
						nodeList[i].parentElement.appendChild(stringDivs[j]);
					}
					nodeList[i].remove();
					// debugger;
				}
			}
		}

	}

function animateBoxes() {
  let animation = anime({
     targets: '.particle',    
     translateX: 100,
     borderRadius: 50,
     duration: 2000,
     easing: 'easeInOutExpo',
     direction: 'alternate',
     translateX: function() {
        return anime.random(-300, 300);
     },   
     translateY: function() {
        return anime.random(-300, 300);
     }, 
     translateZ: function() {
        return anime.random(-300, 300);
     },
     rotateX: function() {
        return anime.random(0, 360);
     },   
		 rotateY: function() {
        return anime.random(0, 360);
     }, 
     rotateZ: function() {
        return anime.random(0, 360);
     }, 
     scale: function() {
        return anime.random(0.1, 2);
     }, 
     opacity: function() {
        return anime.random(0.3, 1);
     }, 
     delay: anime.stagger(100),
     loop: false,
     direction: 'alternate'
   }).finished;  
  return animation;
}

})();



