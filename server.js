// Starlink AI Backend - Debug Version
const http = require('http');
const https = require('https');

const SF_KEY  = process.env.SILICONFLOW_API_KEY || process.env.SILICONFLOW_KEY  || '';
const SF_BASE = process.env.SILICONFLOW_BASE_URL || process.env.SILICONFLOW_BASE || 'https://api.siliconflow.cn/v1';
const SF_MODEL= process.env.SILICONFLOW_MODEL || 'deepseek-ai/DeepSeek-V3';

console.log('[boot] KEY:', SF_KEY.length, 'bytes');
console.log('[boot] BASE:', SF_BASE);
console.log('[boot] MODEL:', SF_MODEL);
console.log('[boot] Node:', process.version);
console.log('[boot] Port:', process.env.PORT || 3000);

const HTML = '<!doctype html><html><head><meta charset="utf-8"><title>Starlink</title></head><body><h1>Starlink</h1><p>AI Company</p><script>var b=document.getElementById("chatFab"),l=document.getElementById("chatLog"),t=document.getElementById("chatText"),s=document.getElementById("chatSend");b.onclick=function(){b.style.display="flex"};function go(){var v=t.value.trim();if(!v)return;add("me",v);t.value="";add("ai","...");fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:v})}).then(r=>r.json()).then(j=>{l.lastChild.textContent=j.reply}).catch(e=>{l.lastChild.textContent="Error"})}s.onclick=go;t.onkeydown=e=>{if(e.key==="Enter")go()};function add(r,t){var d=document.createElement("div");d.textContent=t;l.appendChild(d)}</script></body></html>';

const FALLBACK = [
  {k:["what","service","about"],a:"Starlink: P2 AI customer service, P7 silver travel, P8 comic tutorial, P1 employee hosting."},
  {k:["price","cost"],a:"P2: 9,800+4,800/mo. P7: 9,800+6,800/mo. P8: 299-2,980. Seed: 0+2,980/mo."},
  {k:["process","start"],a:"3 steps: 1.Chat 2.Diagnose(1d) 3.Launch(7d)."},
  {k:["contact","wechat"],a:"Fill form or chat AI (bottom right). 24/7 online."}
];

function fallback(m){
  m=(m||"").toLowerCase();
  for(var i=0;i<FALLBACK.length;i++)for(var j=0;j<FALLBACK[i].k.length;j++)if(m.indexOf(FALLBACK[i].k[j])!==-1)return FALLBACK[i].a;
  return "Thanks! We will contact you soon.";
}

const SYSTEM = "You are Starlink AI. Answer in the language user uses. Services: P2 AI customer service(9,800+4,800/mo), P7 silver travel(9,800+6,800/mo), P8 comic tutorial(299-2,980), P1 AI hosting(9,800+/mo).";

function callAPI(msg,cb){
  var postData=JSON.stringify({model:SF_MODEL,messages:[{role:"system",content:SYSTEM},{role:"user",content:msg}],temperature:0.3});
  var req=https.request({
    hostname:"api.siliconflow.cn",
    path:"/v1/chat/completions",
    method:"POST",
    headers:{"Content-Type":"application/json","Authorization":"Bearer "+SF_KEY,"Content-Length":Buffer.byteLength(postData)},
    timeout:30000
  },function(res){
    var data="";
    res.on("data",c=>data+=c);
    res.on("end",function(){
      console.log("[api] status:",res.statusCode,"len:",data.length);
      if(res.statusCode!==200){cb(new Error("API_"+res.statusCode),null);return}
      try{var j=JSON.parse(data);cb(null,j.choices[0].message.content)}catch(e){cb(e,null)}
    });
  });
  req.on("error",e=>{console.log("[api] error:",e.message);cb(e,null)});
  req.on("timeout",()=>{req.destroy();cb(new Error("Timeout"),null)});
  req.write(postData);
  req.end();
}

var server=http.createServer(function(req,res){
  console.log("[req]",req.method,req.url);
  
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods","GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers","Content-Type");

  if(req.method==="OPTIONS"){res.writeHead(200);res.end();return}

  if(req.method==="POST"&&req.url==="/api/chat"){
    var body="";
    req.on("data",c=>body+=c);
    req.on("end",function(){
      console.log("[chat] body:",body.substring(0,100));
      var msg="";
      try{msg=JSON.parse(body).message||""}catch(e){}
      if(!SF_KEY){
        res.setHeader("Content-Type","application/json");
        res.end(JSON.stringify({reply:fallback(msg)}));
        return;
      }
      callAPI(msg,function(err,reply){
        if(err){
          res.setHeader("Content-Type","application/json");
          res.end(JSON.stringify({reply:"Error: "+err.message}));
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
    req.on("data",c=>body+=c);
    req.on("end",function(){
      try{
        var d=JSON.parse(body);
        d.ts=new Date().toISOString();
        res.setHeader("Content-Type","application/json");
        res.end(JSON.stringify({ok:true,data:d}));
      }catch(e){
        res.setHeader("Content-Type","application/json");
        res.end(JSON.stringify({ok:false,error:e.message}));
      }
    });
    return;
  }

  res.setHeader("Content-Type","text/html; charset=utf-8");
  res.end(HTML);
});

server.listen(process.env.PORT||3000,function(){
  console.log("[ready] Server running");
});
