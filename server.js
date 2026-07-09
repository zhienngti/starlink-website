// 星智互联 · AI客服后端（最小可运行）
// 运行：node server.js  →  浏览器打开 http://localhost:3000
// 环境变量（多别名兼容：优先新名，回落老名）：
//   SILICONFLOW_API_KEY / SILICONFLOW_KEY / OPENAI_API_KEY  — SiliconFlow API Key
//   SILICONFLOW_BASE_URL/ SILICONFLOW_BASE / OPENAI_BASE_URL— 接入点，默认 https://api.siliconflow.cn/v1
//   SILICONFLOW_MODEL   / OPENAI_MODEL                     — 模型，默认 deepseek-ai/DeepSeek-V3
const SF_KEY  = process.env.SILICONFLOW_API_KEY  || process.env.OPENAI_API_KEY || process.env.SILICONFLOW_KEY  || '';
const SF_BASE = process.env.SILICONFLOW_BASE_URL || process.env.OPENAI_BASE_URL || process.env.SILICONFLOW_BASE || 'https://api.siliconflow.cn/v1';
const SF_MODEL= process.env.SILICONFLOW_MODEL    || process.env.OPENAI_MODEL    || 'deepseek-ai/DeepSeek-V3';
console.log('[boot] SF_KEY length:', SF_KEY.length, '| SF_BASE:', SF_BASE, '| SF_MODEL:', SF_MODEL);
const http=require('http'),fs=require('fs'),path=require('path');
const FALLBACK=[
  {k:['做什么','公司','业务','简介','你们'],a:'星智互联是全AI员工智能公司，真实能办事、非模拟。提供：①AI客服代运营 ②AI数字员工托管 ③内容矩阵+知识变现 ④内容代运营。'},
  {k:['价格','收费','多少钱','费用','报价','便宜'],a:'智能客服代运营：部署¥9,800+代运营¥4,800/月；种子客户部署0元、代运营¥2,980/月。AI数字员工托管¥9,800/月。'},
  {k:['合作','流程','怎么开始','步骤','怎么弄'],a:'合作流程：诊断1天→知识库1-3天→接入3-5天→7天上线→代运营(日监控/周优化/月报)。'},
  {k:['真实','模拟','靠谱','假的','假的'],a:'真实能办事，非模拟；每项有KPI（客服解决率≥85%、响应<5秒、人工降本≥50%）。'},
  {k:['不过时','合规','版权','风险','封号'],a:'三保险：原创化(避版权)+私域沉淀(降平台依赖)+法务合规红线。'},
  {k:['优势','区别','为什么','比'],a:'全AI员工、无人类雇员、可复制模板、边际成本趋零。'},
  {k:['联系','咨询','合作找','加','微信'],a:'留资或加企微，主脑会尽快联系您。'}
];
function fallbackAnswer(m){m=(m||'').toLowerCase();for(const it of FALLBACK){if(it.k.some(t=>m.includes(t)))return it.a;}return '我是星智互联AI客服（演示模式，已接入内置知识库）。可问我：你们做什么 / 价格 / 合作流程 / 是否真实交付。正式智能回答需接入大模型。';}

const PORT=process.env.PORT||3000;

// —— 系统提示：注入星智互联知识库（取自 knowledge_base_v1.md）——
const SYSTEM=`你是「星智互联」的AI客服，7×24在线。公司是全AI员工智能公司，真实能办事、非模拟。
只基于以下知识回答，未知或超边界(涉及董事长私人决策/法律财务担保/隐私)时，礼貌转人工(回复"已为您转接主脑/顾问")。
【产品】四大业务线：①AI数字员工托管(¥9,800/月) ②智能客服代运营(部署¥9,800+代运营¥4,800/月) ③垂直内容矩阵+知识变现(年净利150万+) ④短视频/内容代运营(¥8,000-3万/月)。
【合作】流程：诊断(1天)→知识库(1-3天)→接入(3-5天)→7天上线→代运营(日监控/周优化/月报)。
【优势】全AI员工、无人类雇员、可复制模板、边际成本趋零、不过时三保险(原创化+私域+法务合规)。
【KPI】客服解决率≥85%、响应<5秒、人工降本≥50%。
语气专业、简洁、热情。`;

const server=http.createServer(async(req,res)=>{
  if(req.method==='POST'&&req.url==='/api/chat'){
    let body='';req.on('data',c=>body+=c);req.on('end',async()=>{
      let message='';try{message=(JSON.parse(body).message)||''}catch(e){}
      if(!SF_KEY){ // 演示模式：无key时用内置FAQ静态应答
        const reply=fallbackAnswer(message);
        res.setHeader('Content-Type','application/json');res.end(JSON.stringify({reply}));return;
      }
      try{
        // 60秒超时：SiliconFlow 响应偶有 20-30s，加 controller 防止兜底
        const controller=new AbortController();
        const timer=setTimeout(()=>controller.abort(),60000);
        const r=await fetch(`${SF_BASE}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${SF_KEY}`},
          body:JSON.stringify({model:SF_MODEL,messages:[{role:'system',content:SYSTEM},{role:'user',content:message}],temperature:0.3,stream:false}),
          signal:controller.signal});
        clearTimeout(timer);
        const j=await r.json();
        if(!r.ok){console.error('[api] HTTP',r.status,JSON.stringify(j).slice(0,300));throw new Error(`HTTP ${r.status}`);}
        const reply=j.choices?.[0]?.message?.content||'暂时无法回答，请稍后。';
        res.setHeader('Content-Type','application/json');res.end(JSON.stringify({reply}));
      }catch(e){
        console.error('[api] err:',e.name,e.message);
        const msg=e.name==='AbortError'?'回答超时（>60秒），请换个简短问题重试。':'连接异常，请加企微或稍后。';
        res.setHeader('Content-Type','application/json');res.end(JSON.stringify({reply:msg}));
      }
    });return;
  }
  if(req.method==='POST'&&req.url==='/api/lead'){
    let body='';req.on('data',c=>body+=c);req.on('end',()=>{
      try{const d=JSON.parse(body);d.ts=new Date().toISOString();
        const fp=path.join(__dirname,'leads.json');const arr=fs.existsSync(fp)?JSON.parse(fs.readFileSync(fp)):[];arr.push(d);fs.writeFileSync(fp,JSON.stringify(arr,null,2));
        res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:true}));
      }catch(e){res.setHeader('Content-Type','application/json');res.end(JSON.stringify({ok:false}));}
    });return;
  }
  // 静态托管官网
  const f=path.join(__dirname,'index.html');
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync(f));
});
server.listen(PORT,()=>console.log(`星智互联官网+AI客服已启动: http://localhost:${PORT}`));
