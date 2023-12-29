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

        game.settings.register('starwars-silhouette', 'vehicleImagesCount', {
            name: 'vehicleImagesCount',
            hint: '',
            scope: 'world',
            type: Number,
        default:
            0,
            config: false,
        });

        game.settings.register('starwars-silhouette', 'vehicleImagesSilhouetteCount', {
            name: 'vehicleImagesSilhouetteCount',
            hint: '',
            scope: 'world',
            type: Number,
        default:
            0,
            config: false,
        });

        game.settings.register('starwars-silhouette', 'creationShipAttachmentItems', {
            name: 'creationShipAttachmentItems',
            hint: '',
            scope: 'world',
            type: Number,
        default:
            0,
            config: false,
        });

        game.settings.register('starwars-silhouette', 'affectShipAttachmentItems', {
            name: 'affectShipAttachmentItems',
            hint: '',
            scope: 'world',
            type: Number,
        default:
            0,
            config: false,
        });

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
            name: 'How big you want to see a Destroyer ?',
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
            name: 'Affect images into vehicles',
            hint: 'Do you want to get all the images from "OggDude importation" into your vehicle ?',
            scope: 'world',
            type: Boolean,
            requiresReload: true, // This will prompt the user to reload the application for the setting to take effect.
        default:
            false,
            config: true,
            restricted: true,
        });

        game.settings.register('starwars-silhouette', 'useSilhouetteAsVehicleImage', {
            name: 'Use silhouette as vehicle image ?',
            hint: 'Do you want to use all the silhouette images from "OggDude importation" as vehicle image ?',
            scope: 'world',
            type: Boolean,
            requiresReload: true, // This will prompt the user to reload the application for the setting to take effect.
        default:
            false,
            config: true,
            restricted: true,
        });

        game.settings.register('starwars-silhouette', 'forceParsingVehicleImage', {
            name: 'Do you want to force the vehicle image ?',
            hint: 'Force to reevaluate if vehicle image has an update.',
            scope: 'world',
            type: Boolean,
            requiresReload: true, // This will prompt the user to reload the application for the setting to take effect.
        default:
            false,
            config: true,
            restricted: true,
        });

        game.settings.register('starwars-silhouette', 'vehicleSilhouetteImageFolder', {
            name: 'Vehicle Silhoutte Image Folder',
            type: String,
            //filePicker: 'folder',
        default:
            'modules/starwars-silhouette/storage/image/VehicleSilhouettes',
            config: true,
            restricted: true
        });

        game.settings.register('starwars-silhouette', 'vehicleImageFolder', {
            name: 'Vehicle Image Folder',
            type: String,
            //filePicker: 'folder',
        default:
            'modules/starwars-silhouette/storage/image/VehicleImages',
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

        /*game.settings.register('starwars-silhouette', 'testfolderpick', {
        name: 'TEST FOLDER PICK/CREATE',
        hint: '',
        scope: "world",
        config: true,
        default:
        'modules/starwars-silhouette/storage/image/VehicleSilhouettes',
        type: String,
        //filePicker: true,
        requiresReload: false
        });*/
        //importImage('Data/VehicleSilhouettes',''
    }
}

asyncForEach = async(array, callback) => {
    for (let index = 0; index < array.length; index += 1) {
        await callback(array[index], index, array);
    }
};

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

                const i = new File([img], filename, {
                    type
                });
                await UploadFile("data", `${serverPath}`, i, {
                    bucket: null
                });
            }

            return `${serverPath}/${filename}`;
        } catch (err) {
            CONFIG.logger.error(`Error Uploading File: ${path} to ${serverPath}`);
        }
    }
}

