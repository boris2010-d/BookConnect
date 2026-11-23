import {chromium} from "playwright";
import {mkdir} from "node:fs/promises";
const out="stage3-evidence";
const base="https://boris2010-d.github.io/BookConnect/";
await mkdir(out,{recursive:true});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1365,height:900},deviceScaleFactor:1});
async function openPage(path,expectedSelector){
  for(let attempt=0;attempt<9;attempt++){
    await page.goto(base+path,{waitUntil:"domcontentloaded",timeout:30000});
    if(await page.locator(expectedSelector).count())return;
    await page.waitForTimeout(3000);
  }
  throw Error("Published site has not deployed Stage 3 UI: "+expectedSelector);
}
try {
  await openPage("","#accountForm");
  await page.locator(".book-card").first().waitFor({timeout:20000});
  await page.screenshot({path:out+"/01-catalog-BG.png",fullPage:true});
  await page.locator("#enBtn").click();
  await page.screenshot({path:out+"/02-catalog-EN.png",fullPage:true});
  await page.locator("#bgBtn").click();
  await page.locator("#account").scrollIntoViewIfNeeded();
  await page.screenshot({path:out+"/03-account-signup.png",fullPage:true});
  await openPage("librarian.html","#inventoryRows");
  await page.locator("#inventoryRows tr").first().waitFor({timeout:20000});
  await page.screenshot({path:out+"/04-librarian-BG.png",fullPage:true});
  await page.locator("#enBtn").click();
  await page.screenshot({path:out+"/05-librarian-EN.png",fullPage:true});
  console.log("Saved 5 real screenshots of published live site in",out);
}finally{
  await browser.close();
}
