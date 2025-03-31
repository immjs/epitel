import { Route, Routes, useLocation, useNavigate } from "react-router";
import { apps } from "./apps.js";
import { useState } from "react";
import { useKeyboard } from "minitel-react";

export function EpitelMain() {
  return (
    <mt-yjoin>
      <mt-cont flexGrow>
        <Routes>
          <Route path="/" element={<AppMenu />} />
          {
            apps.map((v) => (
              <Route path={`/${v.base}/*`} element={v.routes} key={v.base}/>
            ))
          }
        </Routes>
      </mt-cont>
      <mt-xjoin>
      </mt-xjoin>
    </mt-yjoin>
  );
}

const MAX_APPS = 5;

function AppMenu() {
  const chunked = Array.from({ length: Math.ceil(apps.length / MAX_APPS) }, (v, i) => apps.slice(MAX_APPS * i, MAX_APPS * (i + 1)));
  const [currApp, setCurrApp] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useKeyboard((key) => {
    if (key === "\x13\x41") {
      if (errorMsg) {
        setErrorMsg(null);
      } else {
        if (!(+currApp in apps)) setErrorMsg("No such app number");
        else navigate(`/${apps[+currApp].base}`);
      }
    }
  }, [errorMsg, currApp]);

  return (
    <mt-zjoin>
      <mt-yjoin widthAlign="middle" heightAlign="middle" pad={[1, 0]} gap={1}>
        <mt-xjoin widthAlign="middle">
          <mt-para doubleHeight>
            Welcome to Epitel
          </mt-para>
        </mt-xjoin>
        <mt-xjoin widthAlign="middle">
          {
            chunked.map((v, i) => (
              <mt-yjoin key={i} width={8}>
                {
                  v.map((v_, i_) => `${String(i * MAX_APPS + i_).padStart(2, '0')} ${v_.name}`).join('\n')
                }
              </mt-yjoin>
            ))
          }
        </mt-xjoin>
        <mt-xjoin>Run: <mt-input onChange={setCurrApp} width={3} autofocus /></mt-xjoin>
        <mt-para><mt-span invert>ENVOI</mt-span> to run</mt-para>
      </mt-yjoin>
      {
        errorMsg && (
          <mt-yjoin widthAlign="middle" heightAlign="middle">
            <mt-yjoin bg={5} pad={1}>
              <mt-para>
                { errorMsg }
              </mt-para>
              <mt-para><mt-span invert>ENVOI</mt-span> to continue</mt-para>
            </mt-yjoin>
          </mt-yjoin>
        )
      }
    </mt-zjoin>
  );
}
