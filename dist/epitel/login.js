import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useContext, useState } from "react";
import { useKeyboard } from "minitel-react";
import gssapi from "gssapi.js";
import { getuid } from "process";
import { createId } from "@paralleldrive/cuid2";
import { mainContext } from "../index.js";
import { makeDirectory } from "make-dir";
import makeFetchCookie from "fetch-cookie";
async function attemptKerberos(username, password) {
    try {
        const fetchCookie = makeFetchCookie(fetch);
        const sessId = createId();
        const dir = `${process.env.XDG_RUNTIME_DIR ?? `/tmp/user-${getuid()}`}/epitel/${sessId}/`;
        await makeDirectory(dir);
        const cache = `${dir}/info.krb5`;
        await gssapi.kinit(cache, `${username}@CRI.EPITA.FR`, password);
        const ctx = gssapi.createClientContext({
            server: 'HTTP@CRI.EPITA.FR',
            krbCcache: cache,
        });
        const res = await fetchCookie('https://cri.epita.fr/auth/login', {
            headers: {
                Authorization: 'Negotiate ' + (await gssapi.initSecContext(ctx)).toString('base64'),
            },
        });
        if (res.headers.has('WWW-Authenticate')) {
            await gssapi.initSecContext(ctx, Buffer.from(res.headers.get('WWW-Authenticate').split(' ')[1], 'base64'));
        }
        return {
            sessId,
            fetch: fetchCookie,
        };
    }
    catch (err) {
        console.log(err);
        return null;
    }
}
export function EpitelLogIn() {
    const mainCtx = useContext(mainContext);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loginFailed, setLoginFailed] = useState(false);
    useKeyboard(async (txt) => {
        if (txt === '\x13\x41') {
            const success = await attemptKerberos(username, password);
            if (!success) {
                setLoginFailed(true);
            }
            else {
                mainCtx.auth[1](success);
            }
        }
    }, [username, password]);
    return (_jsx("mt-yjoin", { children: _jsx("mt-xjoin", { widthAlign: "middle", heightAlign: "middle", flexGrow: true, children: _jsxs("mt-yjoin", { gap: 1, width: 32, widthAlign: "stretch", textAlign: "middle", children: [_jsx("mt-xjoin", { widthAlign: "middle", children: _jsxs("mt-para", { children: ["Welcome to ", mainCtx.machineIsFrom] }) }), _jsxs("mt-xjoin", { gap: 1, children: [_jsxs("mt-yjoin", { gap: 1, children: [_jsx("mt-para", { children: "Username" }), _jsx("mt-para", { children: "Password" })] }), _jsxs("mt-yjoin", { flexGrow: true, widthAlign: "stretch", gap: 1, children: [_jsx("mt-input", { type: "text", invert: true, onChange: setUsername, autofocus: true }), _jsx("mt-input", { type: "password", invert: true, onChange: setPassword })] })] }), _jsx("mt-para", { children: _jsx("mt-span", { fg: 2, children: loginFailed ? 'Login failed' : ' ' }) }), _jsxs("mt-para", { children: [_jsx("mt-span", { invert: true, children: "ENVOI" }), " to log in"] })] }) }) }));
}
