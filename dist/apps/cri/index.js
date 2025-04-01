import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Route, Routes, useNavigate } from "react-router";
import { CriLookup } from "./lookup.js";
import { useState } from "react";
import { useKeyboard } from "minitel-react";
export const Cri = {
    name: 'Cri',
    base: 'cri',
    routes: (_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(CriApp, {}) }), _jsx(Route, { path: "/lookup/:lookup", element: _jsx(CriLookup, {}) })] })),
};
function CriApp() {
    const [lookingUp, setLookingUp] = useState("");
    const navigate = useNavigate();
    useKeyboard((key) => {
        console.log('key');
        if (key === "\x13\x41") {
            navigate(`/cri/lookup/${lookingUp}`, { replace: true });
        }
    }, [lookingUp]);
    return (_jsx("mt-yjoin", { widthAlign: "middle", heightAlign: "middle", children: _jsxs("mt-yjoin", { widthAlign: "stretch", textAlign: "middle", children: [_jsx("mt-para", { bg: 3, fg: 0, pad: 2, children: _jsx("mt-span", { doubleHeight: true, doubleWidth: true, children: "CRI lookup" }) }), _jsxs("mt-yjoin", { widthAlign: "stretch", invert: true, gap: 1, pad: 2, children: [_jsx("mt-para", { children: "Login of the person to look up" }), _jsx("mt-input", { autofocus: true, onChange: setLookingUp }), _jsxs("mt-para", { children: [_jsx("mt-span", { invert: true, children: "ENVOI" }), " to look up"] })] })] }) }));
}
