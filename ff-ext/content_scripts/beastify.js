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
      // testTreeWalker(document.body, a => { console.log("Number of elems returned with this filter: " + a.length); });
      // animateBoxes();

      
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
			NodeFilter.SHOW_ELEMENT,
			{ acceptNode: function(node) { return NodeFilter.FILTER_ACCEPT; } }
		);

		var nodeList = [];
		var currentNode = treeWalker.currentNode;

		while(currentNode) {
      console.log(currentNode);
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



  function createParticleSpan (character, particleId) {
    var newSpan = document.createElement("span");
    
    newSpan.setAttribute('class', particleId);
    // newSpan.setAttribute('style', 'padding: 0px; background-color: #BCC6CC; display:inline-block; white-space:pre');
    newSpan.setAttribute('style', 'padding: 0px; display:inline-block; white-space:pre; ');
    // debugger;
    nodeCharacter = character;
    var newCharNode = document.createTextNode(nodeCharacter);
    newSpan.append(newCharNode);

		return newSpan;
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
		for(var i = 1; i < nodeList.length; i++) {
      console.log("------------------- record start -------------------");
			console.log("len: " + nodeList.length);
			// console.log(i + ": " + nodeList[i].textContent.trim());
  
      // Process the child nodes
      for(var j = 0; j < nodeList[i].childNodes.length; j++) {
        var tagType = nodeList[i].tagName.toLowerCase();
        if(tagType != "style") {
          if (nodeList[i].childNodes[j].nodeType === Node.TEXT_NODE) {
            var newNodes = [];

            var trimmedText = nodeList[i].childNodes[j].textContent.trim();
            if (trimmedText.length > 0)
            {
              console.log(trimmedText);

              var newSpan = document.createElement("span");
    
              newSpan.setAttribute('class', 'replaced-text');
              newSpan.innerHTML = trimmedText.replaceAll("b", "<span style=\"padding: 0px; display:inline-block; white-space:pre;\" class=\"particle-bee\" >b</span>");

              nodeList[i].replaceChild(newSpan, nodeList[i].childNodes[j]);
            }            
          }
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



