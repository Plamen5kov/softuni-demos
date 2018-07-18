const imageSourceModule = require("tns-core-modules/image-source");
const fileSystemModule = require("tns-core-modules/file-system");
const httpModule = require("http");
const view = require("tns-core-modules/ui/core/view");
const timerModule = require("tns-core-modules/timer");
const connectivityModule = require("tns-core-modules/connectivity");
const dialogs = require("ui/dialogs");
const platformModule = require("tns-core-modules/platform");
const Observable = require("tns-core-modules/data/observable").Observable;
const appSettingsModule = require("application-settings");

let imageSourceContent;
function http() {    
    httpModule.getImage("https://i.pinimg.com/originals/6f/31/2c/6f312c7dadfd7d523ffbd57321c5bf6b.jpg")
    .then((r) => {
        fsAccess(r);
        dialogs.alert("querry success!")
    }, (e) => {
        console.log(e);
    });
}
function appSettingsGet() {
    const username = appSettingsModule.getString("username");
    dialogs.alert(username);
}

function appSettingsSet() {
    const username = appSettingsModule.getString("username");
    if(!username) {
        appSettingsModule.setString("username", "plamen5kov");
    } else {
        appSettingsModule.clear();
    }
}

function fsAccess(args) {

    const folderDest = fileSystemModule.knownFolders.documents();
    const pathDest = fileSystemModule.path.join(folderDest.path, "test.png");
    let saved = false;

    if(args.eventName) {
        const imageFromLocalFile = imageSourceModule.fromFile(pathDest);
        if(!imageFromLocalFile) {
            dialogs.alert("I don't have anything to work with. Usce HTTP button to download a picture and try again!")
        } else {
            dialogs.alert("There's already a saved file on the file system. Try clicking Image Source to see what happens")
        }
    }

    if(args.saveToFile) {
        saved = args.saveToFile(pathDest, "png");   
    } 
    if (saved) {
        dialogs.alert("image successfully saved to file system")
    }
}
function platform(args) {
    let message = "";
    if (platformModule.isAndroid) {
        message = "You are using Android device";
    } else if (platformModule.isIOS) {
        message = "You are using IOS device";
    }
    const page = args.object.page;
    const vm = page.bindingContext;
    
    console.log(vm);
    dialogs.alert(message);
}
function traceConsole() {
    console.log("NativeScript Playground!");
    console.log({ objProp: "I am Object!" });
    console.info("NativeScript Rocks!");
    console.warn("Low memory");
    console.error("Uncaught Application Exception");
    dialogs.alert("Look at the log cat");
}
function connectivityCheck() {
    // !!!! NEED PERMISSION: android.permission.ACCESS_NETWORK_STATE to use this !!!
    // result is ConnectionType enumeration (none, wifi or mobile)
    const connectionType = connectivityModule.getConnectionType();
    switch (connectionType) {
        case connectivityModule.connectionType.none:
            dialogs.alert("no connection!");
            break;
        case connectivityModule.connectionType.wifi:
            dialogs.alert("WiFi connection");
            break;
        case connectivityModule.connectionType.mobile:
            dialogs.alert("Mobile connection");
            break;
        default:
            break;
    }
}

let timerClearTogle = true;
function timers(args) {
    if(timerClearTogle) {
        // id = timerModule.setInterval(
        //     () => {
        //     imageSource(args);
        //     },
        //     1000);
        timerModule.setTimeout(() => {
            imageSource(args);
        }, 2000)
    } else {
        clearInterval(id);
    }
    timerClearTogle = !timerClearTogle;
}

let imageShowTogle = true;
function imageSource(args) {
    const folderDest = fileSystemModule.knownFolders.documents();
    const pathDest = fileSystemModule.path.join(folderDest.path, "test.png");
    const image = view.getViewById(args.object.parent, "image_placeholder");

    const imageSourceFile = imageSourceModule.fromFile(pathDest);
    image.imageSource = imageSourceFile;
    if(imageShowTogle) {
        image.height = 300;
        image.stretch = "aspectFill";
    } else {
        image.height = 0;
        image.stretch = "none";
    }
    imageShowTogle = !imageShowTogle;
}

function makeGetRequest() {
    httpModule.request({
        url: "https://httpbin.org/get",
        method: "GET"
    }).then((response) => {
        console.log(response);
    }, (e) => {
        console.log(e);
    });
}

function makePostRequest() {
    httpModule.request({
        url: "https://httpbin.org/post",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        content: JSON.stringify({
            username: "plamen",
            password: "asdasd"
        })
    }).then((response) => {
        const result = response.content.toJSON();
        console.log(result)
    }, (e) => {
        console.log(e);
    });
}

exports.http = http;
exports.appSettingsGet = appSettingsGet;
exports.appSettingsSet = appSettingsSet;
exports.fsAccess = fsAccess;
exports.platform = platform;
exports.traceConsole = traceConsole;
exports.connectivityCheck = connectivityCheck;
exports.timers = timers;
exports.imageSource = imageSource;
exports.makeGetRequest = makeGetRequest;
exports.makePostRequest = makePostRequest;

exports.onNavigatingTo = onNavigatingTo;
function onNavigatingTo(args) {
    const page = args.object;
    const vm = new Observable();
    vm.set("deviceInformationmodel", platformModule.device.model);
    vm.set("deviceInformationdeviceType", platformModule.device.deviceType);
    vm.set("deviceInformationos", platformModule.device.os);
    vm.set("deviceInformationosVersion", platformModule.device.osVersion);
    vm.set("deviceInformationsdkVersion", platformModule.device.sdkVersion);
    vm.set("deviceInformationlanguage", platformModule.device.language);
    vm.set("deviceInformationmanufacturer", platformModule.device.manufacturer);
    vm.set("deviceInformationuuid", platformModule.device.uuid);
    vm.set("screenInformationheightDIPs", platformModule.screen.mainScreen.heightDIPs);
    vm.set("screenInformationheightPixels", platformModule.screen.mainScreen.heightPixels);
    vm.set("screenInformationscale", platformModule.screen.mainScreen.scale);
    vm.set("screenInformationwidthDIPs", platformModule.screen.mainScreen.widthDIPs);
    vm.set("screenInformationwidthPixels", platformModule.screen.mainScreen.widthPixels);

    vm.set("deviceInfoButton", "Show device info");
    vm.set("screenInfoButton", "Show screen info");
    vm.set("isItemVisible", false);
    vm.set("isItemVisibleScreenInfo", false);
    page.bindingContext = vm;
}
