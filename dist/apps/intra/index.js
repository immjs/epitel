import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { mainContext } from "../../index.js";
import { getPage } from "../../utils/scraper.js";
export const Intra = {
    name: 'Intra',
    base: 'intra',
    routes: (_jsx(Routes, { children: _jsx(Route, { path: "/", element: _jsx(IntraMain, {}) }) })),
};
function IntraMain() {
    const { auth: [{ fetch: fetchCookie }] } = useContext(mainContext);
    const [data, setData] = useState([]);
    useEffect(() => {
        (async () => {
            const [currTens, currTen, currOngs, currOng] = data;
            switch (data.length) {
                case 0: {
                    const rootPage = await getPage('https://intra.forge.epita.fr/', fetchCookie);
                    const tenants = [];
                    for (let el of rootPage.querySelectorAll('.project')) {
                        const dates = el.querySelectorAll('.project__dates');
                        const tenant = {
                            name: el.querySelector('.project__title').text,
                            code: el.attributes.href,
                            ongoingStart: dates[0].text,
                            ongoingEnd: dates[1].text,
                        };
                        tenants.push(tenant);
                    }
                    setData([tenants]);
                    break;
                }
                case 2: {
                    const rootPage = await getPage('https://intra.forge.epita.fr/', fetchCookie);
                    const ongoings = [];
                    for (let el of rootPage.querySelectorAll('.project')) {
                        const dates = el.querySelectorAll('.project__dates');
                        const ongoing = {
                            name: el.querySelector('.project__title').text,
                            code: el.attributes.href,
                            start: dates[0].text,
                            end: dates[1].text,
                        };
                        ongoings.push(ongoing);
                    }
                    setData([currTens, currTen, ongoings]);
                    break;
                }
                // case 2: {
                //   setData((dat) => [...dat,]);
                //   break;
                // }
            }
        })();
    }, [data]);
    if (data.length % 2 == 0)
        return _jsx("mt-xjoin", { widthAlign: "middle", heightAlign: "middle", children: "Loading..." });
    if (data[1] == null) {
        return (_jsxs("mt-yjoin", { pad: 2, children: [_jsx("mt-para", { doubleWidth: true, doubleHeight: true, children: "My Tenants" }), _jsx("mt-scroll", { disabled: true })] }));
    }
    if (data[1] == null) {
        return (_jsx("mt-yjoin", {}));
    }
    if (data[2] == null) {
        return (_jsx("mt-yjoin", {}));
    }
}
