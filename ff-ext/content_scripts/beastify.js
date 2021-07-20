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

  function getIndexesOfCharacterIn(nodeString, character) {
    var charOffset = 0;
    var indexesOfChar = [];
    var nextSeek = 0;
    while(true) {
      var charOffset = nodeString.indexOf(character, nextSeek);
      if (charOffset > -1) {
        indexesOfChar.push(charOffset);
        nextSeek = charOffset + 1;
      } 
      else
      {
        break;
      }
    }
    return indexesOfChar;
  }



  function createParticleDiv (character, particleId) {
    var newDiv = document.createElement("div");
    
    newDiv.setAttribute('class', particleId);
    // newDiv.setAttribute('style', 'padding: 0px; background-color: #BCC6CC; display:inline-block; white-space:pre');
    newDiv.setAttribute('style', 'padding: 0px; display:inline-block; white-space:pre; ');
    // debugger;
    nodeCharacter = character;
    var newCharNode = document.createTextNode(nodeCharacter);
    newDiv.append(newCharNode);

		return newDiv;
	}

  // Need a function that slowly converts the page into sprites and slowly evolves the page 
  // into the playground
  //
  // Use Promises so there can be a high level of parallel executions
  //

  const splitAt = index => x => [x.slice(0, index), x.slice(index + 1)]

  var convertTextInNodeListToDivs = function(nodeList) {

	    // Need to delete this node
	    // And then create divs and add them to the same place
		for(var i = 1; i < nodeList.length - 1; i++) {
			console.log("len: " + nodeList.length);
			console.log(i + ": " + nodeList[i].textContent.trim());

			var trimmedText = nodeList[i].textContent.trim();
      debugger;
			if (trimmedText.length >= 0) {
        debugger;
				var indexesOfCharacter = getIndexesOfCharacterIn(trimmedText, 'b');
				if (nodeList[i].parentElement) {
					// nodeList[i].parentElement.innerHTML = newNodeString;
          // We now want to split the string at each juncture based on the character
          // then make it left_str + <div>char</div> + right_str
          //
          // Get the parent's tagName
          // var openingTag = "<" + nodeList[i].parentNode.tagName.toLowerCase() + ">";
          // var closingTag = "</" + nodeList[i].parentNode.tagName.toLowerCase() + ">";
          var tagType = nodeList[i].parentNode.tagName.toLowerCase();

					for(var j = 0; j < indexesOfCharacter.length; j++) {
						// nodeList[i].parentElement.appendChild(stringDivs[j]);
            var splitString = splitAt(indexesOfCharacter[j])(trimmedText);  
            var newDiv = createParticleDiv('b', 'particle-bee');

            /*
            var newDiv = 
    
            newDiv.setAttribute('class', particleId);
            // newDiv.setAttribute('style', 'padding: 0px; background-color: #BCC6CC; display:inline-block; white-space:pre');
            newDiv.setAttribute('style', 'padding: 0px; display:inline-block; white-space:pre; ');
            // debugger;
            nodeCharacter = character;
            var newCharNode = document.createTextNode(nodeCharacter);
            newDiv.append(newCharNode);
            */
            var leftElement = document.createElement(tagType);
            var leftElementText = document.createTextNode(splitString[0]);
            leftElement.append(leftElementText);

            var rightElement = document.createElement(tagType);
            var rightElementText = document.createTextNode(splitString[1]);
            rightElement.append(rightElementText);

            nodeList[i].parentElement.appendChild(leftElement);
            nodeList[i].parentElement.appendChild(newDiv);
            nodeList[i].parentElement.appendChild(rightElement);
            debugger;

					}
					nodeList[i].remove();
					// debugger;
				}
			}
		}

	}

function animateBoxes() {
  let animation = anime({
     targets: '.particle-bee',    
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



