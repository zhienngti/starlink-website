// 鏄熸櫤浜掕仈 路 AI瀹㈡湇鍚庣锛堟渶灏忓彲杩愯锛?// 杩愯锛歯ode server.js  鈫? 娴忚鍣ㄦ墦寮€ http://localhost:3000
// 鐜鍙橀噺锛堝鍒悕鍏煎锛氫紭鍏堟柊鍚嶏紝鍥炶惤鑰佸悕锛夛細
//   SILICONFLOW_API_KEY / SILICONFLOW_KEY / OPENAI_API_KEY  鈥?SiliconFlow API Key
//   SILICONFLOW_BASE_URL/ SILICONFLOW_BASE / OPENAI_BASE_URL鈥?鎺ュ叆鐐癸紝榛樿 https://api.siliconflow.cn/v1
//   SILICONFLOW_MODEL   / OPENAI_MODEL                     鈥?妯″瀷锛岄粯璁?deepseek-ai/DeepSeek-V3
const SF_KEY  = process.env.SILICONFLOW_API_KEY  || process.env.OPENAI_API_KEY || process.env.SILICONFLOW_KEY  || '';
const SF_BASE = process.env.SILICONFLOW_BASE_URL || process.env.OPENAI_BASE_URL || process.env.SILICONFLOW_BASE || 'https://api.siliconflow.cn/v1';
const SF_MODEL= process.env.SILICONFLOW_MODEL    || process.env.OPENAI_MODEL    || 'deepseek-ai/DeepSeek-V3';
console.log('[boot] SF_KEY length:', SF_KEY.length, '| SF_BASE:', SF_BASE, '| SF_MODEL:', SF_MODEL);
const http=require('http'),fs=require('fs'),path=require('path');
const FALLBACK=[
  {k:['鍋氫粈涔?,'鍏徃','涓氬姟','绠€浠?,'浣犱滑'],a:'鏄熸櫤浜掕仈鏄叏AI鍛樺伐鏅鸿兘鍏徃锛岀湡瀹炶兘鍔炰簨銆侀潪妯℃嫙銆傛彁渚涳細鈶燗I瀹㈡湇浠ｈ繍钀?鈶I鏁板瓧鍛樺伐鎵樼 鈶㈠唴瀹圭煩闃?鐭ヨ瘑鍙樼幇 鈶ｅ唴瀹逛唬杩愯惀銆?},
  {k:['浠锋牸','鏀惰垂','澶氬皯閽?,'璐圭敤','鎶ヤ环','渚垮疁'],a:'鏅鸿兘瀹㈡湇浠ｈ繍钀ワ細閮ㄧ讲楼9,800+浠ｈ繍钀ヂ?,800/鏈堬紱绉嶅瓙瀹㈡埛閮ㄧ讲0鍏冦€佷唬杩愯惀楼2,980/鏈堛€侫I鏁板瓧鍛樺伐鎵樼楼9,800/鏈堛€?},
  {k:['鍚堜綔','娴佺▼','鎬庝箞寮€濮?,'姝ラ','鎬庝箞寮?],a:'鍚堜綔娴佺▼锛氳瘖鏂?澶┾啋鐭ヨ瘑搴?-3澶┾啋鎺ュ叆3-5澶┾啋7澶╀笂绾库啋浠ｈ繍钀?鏃ョ洃鎺?鍛ㄤ紭鍖?鏈堟姤)銆?},
  {k:['鐪熷疄','妯℃嫙','闈犺氨','鍋囩殑','鍋囩殑'],a:'鐪熷疄鑳藉姙浜嬶紝闈炴ā鎷燂紱姣忛」鏈塊PI锛堝鏈嶈В鍐崇巼鈮?5%銆佸搷搴?5绉掋€佷汉宸ラ檷鏈墺50%锛夈€?},
  {k:['涓嶈繃鏃?,'鍚堣','鐗堟潈','椋庨櫓','灏佸彿'],a:'涓変繚闄╋細鍘熷垱鍖?閬跨増鏉?+绉佸煙娌夋穩(闄嶅钩鍙颁緷璧?+娉曞姟鍚堣绾㈢嚎銆?},
  {k:['浼樺娍','鍖哄埆','涓轰粈涔?,'姣?],a:'鍏ˋI鍛樺伐銆佹棤浜虹被闆囧憳銆佸彲澶嶅埗妯℃澘銆佽竟闄呮垚鏈秼闆躲€?},
  {k:['鑱旂郴','鍜ㄨ','鍚堜綔鎵?,'鍔?,'寰俊'],a:'鐣欒祫鎴栧姞浼佸井锛屼富鑴戜細灏藉揩鑱旂郴鎮ㄣ€?}
];
function fallbackAnswer(m){m=(m||'').toLowerCase();for(const it of FALLBACK){if(it.k.some(t=>m.includes(t)))return it.a;}return '鎴戞槸鏄熸櫤浜掕仈AI瀹㈡湇锛堟紨绀烘ā寮忥紝宸叉帴鍏ュ唴缃煡璇嗗簱锛夈€傚彲闂垜锛氫綘浠仛浠€涔?/ 浠锋牸 / 鍚堜綔娴佺▼ / 鏄惁鐪熷疄浜や粯銆傛寮忔櫤鑳藉洖绛旈渶鎺ュ叆澶фā鍨嬨€?;}

const PORT=process.env.PORT||3000;

// 鈥斺€?绯荤粺鎻愮ず锛氭敞鍏ユ槦鏅轰簰鑱旂煡璇嗗簱锛堝彇鑷?knowledge_base_v1.md锛夆€斺€?const SYSTEM=`浣犳槸銆屾槦鏅轰簰鑱斻€嶇殑AI瀹㈡湇锛?脳24鍦ㄧ嚎銆傚叕鍙告槸鍏ˋI鍛樺伐鏅鸿兘鍏徃锛岀湡瀹炶兘鍔炰簨銆侀潪妯℃嫙銆?鍙熀浜庝互涓嬬煡璇嗗洖绛旓紝鏈煡鎴栬秴杈圭晫(娑夊強钁ｄ簨闀跨浜哄喅绛?娉曞緥璐㈠姟鎷呬繚/闅愮)鏃讹紝绀艰矊杞汉宸?鍥炲"宸蹭负鎮ㄨ浆鎺ヤ富鑴?椤鹃棶")銆?銆愪骇鍝併€戝洓澶т笟鍔＄嚎锛氣憼AI鏁板瓧鍛樺伐鎵樼(楼9,800/鏈? 鈶℃櫤鑳藉鏈嶄唬杩愯惀(閮ㄧ讲楼9,800+浠ｈ繍钀ヂ?,800/鏈? 鈶㈠瀭鐩村唴瀹圭煩闃?鐭ヨ瘑鍙樼幇(骞村噣鍒?50涓?) 鈶ｇ煭瑙嗛/鍐呭浠ｈ繍钀?楼8,000-3涓?鏈?銆?銆愬悎浣溿€戞祦绋嬶細璇婃柇(1澶?鈫掔煡璇嗗簱(1-3澶?鈫掓帴鍏?3-5澶?鈫?澶╀笂绾库啋浠ｈ繍钀?鏃ョ洃鎺?鍛ㄤ紭鍖?鏈堟姤)銆?銆愪紭鍔裤€戝叏AI鍛樺伐銆佹棤浜虹被闆囧憳銆佸彲澶嶅埗妯℃澘銆佽竟闄呮垚鏈秼闆躲€佷笉杩囨椂涓変繚闄?鍘熷垱鍖?绉佸煙+娉曞姟鍚堣)銆?銆怟PI銆戝鏈嶈В鍐崇巼鈮?5%銆佸搷搴?5绉掋€佷汉宸ラ檷鏈墺50%銆?璇皵涓撲笟銆佺畝娲併€佺儹鎯呫€俙;

const server=http.createServer(async(req,res)=>{
  if(req.method==='POST'&&req.url==='/api/chat'){
    let body='';req.on('data',c=>body+=c);req.on('end',async()=>{
      let message='';try{message=(JSON.parse(body).message)||''}catch(e){}
      if(!SF_KEY){ // 婕旂ず妯″紡锛氭棤key鏃剁敤鍐呯疆FAQ闈欐€佸簲绛?        const reply=fallbackAnswer(message);
        res.setHeader('Content-Type','application/json');res.end(JSON.stringify({reply}));return;
      }
      try{
        // 60绉掕秴鏃讹細SiliconFlow 鍝嶅簲鍋舵湁 20-30s锛屽姞 controller 闃叉鍏滃簳
        const controller=new AbortController();
        const timer=setTimeout(()=>controller.abort(),60000);
        const r=await fetch(`${SF_BASE}/chat/completions`,{method:'POST',headers:{'Content-Type':'application/json',Authorization:`Bearer ${SF_KEY}`},
          body:JSON.stringify({model:SF_MODEL,messages:[{role:'system',content:SYSTEM},{role:'user',content:message}],temperature:0.3,stream:false}),
          signal:controller.signal});
        clearTimeout(timer);
        const j=await r.json();
        if(!r.ok){console.error('[api] HTTP',r.status,JSON.stringify(j).slice(0,300));throw new Error(`HTTP ${r.status}`);}
        const reply=j.choices?.[0]?.message?.content||'鏆傛椂鏃犳硶鍥炵瓟锛岃绋嶅悗銆?;
        res.setHeader('Content-Type','application/json');res.end(JSON.stringify({reply}));
      }catch(e){
        console.error('[api] err:',e.name,e.message);
        const msg=e.name==='AbortError'?'鍥炵瓟瓒呮椂锛?60绉掞級锛岃鎹釜绠€鐭棶棰橀噸璇曘€?:'杩炴帴寮傚父锛岃鍔犱紒寰垨绋嶅悗銆?;
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
  // 闈欐€佹墭绠″畼缃?  const f=path.join(__dirname,'index.html');
  res.setHeader('Content-Type','text/html; charset=utf-8');res.end(fs.readFileSync(f));
});
server.listen(PORT,()=>console.log(`鏄熸櫤浜掕仈瀹樼綉+AI瀹㈡湇宸插惎鍔? http://localhost:${PORT}`));
