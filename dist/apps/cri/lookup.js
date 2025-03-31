import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { DefaultImg, SharpImg } from "minitel-mosaic";
import { mainContext } from "../../index.js";
import { getPage } from "../../utils/scraper.js";
export function CriLookup() {
    const { auth: [{ fetch: fetchCookie }] } = useContext(mainContext);
    const [results, setResults] = useState(null);
    const [imageData, setImageData] = useState(null);
    const urlParams = useParams();
    console.log("Getting rendered...");
    useEffect(() => setResults(null), [urlParams.lookup]);
    useEffect(() => {
        if (results === null) {
            (async () => {
                await Promise.all([
                    (async () => {
                        const parsed = await getPage(`https://cri.epita.fr/users/${urlParams.lookup}`, fetchCookie);
                        const findInParsed = (label) => parsed.querySelectorAll("th,td").find((v, i, a) => i != 0 && a[i - 1].text === label).text;
                        const newResults = {
                            firstName: findInParsed("First name").trim(),
                            lastName: findInParsed("Last name").trim(),
                            email: findInParsed("Email address").trim(),
                        };
                        setResults(newResults);
                    })(),
                    (async () => {
                        const image = await fetchCookie(`https://cri.epita.fr/photos/${urlParams.lookup}`);
                        if (!image.ok)
                            throw new Error();
                        setImageData(Buffer.from(await image.arrayBuffer()));
                    })(),
                ]);
            })();
        }
    });
    return (_jsxs("mt-xjoin", { pad: [1, 0], children: [_jsx("mt-yjoin", { flexGrow: true, pad: [2, 1], widthAlign: "stretch", children: results
                    ? (_jsxs(_Fragment, { children: [_jsx("mt-span", { doubleHeight: true, children: urlParams.lookup }), _jsxs("mt-para", { wrap: "word-wrap", children: ["First name: ", results.firstName] }), _jsxs("mt-para", { wrap: "word-wrap", children: ["Last name: ", results.lastName] }), _jsxs("mt-para", { wrap: "word-break", children: ["Email: ", results.email] })] }))
                    : "Loading..." }), imageData ? _jsx(SharpImg, { path: imageData, defaultComponent: () => _jsx(DefaultImg, { flexGrow: true }), flexGrow: true }) : _jsx(DefaultImg, { flexGrow: true })] }));
}
