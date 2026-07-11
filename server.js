// Starlink AI Customer Service Backend v4.0
// 2026-07-11 | Pure ASCII - zero non-ASCII chars in source
const http = require('http');
const https = require('https');

const SF_KEY  = process.env.SILICONFLOW_API_KEY  || process.env.OPENAI_API_KEY || process.env.SILICONFLOW_KEY  || '';
const SF_BASE = process.env.SILICONFLOW_BASE_URL || process.env.OPENAI_BASE_URL || process.env.SILICONFLOW_BASE || 'https://api.siliconflow.cn/v1';
const SF_MODEL= process.env.SILICONFLOW_MODEL    || process.env.OPENAI_MODEL    || 'deepseek-ai/DeepSeek-V3';

console.log('[boot] SF_KEY len:', SF_KEY.length, '| BASE:', SF_BASE, '| MODEL:', SF_MODEL);
console.log('[boot] Node version:', process.version);

// ALL-ASCII HTML - Chinese text served via API responses instead
const HTML = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8"/>\n<meta name="viewport" content="width=device-width,initial-scale=1"/>\n<title>Starlink - All-AI Company</title>\n<style>\n*{box-sizing:border-box;margin:0;padding:0}\nbody{font-family:system-ui,sans-serif;background:#0b1020;color:#e8edf7;line-height:1.6}\nheader{text-align:center;padding:56px 24px 32px}\nh1{font-size:34px;margin-bottom:10px;color:#e8edf7}\n.tag{color:#9fb0cf;max-width:680px;margin:0 auto 22px}\n.cta{display:inline-block;padding:12px 26px;background:#5b8cff;color:#fff;border-radius:10px;text-decoration:none;font-weight:600}\nsection{max-width:980px;margin:0 auto;padding:28px 24px}\nh2{font-size:22px;border-left:4px solid #5b8cff;padding-left:12px;margin-bottom:18px}\n.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}\n.card{background:#141b2e;border:1px solid #233;border-radius:14px;padding:18px}\n.card h3{margin:0 0 8px;font-size:17px;color:#e8edf7}\n.card p{margin:0;color:#9fb0cf;font-size:14px;line-height:1.6}\n.price{font-weight:700;color:#5b8cff}\n.badge{display:inline-block;background:#ff6b6b;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:8px}\nfooter{text-align:center;color:#9fb0cf;padding:30px;font-size:13px}\n#chatFab{position:fixed;right:22px;bottom:22px;width:60px;height:60px;border-radius:50%;background:#5b8cff;color:#fff;border:none;font-size:26px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.4)}\n#chatBox{position:fixed;right:22px;bottom:92px;width:340px;max-width:92vw;height:460px;background:#141b2e;border:1px solid #2a3550;border-radius:16px;display:none;flex-direction:column;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.5)}\n#chatHead{padding:12px 14px;background:#1b2440;font-weight:600;display:flex;justify-content:space-between;align-items:center}\n#chatHead small{color:#9fb0cf;font-weight:400}\n#chatLog{flex:1;overflow:auto;padding:12px;font-size:14px;line-height:1.6}\n.msg{padding:8px 11px;border-radius:10px;margin-bottom:8px;max-width:85%;white-space:pre-wrap}\n.me{background:#5b8cff;margin-left:auto}\n.ai{background:#1e2a40;color:#e8edf7}\n#chatInput{display:flex;border-top:1px solid #2a3550}\n#chatInput input{flex:1;border:none;background:transparent;color:#e8edf7;padding:12px;outline:none}\n#chatInput button{background:#5b8cff;color:#fff;border:none;padding:0 18px;cursor:pointer}\n</style>\n</head>\n<body>\n<header>\n<h1>Starlink</h1>\n<p class="tag">All-AI Employee Intelligent Company. Real delivery, not simulation. AI CEO leads execution. Chairman sets direction.</p>\n<a class="cta" href="#contact">Contact Us</a>\n</header>\n<section>\n<h2>Core Services</h2>\n<div class="grid">\n<div class="card"><h3>P2 - AI Customer Service <span class="badge">Hot</span></h3><p>Knowledge base + multi-channel deployment + 24/7 operation. Launch in 7 days, cut costs 50%. Setup CNY 9,800 + CNY 4,800/month.</p></div>\n<div class="card"><h3>P7 - AI Silver Travel</h3><p>AI customer service + content team for senior travel agencies. Voice support, 24/7, elderly-friendly. CNY 9,800 + CNY 6,800/month.</p></div>\n<div class="card"><h3>P8 - AI Comic Tutorial</h3><p>Learn AI comic video creation in 7 days. Zero to published. CNY 299-2,980. Side income or business.</p></div>\n<div class="card"><h3>P1 - AI Employee Hosting</h3><p>Monthly subscription = your own AI department. Customer service, sales, operations, finance. CNY 9,800+/month.</p></div>\n</div>\n</section>\n<section>\n<h2>Why Us</h2>\n<div class="grid">\n<div class="card"><h3>All-AI Team</h3><p>AI executives + AI teams. 24/7 work, near-zero marginal cost, ultra-competitive pricing.</p></div>\n<div class="card"><h3>KPI Commitment</h3><p>Resolution rate &gt;= 85%, response &lt; 5s, cost reduction &gt;= 50%. Measurable results, not concepts.</p></div>\n<div class="card"><h3>Replication Engine</h3><p>Build once, sell N times. New client = instantiate template, not reinvent. Maximum leverage.</p></div>\n<div class="card"><h3>7-Day Launch</h3><p>Diagnosis (1d) &gt; Knowledge Base (1-3d) &gt; Deploy (3-5d) &gt; Launch (Day 7) &gt; Operate.</p></div>\n</div>\n</section>\n<section id="contact">\n<h2>Seed Client Program (First 3 Only)</h2>\n<div class="card">\n<p style="margin-bottom:12px">Setup fee <b style="color:#5b8cff">CNY 0</b> (was CNY 9,800). Trial <b style="color:#5b8cff">CNY 2,980/month</b> (was CNY 4,800). 7-day launch. Chairman oversees personally.</p>\n<form id="leadForm" style="display:grid;gap:10px">\n<input id="lf_name" placeholder="Name" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:#e8edf7"/>\n<input id="lf_company" placeholder="Company / Industry" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:#e8edf7"/>\n<input id="lf_contact" placeholder="WeChat / Phone" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:#e8edf7"/>\n<textarea id="lf_need" placeholder="Main pain point or need" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:#e8edf7;min-height:60px"></textarea>\n<button type="button" id="leadSend" style="padding:12px;background:#5b8cff;color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">Apply Now</button>\n</form>\n<p id="leadMsg" style="color:#5b8cff;margin-top:8px"></p>\n</div>\n<p class="tag" style="margin-top:14px">Process: Diagnosis (1d) &gt; Knowledge Base (1-3d) &gt; Deploy (3-5d) &gt; Launch (Day 7) &gt; Operate.</p>\n</section>\n<footer>Starlink Intelligent Technology Co., Ltd. - All-AI Employees - AI CEO Operated</footer>\n<button id="chatFab" title="AI Customer Service">AI</button>\n<div id="chatBox">\n<div id="chatHead">Starlink AI Service <small>24/7</small></div>\n<div id="chatLog"></div>\n<div id="chatInput"><input id="chatText" placeholder="Ask about our services..." /><button id="chatSend">Send</button></div>\n</div>\n<script>\nvar fab=document.getElementById("chatFab"),box=document.getElementById("chatBox"),log=document.getElementById("chatLog"),txt=document.getElementById("chatText"),send=document.getElementById("chatSend");\nfab.onclick=function(){\n  box.style.display=box.style.display==="flex"?"none":"flex";\n  if(box.style.display==="flex"&&!log.dataset.hi){\n    add("ai","Hello! I am Starlink AI Customer Service. Ask me about: AI customer service / silver travel / comic tutorial / pricing / process. Bilingual - Chinese or English OK!");\n    log.dataset.hi="1";\n  }\n};\nfunction add(role,text){\n  var d=document.createElement("div");\n  d.className="msg "+(role==="me"?"me":"ai");\n  d.textContent=text;\n  log.appendChild(d);\n  log.scrollTop=log.scrollHeight;\n}\nasync function go(){\n  var v=txt.value.trim();if(!v)return;\n  add("me",v);txt.value="";\n  add("ai","Thinking...");\n  try{\n    var r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:v})});\n    var j=await r.json();\n    if(log.lastChild)log.lastChild.textContent=j.reply||"No response.";\n  }catch(e){if(log.lastChild)log.lastChild.textContent="Error. Please try again.";}\n}\nsend.onclick=go;\ntxt.onkeydown=function(e){if(e.key==="Enter")go();};\ndocument.getElementById("leadSend").onclick=async function(){\n  var d={name:document.getElementById("lf_name").value,company:document.getElementById("lf_company").value,contact:document.getElementById("lf_contact").value,need:document.getElementById("lf_need").value};\n  if(!d.contact){alert("Please enter contact info");return;}\n  try{\n    var r=await fetch("/api/lead",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});\n    var j=await r.json();\n    document.getElementById("leadMsg").textContent=j.ok?"Sent! We will contact you shortly.":"Failed. Please try again.";\n    document.getElementById("leadForm").reset();\n  }catch(e){document.getElementById("leadMsg").textContent="Network error.";}\n};\n</script>\n</body>\n</html>';