async function ForgeUploadFile(source, path, file, options) {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("path", `${path}/${file.name}`);

    const response = await ForgeAPI.call("assets/upload", fd);
    if (!response || response.error) {
        ui.notifications.error(response ? response.error : "An unknown error occured accessing The Forge API");
        return false;
    } else {
        return {
            path: response.url
        };
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
        return ForgeUploadFile("forgevtt", path, file, options);
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

Hooks.on("renderSettingsConfig", (app, html, data) => {

    let fileInput = $('input[name="starwars-silhouette.vehicleSilhouetteImageFolder"]', html).css({
        'flex-basis': 'unset',
        'flex-grow': 1
    });

    // Create a button for browsing files
    let browseBtn = $('<button>')
        .addClass('file')
        .attr('type', 'button') // Change type to 'button' to prevent form submission
        .attr('data-type', "folder")
        .attr('data-target', "img")
        .attr('title', "Select Folder")
        .attr('tabindex', "-1")
        .html('<i class="fas fa-file-import fa-fw"></i>')
        .click(function (event) {
            const fp = new FilePicker({
                type: "folder",
                current: fileInput.val(),
                callback: path => {
                    fileInput.val(path);
                }
            });
            return fp.browse();
        });

    // Create a button for creating a directory
    let createDirBtn = $('<button>')
        .addClass('create-directory')
        .attr('type', 'button') // Change type to 'button' to prevent form submission
        .attr('title', 'Create a sub directory')
        .attr('tabindex', '-1')
        .html('<i class="fas fa-folder-plus fa-fw"></i>')
        .click(function (event) {
            const fp = new FilePicker({
                type: 'folder',
                current: fileInput.val(),
                callback: path => {
                    fileInput.val(path);
                }
            });
            return fp._createDirectoryDialog(fp.sources.data)
        });

    // Insert the buttons after the file input
    browseBtn.clone(true).insertAfter(fileInput);
    createDirBtn.clone(true).insertAfter(fileInput);

    let fileInputImage = $('input[name="starwars-silhouette.vehicleImageFolder"]', html).css({
        'flex-basis': 'unset',
        'flex-grow': 1
    });

    // Create a button for browsing files
    let browseBtnImage = $('<button>')
        .addClass('file')
        .attr('type', 'button') // Change type to 'button' to prevent form submission
        .attr('data-type', "folder")
        .attr('data-target', "img")
        .attr('title', "Select Folder")
        .attr('tabindex', "-1")
        .html('<i class="fas fa-file-import fa-fw"></i>')
        .click(function (event) {
            const fp = new FilePicker({
                type: "folder",
                current: fileInputImage.val(),
                callback: path => {
                    fileInputImage.val(path);
                }
            });
            return fp.browse();
        });

    // Create a button for creating a directory
    let createDirBtnImage = $('<button>')
        .addClass('create-directory')
        .attr('type', 'button') // Change type to 'button' to prevent form submission
        .attr('title', 'Create a sub directory')
        .attr('tabindex', '-1')
        .html('<i class="fas fa-folder-plus fa-fw"></i>')
        .click(function (event) {
            const fp = new FilePicker({
                type: 'folder',
                current: fileInputImage.val(),
                callback: path => {
                    fileInputImage.val(path);
                }
            });
            return fp._createDirectoryDialog(fp.sources.data)
        });

    // Insert the buttons after the file input
    browseBtnImage.clone(true).insertAfter(fileInputImage);
    createDirBtnImage.clone(true).insertAfter(fileInputImage);

});

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

        await changeScaleOnSilhouette(actors);

        if (game.settings.get('starwars-silhouette', 'autoChangeVehicleImage')) {
            //SceneNavigation.displayProgressBar({label: "Test Progress Bar",pct: 45});
            let currentAffectedCount = await importImageFromOggImageFolder(actors);
            ui.notifications.info("Number of vehicle with a new image: " + currentAffectedCount.toString() + " / "+ actors.length + " vehicles");
        }
    }

    if (game.settings.get('starwars-silhouette', 'folderReset')) {
        game.settings.set('starwars-silhouette', 'vehicleImagesCount', 0);
        game.settings.set('starwars-silhouette', 'vehicleImagesSilhouetteCount', 0);
        game.settings.set('starwars-silhouette', 'creationShipAttachmentItems', 0);
        game.settings.set('starwars-silhouette', 'affectShipAttachmentItems', 0);
        game.settings.set('starwars-silhouette', 'folderCreated', false);
        game.settings.set('starwars-silhouette', 'folderId', '');
        game.settings.set('starwars-silhouette', 'folderReset', false);
        game.settings.set('starwars-silhouette', 'vehicleImageFolder', 'modules/starwars-silhouette/storage/image/VehicleImages');
        game.settings.set('starwars-silhouette', 'vehicleSilhouetteImageFolder', 'modules/starwars-silhouette/storage/image/VehicleSilhouettes');

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
        "img": imageUrl,
        "prototypeToken.texture.src": imageUrl
    });
    return actor.id;
}

