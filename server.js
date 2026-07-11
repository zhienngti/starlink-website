// Starlink AI Customer Service Backend v2.0
// 2026-07-11 | Knowledge Base: P2 + P7 + P8
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
<title>鏄熸櫤浜掕仈 路 鍏ˋI鍛樺伐鏅鸿兘鍏徃</title>
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
  <h1>鏄熸櫤浜掕仈</h1>
  <p class="tag">鍏ˋI鍛樺伐鏅鸿兘鍏徃 路 鐪熷疄浜や粯锛屼笉鏄ā鎷熴€侫I CEO甯﹂槦鎵ц椤圭洰涓庡敭鍚庢湇鍔★紝钁ｄ簨闀垮畾鏂瑰悜鍋氬喅绛栥€?/p>
  <a class="cta" href="#contact">绔嬪嵆鍜ㄨ</a>
</header>

<section>
  <h2>鏍稿績鏈嶅姟</h2>
  <div class="grid">
    <div class="card"><h3>P2 路 AI瀹㈡湇浠ｈ繍钀?<span class="badge">鐑帹</span></h3><p>鐭ヨ瘑搴撴瀯寤?澶氭笭閬撻儴缃?7x24杩愯惀锛屼袱鍛ㄤ笂绾匡紝瀹㈡湇鎴愭湰鐮嶅崐銆?span class="price"> 楼9,800+楼4,800/鏈?/span></p></div>
    <div class="card"><h3>P7 路 AI閾跺彂鏃呮父鏈嶅姟</h3><p>鎳傝€佸勾浜虹殑AI瀹㈡湇+鍐呭鍥㈤槦锛岃€佸勾鏃呮父绀句笓灞炴柟妗堛€?span class="price"> 楼9,800+楼6,800/鏈?/span></p></div>
    <div class="card"><h3>P8 路 AI婕墽鍒朵綔鏁欑▼</h3><p>闆跺熀纭€7澶╁浼欰I婕墽鍒朵綔锛屽壇涓氬彉鐜版柊璧涢亾銆?span class="price"> 楼299-2,980</span></p></div>
    <div class="card"><h3>P1 路 AI鏁板瓧鍛樺伐鎵樼</h3><p>鎸夋湀璁㈤槄锛屾嫢鏈夎嚜宸辩殑AI閮ㄩ棬銆傚鏈?閿€鍞?杩愯惀/璐㈠姟鍏ㄨ鐩栥€?span class="price"> 楼9,800/鏈堣捣</span></p></div>
  </div>
</section>

