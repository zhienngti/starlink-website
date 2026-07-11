// Starlink AI Customer Service Backend
// Run: node server.js -> Open browser at http://localhost:3000
const http = require('http');
const https = require('https');

// Environment variables (multi-alias compatible)
const SF_KEY  = process.env.SILICONFLOW_API_KEY  || process.env.OPENAI_API_KEY || process.env.SILICONFLOW_KEY  || '';
const SF_BASE = process.env.SILICONFLOW_BASE_URL || process.env.OPENAI_BASE_URL || process.env.SILICONFLOW_BASE || 'https://api.siliconflow.cn/v1';
const SF_MODEL= process.env.SILICONFLOW_MODEL    || process.env.OPENAI_MODEL    || 'deepseek-ai/DeepSeek-V3';

console.log('[boot] SF_KEY length:', SF_KEY.length, '| SF_BASE:', SF_BASE, '| SF_MODEL:', SF_MODEL);

const HTML = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Starlink · All-AI Company</title>
<style>
  :root{--bg:#0b1020;--card:#141b2e;--accent:#5b8cff;--txt:#e8edf7;--sub:#9fb0cf}
  *{box-sizing:border-box}
  body{margin:0;font-family:system-ui,"PingFang SC","Microsoft YaHei",sans-serif;background:var(--bg);color:var(--txt)}
  header{padding:56px 24px 32px;text-align:center}
  h1{font-size:34px;margin:0 0 10px}
  .tag{color:var(--sub);max-width:680px;margin:0 auto;line-height:1.7}
  .cta{display:inline-block;margin-top:22px;padding:12px 26px;background:var(--accent);color:#fff;border-radius:10px;text-decoration:none;font-weight:600}
  section{max-width:980px;margin:0 auto;padding:28px 24px}
  h2{font-size:22px;border-left:4px solid var(--accent);padding-left:12px;margin-bottom:18px}
  .grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}
  .card{background:var(--card);border:1px solid #233;border-radius:14px;padding:18px}
  .card h3{margin:0 0 8px;font-size:17px}
  .card p{margin:0;color:var(--sub);line-height:1.6;font-size:14px}
  .price{font-weight:700;color:var(--accent)}
  footer{text-align:center;color:var(--sub);padding:30px;font-size:13px}
  #chatFab{position:fixed;right:22px;bottom:22px;width:60px;height:60px;border-radius:50%;background:var(--accent);color:#fff;border:none;font-size:26px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.4)}
  #chatBox{position:fixed;right:22px;bottom:92px;width:340px;max-width:92vw;height:460px;background:var(--card);border:1px solid #2a3550;border-radius:16px;display:none;flex-direction:column;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,.5)}
  #chatHead{padding:12px 14px;background:#1b2440;font-weight:600;display:flex;justify-content:space-between;align-items:center}
  #chatHead small{color:var(--sub);font-weight:400}
  #chatLog{flex:1;overflow:auto;padding:12px;font-size:14px;line-height:1.6}
  .msg{padding:8px 11px;border-radius:10px;margin-bottom:8px;max-width:85%}
  .me{background:var(--accent);margin-left:auto}
  .ai{background:#223;color:var(--txt)}
  #chatInput{display:flex;border-top:1px solid #2a3550}
  #chatInput input{flex:1;border:none;background:transparent;color:var(--txt);padding:12px;outline:none}
  #chatInput button{background:var(--accent);color:#fff;border:none;padding:0 18px;cursor:pointer}
</style>
</head>
<body>
<header>
  <h1>Starlink</h1>
  <p class="tag">Full-AI Employee Intelligent Company. Real delivery, not simulation. AI CEO leads the team to execute projects and post-project services. Chairman sets direction and makes decisions.</p>
  <a class="cta" href="#contact">Contact Us</a>
</header>

<section>
  <h2>Four Replicable Business Lines</h2>
  <div class="grid">
    <div class="card"><h3>1. AI Digital Employee Hosting</h3><p>Deploy trained AI employees + operation, 1 template x N clients.<span class="price"> CNY 9,800/month</span></p></div>
    <div class="card"><h3>2. AI Customer Service Operation</h3><p>RAG knowledge base + 7x24 multi-channel, 1 template x N clients.<span class="price"> Setup CNY 9,800 + Operation CNY 4,800/month</span></p></div>
    <div class="card"><h3>3. Vertical Content Matrix</h3><p>90-day closed-loop SOP x N verticals x N accounts.<span class="price"> Annual profit CNY 1.5M+</span></p></div>
    <div class="card"><h3>4. Short Video/Content Operation</h3><p>AI content factory SOP x N clients, market CNY 68B+.<span class="price"> CNY 8,000-30,000/month</span></p></div>
  </div>
</section>

<section>
  <h2>Our Methodology: Replication Engine</h2>
  <div class="grid">
    <div class="card"><h3>Build Once, Sell N Times</h3><p>Each new line first builds 1:N replicable templates/SOPs. New client = instantiation, not rebuild.</p></div>
    <div class="card"><h3>Three Insurance Against Obsolescence</h3><p>Originality (avoid IP issues) + private domain accumulation (reduce platform dependency) + legal compliance.</p></div>
    <div class="card"><h3>Full-AI Self-Sufficient</h3><p>AI CEO + AI team, zero human employees, marginal cost approaching zero.</p></div>
    <div class="card"><h3>Real Delivery</h3><p>Quantifiable KPIs: resolution rate above 85%, response under 5s, cost reduction above 50%.</p></div>
  </div>
</section>

<section id="contact">
  <h2>Become a Seed Client (First 3 Exclusives)</h2>
  <div class="card">
    <p>Setup fee <b style="color:var(--accent)">CNY 0</b> (was CNY 9,800). Operation trial <b style="color:var(--accent)">CNY 2,980/month</b> (was CNY 4,800). Live in 7 days. Chairman personally oversees quality.</p>
    <form id="leadForm" style="margin-top:12px;display:grid;gap:10px">
      <input id="lf_name" placeholder="Your name" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:var(--txt)"/>
      <input id="lf_company" placeholder="Company/Industry" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:var(--txt)"/>
      <input id="lf_contact" placeholder="WeChat/Phone" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:var(--txt)"/>
      <textarea id="lf_need" placeholder="Main customer service pain points" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:var(--txt);min-height:60px"></textarea>
      <button type="button" id="leadSend" style="padding:12px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">Apply for Seed Spot</button>
    </form>
    <p id="leadMsg" style="color:var(--accent);margin-top:8px"></p>
  </div>
  <p class="tag" style="margin-top:14px">Process: Diagnosis(1d) -> Knowledge Base(1-3d) -> Integration(3-5d) -> Live(7d) -> Operation(daily/weekly/monthly).</p>
</section>

<footer>Starlink Intelligent Technology Co., Ltd. · Full-AI Employees · AI CEO Operated</footer>

<button id="chatFab" title="AI Customer Service">AI</button>
<div id="chatBox">
  <div id="chatHead">Starlink · AI Customer Service <small>7x24 Online</small></div>
  <div id="chatLog"></div>
  <div id="chatInput"><input id="chatText" placeholder="Ask me anything..." /><button id="chatSend">Send</button></div>
</div>

<script>
const fab=document.getElementById('chatFab'),box=document.getElementById('chatBox'),
log=document.getElementById('chatLog'),txt=document.getElementById('chatText'),send=document.getElementById('chatSend');
fab.onclick=()=>{box.style.display=box.style.display==='flex'?'none':'flex';if(box.style.display==='flex'&&!log.dataset.hi){add('ai','Hello! I am Starlink AI Customer Service. Which service or cooperation model are you interested in?');log.dataset.hi=1;}};
function add(role,text){const d=document.createElement('div');d.className='msg '+(role==='me'?'me':'ai');d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;}
async function go(){const v=txt.value.trim();if(!v)return;add('me',v);txt.value='';add('ai','Thinking...');
 try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:v})});const j=await r.json();log.lastChild.textContent=j.reply;}
 catch(e){log.lastChild.textContent='Connection error. Please try again later.';}}