async function createItems(data, actor) {
    const created = await Item.create(data, {
        parent: actor
    });
    console.log(created);
    return created.id;
}

async function updateItemsImage(imageUrl, item) {
    await item.update({
        "img": imageUrl
    });
}

async function deleteItem (item) {
    let itemId = item.id;
    await item?.delete();
    return itemId;
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

    let defaultSilhouette = `modules/starwars-silhouette/storage/image/shipdefence.webp`;
    //let defaultSilhouette = `modules/star-wars-all-compendia/assets/images/packs/shipdefence.webp`;
    //actors.forEach(actor => {
    let defaultImageToVehicleCount = 0;
    let actorCount = actors.length;
    
    await this.asyncForEach(actors, async(actor) => {
        let imageName = extractFileName(actor.img);
        SceneNavigation.displayProgressBar({label: "Default Images to vehicles ",pct: Math.floor((defaultImageToVehicleCount/actorCount)*100)});
        defaultImageToVehicleCount+=1;
        if (imageName === 'mystery-man' || imageName === 'shipdefence') {
            let defaultImage = await updateImage(defaultSilhouette, actor);
            console.log("Default image:" + defaultSilhouette + " in " + defaultImage);
        }
    });
    
    SceneNavigation.displayProgressBar({label: "Default Images to vehicles",pct: 100});

    let folderPath = game.settings.get('starwars-silhouette', 'vehicleImageFolder');
    if (game.settings.get('starwars-silhouette', 'useSilhouetteAsVehicleImage')) {
        folderPath = game.settings.get('starwars-silhouette', 'vehicleSilhouetteImageFolder');
    }

    let {
        files
    } = await FilePicker.browse("data", folderPath);

    let currentAffectedCount = 0;
    let currentTreatedFileCount = 0;
    let maxAffectable = files.length;
    //files.forEach(async file => {
    await this.asyncForEach(files, async(file) => {
        // Extract the name without path and extension
        let fileName = extractFileName(file);
        let actor = actors.filter(i => i.flags.starwarsffg?.ffgimportid == fileName);
        let imageName = actor[0] ? extractFileName(actor[0].img) : 'shipdefence';
        SceneNavigation.displayProgressBar({label: "Affected Images to vehicles",pct: Math.floor((currentTreatedFileCount/maxAffectable)*100)});
        currentTreatedFileCount+=1;
        if (imageName === 'mystery-man' || imageName === 'shipdefence' || game.settings.get('starwars-silhouette', 'forceParsingVehicleImage')) {
            if (actor) {
                let imageUrl = actor[0] ? folderPath + `/${actor[0].flags.starwarsffg.ffgimportid}.png` : defaultSilhouette;
                if (actor[0]) {
                    let actorId = await updateImage(imageUrl, actor[0]);
                    currentAffectedCount += 1;
                    console.log("affected image:" + imageUrl + "in " + actorId);
                }
            }
        }
    });
    SceneNavigation.displayProgressBar({label: "Affected Images to vehicles",pct: 100});
    return currentAffectedCount;
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
            createItems(data, actor);
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
    async activateListeners(html) {
        super.activateListeners(html);

        $(`<span class="debug"><label><input type="checkbox" /> Generate Log</label></span>`).insertBefore("#data-importer header a");

        html.find(".dialog-button").on("click", this._dialogButton.bind(this));

        let folderPath = game.settings.get('starwars-silhouette', 'vehicleImageFolder');
        let vehicleImagesCount = game.settings.get('starwars-silhouette', 'vehicleImagesCount');

        let dataImage = await FilePicker.browse("data", folderPath, {
            bucket: null,
            extensions: [".png", ".PNG"],
            wildcard: false
        });
        let vehicleImagesUploadedCount = dataImage.files.length;

        folderPath = game.settings.get('starwars-silhouette', 'vehicleSilhouetteImageFolder');

        let dataSilhouetteImage = await FilePicker.browse("data", folderPath, {
            bucket: null,
            extensions: [".png", ".PNG"],
            wildcard: false
        });
        let vehicleImagesSilhouetteUploadedCount = dataSilhouetteImage.files.length;

        //Force enabled checkbox
        if (vehicleImagesSilhouetteUploadedCount && vehicleImagesUploadedCount) {
            $("input[type='checkbox'][name='creation'][id='creationShipAttachmentItems']").attr("disabled", false);
            $("input[type='checkbox'][name='creation'][id='affectShipAttachmentItems']").attr("disabled", false);
            $(".import-progress.vehicleImage").toggleClass("import-hidden");
            $(".import-progress.VehicleSilhouettes").toggleClass("import-hidden");
            $("div[id='first-step'][name='firststep']").attr("style", "display: flex;justify-content: flex-end; visibility: visible;");
            $(".vehicleImage .import-progress-bar")
            .width(`100%`)
            .html(`<span>${vehicleImagesUploadedCount} images found</span>`);

            $(".VehicleSilhouettes .import-progress-bar")
            .width(`100%`)
            .html(`<span>${vehicleImagesSilhouetteUploadedCount} images found</span>`);
        }
        let creationShipAttachmentItemsCount = game.settings.get('starwars-silhouette', 'creationShipAttachmentItems');
        if (creationShipAttachmentItemsCount) {
            $("input[type='checkbox'][name='creation'][id='creationShipAttachmentItems']").attr("disabled", true);
            $(".import-progress.ShipAttachmentItems").toggleClass("import-hidden");
            $("div[id='second-step'][name='secondstep']").attr("style", "display: flex;justify-content: flex-end; visibility: visible;");
            $(".ShipAttachmentItems .import-progress-bar")
            .width(`100%`)
            .html(`<span>${creationShipAttachmentItemsCount} items found</span>`);
        }
        let affectShipAttachmentItemsCount = game.settings.get('starwars-silhouette', 'affectShipAttachmentItems');
        if (affectShipAttachmentItemsCount) {
            $("input[type='checkbox'][name='creation'][id='affectShipAttachmentItems']").attr("disabled", true);
            $(".import-progress.AffectShipAttachmentItems").toggleClass("import-hidden");
            $("div[id='second-step'][name='secondstep']").attr("style", "display: flex;justify-content: flex-end; visibility: visible;");
            $(".AffectShipAttachmentItems .import-progress-bar")
            .width(`100%`)
            .html(`<span>${affectShipAttachmentItemsCount} items affected</span>`);
        }
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
        $("input[type='checkbox'][name='creation']").attr("disabled", true);

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
        if (action === "migrate") {

            /*DELETE VEHICLE SILHOUETTE FOLDER*/
            //await this.asyncForEach(game.items, async(item) => {
            let items = game.items.filter(i => i.type === 'shipattachment');
            let itemCount = items.length;
            let processedItem = 0;
            let deletedItemCount = 0;
            //game.items.forEach(item => {
            
            await this.asyncForEach(items, async(item) => {
                SceneNavigation.displayProgressBar({label: "Delete silhouette items ",pct: Math.floor((processedItem/itemCount)*100)});
                if (item.type === "shipattachment" && item.name && item.name.startsWith("VT:")){
                    deletedItemCount += 1;
                    let deletedItem = await deleteItem(item);//item?.delete();
                }
                processedItem += 1;
            });
            
            SceneNavigation.displayProgressBar({label: "Delete silhouette items ",pct: 100});
            ui.notifications.info("Silhouette item deleted count: " + deletedItemCount.toString() + " items");
            let folder = game.folders.get(game.settings.get('starwars-silhouette', 'folderId'));
            let folderName;
            if (folder !== null || folder !== undefined){
                folderName = folder?.name;
                folder?.delete();
                ui.notifications.info("Folder "+folderName+" deleted successfully");
            }

            /*RESET THE ENTIRE MODULE*/
            game.settings.set('starwars-silhouette', 'vehicleImagesCount', 0);
            game.settings.set('starwars-silhouette', 'vehicleImagesSilhouetteCount', 0);
            game.settings.set('starwars-silhouette', 'creationShipAttachmentItems', 0);
            game.settings.set('starwars-silhouette', 'affectShipAttachmentItems', 0);
            game.settings.set('starwars-silhouette', 'folderCreated', false);
            game.settings.set('starwars-silhouette', 'folderId', '');
            game.settings.set('starwars-silhouette', 'folderReset', false);
            game.settings.set('starwars-silhouette', 'vehicleImageFolder', 'modules/starwars-silhouette/storage/image/VehicleImages');
            game.settings.set('starwars-silhouette', 'vehicleSilhouetteImageFolder', 'modules/starwars-silhouette/storage/image/VehicleSilhouettes');

            /*let items = game.items.filter(i => i.type === 'species');
            CONFIG.logger.debug(`Starting affect images on new module assets images pack`);
            $(".import-progress.AffectShipAttachmentItems").toggleClass("import-hidden");
            let moduleDefaultAssetsFolder = 'modules/star-wars-all-compendia/assets/images/packs';
            let totalCount = items.length;
            let currentCount = 0;

            await this.asyncForEach(items, async(item) => {
            let ffgimportid = item.flags.starwarsffg?.ffgimportid;
            let itemImg = item.img;
            let imageName = extractFileName(itemImg);

            if (imageName === 'Gear' + ffgimportid){
            //updateItemsImage(moduleDefaultAssetsFolder + "/icons/svg/"+ imageName + '.svg', item);
            updateItemsImage(moduleDefaultAssetsFolder + "/species/"+ imageName + '.webp', item);
            }

            currentCount += 1;

            $(".AffectShipAttachmentItems .import-progress-bar")
            .width(`${Math.trunc((currentCount / totalCount) * 100)}%`)
            .html(`<span>${Math.trunc((currentCount / totalCount) * 100)}%</span>`);


            console.log(ffgimportid);
            });*/

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

            //await this.asyncForEach(importFiles, async(file) => {
            importFiles.forEach(async file => {
                if (file.file.includes('/VehicleImages')) {
                    const files = Object.values(zip.files).filter((file) => {
                        return !file.dir && file.name.split(".").pop() === "png" && file.name.includes("/VehicleImages/");
                    });
                    //let serverPath = `modules/starwars-silhouette/image/VehicleImages`;
                    let serverPath = game.settings.get('starwars-silhouette', 'vehicleImageFolder', );
                    let totalCount = files.length;
                    let currentCount = 0;
                    if (files.length) {
                        CONFIG.logger.debug(`Starting Oggdude Vehicle Images Import`);
                        $(".import-progress.vehicleImage").toggleClass("import-hidden");
                        await this.asyncForEach(files, async(file) => {
                            //files.forEach(async file => {
                            try {
                                let myNewFile = await importImage(file.name, zip, serverPath);
                                currentCount += 1;

                                $(".vehicleImage .import-progress-bar")
                                .width(`${Math.trunc((currentCount / totalCount) * 100)}%`)
                                .html(`<span>${Math.trunc((currentCount / totalCount) * 100)}%</span>`);

                            } catch (err) {
                                CONFIG.logger.error(`Error importing record : `, err);
                            }
                        });
                        ui.notifications.info("Vehicle Image imported successfully: " + currentCount.toString() + " images");
                        game.settings.set('starwars-silhouette', 'vehicleImagesCount', currentCount);
                        //game.settings.set('starwars-silhouette', 'vehicleImageFolder', serverPath);
                    }
                }
                if (file.file.includes('/VehicleSilhouettes')) {
                    const files = Object.values(zip.files).filter((file) => {
                        return !file.dir && file.name.split(".").pop() === "png" && file.name.includes("/VehicleSilhouettes/");
                    });
                    //let serverPath = `modules/starwars-silhouette/image/VehicleSilhouettes`;
                    let serverPath = game.settings.get('starwars-silhouette', 'vehicleSilhouetteImageFolder');
                    let totalCount = files.length;
                    let currentCount = 0;

                    if (files.length) {
                        CONFIG.logger.debug(`Starting Oggdude Vehicle Silhouettes Images Import`);
                        $(".import-progress.VehicleSilhouettes").toggleClass("import-hidden");
                        await this.asyncForEach(files, async(file) => {
                            //files.forEach(async file => {
                            try {
                                let myNewFile = await importImage(file.name, zip, serverPath);
                                currentCount += 1;

                                $(".VehicleSilhouettes .import-progress-bar")
                                .width(`${Math.trunc((currentCount / totalCount) * 100)}%`)
                                .html(`<span>${Math.trunc((currentCount / totalCount) * 100)}%</span>`);

                            } catch (err) {
                                CONFIG.logger.error(`Error importing record : `, err);
                            }
                        });
                        ui.notifications.info("Vehicle Silhouette Image imported successfully: " + currentCount.toString() + " images");
                        game.settings.set('starwars-silhouette', 'vehicleImagesSilhouetteCount', currentCount);
                        //game.settings.set('starwars-silhouette', 'vehicleSilhouetteImageFolder', serverPath);

                    }
                }
                $("div[id='first-step'][name='firststep']").attr("style", "display: flex;justify-content: flex-end; visibility: visible;");

            });

            CONFIG.temporary = {};
        }
        if (action === "creation") {
            const itemCreation = $("input:checkbox[name=creation]:checked")
                .map(function () {
                    return {
                        file: $(this).val(),
                        label: $(this).data("name"),
                        type: $(this).data("type"),
                        itemtype: $(this).data("itemtype")
                    };
                })
                .get();
            await this.asyncForEach(itemCreation, async(file) => {
                if (file.file.includes('/ShipAttachmentItems')) {

                    let actors = game.actors.filter(i => i.type === 'vehicle');
                    CONFIG.logger.debug(`Starting Ship Attachment Silhouette creation`);
                    $(".import-progress.ShipAttachmentItems").toggleClass("import-hidden");
                    let folderId = '';
                    if (game.settings.get('starwars-silhouette', 'folderCreated') === false) {
                        folderId = await createFolder("Vehicle silhouette", "Item");
                        game.settings.set('starwars-silhouette', 'folderCreated', true);
                        game.settings.set('starwars-silhouette', 'folderId', folderId);

                        let folderPath = game.settings.get('starwars-silhouette', 'vehicleSilhouetteImageFolder');
                        let {
                            files
                        } = await FilePicker.browse("data", folderPath);

                        let totalCount = files.length;
                        let currentCount = 0;
                        await this.asyncForEach(files, async(file) => {

                            // Extract the name without path and extension
                            let fileName = extractFileName(file);
                            const itemId = await createItemInFolder(fileName, file, folderId);
                            currentCount += 1;

                            $(".ShipAttachmentItems .import-progress-bar")
                            .width(`${Math.trunc((currentCount / totalCount) * 100)}%`)
                            .html(`<span>${Math.trunc((currentCount / totalCount) * 100)}%</span>`);
                            console.log(itemId);
                        });
                        if (currentCount === 0) {
                            ui.notifications.warn("No file were found in the Silhouette Folder !");
                        } else {
                            ui.notifications.info("Ship attachments items created successfully: " + currentCount.toString() + " items");
                            game.settings.set('starwars-silhouette', 'creationShipAttachmentItems', currentCount);
                        }
                    } else {
                        ui.notifications.warn("Folder Silhouette already created, delete it and reset the module !");
                    }
                }
                if (file.file.includes('/AffectShipAttachmentItems')) {
                    let actors = game.actors.filter(i => i.type === 'vehicle');
                    CONFIG.logger.debug(`Starting ship attachment items to all vehicle`);
                    $(".import-progress.AffectShipAttachmentItems").toggleClass("import-hidden");
                    let totalCount = actors.length;
                    let currentCount = 0;
                    //actors.forEach(actor => {
                    await this.asyncForEach(actors, async(actor) => {
                        let ffgimportid = actor.flags.starwarsffg?.ffgimportid;
                        if (ffgimportid) {
                            let item = game.items.filter(i => i.name == "VT:" + ffgimportid);
                            let existItemActor = actor.items.filter(i => i.name == "VT:" + ffgimportid);
                            if (existItemActor.length >= 1) {
                                existItemActor.forEach(existItem => {
                                    actor.items.delete(existItem.id, existItem);
                                });
                                existItemActor = [];
                                
                            }
                            if (existItemActor.length === 0) {
                                const data = item;
                                const itemCreateAffectationId = await createItems(data, actor);
                                currentCount += 1;
                            }

                            $(".AffectShipAttachmentItems .import-progress-bar")
                            .width(`${Math.trunc((currentCount / totalCount) * 100)}%`)
                            .html(`<span>${Math.trunc((currentCount / totalCount) * 100)}%</span>`);
                        }

                        console.log(ffgimportid);
                    });
                    if (currentCount === 0) {
                        ui.notifications.warn("No actor were affected or there is no actor !");
                    } else {
                        ui.notifications.info("Ship attachments items affected to vehicle successfully: " + currentCount.toString() + " items");
                        game.settings.set('starwars-silhouette', 'affectShipAttachmentItems', currentCount);
                    }

                }

            });
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
