//"use strict";
//import DataImporter from "importer/data-importer.js";

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
        default:
            false,
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
        default:
            '',
            config: false,
            onChange: value => {
                console.log(value);
                //location.reload();
            },
        });

        game.settings.register('starwars-silhouette', 'importItems', {
            name: 'I want to import items ?',
            hint: '',
            scope: 'world',
            type: Boolean,
            requiresReload: true, // This will prompt the user to reload the application for the setting to take effect.
        default:
            false,
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
            requiresReload: true, // This will prompt the user to reload the application for the setting to take effect.
        default:
            false,
            config: true,
            restricted: true,
            onChange: value => {
                console.log(value);
                //location.reload();
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
        default:
            4,
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
            requiresReload: true, // This will prompt the user to reload the application for the setting to take effect.
        default:
            false,
            config: true,
            restricted: true,
            onChange: value => {
                console.log(value);
                /*location.reload();*/
            },
        });
        game.settings.register('starwars-silhouette', 'vehicleSilhouetteImageFolder', {
            name: 'Vehicle Silhoutte Image Folder',
            type: String,
            filePicker: 'folder',
        default:
            'modules/starwars-silhouette/image/VehicleSilhouettes',
            config: true,
            restricted: true
        });

        game.settings.register('starwars-silhouette', 'vehicleImageFolder', {
            name: 'Vehicle Image Folder',
            type: String,
            filePicker: 'folder',
        default:
            'modules/starwars-silhouette/image/VehicleImages',
            config: true,
            restricted: true
        });

        game.settings.registerMenu('starwars-silhouette', 'vehicleSilhouetteUploadImage', {
            name: "Vehicle Silhoutte Upload Image Folder",
            label: "Import Images", // The text label used in the button
            hint: "Import images in Star Wars Silhouette module from data.zip (oggdude)",
            icon: "fas fa-upload", // A Font Awesome icon used in the submenu button
            type: DataImporter, // A FormApplication subclass
            restricted: true // Restrict this submenu to gamemaster only?
        });

        game.settings.register('starwars-silhouette', 'folderReset', {
            name: 'Reset module',
            hint: '',
            scope: 'world',
            type: Boolean,
            requiresReload: true, // This will prompt the user to reload the application for the setting to take effect.
        default:
            false,
            config: true,
            restricted: true,
            onChange: value => {
                console.log(value);
                /*if (value)
                location.reload();*/
            },
        });

        game.settings.register('starwars-silhouette', 'folderRemove', {
            name: 'Remove Folder',
            hint: '',
            scope: 'world',
            type: Boolean,
            requiresReload: true, // This will prompt the user to reload the application for the setting to take effect.
        default:
            false,
            config: true,
            restricted: true,
            onChange: value => {
                console.log(value);
            },
        });

        //importImage('Data/VehicleSilhouettes',''
    }
}
 
  /**
   * Imports binary file, by extracting from zip file and uploading to path.
   *
   * @param  {string} path - Path to image within zip file
   * @param  {object} zip - Zip file
   * @returns {string} - Path to file within VTT
   */
  async function importImage(path, zip, serverPath) {
    if (path) {
      //const serverPath = `worlds/${game.world.id}/images/packs/${pack.metadata.name}`;
      //const serverPath = `modules/starwars-silhouette/image/vehicleImages`;
      const filename = path.replace(/^.*[\\\/]/, "");
      if (!CONFIG.temporary.images) {
        CONFIG.temporary.images = [];
      }
      try {
        if (!CONFIG.temporary.images.includes(`${serverPath}/${filename}`)) {
          CONFIG.temporary.images.push(`${serverPath}/${filename}`);
          //await verifyPath("data", serverPath);
          const img = await zip.file(path).async("uint8array");
          var arr = img.subarray(0, 4);
          var header = "";
          for (var a = 0; a < arr.length; a++) {
            header += arr[a].toString(16);
          }
          const type = getMimeType(header);

          const i = new File([img], filename, { type });
          await UploadFile("data", `${serverPath}`, i, { bucket: null });
        }

        return `${serverPath}/${filename}`;
      } catch (err) {
        CONFIG.logger.error(`Error Uploading File: ${path} to ${serverPath}`);
      }
    }
  }

