import { jsx as _jsx } from "react/jsx-runtime";
import { MemoryRouter } from "react-router";
import { Epitel } from "./epitel/epitel.js";
import { useState } from "react";
import { mainContext } from "./index.js";
export function App({ remoteAddress }) {
    return (_jsx(mainContext.Provider, { value: {
            machineIsFrom: remoteAddress,
            userData: useState(null),
            auth: useState(null),
        }, children: _jsx(MemoryRouter, { children: _jsx(Epitel, {}) }) }));
}