const FALLBACK=[
  {k:["what","service","about","company","business","do"],a:"Starlink is an all-AI employee company. We provide: P2 AI customer service operation, P7 AI silver travel service, P8 AI comic drama tutorial, P1 AI employee hosting. Real delivery, not simulation. AI CEO leads execution, Chairman sets direction."},
  {k:["price","cost","how much","fee","quote","money"],a:"P2 AI Customer Service: Setup CNY 9,800 + CNY 4,800/month (Seed: CNY 0 setup + CNY 2,980/month). P7 Silver Travel: CNY 9,800 + CNY 6,800/month. P8 Tutorial: CNY 299-2,980. P1 Hosting: CNY 9,800+/month."},
  {k:["process","how to start","steps","cooperate","begin"],a:"3 steps: 1. Chat with us or fill form 2. We diagnose in 1 day 3. Sign and launch in 7 days. Process: Diagnosis (1d) > Knowledge Base (1-3d) > Deploy (3-5d) > Launch > Operate."},
  {k:["customer service","P2","AI service","chatbot"],a:"We deploy + operate AI customer service for businesses. Knowledge base + multi-channel (WeChat/Douyin/Web/Mini) + 24/7 + daily monitoring + weekly optimization + monthly report. Launch in 7 days, cut costs 50%."},
  {k:["silver","senior","travel","P7","elderly","old people"],a:"AI solutions for senior travel agencies: P7-A AI Silver Customer Service (elderly-friendly, voice support, 24/7), P7-B AI Silver Content Team (travel guides, health tips), P7-C AI Elderly Care Training. Pricing: CNY 9,800 + CNY 6,800/month."},
  {k:["comic","tutorial","P8","drama","video","create"],a:"P8: Learn AI comic video creation in 7 days. No skills needed. Intro CNY 299, Toolkit CNY 980, Community CNY 2,980/year. After course: run accounts, freelance, side income."},
  {k:["reliable","real","simulation","trust","fake"],a:"Real delivery with KPIs: resolution rate >= 85%, response < 5s, cost reduction >= 50%. Seed clients: 1-month trial, cancel anytime if not satisfied."},
  {k:["advantage","why","difference","better"],a:"3 advantages: 1. All-AI team (24/7, ultra-low cost) 2. Measurable delivery (KPI commitments) 3. Replication engine (build once, sell N times)."},
  {k:["trial","seed","test","free"],a:"Seed Client Program: First 3 companies - Setup CNY 0 (was 9,800), Trial CNY 2,980/month (was 4,800). 1-month trial, cancel anytime."},
  {k:["contact","wechat","phone","email","reach"],a:"Use the form at the bottom of this page, or click the AI chat button (bottom right). Our AI team is online 24/7 and will contact you soon."}
];