/**
 * Uploads a file to Foundry without the UI Notification
 * @param  {string} source
 * @param  {string} path
 * @param  {blog} file
 * @param  {object} options
 */
async function UploadFile(source, path, file, options) {
    if (typeof ForgeVTT !== "undefined" && ForgeVTT?.usingTheForge) {
        return Helpers.ForgeUploadFile("forgevtt", path, file, options);
    }

    let fd = new FormData();
    fd.set("source", source);
    fd.set("target", path);
    fd.set("upload", file);
    Object.entries(options).forEach((o) => fd.set(...o));

    const request = await fetch(FilePicker.uploadURL, {
        method: "POST",
        body: fd
    });
    if (request.status === 413) {
        return ui.notifications.error(game.i18n.localize("FILES.ErrorTooLarge"));
    }

    const response = await request.json().catch((err) => {
        return {};
    });
    if (response.error) {
        ui.notifications.error(response.error);
        return false;
    } else if (!response.path) {
        return ui.notifications.error(game.i18n.localize("FILES.ErrorSomethingWrong"));
    }
}

Hooks.once("init", async function () {
    // TURN ON OR OFF HOOK DEBUGGING
    CONFIG.debug.hooks = false;

});

Hooks.on("ready", async() => {
    swSilouhetteModule.singleton = new swSilouhetteModule();
    swSilouhetteModule.singleton.init();

    if (game.settings.get('starwars-silhouette', 'folderRemove')) {
        game.settings.set('starwars-silhouette', 'folderRemove', false);

        game.items.forEach(item => {
            if (item.type === "shipattachment" && item.name && item.name.startsWith("VT:"))
                item.delete();
        });

        let folder = game.folders.get(game.settings.get('starwars-silhouette', 'folderId'));
        folder.delete();

        game.settings.set('starwars-silhouette', 'folderId', '');
    } else {
        let actors = game.actors.filter(i => i.type === 'vehicle');
        if (game.settings.get('starwars-silhouette', 'importItems') === true) {
            await createShipAttachmentsItems();
        }

        await changeScaleOnSilhouette(actors);

        if (game.settings.get('starwars-silhouette', 'autoChangeVehicleImage')) {
            await importImageFromOggImageFolder(actors);
        }
    }

    if (game.settings.get('starwars-silhouette', 'folderReset')) {
        game.settings.set('starwars-silhouette', 'folderCreated', false);
        game.settings.set('starwars-silhouette', 'folderId', '');
        game.settings.set('starwars-silhouette', 'folderReset', false);
    }

    if (game.settings.get('starwars-silhouette', 'importItems') === true) {
        let actors = game.actors.filter(i => i.type === 'vehicle');
        await affectShitAttachmentsItemsToVehicle(actors);
    }

});

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

async function updateTokenScale(height, width, actor) {
    await actor.update({
        "prototypeToken.height": height
    });
    await actor.update({
        "prototypeToken.width": width
    });
}

async function updateImage(imageUrl, actor) {
    await actor.update({
        "img": imageUrl
    });
}

