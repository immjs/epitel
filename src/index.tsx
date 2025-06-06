import { WebSocketServer } from "ws";
import { Minitel, render } from "minitel-react";
import { stat } from "node:fs";
import { SerialPort } from "serialport";

import "dotenv/config";

import { join } from "node:path/posix";
import duplexer3 from "duplexer3";
import { createContext, Dispatch, SetStateAction, useState } from "react";

import { App } from "./app.js";
import { Duplex } from "node:stream";
import { createReadStream, createWriteStream } from "node:fs";
import { DuplexBridge } from "ws-duplex-bridge";

export type State<T, U = never> = [T, Dispatch<SetStateAction<T | U>>]

interface BaseMainContext {
  machineIsFrom: string;
}

export interface UserData {

}

export type AuthDetails = {
  fetch: typeof fetch;
  sessId: string;
};

interface MainContextAuthed extends BaseMainContext {
  auth: State<AuthDetails, null>;
  userData: State<UserData, null>;
}

interface MainContextUnauthed extends BaseMainContext {
  auth: State<null, AuthDetails>;
  userData: State<null, UserData>;
}

type MainContextType = MainContextAuthed | MainContextUnauthed;

export const mainContext = createContext({} as MainContextType);

async function init(stream: Duplex, name: string) {
  const minitel = new Minitel(
    stream,
    {
      statusBar: true,
      defaultCase: 'lower',
    },
  );

  // await minitel.readyAsync();

  render((
    <App remoteAddress={name} />
  ), minitel);
}

// server.listen(process.env.PORT, () => console.log(`Up and running on ${process.env.PORT}`));
for (let terminal of process.env.PATHS!.split(',')) {
  if (await new Promise((r) => stat(terminal, (e) => r(e))) == null) {
    const serial = new SerialPort({ path: terminal, baudRate: +process.env.BAUDRATE!, parity: 'even', dataBits: 7 });
    const duplex = serial;
    duplex.write("hello");
    duplex.on('data', (v) => console.log(v));
    init(duplex, terminal);
    console.log(terminal, 'is up!');
  } else {
    console.log('Skipping', terminal);
  }
}

if (process.env.NODE_ENV !== 'local') {
  const wss = new WebSocketServer({ port: +process.env.PORT! });
  wss.on('connection', (ws, req) => {
    const connection = new DuplexBridge(ws, { decodeStrings: false });

    const remoteAddress = req.socket.remoteAddress;

    // Keepalive
    setInterval(() => connection.write('\x00'), 10_000);

    init(connection, remoteAddress!);
  });
  console.log('Is in dev; port', +process.env.PORT!, 'is up!');
}

console.log('All up!');
