import { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import { App } from "../../epitel/apps.js";
import { mainContext } from "../../index.js";
import { getPage } from "../../utils/scraper.js";

export const Intra: App = {
  name: 'Intra',
  base: 'intra',
  routes: (
    <Routes>
      <Route path="/" element={<IntraMain />} />
    </Routes>
  ),
};

interface Tenant {
  name: string;
  code: string;
  ongoingStart: string;
  ongoingEnd: string;
}

interface Ongoing {
  name: string;
  code: string;
  start: string;
  end: string;
}

function IntraMain() {
  const { auth: [{ fetch: fetchCookie }] } = useContext(mainContext) as { auth: [{ fetch: typeof fetch }, any] };
  const [data, setData] = useState<[] | [Tenant[]] | [Tenant[], string] | [Tenant[], string, Ongoing[]] | [Tenant[], string, Ongoing[], string]>([]);

  useEffect(() => {
    (async () => {
      const [currTens, currTen, currOngs, currOng] = data;
      switch (data.length) {
        case 0: {
          const rootPage = await getPage('https://intra.forge.epita.fr/', fetchCookie);
          const tenants: Tenant[] = [];
          for (let el of rootPage.querySelectorAll('.project')) {
            const dates = el.querySelectorAll('.project__dates');
            const tenant: Tenant = {
              name: el.querySelector('.project__title')!.text,
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
          const ongoings: Ongoing[] = [];
          for (let el of rootPage.querySelectorAll('.project')) {
            const dates = el.querySelectorAll('.project__dates');
            const ongoing: Ongoing = {
              name: el.querySelector('.project__title')!.text,
              code: el.attributes.href,
              start: dates[0].text,
              end: dates[1].text,
            };
            ongoings.push(ongoing);
          }
          setData([currTens!, currTen!, ongoings]);
          break;
        }
        // case 2: {
        //   setData((dat) => [...dat,]);
        //   break;
        // }
      }
    })();
  }, [data]);

  if (data.length % 2 == 0) return <mt-xjoin widthAlign="middle" heightAlign="middle">Loading...</mt-xjoin>;

  if (data[1] == null) {
    return (
      <mt-yjoin pad={2}>
        <mt-para doubleWidth doubleHeight>
          My Tenants
        </mt-para>
        <mt-scroll disabled></mt-scroll>
      </mt-yjoin>
    );
  }

  if (data[1] == null) {
    return (
      <mt-yjoin>

      </mt-yjoin>
    );
  }

  if (data[2] == null) {
    return (
      <mt-yjoin>

      </mt-yjoin>
    );
  }
}