async function updateItems(data, actor) {
    const created = await Item.create(data, {
        parent: actor
    });
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

async function createFolder(_name, _type) {
    const newfolder = await Folder.create([{
                    name: _name,
                    type: _type
                }
            ]);
    return newfolder[0]._id;

}
async function importImageFromOggImageFolder(actors) {

    let defaultSilhouette = `modules/starwars-silhouette/image/shipdefence.png`;
    actors.forEach(actor => {
        let imageName = extractFileName(actor.img);
        if (imageName === 'mystery-man' || imageName === 'shipdefence')
            updateImage(defaultSilhouette, actor);
    });
    let folderPath = game.settings.get('starwars-silhouette', 'vehicleImageFolder');

    let {
        files
    } = await FilePicker.browse("data", folderPath);

    files.forEach(async file => {
        // Extract the name without path and extension
        let fileName = extractFileName(file);
        let actor = actors.filter(i => i.flags.starwarsffg.ffgimportid == fileName);
        let imageUrl = actor[0] ? game.settings.get('starwars-silhouette', 'vehicleImageFolder') + `/${actor[0].flags.starwarsffg.ffgimportid}.png` : defaultSilhouette;
        if (actor[0])
            updateImage(imageUrl, actor[0]);
    });
}

async function changeScaleOnSilhouette(actors) {
    let scaleRatio = game.settings.get('starwars-silhouette', 'scaleSilhouetteRatio');

    actors.forEach(actor => {
        const ORIGINALSCALE = 1;
        let silhouetteValue = actor.system.stats.silhouette.value;
        let floorDivRatio = Math.floor(silhouetteValue / scaleRatio);
        let newScale = ORIGINALSCALE + floorDivRatio;
        if (silhouetteValue >= 9)
            newScale = newScale + 3;
        if (game.settings.get('starwars-silhouette', 'autoScaling') != true) {
            newScale = 1;
        } //get the orignal scale
        updateTokenScale(newScale, newScale, actor);

    });
}

async function createItemInFolder(fileName, file, folderId) {
    const resultItemCreation = await Item.createDocuments([{
                    name: `VT:${fileName}`,
                    img: file,
                    type: "shipattachment",
                    folder: folderId
                }
            ]);

    return resultItemCreation[0]._id;
}
async function createShipAttachmentsItems() {
    let folderId = '';
    if (game.settings.get('starwars-silhouette', 'folderCreated') === false) {
        folderId = await createFolder("Vehicle silhouette", "Item");
        game.settings.set('starwars-silhouette', 'folderCreated', true);
        game.settings.set('starwars-silhouette', 'folderId', folderId);
    } else {
        return;
    }

    let folderPath = game.settings.get('starwars-silhouette', 'vehicleSilhouetteImageFolder');
    let {
        files
    } = await FilePicker.browse("data", folderPath);

    files.forEach(async file => {
        // Extract the name without path and extension
        let fileName = extractFileName(file);
        const itemId = await createItemInFolder(fileName, file, folderId);
        console.log(itemId);
    });

    const confirmation = await Dialog.prompt({
        content: "Ship Attachments</BR>were created succesfully !"
    });
}

async function affectShitAttachmentsItemsToVehicle(actors) {
    actors.forEach(actor => {
        let ffgimportid = actor.flags.starwarsffg.ffgimportid;
        let item = game.items.filter(i => i.name == "VT:" + ffgimportid);
        let existItemActor = actor.items.filter(i => i.name == "VT:" + ffgimportid);
        if (existItemActor.length === 0) {
            const data = item;
            updateItems(data, actor);
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

function readBlobFromFile(file) {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
        reader.onload = (ev) => {
            resolve(reader.result);
        };
        reader.onerror = (ev) => {
            reader.abort();
            reject();
        };
        reader.readAsBinaryString(file);
    });
}

function writeFileFromBlob(fileBlob) {
    const fileWriter = new FileWriter(filePath);
    fileWriter.write(fileBlob);
    fileWriter.onwriteend = () => {
        resolve(filePath);
    };
    fileWriter.onerror = (err) => {
        reject(err);
    };
}
/**
 * Returns the name of a file within the zip file based on a built string.
 *
 * @param  {object} zip - Zip file
 * @param  {string} type - Object Type
 * @param  {string} itemtype - Item Type
 * @param  {string} key - Item Key
 * @returns {string} - Path to file within Zip File
 */
async function getImageFilename(zip, type, itemtype, key) {
    const imgFileName = `${type}Images/${itemtype}${key}`;

    return Object.values(zip.files).find((file) => {
        if (file.name.includes(imgFileName)) {
            return file.name;
        }
        return undefined;
    });
}

/**
 * Returns the MIME type for a media file
 * @param  {string} header - Hex header for file.
 */
async function getMimeType(header) {
    let type = "";
    switch (header) {
    case "89504e47":
        type = "image/png";
        break;
    case "47494638":
        type = "image/gif";
        break;
    case "ffd8ffe0":
    case "ffd8ffe1":
    case "ffd8ffe2":
    case "ffd8ffe3":
    case "ffd8ffe8":
        type = "image/jpeg";
        break;
    default:
        type = "unknown"; // Or you can use the blob.type as fallback
    }

    return type;
}

class DataImporter extends FormApplication {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            id: "data-importer",
            classes: ["starwarsffg", "data-import"],
            title: "Data Importer",
            template: "modules/starwars-silhouette/template/data-importer.html",
        });
    }

    /**
     * Return a reference to the target attribute
     * @type {String}
     */
    get attribute() {
        return this.options.name;
    }

    asyncForEach = async(array, callback) => {
        for (let index = 0; index < array.length; index += 1) {
            await callback(array[index], index, array);
        }
    };
    /** @override */
    async getData() {
        let data = await FilePicker.browse("data", "", {
            bucket: null,
            extensions: [".zip", ".ZIP"],
            wildcard: false
        });
        const files = data.files.map((file) => {
            return decodeURIComponent(file);
        });

        $(".import-progress").addClass("import-hidden");

        if (!CONFIG?.temporary) {
            CONFIG.temporary = {};
        }

        return {
            data,
            files,
            cssClass: "data-importer-window",
        };
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        $(`<span class="debug"><label><input type="checkbox" /> Generate Log</label></span>`).insertBefore("#data-importer header a");

        html.find(".dialog-button").on("click", this._dialogButton.bind(this));
    }

    _importLog = [];
    _importLogger(message) {
        if ($(".debug input:checked").length > 0) {
            this._importLog.push(`[${new Date().getTime()}] ${message}`);
        }
    }

    async _dialogButton(event) {
        event.preventDefault();
        event.stopPropagation();
        const a = event.currentTarget;
        const action = a.dataset.button;

        // if clicking load file reset default
        $("input[type='checkbox'][name='imports']").attr("disabled", true);

        // load the requested file
        if (action === "load") {
            try {
                const selectedFile = $("#import-file").val();

                let zip;

                if (selectedFile) {
                    zip = await fetch(`/${selectedFile}`)
                        .then(function (response) {
                            if (response.status === 200 || response.status === 0) {
                                return Promise.resolve(response.blob());
                            } else {
                                return Promise.reject(new Error(response.statusText));
                            }
                        })
                        .then(JSZip.loadAsync);
                } else {
                    const form = $("form.data-importer-window")[0];

                    if (form.data.files.length) {
                        zip = await readBlobFromFile(form.data.files[0]).then(JSZip.loadAsync);
                    }
                }

                this._enableImportSelection(zip.files, "VehicleSilhouettes", true);
                this._enableImportSelection(zip.files, "VehicleImages", true);

            } catch (err) {
                ui.notifications.warn("There was an error trying to load the import file, check the console log for more information.");
                console.error(err);
            }
        }

        if (action === "import") {
            CONFIG.logger.debug("Importing Data Files");
            this._importLogger(`Starting import`);

            const importFiles = $("input:checkbox[name=imports]:checked")
                .map(function () {
                    return {
                        file: $(this).val(),
                        label: $(this).data("name"),
                        type: $(this).data("type"),
                        itemtype: $(this).data("itemtype")
                    };
                })
                .get();

            const selectedFile = $("#import-file").val();
            this._importLogger(`Using ${selectedFile} for import source`);

            let zip;

            if (selectedFile) {
                zip = await fetch(`/${selectedFile}`)
                    .then(function (response) {
                        if (response.status === 200 || response.status === 0) {
                            return Promise.resolve(response.blob());
                        } else {
                            return Promise.reject(new Error(response.statusText));
                        }
                    })
                    .then(JSZip.loadAsync);
            } else {
                const form = $("form.data-importer-window")[0];

                if (form.data.files.length) {
                    zip = await readBlobFromFile(form.data.files[0]).then(JSZip.loadAsync);
                }
            }           
            
            await this.asyncForEach(importFiles, async (file) => {
                if ( file.file.includes('/VehicleImages')) {
                     const files = Object.values(zip.files).filter((file) => {
                        return !file.dir && file.name.split(".").pop() === "png" && file.name.includes("/VehicleImages/");
                    });
                    let serverPath = `modules/starwars-silhouette/image/VehicleImages`;
                    let totalCount = files.length;
                    let currentCount = 0;
                    if (files.length) {
                        CONFIG.logger.debug(`Starting Oggdude Vehicle Images Import`);
                        $(".import-progress.vehicleImage").toggleClass("import-hidden");
                        await this.asyncForEach(files, async(file) => {
                            try {
                                let myNewFile = importImage(file.name,zip,serverPath);
                                currentCount += 1;

                                $(".vehicleImage .import-progress-bar")
                                    .width(`${Math.trunc((currentCount / totalCount) * 100)}%`)
                                    .html(`<span>${Math.trunc((currentCount / totalCount) * 100)}%</span>`);

                            } catch (err) {
                                CONFIG.logger.error(`Error importing record : `, err);
                            }
                        });
                        ui.notifications.info("Vehicle Image imported successfully: " + currentCount.toString()+" images" );
                        game.settings.set('starwars-silhouette', 'vehicleImageFolder',serverPath);
                    }
                }
                if ( file.file.includes('/VehicleSilhouettes')) {
                    const files = Object.values(zip.files).filter((file) => {
                        return !file.dir && file.name.split(".").pop() === "png" && file.name.includes("/VehicleSilhouettes/");
                    });
                    let serverPath = `modules/starwars-silhouette/image/VehicleSilhouettes`;
                    let totalCount = files.length;
                    let currentCount = 0;
                    if (files.length) {
                        CONFIG.logger.debug(`Starting Oggdude Vehicle Silhouettes Images Import`);
                        $(".import-progress.VehicleSilhouettes").toggleClass("import-hidden");
                        await this.asyncForEach(files, async(file) => {
                            try {
                                let myNewFile = importImage(file.name,zip,serverPath);
                                currentCount += 1;

                                $(".VehicleSilhouettes .import-progress-bar")
                                    .width(`${Math.trunc((currentCount / totalCount) * 100)}%`)
                                    .html(`<span>${Math.trunc((currentCount / totalCount) * 100)}%</span>`);

                            } catch (err) {
                                CONFIG.logger.error(`Error importing record : `, err);
                            }
                        });
                        ui.notifications.info("Vehicle Silhouette Image imported successfully: " + currentCount.toString()+" images" );
                        game.settings.set('starwars-silhouette', 'vehicleSilhouetteImageFolder',serverPath);
                    }
                }
                
            });
            CONFIG.temporary = {};
            this.close();
        }
    }

    _enableImportSelection(files, name, isDirectory, returnFilename) {
        this._importLogger(`Checking zip file for ${name}`);
        let fileName;
        Object.values(files).findIndex((file) => {
            if (file.name.includes(`/${name}.xml`) || (isDirectory && file.name.includes(`/${name}`))) {
                this._importLogger(`Found file ${file.name}`);
                let filename = file.name;
                if (file.name.includes(`.xml`) && isDirectory) {
                    filename = `${file.name.substring(0, file.name.lastIndexOf("/"))}/`;
                }
                $(`#import${name.replace(" ", "")}`)
                .removeAttr("disabled")
                .val(filename);
                if (returnFilename) {
                    fileName = file.name;
                }
                return true;
            }
            return false;
        }) > -1;

        return fileName;
    }

}
