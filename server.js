// Starlink AI Customer Service Backend v3.0
// 2026-07-11 | Pure ASCII version for CloudBase container
const http = require('http');
const https = require('https');

const SF_KEY  = process.env.SILICONFLOW_API_KEY  || process.env.OPENAI_API_KEY || process.env.SILICONFLOW_KEY  || '';
const SF_BASE = process.env.SILICONFLOW_BASE_URL || process.env.OPENAI_BASE_URL || process.env.SILICONFLOW_BASE || 'https://api.siliconflow.cn/v1';
const SF_MODEL= process.env.SILICONFLOW_MODEL    || process.env.OPENAI_MODEL    || 'deepseek-ai/DeepSeek-V3';

console.log('[boot] SF_KEY length:', SF_KEY.length, '| SF_BASE:', SF_BASE, '| SF_MODEL:', SF_MODEL);

const HTML = `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Starlink - All-AI Company</title>
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
.badge{display:inline-block;background:#ff6b6b;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;margin-left:8px}
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
<p class="tag">All-AI Employee Intelligent Company. Real delivery, not simulation. AI CEO leads team execution. Chairman sets direction and makes decisions.</p>
<a class="cta" href="#contact">Contact Us</a>
</header>
<section>
<h2>Core Services</h2>
<div class="grid">
<div class="card"><h3>P2 - AI Customer Service Operation <span class="badge">Hot</span></h3><p>Knowledge base + multi-channel deployment + 24/7 operation. Launch in 2 weeks, cut costs by 50%.<span class="price"> CNY 9,800 + 4,800/month</span></p></div>
<div class="card"><h3>P7 - AI Silver Travel Service</h3><p>AI customer service + content team for senior travel agencies. Supports voice input, 24/7 availability.<span class="price"> CNY 9,800 + 6,800/month</span></p></div>
<div class="card"><h3>P8 - AI Comic Drama Tutorial</h3><p>Learn AI comic video creation in 7 days. No prior skills needed.<span class="price"> CNY 299-2,980</span></p></div>
<div class="card"><h3>P1 - AI Digital Employee Hosting</h3><p>Subscribe monthly to have your own AI department. Customer service, sales, operations, finance.<span class="price"> CNY 9,800+/month</span></p></div>
</div>
</section>
<section>
<h2>Why Choose Us</h2>
<div class="grid">
<div class="card"><h3>All-AI Team</h3><p>Company run by AI executives and teams. 24/7 operation, near-zero marginal cost, competitive pricing.</p></div>
<div class="card"><h3>Measurable Delivery</h3><p>Every service has KPI commitments: resolution rate &gt;=85%, response &lt;5s, cost reduction &gt;=50%.</p></div>
<div class="card"><h3>Replication Engine</h3><p>Build once, sell N times. New client = instantiate template, not reinvent. Maximum efficiency.</p></div>
<div class="card"><h3>7-Day Launch</h3><p>Diagnosis(1d) &gt; Knowledge Base(1-3d) &gt; Deployment(3-5d) &gt; Launch(Day 7) &gt; Ongoing Operation.</p></div>
</div>
</section>
<section id="contact">
<h2>Seed Client Program (First 3 Only)</h2>
<div class="card">
<p>Setup fee <b style="color:var(--accent)">CNY 0</b> (was CNY 9,800). Trial operation <b style="color:var(--accent)">CNY 2,980/month</b> (was CNY 4,800). Launch in 7 days. Chairman personally oversees quality.</p>
<form id="leadForm" style="margin-top:12px;display:grid;gap:10px">
<input id="lf_name" placeholder="Your Name" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:var(--txt)"/>
<input id="lf_company" placeholder="Company/Industry" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:var(--txt)"/>
<input id="lf_contact" placeholder="WeChat/Phone" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:var(--txt)"/>
<textarea id="lf_need" placeholder="Main customer service pain points" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:var(--txt);min-height:60px"></textarea>
<button type="button" id="leadSend" style="padding:12px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">Apply for Seed Spot</button>
</form>
<p id="leadMsg" style="color:var(--accent);margin-top:8px"></p>
</div>
<p class="tag" style="margin-top:14px">Process: Diagnosis(1d) &gt; Knowledge Base(1-3d) &gt; Deployment(3-5d) &gt; Launch(Day 7) &gt; Ongoing Operation.</p>
</section>
<footer>Starlink Intelligent Technology Co., Ltd. - All-AI Employees - AI CEO Operated</footer>
<button id="chatFab" title="AI Customer Service">AI</button>
<div id="chatBox">
<div id="chatHead">Starlink AI Customer Service <small>24/7 Online</small></div>
<div id="chatLog"></div>
<div id="chatInput"><input id="chatText" placeholder="Ask me anything..." /><button id="chatSend">Send</button></div>
</div>
<script>
const fab=document.getElementById('chatFab'),box=document.getElementById('chatBox'),log=document.getElementById('chatLog'),txt=document.getElementById('chatText'),send=document.getElementById('chatSend');
fab.onclick=()=>{box.style.display=box.style.display==='flex'?'none':'flex';if(box.style.display==='flex'&&!log.dataset.hi){add('ai','Hello! I am Starlink AI Customer Service. Ask me about: AI customer service / silver travel / comic tutorial / pricing / process.');log.dataset.hi=1;}};
function add(role,text){const d=document.createElement('div');d.className='msg '+(role==='me'?'me':'ai');d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;}
async function go(){const v=txt.value.trim();if(!v)return;add('me',v);txt.value='';add('ai','Thinking...');
try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:v})});const j=await r.json();log.lastChild.textContent=j.reply;}
catch(e){log.lastChild.textContent='Connection error. Please try again later.';}}
send.onclick=go;txt.onkeydown=e=>{if(e.key==='Enter')go();};
document.getElementById('leadSend').onclick=async()=>{
const d={name:document.getElementById('lf_name').value,company:document.getElementById('lf_company').value,contact:document.getElementById('lf_contact').value,need:document.getElementById('lf_need').value};
if(!d.contact){alert('Please leave your contact info');return;}
try{const r=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const j=await r.json();document.getElementById('leadMsg').textContent=j.ok?'Received! We will contact you soon.' : 'Submission failed.';document.getElementById('leadForm').reset();}
catch(e){document.getElementById('leadMsg').textContent='Network error. Please try again.';}};
</script>
</body>
</html>`;