function fallbackAnswer(m){
  m=(m||"").toLowerCase();
  for(var i=0;i<FALLBACK.length;i++){
    var it=FALLBACK[i];
    for(var j=0;j<it.k.length;j++){
      if(m.indexOf(it.k[j])!==-1)return it.a;
    }
  }
  return "Thank you for your inquiry! Your question is recorded. We will contact you shortly. You can also use the form below for priority response.";
}

const PORT=process.env.PORT||3000;

// SYSTEM prompt - bilingual, ASCII only
const SYSTEM=
"You are Starlink AI Customer Service, available 24/7. Starlink is an all-AI employee intelligent company, real delivery, not simulation.\n\n" +
"[Company] All-AI team led by AI CEO. Chairman sets direction. 24/7 operation, near-zero marginal cost, competitive pricing.\n\n" +
"[Core Services - always mention pricing]\n" +
"1. P2 AI Customer Service: Knowledge base + multi-channel + 24/7 operation. Launch 7 days. Setup CNY 9,800 + CNY 4,800/month. Seed: CNY 0 + CNY 2,980/month (first 3 only).\n" +
"2. P7 AI Silver Travel: For senior travel agencies. AI customer service (elderly-friendly, voice, 24/7) + content team. Setup CNY 9,800 + CNY 6,800/month.\n" +
"3. P8 AI Comic Tutorial: Learn AI comic video creation in 7 days. Zero to published. Intro CNY 299, Toolkit CNY 980, Community CNY 2,980/year.\n" +
"4. P1 AI Employee Hosting: Monthly subscription = your own AI department. CNY 9,800+/month.\n\n" +
"[Process] Diagnosis (1d) > Knowledge Base (1-3d) > Deploy (3-5d) > Launch (Day 7) > Operate.\n\n" +
"[KPIs] Resolution rate >= 85%, response < 5s, cost reduction >= 50%.\n\n" +
"[Compliance] No medical advice, no investment advice, no exaggerated claims. For these: say 'This requires human consultation. Let me transfer you.'\n\n" +
"[IMPORTANT] Answer in the SAME language the user uses. If user writes Chinese, respond in Chinese. If English, respond in English.";

