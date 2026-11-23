import {chromium} from "playwright";
import {mkdir} from "node:fs/promises";
await mkdir("preview-screenshots",{recursive:true});
const browser=await chromium.launch({headless:true,args:["--no-sandbox"]});
for(const viewport of [{width:1440,height:900,name:"desktop"},{width:390,height:844,name:"mobile"}]){
 const page=await browser.newPage({viewport:{width:viewport.width,height:viewport.height},deviceScaleFactor:1});
 const errors=[];page.on("pageerror",e=>errors.push(e.message));
 await page.goto("http://127.0.0.1:8765/index.html",{waitUntil:"domcontentloaded"});
 await page.waitForTimeout(6000);
 const cards=await page.locator(".book-card").count();
 console.log(viewport.name,"catalog cards:",cards,"page errors:",errors);
 if(errors.length)throw Error("JavaScript runtime errors: "+errors.join("; "));
 if(cards<20)throw Error("Catalog should show 20+ books, found "+cards);
 await page.screenshot({path:"preview-screenshots/"+viewport.name+"-catalog.png",fullPage:true});
 await page.locator("#tabSignup").click();
 await page.locator("#account").scrollIntoViewIfNeeded();
 await page.screenshot({path:"preview-screenshots/"+viewport.name+"-registration.png"});
 await page.locator("#tabLogin").click();
 await page.locator("#enBtn").click();
 await page.screenshot({path:"preview-screenshots/"+viewport.name+"-english.png",fullPage:true});
 await page.close();
}
await browser.close();
console.log("Preview screenshots generated");
