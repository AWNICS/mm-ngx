declare var System: SystemJSLoader.System;

System.config(JSON.parse('<%= SYSTEM_CONFIG_DEV %>'));

/*System.config({
    packages: {
        "socket.io-client": {"defaultExtension": "js"}
    },
    map: {
        "socket.io-client": "node_modules/socket.io-client/socket.io.js"
    }
});*/
