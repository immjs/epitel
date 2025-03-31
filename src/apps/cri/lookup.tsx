import { parse } from "node-html-parser";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { DefaultImg, SharpImg } from "minitel-mosaic";
import { mainContext } from "../../index.js";
import { getPage } from "../../utils/scraper.js";

interface Results {
  firstName: string,
  lastName: string,
  email: string,
}

export function CriLookup() {
  const { auth: [{ fetch: fetchCookie }] } = useContext(mainContext) as { auth: [{ fetch: typeof fetch }, any] };
  const [results, setResults] = useState<Results | null>(null);
  const [imageData, setImageData] = useState<Buffer | null>(null);
  const urlParams = useParams();

  console.log("Getting rendered...");

  useEffect(() => setResults(null), [urlParams.lookup]);
  useEffect(() => {
    if (results === null) {
      (async () => {
        await Promise.all([
          (async () => {
            const parsed = await getPage(`https://cri.epita.fr/users/${urlParams.lookup}`, fetchCookie);
            const findInParsed = (label: string) => parsed.querySelectorAll("th,td").find((v, i, a) => i != 0 && a[i - 1].text === label)!.text;

            const newResults: Results = {
              firstName: findInParsed("First name").trim(),
              lastName: findInParsed("Last name").trim(),
              email: findInParsed("Email address").trim(),
            };
            setResults(newResults);
          })(),
          (async () => {
            const image = await fetchCookie(`https://cri.epita.fr/photos/${urlParams.lookup}`);
            if (!image.ok) throw new Error();

            setImageData(Buffer.from(await image.arrayBuffer()));
          })(),
        ]);
      })();
    }
  });

  return (
    <mt-xjoin pad={[1, 0]}>
      <mt-yjoin flexGrow pad={[2, 1]} widthAlign="stretch">
        {
          results
          ? (
            <>
              <mt-span doubleHeight>
                {urlParams.lookup}
              </mt-span>
              <mt-para wrap="word-wrap">
                First name: {results.firstName}
              </mt-para>
              <mt-para wrap="word-wrap">
                Last name: {results.lastName}
              </mt-para>
              <mt-para wrap="word-break">
                Email: {results.email}
              </mt-para>
            </>
          )
          : "Loading..."
        }
      </mt-yjoin>
      {imageData ? <SharpImg path={imageData} defaultComponent={() => <DefaultImg flexGrow />} flexGrow /> : <DefaultImg flexGrow />}
    </mt-xjoin>
  );
}
