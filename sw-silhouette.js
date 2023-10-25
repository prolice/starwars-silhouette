"use strict";

const sizes = { 
    "fine" :  0.1,
    "dim" :   0.2, 
    "tiny":   0.5,
    "sm":     0.7,
    "med":    1, 
    "lg":     2, 
    "huge":   3,
    "grg":    4, 
    "col":    6
};

class swSilouhetteModule {
	
    constructor() {
        this.swSilouhetteModule = new Map();
        this.TIMEOUT_INTERVAL = 50; // ms
        this.MAX_TIMEOUT = 1000; // ms
        // Random id to prevent collision with other modules;
        this.ID = randomID(24);
    }

    log(msg, ...args) {
        if (game && game.settings.get("starwars-silouhette", "verboseLogs")) {
            const color = "background: #6699ff; color: #000; font-size: larger;";
            console.debug(`%c swSilouhetteModule: ${msg}`, color, ...args);
        }
    }

    async init() {
		
	}
	
	
}

Hooks.once("init", async function () {
	// TURN ON OR OFF HOOK DEBUGGING
    CONFIG.debug.hooks = false;

});

Hooks.on("ready", () => {
    swSilouhetteModule.singleton = new swSilouhetteModule();
    swSilouhetteModule.singleton.init();
});

Hooks.once('ready', function () {
   
});

Hooks.on("renderActorSheetFFG", (app, html, data) => {
	const dirHeader = html[0].querySelector(".defense-decoration");
	//data.data.stats.silhouette.value
	//data.token.texture.scaleX / data.token.texture.scaleY
	/*const silhouetteValue = data.data.stats.silhouette.value;
	
	if (data.token && data.token.texture) {
		let scaleValue = 1;
		
		// Determine scale factor based on silhouette value
		if (silhouetteValue >= 3) {
			scaleValue = 2;
		} // Add more conditions for other silhouette values if needed
		
		// Set scaleX and scaleY to the calculated scale factor
		data.token.texture.scaleX = scaleValue;
		data.token.texture.scaleY = scaleValue;
	}*/
   
	let actor = game.actors.get(data.actor._id).prototypeToken;
	//updateTokenScale(1,1,actor);
	// Loop through data.items array
	data.items.forEach(item => {
		// Check if item name starts with "VT:"
		if (item.type == "shipattachment" && item.name && item.name.startsWith("VT:")) {

			// Update the image in .defense-decoration with item.img
			if (dirHeader) {
				const imgElement = dirHeader.querySelector("img");
				if (imgElement) {
					imgElement.src = item.img;
				} else {
					// If img element doesn't exist, create one and set its src
					const newImg = document.createElement("img");
					newImg.src = item.img;
					dirHeader.appendChild(newImg);
				}
			}
		}
	});
    
});

async function updateTokenScale(height,width, actor) {
	await actor.update({"prototypeToken.height": height});
	await actor.update({"prototypeToken.width": width});
}

async function updateImage(imageUrl, actor) {
	await actor.update({"img": imageUrl});
}

Hooks.on("drawToken", (object, html) => {
    let actor = game.actors.get(object.document.actorId);
    //let newWidth = 2;
    //let newHeight = 2;
    //let change={"prototyToken.width":newWidth} // construct our update object with the calculated hp value
    //await actor.update(change); // actually call the update
    //updateTokenScale(1,1,actor);
});

async function checkImageExists(url) {
    return new Promise(resolve => {
        let img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

async function createFolder(_name,_type){
	const newfolder = await Folder.create([{
	  name: _name,
	  type: _type
	}]);
	return newfolder[0]._id;

}

async function changeScaleOnSilhouette(actors){
	
	    actors.forEach(actor => {
		  let silhouetteValue = actor.system.stats.silhouette.value;
		  if (silhouetteValue <= 4) {
			  updateTokenScale(1, 1, actor);
		  } else if (silhouetteValue >= 5 && silhouetteValue <= 6) {
			  updateTokenScale(2, 2, actor);
		  } else if (silhouetteValue >= 7 && silhouetteValue <= 8) {
			  updateTokenScale(3, 3, actor);
		  } else if (silhouetteValue > 9) {
			  updateTokenScale(6, 6, actor);
		  }
		  
		  if (actor.flags.starwarsffg && actor.flags.starwarsffg.ffgimportid) {
			let imageUrl = `worlds/test-ui/images/VehicleImages/${actor.flags.starwarsffg.ffgimportid}.png`;
			//actor.img = imageUrl;
			updateImage(imageUrl, actor);
		  }
		});
}

async function createShipAttachmentsItems(actors) {
	let folderId = await createFolder("Vehicle silhouette","Item");
	
	actors.forEach(actor => {
	  let __imageUrl = `worlds/test-ui/images/VehicleSilhouettes/${actor.flags.starwarsffg.ffgimportid}.png`;
	  
	  let isImgFound = checkImageExists(__imageUrl);
	  
	  Item.createDocuments([{
			name:`VT:${actor.flags.starwarsffg.ffgimportid}`,
			img: `worlds/test-ui/images/VehicleSilhouettes/${actor.flags.starwarsffg.ffgimportid}.png`,
			type:"shipattachment",
			folder:folderId
	  }]);
	});
}

Hooks.on("canvasReady", () => {
    let actors = game.actors.filter(i => i.type === 'vehicle');
	
	createShipAttachmentsItems(actors);
	
	changeScaleOnSilhouette(actors);
	
	/*game.items.forEach(item => {
		if (item.type === "shipattachment")
		  item.delete();
	});*/
	
   
});


