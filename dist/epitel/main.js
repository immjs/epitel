import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes, useNavigate } from "react-router";
import { apps } from "./apps.js";
import { useState } from "react";
import { useKeyboard } from "minitel-react";
export function EpitelMain() {
    return (_jsxs("mt-yjoin", { children: [_jsx("mt-cont", { flexGrow: true, children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(AppMenu, {}) }), apps.map((v) => (_jsx(Route, { path: `/${v.base}/*`, element: v.routes }, v.base)))] }) }), _jsx("mt-xjoin", {})] }));
}
const MAX_APPS = 5;
function AppMenu() {
    const chunked = Array.from({ length: Math.ceil(apps.length / MAX_APPS) }, (v, i) => apps.slice(MAX_APPS * i, MAX_APPS * (i + 1)));
    const [currApp, setCurrApp] = useState("");
    const [errorMsg, setErrorMsg] = useState(null);
    const navigate = useNavigate();
    useKeyboard((key) => {
        if (key === "\x13\x41") {
            if (errorMsg) {
                setErrorMsg(null);
            }
            else {
                if (!(+currApp in apps))
                    setErrorMsg("No such app number");
                else
                    navigate(`/${apps[+currApp].base}`);
            }
        }
    }, [errorMsg, currApp]);
    return (_jsxs("mt-zjoin", { children: [_jsxs("mt-yjoin", { widthAlign: "middle", heightAlign: "middle", pad: [1, 0], gap: 1, children: [_jsx("mt-xjoin", { widthAlign: "middle", children: _jsx("mt-para", { doubleHeight: true, children: "Welcome to Epitel" }) }), _jsx("mt-xjoin", { widthAlign: "middle", children: chunked.map((v, i) => (_jsx("mt-yjoin", { width: 8, children: v.map((v_, i_) => `${String(i * MAX_APPS + i_).padStart(2, '0')} ${v_.name}`).join('\n') }, i))) }), _jsxs("mt-xjoin", { children: ["Run: ", _jsx("mt-input", { onChange: setCurrApp, width: 3, autofocus: true })] }), _jsxs("mt-para", { children: [_jsx("mt-span", { invert: true, children: "ENVOI" }), " to run"] })] }), errorMsg && (_jsx("mt-yjoin", { widthAlign: "middle", heightAlign: "middle", children: _jsxs("mt-yjoin", { bg: 5, pad: 1, children: [_jsx("mt-para", { children: errorMsg }), _jsxs("mt-para", { children: [_jsx("mt-span", { invert: true, children: "ENVOI" }), " to continue"] })] }) }))] }));
}
