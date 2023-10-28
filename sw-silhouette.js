"use strict";

class swSilouhetteModule {
	
    constructor() {
        this.swSilouhetteModule = new Map();
        this.TIMEOUT_INTERVAL = 50; // ms
        this.MAX_TIMEOUT = 1000; // ms
        // Random id to prevent collision with other modules;
        this.ID = randomID(24);
    }

    log(msg, ...args) {
        if (game && game.settings.get("starwars-silhouette", "verboseLogs")) {
            const color = "background: #6699ff; color: #000; font-size: larger;";
            console.debug(`%c swSilouhetteModule: ${msg}`, color, ...args);
        }
    }

    async init() {
      
	  game.settings.register('starwars-silhouette', 'folderCreated', {
          name: 'folderCreated',
          hint: '',
          scope: 'world',
          type: Boolean,
          default: false,
          config: false,
          onChange: value => {
              console.log(value);
              //location.reload();
          },
      });
      
      game.settings.register('starwars-silhouette', 'folderId', {
          name: 'folderId',
          hint: '',
          scope: 'world',
          type: String,
          default: '',
          config: false,
          onChange: value => {
              console.log(value);
              //location.reload();
          },
      });
      
      game.settings.register('starwars-silhouette', 'folderReset', {
          name: 'Reset module',
          hint: '',
          scope: 'world',
          type: Boolean,
          default: false,
          config: true,
          restricted: true,   
          onChange: value => {
              console.log(value);
              if (value)
                  location.reload();
          },
      });
      
      game.settings.register('starwars-silhouette', 'folderRemove', {
          name: 'Remove Folder',
          hint: '',
          scope: 'world',
          type: Boolean,
          default: false,
          config: true,
          restricted: true,   
          onChange: value => {
              console.log(value);
              if (value)
				  location.reload();
          },
      });
      
      game.settings.register('starwars-silhouette', 'importItems', {
          name: 'I want to import items ?',
          hint: '',
          scope: 'world',
          type: Boolean,
          default: false,
          config: true,
          restricted: true,   
          onChange: value => {
              console.log(value);
              //location.reload();
          },
      });
	  
	   game.settings.register('starwars-silhouette', 'autoScaling', {
          name: 'Do you want to auto scale your token ?',
          hint: '',
          scope: 'world',
          type: Boolean,
          default: true,
          config: true,
          restricted: true,   
          onChange: value => {
              console.log(value);
              location.reload();
          },
      });
	  
	  game.settings.register('starwars-silhouette', 'scaleSilhouetteRatio', {
          name: 'How big I want to see a Destroyer ?',
          hint: 'The bigger the number is, the smaller the scale will be !',
          scope: 'world',
          type: Number,
		  range: {
			min: 1,
			max: 5,
			step: 1
		  },
          default: 4,
          config: true,
          restricted: true,  		  
          onChange: value => {
              console.log(value);
              location.reload();
          },
      });
	  
      game.settings.register('starwars-silhouette', 'autoChangeVehicleImage', {
          name: 'Do you want to get all the images from OggDude importation into your space vehicle ?',
          hint: '',
          scope: 'world',
          type: Boolean,
          default: true,
          config: true,
          restricted: true,   
          onChange: value => {
              console.log(value);
              location.reload();
          },
      });
      game.settings.register('starwars-silhouette', 'vehicleSilhouetteImageFolder', {
          name: 'Vehicle Silhoutte Image Folder',
          type: String,
          filePicker: 'folder',
          default:'worlds/test-ui/images/VehicleSilhouettes',
          config: true,
          restricted: true   
        });

       game.settings.register('starwars-silhouette', 'vehicleImageFolder', {
          name: 'Vehicle Image Folder',
          type: String,
          filePicker: 'folder',
          default:'worlds/test-ui/images/VehicleImages',
          config: true,
          restricted: true   
        });
	}
}

Hooks.once("init", async function () {
	// TURN ON OR OFF HOOK DEBUGGING
    CONFIG.debug.hooks = false;
	
});

Hooks.on("ready", async () => {
    swSilouhetteModule.singleton = new swSilouhetteModule();
    swSilouhetteModule.singleton.init();
	
	if (game.settings.get('starwars-silhouette', 'folderRemove')){ 
          game.settings.set('starwars-silhouette', 'folderRemove',false);
                    
          game.items.forEach(item => {
          if (item.type === "shipattachment"  && item.name && item.name.startsWith("VT:"))
            item.delete();
          });
          
          let folder = game.folders.get(game.settings.get('starwars-silhouette', 'folderId'));
          folder.delete();
          
          game.settings.set('starwars-silhouette', 'folderId','');
      }
      else {
		  let actors = game.actors.filter(i => i.type === 'vehicle');
          if (game.settings.get('starwars-silhouette', 'importItems') === true){
            await createShipAttachmentsItems();
          }
		  
		  await changeScaleOnSilhouette(actors);
		  
		  if (game.settings.get('starwars-silhouette', 'autoChangeVehicleImage')){
			await importImageFromOggImageFolder(actors);
		  }
      }
      
      if (game.settings.get('starwars-silhouette', 'folderReset')){
        game.settings.set('starwars-silhouette', 'folderCreated',false);
        game.settings.set('starwars-silhouette', 'folderId','');
        game.settings.set('starwars-silhouette', 'folderReset',false);
      }
	
	if (game.settings.get('starwars-silhouette', 'importItems') === true){
	   let actors = game.actors.filter(i => i.type === 'vehicle');
	   await affectShitAttachmentsItemsToVehicle(actors);
    } 
	
});

