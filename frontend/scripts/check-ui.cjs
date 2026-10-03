const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
require('node:fs').mkdirSync(process.env.UI_SCREENSHOT_DIR || '/tmp/uniissuehub-ui',{recursive:true});
const browser=await chromium.launch({executablePath:process.env.CHROME_PATH || '/usr/bin/google-chrome',headless:true,args:['--no-sandbox']});
const complaints=[{_id:'test-issue',title:'Leaking tap in second floor washroom',description:'A sample complaint for layout testing only.',category:'Water',priority:'Medium',status:'In Progress',location:'Block A',createdAt:'2026-10-01T10:00:00Z',student:{name:'Test Student'},aiAnalysis:{}}];
let count=0;
for(const width of (process.env.UI_WIDTHS || '320,360,390,768,1024,1440').split(',').map(Number)){
 for(const theme of ['light','dark']){
 for(const [role,paths] of [['guest',['/','/login','/register','/forgot-password']],['student',['/dashboard','/my-complaints','/submit','/notifications']],['admin',['/admin','/admin/complaints']],['warden',['/warden']],['technician',['/technician']]]){
 const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
 await context.addInitScript(({role,theme})=>{localStorage.setItem('theme',theme);if(role!=='guest')localStorage.setItem('user',JSON.stringify({_id:'test-user',name:'Test Student',role,rollNumber:'TEST001',hostel:'Block A'}));},{role,theme});
 await context.route('https://complaint-system-bc1h.onrender.com/**',async route=>{
 const url=route.request().url();let data={complaints,users:[],history:[]};
 if(url.includes('/admin/analytics'))data={analytics:{total:1,pending:0,inProgress:1,resolved:0,recentComplaints:complaints,categoryBreakdown:[],priorityBreakdown:[],sentimentBreakdown:[]}};
 await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify(data)});
 });
 for(const path of paths){
 console.log('CHECK',width,theme,role,path);const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto((process.env.UI_URL || 'http://127.0.0.1:4173')+path);await page.waitForSelector('h1, h2, form', {state:'attached'});await page.waitForTimeout(600);
 assert.equal(errors.length,0,`${path} ${width}: ${errors}`);
 const sizes=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));
 if(sizes.scroll>sizes.width+1)console.log(await page.evaluate(()=>Array.from(document.querySelectorAll('body *')).filter(e=>e.getBoundingClientRect().right>innerWidth+1).map(e=>({tag:e.tagName,cls:e.className})).slice(0,20)));assert.ok(sizes.scroll<=sizes.width+1,`${path} ${theme} ${width}: overflow ${sizes.scroll}`);
 if(role==='student'&&path==='/dashboard'&&width===390&&theme==='light'){
 await page.getByRole('button',{name:'Open navigation'}).click();await page.getByRole('dialog',{name:'Campus navigation'}).waitFor();
 assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'detached'});
 }
 if((width===390||width===1440)&&process.env.UI_ALL_SHOTS)await page.screenshot({path:`${process.env.UI_SCREENSHOT_DIR || '/tmp/uniissuehub-ui'}/${theme}-${width}-${role}-${path.replace(/\W/g,'_')||'home'}.png`});
 if(width===390&&theme==='light'&&['/dashboard','/submit','/login'].includes(path))await page.screenshot({path:`${process.env.UI_SCREENSHOT_DIR || '/tmp/uniissuehub-ui'}/after-${path.slice(1)}-mobile.png`,fullPage:true});
 if(width===1440&&theme==='light'&&path==='/dashboard')await page.screenshot({path:(process.env.UI_SCREENSHOT_DIR || '/tmp/uniissuehub-ui')+'/after-dashboard-desktop.png',fullPage:true});
 count++;await page.close();
 }await context.close();
 }
 }
}await browser.close();console.log(`PASS: ${count} route/theme/viewport checks, no horizontal overflow or React errors. Mobile navigation open/Escape/scroll-lock passed.`);
})();
