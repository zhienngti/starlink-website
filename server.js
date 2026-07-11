// Starlink AI Customer Service Backend
// Run: node server.js -> Open browser at http://localhost:3000
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Environment variables (multi-alias compatible)
const SF_KEY  = process.env.SILICONFLOW_API_KEY  || process.env.OPENAI_API_KEY || process.env.SILICONFLOW_KEY  || '';
const SF_BASE = process.env.SILICONFLOW_BASE_URL || process.env.OPENAI_BASE_URL || process.env.SILICONFLOW_BASE || 'https://api.siliconflow.cn/v1';
const SF_MODEL= process.env.SILICONFLOW_MODEL    || process.env.OPENAI_MODEL    || 'deepseek-ai/DeepSeek-V3';

console.log('[boot] SF_KEY length:', SF_KEY.length, '| SF_BASE:', SF_BASE, '| SF_MODEL:', SF_MODEL);

const FALLBACK=[
  {k:['what','company','business','about'],a:'Starlink is an all-AI employee intelligent company. We provide: AI customer service, AI digital employee hosting, content matrix, and content operation services.'},
  {k:['price','cost','how much','fee','quote'],a:'AI Customer Service: Setup $9800 + Operation $4800/month. AI Digital Employee Hosting: $9800/month.'},
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

const SYSTEM = `You are Starlink AI Customer Service, available 24/7. Starlink is an all-AI employee intelligent company, real delivery, not simulation.
Answer based on the following knowledge. For unknown or out-of-scope questions (involving private decisions/legal guarantees/privacy), politely transfer to human (reply "Transferring to human consultant").
[Products] Four business lines: 1) AI Digital Employee Hosting ($9800/month) 2) AI Customer Service Operation (Setup $9800 + Operation $4800/month) 3) Vertical Content Matrix + Knowledge Monetization (Annual profit $150K+) 4) Short Video/Content Operation ($8000-30000/month).
[Process] Diagnosis(1 day) -> Knowledge Base(1-3 days) -> Integration(3-5 days) -> Go Live(7 days) -> Operation(daily monitoring/weekly optimization/monthly report).
[Advantages] All-AI employees, no human staff, replicable templates, marginal cost approaching zero.
[KPIs] Resolution rate >=85%, response <5s, cost reduction >=50%.
Tone: professional, concise, enthusiastic.`;

function callSiliconFlow(message, callback) {
  const apiUrl = new URL(`${SF_BASE}/chat/completions`);
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
      'Authorization': `Bearer ${SF_KEY}`,
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
          callback(new Error(`HTTP ${res.statusCode}`), null);
          return;
        }
        const reply = j.choices?.[0]?.message?.content || 'Temporarily unable to answer, please try again later.';
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
      try { message = JSON.parse(body).message || ''; } catch(e) {}

      if (!SF_KEY) {
        const reply = fallbackAnswer(message);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({reply}));
        return;
      }

      callSiliconFlow(message, (err, reply) => {
        if (err) {
          console.error('[api] err:', err.message);
          const msg = err.message === 'Timeout' ? 'Response timeout (>60s), please try a shorter question.' : 'Connection error, please add WeChat or try again later.';
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
        d.ts = new Date().toISOString();
        const fp = path.join(__dirname, 'leads.json');
        const arr = fs.existsSync(fp) ? JSON.parse(fs.readFileSync(fp)) : [];
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

  const f = path.join(__dirname, 'index.html');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(fs.readFileSync(f, 'utf8'));
});

server.listen(PORT, () => {
  console.log(`Starlink website + AI service started: http://localhost:${PORT}`);
});