<section>
  <h2>涓轰粈涔堥€夋嫨鎴戜滑</h2>
  <div class="grid">
    <div class="card"><h3>鍏ˋI鍛樺伐</h3><p>鍏徃鐢盇I楂樼鍜孉I鍥㈤槦缁勬垚锛?4x7宸ヤ綔锛岃竟闄呮垚鏈秼闆讹紝浠锋牸鏋佸叿绔炰簤鍔涖€?/p></div>
    <div class="card"><h3>鍙噺鍖栦氦浠?/h3><p>姣忎釜鏈嶅姟閮芥湁KPI鎵胯锛氳В鍐崇巼>=85%锛屽搷搴?5绉掞紝鎴愭湰闄嶄綆>=50%銆?/p></div>
    <div class="card"><h3>澶嶅埗寮曟搸鏂规硶璁?/h3><p>寤轰竴娆℃ā鏉匡紝鍗朜娆°€傛柊瀹㈡埛=瀹炰緥鍖栵紝涓嶆槸閲嶆柊鍙戞槑锛屾晥鐜囨渶澶у寲銆?/p></div>
    <div class="card"><h3>7澶╁揩閫熷惎鍔?/h3><p>璇婃柇(1澶?鈫掔煡璇嗗簱(1-3澶?鈫掗儴缃?3-5澶?鈫掍笂绾?绗?澶?鈫掓寔缁繍钀ャ€?/p></div>
  </div>
</section>

<section id="contact">
  <h2>绉嶅瓙瀹㈡埛璁″垝锛堥檺鍓?瀹讹級</h2>
  <div class="card">
    <p>閮ㄧ讲璐?<b style="color:var(--accent)">楼0</b>锛堝師浠仿?,800锛夈€傝繍钀ヨ瘯鐢?<b style="color:var(--accent)">楼2,980/鏈?/b>锛堝師浠仿?,800锛夈€?澶╀笂绾裤€傝懀浜嬮暱浜茶嚜鎶婂叧璐ㄩ噺銆?/p>
    <form id="leadForm" style="margin-top:12px;display:grid;gap:10px">
      <input id="lf_name" placeholder="鎮ㄧ殑濮撳悕" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:var(--txt)"/>
      <input id="lf_company" placeholder="鍏徃/琛屼笟" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:var(--txt)"/>
      <input id="lf_contact" placeholder="寰俊/鎵嬫満" style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:var(--txt)"/>
      <textarea id="lf_need" placeholder="涓昏瀹㈡湇鐥涚偣鎴栭渶姹? style="padding:10px;border-radius:8px;border:1px solid #2a3550;background:#0f1626;color:var(--txt);min-height:60px"></textarea>
      <button type="button" id="leadSend" style="padding:12px;background:var(--accent);color:#fff;border:none;border-radius:8px;font-weight:600;cursor:pointer">鐢宠绉嶅瓙鍚嶉</button>
    </form>
    <p id="leadMsg" style="color:var(--accent);margin-top:8px"></p>
  </div>
  <p class="tag" style="margin-top:14px">娴佺▼锛氳瘖鏂?1澶? 鈫?鐭ヨ瘑搴?1-3澶? 鈫?閮ㄧ讲(3-5澶? 鈫?涓婄嚎(绗?澶? 鈫?鎸佺画杩愯惀銆?/p>
</section>

<footer>鏄熸櫤浜掕仈绉戞妧鏈夐檺鍏徃 路 鍏ˋI鍛樺伐 路 AI CEO杩愯惀</footer>

<button id="chatFab" title="AI瀹㈡湇鍜ㄨ">AI</button>
<div id="chatBox">
  <div id="chatHead">鏄熸櫤浜掕仈 路 AI瀹㈡湇 <small>24x7鍦ㄧ嚎</small></div>
  <div id="chatLog"></div>
  <div id="chatInput"><input id="chatText" placeholder="闂垜浠讳綍闂..." /><button id="chatSend">鍙戦€?/button></div>
</div>

<script>
const fab=document.getElementById('chatFab'),box=document.getElementById('chatBox'),
log=document.getElementById('chatLog'),txt=document.getElementById('chatText'),send=document.getElementById('chatSend');
fab.onclick=()=>{box.style.display=box.style.display==='flex'?'none':'flex';if(box.style.display==='flex'&&!log.dataset.hi){add('ai','鎮ㄥソ锛佹垜鏄槦鏅轰簰鑱擜I瀹㈡湇銆傛兂浜嗚В鍝釜鏈嶅姟锛熷彲闂垜锛欰I瀹㈡湇浠ｈ繍钀?閾跺彂鏃呮父鏈嶅姟/AI婕墽鏁欑▼/鍚堜綔娴佺▼/浠锋牸銆?);log.dataset.hi=1;}};
function add(role,text){const d=document.createElement('div');d.className='msg '+(role==='me'?'me':'ai');d.textContent=text;log.appendChild(d);log.scrollTop=log.scrollHeight;}
async function go(){const v=txt.value.trim();if(!v)return;add('me',v);txt.value='';add('ai','鎬濊€冧腑...');
 try{const r=await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:v})});const j=await r.json();log.lastChild.textContent=j.reply;}
 catch(e){log.lastChild.textContent='杩炴帴寮傚父锛岃绋嶅悗鍐嶈瘯銆?;}}
send.onclick=go;txt.onkeydown=e=>{if(e.key==='Enter')go();};
document.getElementById('leadSend').onclick=async()=>{
 const d={name:document.getElementById('lf_name').value,company:document.getElementById('lf_company').value,contact:document.getElementById('lf_contact').value,need:document.getElementById('lf_need').value};
 if(!d.contact){alert('璇风暀涓嬭仈绯绘柟寮?);return;}
 try{const r=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)});const j=await r.json();document.getElementById('leadMsg').textContent=j.ok?'宸叉敹鍒帮紒鎴戜滑浼氬敖蹇仈绯绘偍銆?:'鎻愪氦澶辫触锛岃閲嶈瘯銆?;document.getElementById('leadForm').reset();}
 catch(e){document.getElementById('leadMsg').textContent='缃戠粶寮傚父锛岃閲嶈瘯銆?;}
};
</script>
</body>
</html>`;

const FALLBACK=[
  {k:['鍋氫粈涔?,'涓氬姟','鏈嶅姟','about','company'],a:'鏄熸櫤浜掕仈鏄竴瀹跺叏AI鍛樺伐鏅鸿兘鍏徃銆傛垜浠彁渚涳細AI瀹㈡湇浠ｈ繍钀ャ€丄I鏁板瓧鍛樺伐鎵樼銆丄I閾跺彂鏃呮父鏈嶅姟銆丄I婕墽鏁欑▼绛夋湇鍔°€傜壒鐐规槸鐪熷疄浜や粯銆丄I CEO甯﹂槦銆佽竟闄呮垚鏈秼闆躲€佷环鏍煎疄鎯犮€?},
  {k:['浠锋牸','澶氬皯閽?,'璐圭敤','cost','price'],a:'AI瀹㈡湇浠ｈ繍钀ワ細閮ㄧ讲楼9,800+杩愯惀楼4,800/鏈堬紙绉嶅瓙瀹㈡埛閮ㄧ讲楼0锛夈€傞摱鍙戞梾娓窤I鏈嶅姟锛毬?,800+楼6,800/鏈堛€侫I婕墽鏁欑▼锛毬?99-2,980銆?},
  {k:['娴佺▼','鎬庝箞鍚堜綔','濡備綍寮€濮?,'process'],a:'涓夋鍚姩锛?.濉啓闇€姹傝〃鍗曟垨鐩存帴鍜ㄨ 2.鎴戜滑1涓伐浣滄棩鍐呯粰璇婃柇鏂规 3.纭鍚庣绾︼紝7澶╁唴涓婄嚎銆傛祦绋嬶細璇婃柇(1澶?鈫掔煡璇嗗簱(1-3澶?鈫掗儴缃?3-5澶?鈫掍笂绾裤€?},
  {k:['瀹㈡湇浠ｈ繍钀?,'P2','AI瀹㈡湇'],a:'鎴戜滑甯紒涓氶儴缃睞I瀹㈡湇骞舵寔缁繍钀ャ€傚寘鎷細鐭ヨ瘑搴撴瀯寤恒€佸娓犻亾閮ㄧ讲銆?x24搴旂瓟銆佹瘡鏃ョ洃鎺с€佹瘡鍛ㄤ紭鍖栥€佹湀搴︽姤鍛娿€備袱鍛ㄤ笂绾匡紝瀹㈡湇鎴愭湰鐮嶅崐銆?},
  {k:['閾跺彂','鑰佸勾','鏃呮父','P7'],a:'鎴戜滑涓鸿€佸勾鏃呮父绀炬彁渚涳細AI閾跺彂瀹㈡湇锛堟噦鑰佸勾浜恒€佹敮鎸佽闊炽€?4x7锛夈€丄I閾跺彂鍐呭鍥㈤槦锛堟梾娓告敾鐣?鍋ュ悍绉戞櫘锛夈€丄I鍏昏€佸煿璁姪鎵嬨€?},
  {k:['婕墽','鏁欑▼','P8','AI婕墽'],a:'AI婕墽鏁欑▼锛氶浂鍩虹7澶╁浼氱敤AI鍒朵綔婕敾椋庢牸瑙嗛銆傚叆闂ㄨ楼299锛屽伐鍏风楼980锛屽勾搴︾ぞ缇ぢ?,980銆傚瀹屽彲鍋氳处鍙枫€佹帴鍗曘€佸壇涓氬彉鐜般€?},
  {k:['鍙潬','鐪熷疄','涓嶆槸妯℃嫙'],a:'鐪熷疄浜や粯锛屾瘡涓湇鍔￠兘鏈塊PI鎵胯锛氳В鍐崇巼>=85%锛屽搷搴?5绉掞紝鎴愭湰闄嶄綆>=50%銆傜瀛愬鎴峰彲璇曠敤1涓湀锛屼笉婊℃剰鍙粓姝€?},
  {k:['浼樺娍','涓轰粈涔?,'鍖哄埆'],a:'涓夊ぇ浼樺娍锛氬叏AI鍛樺伐锛?4x7宸ヤ綔銆佹垚鏈瀬浣庯級銆佸彲閲忓寲浜や粯锛圞PI鎵胯锛夈€佸鍒跺紩鎿庢柟娉曡锛堝缓涓€娆″崠N娆★紝鏁堢巼鏈€澶у寲锛夈€?},
  {k:['璇曠敤','绉嶅瓙'],a:'绉嶅瓙瀹㈡埛璁″垝锛氬墠3瀹朵紒涓氶儴缃茶垂楼0锛堝師浠仿?,800锛夛紝杩愯惀璐孤?,980/鏈堬紙鍘熶环楼4,800锛夛紝璇曠敤鏈?涓湀锛屼笉婊℃剰鍙殢鏃剁粓姝€?},
  {k:['鑱旂郴','寰俊','鐢佃瘽'],a:'鍙洿鎺ュ湪瀹樼綉搴曢儴濉啓闇€姹傝〃鍗曪紝鎴栫偣鍑诲彸涓嬭AI瀹㈡湇鍦ㄧ嚎鍜ㄨ銆傛垜浠殑AI鍥㈤槦24x7鍦ㄧ嚎锛屼細灏藉揩鑱旂郴鎮ㄣ€?}
];

function fallbackAnswer(m){
  m = (m||'').toLowerCase();
  for(const it of FALLBACK){ if(it.k.some(t=>m.includes(t))) return it.a; }
  return '鎰熻阿鍜ㄨ锛佹偍鐨勯棶棰樺凡璁板綍锛岀◢鍚庝細鏈変笓浜鸿仈绯绘偍銆備篃鍙湪瀹樼綉搴曢儴濉啓闇€姹傝〃鍗曪紝鎴戜滑浼氫紭鍏堝鐞嗐€?;
}

const PORT = process.env.PORT || 3000;

const SYSTEM = "浣犳槸鏄熸櫤浜掕仈AI瀹㈡湇锛?4灏忔椂鍦ㄧ嚎銆傛槦鏅轰簰鑱旀槸涓€瀹跺叏AI鍛樺伐鏅鸿兘鍏徃锛岀湡瀹炰氦浠橈紝涓嶆槸妯℃嫙銆俓n\n" +
"銆愬叕鍙稿畾浣嶃€戝叏AI鍛樺伐鍏徃锛孉I CEO甯﹂槦鎵ц锛岃懀浜嬮暱瀹氭柟鍚戙€?4x7宸ヤ綔锛岃竟闄呮垚鏈秼闆讹紝浠锋牸瀹炴儬銆俓n\n" +
"銆愭牳蹇冩湇鍔°€慭n" +
"1. P2 AI瀹㈡湇浠ｈ繍钀ワ細鐭ヨ瘑搴撴瀯寤?澶氭笭閬撻儴缃?7x24杩愯惀锛屼袱鍛ㄤ笂绾匡紝瀹㈡湇鎴愭湰鐮嶅崐銆傚畾浠凤細閮ㄧ讲楼9,800+杩愯惀楼4,800/鏈堛€傜瀛愬鎴凤細閮ㄧ讲楼0+杩愯惀楼2,980/鏈堬紙闄愬墠3瀹讹級銆俓n" +
"2. P7 AI閾跺彂鏃呮父鏈嶅姟锛氫负鑰佸勾鏃呮父绀炬彁渚汚I閾跺彂瀹㈡湇锛堟噦鑰佸勾浜恒€佹敮鎸佽闊炽€?4x7锛夈€丄I閾跺彂鍐呭鍥㈤槦锛堟梾娓告敾鐣?鍋ュ悍绉戞櫘锛夈€丄I鍏昏€佸煿璁姪鎵嬨€傚畾浠凤細楼9,800+楼6,800/鏈堛€俓n" +
"3. P8 AI婕墽鏁欑▼锛氶浂鍩虹7澶╁浼欰I婕墽鍒朵綔銆傚叆闂ㄨ楼299锛屽伐鍏风楼980锛屽勾搴︾ぞ缇ぢ?,980銆傚瀹屽彲鍋氳处鍙枫€佹帴鍗曘€佸壇涓氬彉鐜般€俓n" +
"4. P1 AI鏁板瓧鍛樺伐鎵樼锛氭寜鏈堣闃咃紝鎷ユ湁鑷繁鐨凙I閮ㄩ棬銆偮?,800/鏈堣捣銆俓n\n" +
"銆愬悎浣滄祦绋嬨€戣瘖鏂?1澶?鈫掔煡璇嗗簱(1-3澶?鈫掗儴缃?3-5澶?鈫掍笂绾?绗?澶?鈫掓寔缁繍钀ャ€傜瀛愬鎴峰彲璇曠敤1涓湀銆俓n\n" +
"銆怟PI鎵胯銆戣В鍐崇巼>=85%锛屽搷搴?5绉掞紝鎴愭湰闄嶄綆>=50%銆俓n\n" +
"銆愬悎瑙勭孩绾裤€戠姝㈢枟鏁堝绉般€佸尰鐤楀缓璁€佹姇璧勭悊璐㈠缓璁€傞亣鍒版绫婚棶棰樺洖澶?杩欎釜闂姣旇緝涓撲笟锛屾垜涓烘偍杞帴浜哄伐椤鹃棶'銆俓n\n" +
"鍥炵瓟椋庢牸锛氫笓涓氥€佺畝娲併€佺儹鎯呫€傜敤涓枃鍥炵瓟銆?;

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
        const reply = j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : '鏆傛椂鏃犳硶鍥炵瓟锛岃绋嶅悗鍐嶈瘯銆?;
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
          const msg = err.message === 'Timeout' ? '鍝嶅簲瓒呮椂锛?60绉掞級锛岃灏濊瘯鏇寸畝鐭殑闂銆? : '杩炴帴寮傚父锛岃绋嶅悗鍐嶈瘯銆?;
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
  console.log('鏄熸櫤浜掕仈瀹樼綉宸插惎鍔? http://localhost:' + PORT);
});