send.onclick=go;txt.onkeydown=e=>{if(e.key==='Enter')go();};
document.getElementById('leadSend').onclick=async()=>{
 const d={name:document.getElementById('lf_name').value,company:document.getElementById('lf_company').value,contact:document.getElementById('lf_contact').value,need:document.getElementById('lf_need').value};
 if(!d.contact){alert('Please leave your contact info');return;}
 try{const r=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const j=await r.json();document.getElementById('leadMsg').textContent=j.ok?'Received! We will contact you soon!' : 'Submission failed.';document.getElementById('leadForm').reset();}
 catch(e){document.getElementById('leadMsg').textContent='Network error. Please try again.';}
};
</script>
</body>
</html>`;

const FALLBACK=[
  {k:['what','company','business','about'],a:'Starlink is an all-AI employee intelligent company. We provide: AI customer service, AI digital employee hosting, content matrix, and content operation services.'},
  {k:['price','cost','how much','fee','quote'],a:'AI Customer Service: Setup CNY 9800 + Operation CNY 4800/month. AI Digital Employee Hosting: CNY 9800/month.'},
  {k:['cooperation','process','how to start','steps'],a:'Process: Diagnosis(1 day) -> Knowledge Base(1-3 days) -> Integration(3-5 days) -> Go Live(7 days) -> Operation(daily monitoring/weekly optimization/monthly report).'},
  {k:['real','simulation','reliable','fake'],a:'Real delivery, not simulation. Each service has KPIs (resolution rate >=85%, response <5s, cost reduction >=50%).'},
  {k:['advantage','difference','why','compare'],a:'All-AI employees, no human staff, replicable templates, marginal cost approaching zero.'},
  {k:['contact','consult','cooperation','wechat'],a:'Please leave your contact info or add us on WeChat. Our team will contact you soon.'}
];

function fallbackAnswer(m){
  m = (m||'').toLowerCase();
  for(const it of FALLBACK){ if(it.k.some(t=>m.includes(t))) return it.a; }
  return 'I am Starlink AI Customer Service (demo mode with built-in knowledge base). Ask me: what we do / pricing / cooperation process / real delivery verification.';
}

const PORT = process.env.PORT || 3000;

const SYSTEM = "You are Starlink AI Customer Service, available 24/7. Starlink is an all-AI employee intelligent company, real delivery, not simulation.\n" +
"Answer based on the following knowledge. For unknown or out-of-scope questions (involving private decisions/legal guarantees/privacy), politely transfer to human (reply 'Transferring to human consultant').\n" +
"[Products] Four business lines: 1) AI Digital Employee Hosting (CNY 9800/month) 2) AI Customer Service Operation (Setup CNY 9800 + Operation CNY 4800/month) 3) Vertical Content Matrix + Knowledge Monetization (Annual profit CNY 1.5M+) 4) Short Video/Content Operation (CNY 8000-30000/month).\n" +
"[Process] Diagnosis(1 day) -> Knowledge Base(1-3 days) -> Integration(3-5 days) -> Go Live(7 days) -> Operation(daily monitoring/weekly optimization/monthly report).\n" +
"[Advantages] All-AI employees, no human staff, replicable templates, marginal cost approaching zero.\n" +
"[KPIs] Resolution rate >=85%, response <5s, cost reduction >=50%.\n" +
"Tone: professional, concise, enthusiastic.";

function callSiliconFlow(message, callback) {
  const apiUrl = new URL(SF_BASE + '/chat/completions');
  const postData = JSON.stringify({
    model: SF_MODEL,
    messages: [{role:'system',content:SYSTEM},{role:'user',content:message}],
    temperature: 0.3,
    stream: false
  });

  const options = {
    hostname: apiUrl.hostname,
    path: apiUrl.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SF_KEY,
      'Content-Length': Buffer.byteLength(postData)
    },
    timeout: 60000
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => { data += chunk; });
    res.on('end', () => {
      try {
        const j = JSON.parse(data);
        if (res.statusCode !== 200) {
          console.error('[api] HTTP', res.statusCode, data.slice(0,300));
          callback(new Error('HTTP ' + res.statusCode), null);
          return;
        }
        const reply = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : 'Temporarily unable to answer, please try again later.';
        callback(null, reply);
      } catch (e) {
        callback(e, null);
      }
    });
  });

  req.on('error', (e) => { callback(e, null); });
  req.on('timeout', () => { req.destroy(); callback(new Error('Timeout'), null); });

  req.write(postData);
  req.end();
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/api/chat') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      let message = '';
      try { const j = JSON.parse(body); message = j.message || ''; } catch(e) {}

      if (!SF_KEY) {
        const reply = fallbackAnswer(message);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({reply}));
        return;
      }

      callSiliconFlow(message, (err, reply) => {
        if (err) {
          console.error('[api] err:', err.message);
          const msg = err.message === 'Timeout' ? 'Response timeout (>60s), please try a shorter question.' : 'Connection error, please try again later.';
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({reply: msg}));
          return;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({reply}));
      });
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/api/lead') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => {
      try {
        const d = JSON.parse(body);
        const fs = require('fs');
        const path = require('path');
        d.ts = new Date().toISOString();
        const fp = path.join(__dirname, 'leads.json');
        const arr = fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp, 'utf8')) : [];
        arr.push(d);
        fs.writeFileSync(fp, JSON.stringify(arr, null, 2));
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ok: true}));
      } catch(e) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ok: false}));
      }
    });
    return;
  }

  res.end(HTML);
});

server.listen(PORT, () => {
  console.log('Starlink website + AI service started: http://localhost:' + PORT);
});
