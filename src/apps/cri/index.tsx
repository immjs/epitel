import { MemoryRouter, Route, Routes, useNavigate } from "react-router";
import { CriLookup } from "./lookup.js";
import { App } from "../../epitel/apps.js";
import { useState } from "react";
import { useKeyboard } from "minitel-react";

export const Cri: App = {
  name: 'Cri',
  base: 'cri',
  routes: (
    <Routes>
      <Route path="/" element={<CriApp />} />
      <Route path="/lookup/:lookup" element={<CriLookup />} />
    </Routes>
  ),
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

  return (
    <mt-yjoin widthAlign="middle" heightAlign="middle">
      <mt-yjoin widthAlign="stretch" textAlign="middle">
        <mt-para bg={3} fg={0} pad={2}>
          <mt-span doubleHeight doubleWidth>
            CRI lookup
          </mt-span>
        </mt-para>
        <mt-yjoin widthAlign="stretch" invert gap={1} pad={2}>
          <mt-input autofocus onChange={setLookingUp} />
          <mt-para><mt-span invert>ENVOI</mt-span> to look up</mt-para>
        </mt-yjoin>
      </mt-yjoin>
    </mt-yjoin>
  )
}
