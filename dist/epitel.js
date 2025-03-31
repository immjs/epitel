import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useContext } from "react";
import { mainContext } from "./index.js";
export function Epitel() {
    const mainCtx = useContext(mainContext);
    return (_jsx("yjoin", { children: _jsx("xjoin", { widthAlign: "middle", heightAlign: "middle", flexGrow: true, children: _jsxs("yjoin", { gap: 1, width: 32, widthAlign: "stretch", children: [_jsx("xjoin", { widthAlign: "middle", children: _jsxs("para", { children: ["Welcome to ", mainCtx.machineIsFrom] }) }), _jsxs("xjoin", { gap: 1, children: [_jsxs("yjoin", { gap: 1, children: [_jsx("para", { children: "Username" }), _jsx("para", { children: "Password" })] }), _jsxs("yjoin", { flexGrow: true, widthAlign: "stretch", gap: 1, children: [_jsx("input", { type: "text", invert: true, onChange: (evt) => console.log(evt), autofocus: true }), _jsx("input", { type: "password", invert: true, onChange: (evt) => console.log(evt) })] })] })] }) }) }));
}
