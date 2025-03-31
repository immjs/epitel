import { jsx as _jsx } from "react/jsx-runtime";
import { WebSocketServer } from "ws";
import { Minitel, render } from "minitel-react";
import { stat } from "node:fs";
import "dotenv/config";
import duplexer3 from "duplexer3";
import { createContext } from "react";
import { App } from "./app.js";
import { createReadStream, createWriteStream } from "node:fs";
import { DuplexBridge } from "ws-duplex-bridge";
export const mainContext = createContext({});
function init(stream, name) {
    const minitel = new Minitel(stream, {
        statusBar: true,
        defaultCase: 'lower',
    });
    render((_jsx(App, { remoteAddress: name })), minitel);
}
// server.listen(process.env.PORT, () => console.log(`Up and running on ${process.env.PORT}`));
for (let terminal of [
    "/dev/pts/1",
    "/dev/pts/2",
    "/dev/pts/3",
    "/dev/pts/4",
    "/dev/pts/5",
    "/dev/pts/6",
]) {
    if (await new Promise((r) => stat(terminal, (e) => r(e))) == null) {
        const WS = createWriteStream(terminal);
        const RS = createReadStream(terminal);
        const duplex = duplexer3(WS, RS);
        duplex.write("hello");
        duplex.on('data', (v) => console.log(v));
        init(duplex, terminal);
        console.log(terminal, 'is up!');
    }
    else {
        console.log('Skipping', terminal);
    }
}
if (process.env.NODE_ENV === 'development') {
    const wss = new WebSocketServer({ port: +process.env.PORT });
    wss.on('connection', (ws, req) => {
        const connection = new DuplexBridge(ws, { decodeStrings: false });
        const remoteAddress = req.socket.remoteAddress;
        init(connection, remoteAddress);
    });
    console.log('Is in dev; port', +process.env.PORT, 'is up!');
}
console.log('All up!');
