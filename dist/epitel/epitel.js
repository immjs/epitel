import { jsx as _jsx } from "react/jsx-runtime";
import { useContext } from "react";
import { mainContext } from "../index.js";
import { EpitelLogIn } from "./login.js";
import { EpitelMain } from "./main.js";
export function Epitel() {
    const mainCtx = useContext(mainContext);
    if (mainCtx.auth[0] == null) {
        return _jsx(EpitelLogIn, {});
    }
    else {
        return _jsx(EpitelMain, {});
    }
}
