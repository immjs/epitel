import { parse } from "node-html-parser";

export async function getPage(url: string, fetchCookie: typeof fetch) {
  const webpage = await fetchCookie(url, { headers: { 'User-Agent': `Epitel Scraper by UserByUID:31023 - ${process.env.NODE_ENV === 'development' ? 'Testing for the 1st of April' : 'On behalf of the minitels in Salle Mac'}` } });

  if (!webpage.ok) {
    console.log(await webpage.text());
    throw new Error();
  }

  return parse(await webpage.text());
}
