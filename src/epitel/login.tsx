import { useContext, useState } from "react";
import { useKeyboard } from "minitel-react";
import gssapi from "gssapi.js";
import { getuid } from "process";
import { createId } from "@paralleldrive/cuid2";
import { mainContext } from "../index.js";
import { makeDirectory } from "make-dir";
import makeFetchCookie from "fetch-cookie";

async function attemptKerberos(username: string, password: string) {
  try {
    const fetchCookie = makeFetchCookie(fetch);
    const sessId = createId();
    const dir = `${process.env.XDG_RUNTIME_DIR ?? `/tmp/user-${getuid!()}`}/epitel/${sessId}/`;
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
      await gssapi.initSecContext(ctx, Buffer.from(res.headers.get('WWW-Authenticate')!.split(' ')[1], 'base64'));
    }

    return {
      sessId,
      fetch: fetchCookie,
    };
  } catch (err) {
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
      } else {
        mainCtx.auth[1](success);
      }
    }
  }, [username, password]);

  return (
    <mt-yjoin>
      <mt-xjoin widthAlign="middle" heightAlign="middle" flexGrow>
        <mt-yjoin gap={1} width={32} widthAlign="stretch" textAlign="middle">
          <mt-xjoin widthAlign="middle">
            <mt-para>Welcome to { mainCtx.machineIsFrom }</mt-para>
          </mt-xjoin>
          <mt-xjoin gap={1}>
            <mt-yjoin gap={1}>
              <mt-para>
                Username
              </mt-para>
              <mt-para>
                Password
              </mt-para>
            </mt-yjoin>
            <mt-yjoin flexGrow widthAlign="stretch" gap={1}>
              <mt-input type="text" invert onChange={ setUsername } autofocus />
              <mt-input type="password" invert onChange={ setPassword } />
            </mt-yjoin>
          </mt-xjoin>
          <mt-para>
            <mt-span fg={2}>{ loginFailed ? 'Login failed' : ' ' }</mt-span>
          </mt-para>
          <mt-para><mt-span invert>ENVOI</mt-span> to log in</mt-para>
        </mt-yjoin>
      </mt-xjoin>
    </mt-yjoin>
  );
}