const FALLBACK=[
  {k:['what','service','about','company','business'],a:'Starlink is an all-AI employee intelligent company. We provide: AI customer service operation, AI digital employee hosting, AI silver travel service, AI comic drama tutorials. Features: real delivery, AI CEO leadership, near-zero marginal cost, competitive pricing.'},
  {k:['price','cost','how much','fee'],a:'AI Customer Service: Setup CNY 9,800 + Operation CNY 4,800/month (Seed client: Setup 0 + 2,980/month). Silver Travel AI: CNY 9,800 + 6,800/month. Comic Tutorial: CNY 299-2,980.'},
  {k:['process','how to start','steps','cooperation'],a:'Three steps: 1. Fill the form or chat with us 2. We provide diagnosis in 1 business day 3. Sign and launch in 7 days. Process: Diagnosis(1d) -> Knowledge Base(1-3d) -> Deployment(3-5d) -> Launch(Day 7) -> Ongoing Operation.'},
  {k:['customer service','P2','AI service'],a:'We deploy and operate AI customer service for businesses. Includes: knowledge base construction, multi-channel deployment (WeChat/Douyin/Web/Mini-program), 24/7 auto-response, daily monitoring, weekly optimization, monthly reports. Launch in 2 weeks, cut costs by 50%.'},
  {k:['silver','senior','travel','P7','elderly'],a:'We provide AI solutions for senior travel agencies: AI Silver Customer Service (understands elderly, supports voice, 24/7), AI Silver Content Team (travel guides, health tips, retirement life content), AI Elderly Care Training Assistant.'},
  {k:['comic','tutorial','P8','drama'],a:'AI Comic Drama Tutorial: Learn to create comic-style videos with AI in 7 days. No prior skills needed. Intro course CNY 299, Toolkit CNY 980, Annual community CNY 2,980. After completion: run your own accounts, freelance, or side business.'},
  {k:['reliable','real','not simulation','trust'],a:'Real delivery with measurable KPIs: resolution rate >=85%, response <5s, cost reduction >=50%. Seed clients get 1-month trial, cancel anytime if not satisfied.'},
  {k:['advantage','why','difference'],a:'Three advantages: 1. All-AI team (24/7 work, ultra-low cost) 2. Measurable delivery (KPI commitments) 3. Replication engine methodology (build once, sell N times).'},
  {k:['trial','seed'],a:'Seed Client Program: First 3 companies get Setup fee CNY 0 (was 9,800), Operation CNY 2,980/month (was 4,800). 1-month trial, cancel anytime if not satisfied.'},
  {k:['contact','wechat','phone'],a:'Fill the form at the bottom of this page, or chat with our AI customer service (bottom right corner). Our AI team is online 24/7 and will contact you soon.'}
];

function fallbackAnswer(m){
  m = (m||'').toLowerCase();
  for(const it of FALLBACK){ if(it.k.some(t=>m.includes(t))) return it.a; }
  return 'Thank you for your inquiry! Your question has been recorded and we will contact you soon. You can also fill the form at the bottom of this page for priority handling.';
}

const PORT = process.env.PORT || 3000;

const SYSTEM = "You are Starlink AI Customer Service, available 24/7. Starlink is an all-AI employee intelligent company, real delivery, not simulation.\n\n" +
"[Company] All-AI team led by AI CEO. Chairman sets direction. 24/7 operation, near-zero marginal cost, competitive pricing.\n\n" +
"[Core Services]\n" +
"1. P2 AI Customer Service Operation: Knowledge base + multi-channel deployment + 24/7 operation. Launch in 2 weeks, cut costs 50%. Price: Setup CNY 9,800 + Operation CNY 4,800/month. Seed client: Setup 0 + 2,980/month (first 3 only).\n" +
"2. P7 AI Silver Travel Service: For senior travel agencies. AI customer service (understands elderly, voice support, 24/7), AI content team (travel guides, health tips). Price: CNY 9,800 + 6,800/month.\n" +
"3. P8 AI Comic Drama Tutorial: Learn AI comic video creation in 7 days. No prior skills needed. Intro CNY 299, Toolkit CNY 980, Community CNY 2,980/year.\n" +
"4. P1 AI Digital Employee Hosting: Monthly subscription for your own AI department. CNY 9,800+/month.\n\n" +
"[Process] Diagnosis(1d) -> Knowledge Base(1-3d) -> Deployment(3-5d) -> Launch(Day 7) -> Ongoing Operation.\n\n" +
"[KPIs] Resolution rate >=85%, response <5s, cost reduction >=50%.\n\n" +
"[Compliance] No medical advice, no investment advice, no exaggerated claims. For such questions, reply: 'This requires human consultation. Let me transfer you.'\n\n" +
"Style: Professional, concise, enthusiastic. Answer in the language the user asks in.";

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
        const reply = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : 'Temporarily unable to answer. Please try again later.';
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
          const msg = err.message === 'Timeout' ? 'Response timeout (>60s). Please try a shorter question.' : 'Connection error. Please try again later.';
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
