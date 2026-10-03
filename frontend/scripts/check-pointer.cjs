const {chromium,devices}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
const browser=await chromium.launch({executablePath:'/usr/bin/google-chrome',headless:true,args:['--no-sandbox','--enable-unsafe-swiftshader']});
const modes=[['android', {...devices['Pixel 7'],viewport:{width:390,height:844}}],['iphone', {...devices['iPhone 13'],viewport:{width:390,height:844}}],['wide-touch',{viewport:{width:980,height:900},screen:{width:390,height:844},hasTouch:true,isMobile:true}],['desktop',{viewport:{width:1440,height:900}}],['reduced',{viewport:{width:1440,height:900},reducedMotion:'reduce'}]];
for(const [name,options] of modes){
const context=await browser.newContext(options);const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto(process.env.UI_URL || 'http://127.0.0.1:4173');await page.waitForSelector('h1');
await page.mouse.move(200,300);await page.mouse.move(400,350);await page.waitForTimeout(800);
const metrics=await page.evaluate(()=>({width:innerWidth,screen:screen.width,touch:navigator.maxTouchPoints,meta:document.querySelector('meta[name="viewport"]').content,cols:getComputedStyle(document.querySelector('.landing-hero')).gridTemplateColumns,cursors:document.querySelectorAll('.nyric-pointer,[data-cursor-fluid],.target-cursor-wrapper').length,scroll:document.documentElement.scrollWidth}));
assert.equal(errors.length,0,`${name}: ${errors}`);assert.equal(metrics.cursors,name==='desktop'?2:0);assert.ok(metrics.scroll<=metrics.width+1);
if(name==='android'||name==='iphone')assert.equal(metrics.cols.split(' ').length,1);
if(name==='desktop'){
await page.mouse.move(500,420);await page.mouse.move(560,450);await page.waitForTimeout(120);await page.screenshot({path:'/tmp/desktop-cursor.png'});
await page.emulateMedia({reducedMotion:'reduce'});await page.waitForTimeout(100);assert.equal(await page.locator('.nyric-pointer,[data-cursor-fluid]').count(),0);
await page.emulateMedia({reducedMotion:'no-preference'});await page.mouse.move(270,330);await page.waitForTimeout(100);
}
if(name==='wide-touch') assert.equal(await page.locator('[data-mobile-viewport-notice]').count(),1);
if(name==='android') { await page.locator('.landing-footer').scrollIntoViewIfNeeded(); await page.waitForTimeout(1100); await page.evaluate(()=>scrollTo(0,0)); }
await page.screenshot({path:`/tmp/${name}-landing.png`,fullPage:name!=='desktop'});console.log(name,metrics);await context.close();
}await browser.close();
})();
