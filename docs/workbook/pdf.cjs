const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage();
await p.goto('file://'+__dirname+'/workbook.html');await p.waitForTimeout(800);
await p.pdf({path:__dirname+'/Last-Things-Workbook.pdf',format:'A4',printBackground:true,displayHeaderFooter:true,headerTemplate:'<div></div>',footerTemplate:'<div style="width:100%;font-size:8px;color:#9ca3af;text-align:center;font-family:Inter">Last Things · Study Workbook · <span class="pageNumber"></span></div>',margin:{top:'16mm',bottom:'18mm',left:'15mm',right:'15mm'}});
await b.close()})();
