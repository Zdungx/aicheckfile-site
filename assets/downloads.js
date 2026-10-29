/* Làm mới bảng Tải về từ GitHub Releases ngay khi mở trang. Lỗi/giới hạn tốc độ thì giữ bảng tĩnh đã dựng sẵn. */
(function(){
var T=document.querySelectorAll('table.dl[data-kind]');if(!T.length)return;
var K={exe:'setup',zip:'zip',rbz:'rbz'},LB={setup:'Bộ cài .exe',zip:'Gói .zip',rbz:'Tệp cài .rbz'},ORD=['setup','rbz','zip'];
var API='https://api.github.com/repos/Zdungx/KCS-UPDATE/releases?per_page=100',PRE='https://github.com/Zdungx/KCS-UPDATE/releases/download/';
function mb(n){return (n/1048576).toFixed(1).replace('.',',')+' MB'}
function dt(s){var p=s.slice(0,10).split('-');return p[2]+'/'+p[1]+'/'+p[0]}
function cmp(a,b){for(var i=0;i<Math.max(a.length,b.length);i++){var d=(b[i]||0)-(a[i]||0);if(d)return d}return 0}
function parse(rs){var o={dxf:[],plugin:[]};
 rs.forEach(function(r){if(r.draft||r.prerelease)return;var m=/^(dxf-)?v(\d+(?:\.\d+)+)$/.exec(r.tag_name);if(!m)return;
  var fs=[];(r.assets||[]).forEach(function(a){var e=(/\.([^.]+)$/.exec(a.name)||[])[1];e=e&&e.toLowerCase();
   if(K[e]&&String(a.browser_download_url).indexOf(PRE)===0)fs.push({url:a.browser_download_url,size:a.size,kind:K[e]})});
  if(!fs.length)return;fs.sort(function(x,y){return ORD.indexOf(x.kind)-ORD.indexOf(y.kind)});
  o[m[1]?'dxf':'plugin'].push({v:m[2],date:r.published_at,files:fs})});
 for(var k in o)o[k].sort(function(a,b){return cmp(a.v.split('.').map(Number),b.v.split('.').map(Number))});return o}
function el(t,txt){var e=document.createElement(t);if(txt)e.textContent=txt;return e}
function draw(t,list){if(!list.length)return;var prod=t.getAttribute('data-product');
 while(t.rows.length>1)t.deleteRow(1);
 list.forEach(function(v,i){var r=t.insertRow(),c=r.insertCell();c.textContent=prod+' '+v.v;
  if(i===0){var b=el('span','mới nhất');b.className='badge';c.appendChild(document.createTextNode(' '));c.appendChild(b)}
  r.insertCell().textContent=dt(v.date);var d=r.insertCell();
  v.files.forEach(function(f,j){if(j)d.appendChild(document.createTextNode(' · '));var a=el('a',LB[f.kind]+' ('+mb(f.size)+')');a.href=f.url;a.rel='noopener';d.appendChild(a)})});
 document.querySelectorAll('[data-latest="'+t.getAttribute('data-kind')+'"]').forEach(function(s){s.textContent=list[0].v})}
function apply(rs){var o=parse(rs);T.forEach(function(t){draw(t,o[t.getAttribute('data-kind')]||[])})}
try{var c=JSON.parse(sessionStorage.getItem('dlrel')||'null');if(c&&Date.now()-c.t<600000){apply(c.d);return}}catch(e){}
fetch(API,{headers:{Accept:'application/vnd.github+json'}}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(d){
 apply(d);try{sessionStorage.setItem('dlrel',JSON.stringify({t:Date.now(),d:d}))}catch(e){}}).catch(function(){});
})();