/*Hooks.once('ready', async function () {
  
});*/

Hooks.on("renderActorSheetFFG", (app, html, data) => {
	const dirHeader = html[0].querySelector(".defense-decoration");
   
	let actor = game.actors.get(data.actor._id).prototypeToken;

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

async function updateItems(data, actor) {
    const created = await Item.create(data, {parent: actor});
    console.log(created);
}

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
async function importImageFromOggImageFolder(actors){
	  
	  let defaultSilhouette = `modules/starwars-silhouette/image/shipdefence.png`;
	  actors.forEach(actor => {
		let imageName = extractFileName(actor.img);
			if (imageName === 'mystery-man')
			  updateImage(defaultSilhouette, actor);
	  });
	  let folderPath = game.settings.get('starwars-silhouette', 'vehicleImageFolder');
	  
	  let {files} = await FilePicker.browse("data", folderPath);
	  
	  files.forEach(async file => {
		// Extract the name without path and extension
		let fileName = extractFileName(file);
		let actor = actors.filter(i=>i.flags.starwarsffg.ffgimportid == fileName);
		let imageUrl =  actor[0] ? game.settings.get('starwars-silhouette', 'vehicleImageFolder') + `/${actor[0].flags.starwarsffg.ffgimportid}.png` : defaultSilhouette;
		if (actor[0])
		  updateImage(imageUrl, actor[0]);
	  });
}

async function changeScaleOnSilhouette(actors){
		let scaleRatio = game.settings.get('starwars-silhouette', 'scaleSilhouetteRatio');
		
        actors.forEach(actor => {
		  const ORIGINALSCALE = 1;	
		  let silhouetteValue = actor.system.stats.silhouette.value;
		  let floorDivRatio = Math.floor(silhouetteValue / scaleRatio);
		  let newScale = ORIGINALSCALE + floorDivRatio;
		  if (silhouetteValue >= 9) newScale = newScale + 3;
		  if ( game.settings.get('starwars-silhouette', 'autoScaling') != true){
			newScale = 1;
		  } //get the orignal scale
		  updateTokenScale(newScale,newScale, actor);
          
		});
}

async function createItemInFolder(fileName,file,folderId){
	 const resultItemCreation = await Item.createDocuments([{
            name: `VT:${fileName}`,
            img: file,
            type: "shipattachment",
            folder: folderId
        }]);
		
	 return resultItemCreation[0]._id;
}
async function createShipAttachmentsItems() {
    let folderId = '';
    if (game.settings.get('starwars-silhouette', 'folderCreated') === false){
      folderId = await createFolder("Vehicle silhouette","Item");
      game.settings.set('starwars-silhouette', 'folderCreated',true);
      game.settings.set('starwars-silhouette', 'folderId',folderId);
    }
    else {
      return;
    }
        
    let folderPath = game.settings.get('starwars-silhouette', 'vehicleSilhouetteImageFolder');
	let {files} = await FilePicker.browse("data", folderPath);
	
    files.forEach(async file => {
        // Extract the name without path and extension
        let fileName = extractFileName(file);
		const itemId = await createItemInFolder(fileName,file,folderId);
		console.log(itemId);
    });
	
	const confirmation = await Dialog.prompt({
	  content: "Ship Attachments</BR>were created succesfully !"
	});
}

async function affectShitAttachmentsItemsToVehicle(actors) {
      actors.forEach(actor => {
		  let ffgimportid = actor.flags.starwarsffg.ffgimportid;
          let item = game.items.filter(i=>i.name== "VT:"+ffgimportid);
          let existItemActor = actor.items.filter(i=>i.name =="VT:"+ffgimportid);
          if (existItemActor.length === 0){
            const data = item;
            updateItems(data,actor);
            return;
          }
		  console.log(ffgimportid);
		});
}

// Custom function to extract file name without path and extension
function extractFileName(filePath) {
    let startIndex = filePath.lastIndexOf("/") + 1;
    let endIndex = filePath.lastIndexOf(".");
    return filePath.substring(startIndex, endIndex);
}



