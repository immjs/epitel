import { MemoryRouter, Route, Routes } from "react-router";
import { Epitel } from "./epitel/epitel.js";
import { useState } from "react";
import { AuthDetails, State, UserData, mainContext } from "./index.js";

export function App({ remoteAddress }: { remoteAddress: string }) {
  return (
    <mainContext.Provider value={{
      machineIsFrom: remoteAddress,
      userData: useState<UserData | null>(null) as State<null, UserData>,
      auth: useState<AuthDetails | null>(null) as State<null, AuthDetails>,
    }}>
      <MemoryRouter>
        <Epitel />
      </MemoryRouter>
    </mainContext.Provider>
  );
}