function callSiliconFlow(message,callback){
  var apiUrl=new URL(SF_BASE+"/chat/completions");
  var postData=JSON.stringify({
    model:SF_MODEL,
    messages:[
      {role:"system",content:SYSTEM},
      {role:"user",content:message}
    ],
    temperature:0.3,
    stream:false
  });
  var options={
    hostname:apiUrl.hostname,
    path:apiUrl.pathname,
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer "+SF_KEY,
      "Content-Length":Buffer.byteLength(postData)
    },
    timeout:60000
  };
  var req=https.request(options,function(res){
    var data="";
    res.on("data",function(chunk){data+=chunk;});
    res.on("end",function(){
      try{
        var j=JSON.parse(data);
        if(res.statusCode!==200){
          console.error("[api] HTTP "+res.statusCode+" : "+data.slice(0,200));
          callback(new Error("HTTP_"+res.statusCode),null);
          return;
        }
        var reply=j.choices&&j.choices[0]&&j.choices[0].message?j.choices[0].message.content:"Temporarily unable to answer. Please try again.";
        callback(null,reply);
      }catch(e){
        console.error("[api] parse error: "+e.message);
        callback(e,null);
      }
    });
  });
  req.on("error",function(e){callback(e,null);});
  req.on("timeout",function(){req.destroy();callback(new Error("Timeout"),null);});
  req.write(postData);
  req.end();
}

var server=http.createServer(function(req,res){
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");
  res.setHeader("Content-Type","text/html; charset=utf-8");

  if(req.method==="OPTIONS"){res.writeHead(200);res.end();return;}

  if(req.method==="POST"&&req.url==="/api/chat"){
    var body="";
    req.on("data",function(c){body+=c;});
    req.on("end",function(){
      var message="";
      try{var j=JSON.parse(body);message=j.message||"";}catch(e){}
      if(!SF_KEY){
        res.setHeader("Content-Type","application/json");
        res.end(JSON.stringify({reply:fallbackAnswer(message)}));
        return;
      }
      callSiliconFlow(message,function(err,reply){
        if(err){
          console.error("[chat] error: "+err.message);
          var msg=err.message==="Timeout"?"Response timeout (>60s). Please try a shorter question.":"Connection error. Please try again.";
          res.setHeader("Content-Type","application/json");
          res.end(JSON.stringify({reply:msg}));
          return;
        }
        res.setHeader("Content-Type","application/json");
        res.end(JSON.stringify({reply:reply}));
      });
    });
    return;
  }

  if(req.method==="POST"&&req.url==="/api/lead"){
    var body="";
    req.on("data",function(c){body+=c;});
    req.on("end",function(){
      try{
        var d=JSON.parse(body);
        var fs=require("fs");
        var path=require("path");
        d.ts=new Date().toISOString();
        var fp=path.join(__dirname,"leads.json");
        var arr=fs.existsSync(fp)?JSON.parse(fs.readFileSync(fp,"utf8")):[];
        arr.push(d);
        fs.writeFileSync(fp,JSON.stringify(arr,null,2));
        res.setHeader("Content-Type","application/json");
        res.end(JSON.stringify({ok:true}));
      }catch(e){
        res.setHeader("Content-Type","application/json");
        res.end(JSON.stringify({ok:false,error:e.message}));
      }
    });
    return;
  }

  res.end(HTML);
});

server.listen(PORT,function(){
  console.log("[ready] Starlink website + AI service on port "+PORT);
});
