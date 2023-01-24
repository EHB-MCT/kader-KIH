const { io } = require("socket.io-client");

let domainURL = "https://localhost:5501";
const socket = io(domainURL);


socket.on("connect", () => {
    const engine = socket.io.engine;
    console.log(engine.transport.name); // in most cases, prints "polling"

    // engine.once("upgrade", () => {
    //   // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
    //   console.log(engine.transport.name); // in most cases, prints "websocket"
    // });

    engine.on("instruction", ({ type, data }) => {
        // called for each packet received
        console.log(data);

    });
})