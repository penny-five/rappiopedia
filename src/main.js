import './styles.css';
import DATA from './data/network.json';
import { shortestPath } from './lib/graph.js';
import { hierarchyGroups } from './lib/hierarchy.js';
import { renderNodeArticle, renderSourceArchive } from './wiki.js';

const N=DATA.nodes,E=DATA.edges,S=DATA.sources,by=Object.fromEntries(N.map(n=>[n.id,n]));
const groupMeta={core:['PACT / OHJELMAPERHE','#466b8a'],season1:['PACTHOUSE 01','#89698b'],season2:['PACTHOUSE 02','#517ea1'],season3:['PACTHOUSE 03','#7466a7'],talks:['PACT TALKS','#2d9187'],rappio:['RAPPIOSTRIIMAUS','#b46b63'],events:['TAPAHTUMAT','#ba8747'],rap:['SLIKI / KETOLA','#a5784e'],stream:['KASINOKURKI','#4485b4'],media:['MEDIA / PALSTAT','#818c97'],poker:['JULKKISPELIT / POKERI','#748f62']};
const levels={verified:{label:'Vahvistettu',color:'#16856c'},reported:{label:'Uutisoitu',color:'#356db4'},observed:{label:'Havaittu / päätelmä',color:'#a86b0a'},lead:{label:'Johtolanka / kiistetty',color:'#b04766'}};
const catNames={person:'HENKILÖ',org:'YHTIÖ / BRÄNDI',event:'TAPAHTUMA',show:'OHJELMA',lead:'SELVITETTÄVÄ NIMI',media:'JULKAISU',platform:'ALUSTA',meme:'ILMIÖ'};
const canvas=document.getElementById('canvas'),ctx=canvas.getContext('2d'),space=document.getElementById('space');
let W=0,H=0,dpr=1,yaw=-.32,pitch=.20,dist=3700,target={x:0,y:-70,z:0},selected='pact',sector='all',mode='focus',query='',hover=null,pathNodes=[],pathEdges=[],pointer=null,frame=0,visiblePoints=[],showLevels=new Set(['verified','reported','observed','lead']);
const centers={}; for(const g of Object.keys(groupMeta)){let arr=N.filter(n=>n.group===g);let hub=arr.find(n=>['pact','s1','s2','s3','talks','kieksidoc','bailu','sliki','kasinok','ylilauta'].includes(n.id))||arr[0];centers[g]=hub?.pos3||[0,0,0]}
function esc(t){return String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function image(n){return n.image||''}const photo={};for(const n of N){if(!n.image)continue;const im=new Image();im.referrerPolicy='no-referrer';im.onload=()=>{photo[n.id]=im};im.onerror=()=>{photo[n.id]=null};im.src=n.image;photo[n.id]=null}
const rng=(seed)=>{let z=seed;return()=>{z=(z*1664525+1013904223)>>>0;return z/4294967296}};const R=rng(41),stars=Array.from({length:260},()=>({x:R(),y:R(),radius:R()*1.4+.25,alpha:R()*.42+.08}));
function resize(){const r=space.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,2);W=Math.max(1,r.width);H=Math.max(1,r.height);canvas.width=Math.floor(W*dpr);canvas.height=Math.floor(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)}window.addEventListener('resize',resize);resize();
function vec(x,y,z){return{x,y,z}}function sub(a,b){return vec(a.x-b.x,a.y-b.y,a.z-b.z)}function dot(a,b){return a.x*b.x+a.y*b.y+a.z*b.z}function cross(a,b){return vec(a.y*b.z-a.z*b.y,a.z*b.x-a.x*b.z,a.x*b.y-a.y*b.x)}function norm(a){let q=Math.hypot(a.x,a.y,a.z)||1;return vec(a.x/q,a.y/q,a.z/q)}function projection(){let cp=Math.cos(pitch),sp=Math.sin(pitch),sy=Math.sin(yaw),cy=Math.cos(yaw);let cam=vec(target.x+dist*sy*cp,target.y+dist*sp,target.z+dist*cy*cp);let forward=norm(sub(target,cam)),right=norm(cross(forward,vec(0,1,0))),up=cross(right,forward);let focal=Math.min(W*1.04,H*1.4);return {cam,forward,right,up,focal}}
function pr(v,camera){let dif=sub(vec(v[0],v[1],v[2]),camera.cam),z=dot(dif,camera.forward);if(z<65)return null;let sc=camera.focal/z;return{x:W*.5+dot(dif,camera.right)*sc,y:H*.5-dot(dif,camera.up)*sc,z,sc}}
function tint(c,a){const v=parseInt(c.replace('#',''),16);return `rgba(${(v>>16)&255},${(v>>8)&255},${v&255},${a})`}
function RR(x,y,w,h,r){ctx.beginPath();ctx.roundRect(x,y,w,h,r)}
function hasFocus(n){return !!selected&&(n.id===selected||E.some(e=>(e.a===selected&&e.b===n.id)||(e.b===selected&&e.a===n.id)))}
function inSector(n){return sector==='all'||n.group===sector||n.id===selected}
function onPath(id){return pathNodes.includes(id)}
function isImportant(n){return n.featured||n.id===selected||n.group===sector&&sector!=='all'}
const groundY=-1240;
function drawBackground(){
 ctx.fillStyle='#f6f9fc';ctx.fillRect(0,0,W,H);
 const glow=ctx.createRadialGradient(W*.48,H*.37,30,W*.5,H*.5,Math.max(W,H)*.9);
 glow.addColorStop(0,'#ffffff');glow.addColorStop(1,'#e9f0f6');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
 for(const s of stars){const px=((s.x*W+yaw*18*s.radius)%W+W)%W,py=((s.y*H+pitch*15*s.radius)%H+H)%H;ctx.fillStyle='rgba(55,79,101,'+(s.alpha*.22)+')';ctx.beginPath();ctx.arc(px,py,s.radius*.75,0,Math.PI*2);ctx.fill()}
}
function gridSegment(c,a,b,color,alpha,width=1){
 const p=pr(a,c),q=pr(b,c);if(!p||!q)return;
 const fog=Math.max(.3,Math.min(1,(dist+2000-(p.z+q.z)*.5)/3100));
 ctx.lineWidth=width;ctx.strokeStyle=tint(color,alpha*fog);ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();
}
function drawWorldGrid(c){
 ctx.save();
 for(let v=-2400;v<=2400;v+=300){
  gridSegment(c,[v,groundY,-2400],[v,groundY,2400],'#7894a5',.19,v===0?1.25:.65);
  gridSegment(c,[-2400,groundY,v],[2400,groundY,v],'#7894a5',.19,v===0?1.25:.65);
 }
 gridSegment(c,[-2350,groundY,0],[2350,groundY,0],'#a3716c',.28,1.2);
 gridSegment(c,[0,groundY,-2350],[0,groundY,2350],'#537dba',.28,1.2);
 gridSegment(c,[0,groundY,0],[0,1250,0],'#499482',.26,1.2);
 ctx.font='700 11px DM Sans,Arial';ctx.fillStyle='#647f90';ctx.textAlign='center';
 for(const [name,p] of [['X',pr([2350,groundY,0],c)],['Z',pr([0,groundY,2350],c)],['Y',pr([0,1250,0],c)]])if(p&&p.x>=10&&p.x<=W-10&&p.y>=10&&p.y<=H-10)ctx.fillText(name,p.x+9,p.y-8);
 ctx.restore();
}
function drawDepthGuides(c,ps){
 const hubs=new Set(['pact','s1','s2','s3','talks','kieksidoc','bailu','sliki','kasinok','ylilauta']);
 ctx.save();
 for(const n of N){
  if(!hubs.has(n.id)&&n.id!==selected&&n.id!==hover)continue;
  const top=ps[n.id],foot=pr([n.pos3[0],groundY,n.pos3[2]],c);
  if(!top||!foot||n.pos3[1]<groundY)continue;
  const strong=n.id===selected||n.id===hover,col=groupMeta[n.group][1];
  ctx.lineWidth=strong?1.3:.75;ctx.strokeStyle=tint(col,strong?.4:.13);ctx.setLineDash([3,6]);
  ctx.beginPath();ctx.moveTo(top.x,top.y);ctx.lineTo(foot.x,foot.y);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=tint(col,strong?.16:.065);ctx.beginPath();ctx.ellipse(foot.x,foot.y,Math.max(3,foot.sc*38),Math.max(2,foot.sc*13),0,0,Math.PI*2);ctx.fill();
 }
 ctx.restore();
}

/** PACT program family, outlined in 3D space rather than in screen coordinates. */
function drawPactHierarchy(c){
 const family=hierarchyGroups.find(h=>h.id==='pact-universe');
 if(!family||(sector!=='all'&&!family.groups.includes(sector)))return;
 const nodes=family.hubs.map(id=>by[id]?.pos3).filter(Boolean);if(nodes.length<3)return;
 const center=[0,1,2].map(i=>nodes.reduce((s,p)=>s+p[i],0)/nodes.length);
 const rx=Math.max(...nodes.map(p=>Math.abs(p[0]-center[0])))+330;
 const rz=Math.max(...nodes.map(p=>Math.abs(p[2]-center[2])))+330;
 const y=center[1]-320,alpha=sector==='all'?.23:.43;
 ctx.save();ctx.strokeStyle=tint('#3c9ba8',alpha);ctx.lineWidth=1.5;ctx.setLineDash([10,8]);ctx.beginPath();
 let started=false;
 for(let i=0;i<=80;i++){
  const angle=i/80*Math.PI*2,p=pr([center[0]+rx*Math.cos(angle),y,center[2]+rz*Math.sin(angle)],c);
  if(!p){started=false;continue}if(!started){ctx.moveTo(p.x,p.y);started=true}else ctx.lineTo(p.x,p.y);
 }ctx.stroke();ctx.setLineDash([]);
 const marker=pr([center[0]-rx*.85,y,center[2]-rz*.6],c);
 if(marker){ctx.fillStyle=tint('#226d7e',Math.min(1,alpha*2.6));ctx.font='700 11px DM Sans,Arial';ctx.textAlign='left';ctx.fillText('◈ PACT / OHJELMAPERHE',marker.x,marker.y-9)}
 ctx.restore();
}
function drawCluster(c){
 for(const [g,coords] of Object.entries(centers)){
  const v=pr(coords,c);if(!v||v.x< -450||v.x>W+450||v.y< -450||v.y>H+450)continue;
  const col=groupMeta[g][1],active=sector==='all'||sector===g;
  const radius=Math.min(560,Math.max(245,...N.filter(n=>n.group===g).map(n=>Math.hypot(n.pos3[0]-coords[0],n.pos3[2]-coords[2])+100)));
  const rings=[];
  for(const y of [coords[1]-155,coords[1]+155]){
   const ring=[];for(let i=0;i<=44;i++){const a=i/44*Math.PI*2;ring.push(pr([coords[0]+radius*Math.cos(a),y,coords[2]+radius*Math.sin(a)],c))}
   rings.push(ring);
  }
  ctx.save();ctx.lineWidth=active?1.1:.7;ctx.setLineDash([5,9]);
  for(let k=0;k<rings.length;k++){
   ctx.beginPath();let started=false;for(const p of rings[k]){if(!p){started=false;continue}if(!started){ctx.moveTo(p.x,p.y);started=true}else ctx.lineTo(p.x,p.y)}
   ctx.strokeStyle=tint(col,(active?.32:.09)*(k===0?1:.7));ctx.stroke();
  }
  ctx.setLineDash([]);
  for(const i of [0,11,22,33]){
   const a=rings[0][i],b=rings[1][i];if(a&&b){ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.strokeStyle=tint(col,active?.14:.045);ctx.stroke()}
  }
  const title=pr([coords[0],coords[1]+155,coords[2]],c);
  if(title){ctx.fillStyle=tint(col,active?.94:.3);ctx.font='700 10px DM Sans,Arial';ctx.textAlign='center';ctx.fillText(groupMeta[g][0],title.x,title.y-13)}
  ctx.restore();
 }
}
function drawLink(p,q,e,highlight,dim){
 const color=levels[e.level].color,base=highlight?.88:dim?.055:(sector==='all'?.24:.36);
 const fog=z=>Math.max(.26,Math.min(1,(dist+1850-z)/2400));
 const grad=ctx.createLinearGradient(p.x,p.y,q.x,q.y);
 grad.addColorStop(0,tint(color,base*(highlight?1:fog(p.z))));
 grad.addColorStop(1,tint(color,base*(highlight?1:fog(q.z))));
 ctx.strokeStyle=grad;ctx.lineWidth=highlight?2.2:1;ctx.setLineDash(e.level==='lead'?[5,7]:[]);
 ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.setLineDash([]);
 if(highlight){
  const x=p.x+(q.x-p.x)*.68,y=p.y+(q.y-p.y)*.68,angle=Math.atan2(q.y-p.y,q.x-p.x);
  ctx.fillStyle=tint(color,.94);ctx.beginPath();ctx.moveTo(x+6*Math.cos(angle),y+6*Math.sin(angle));
  ctx.lineTo(x-5*Math.cos(angle-.55),y-5*Math.sin(angle-.55));ctx.lineTo(x-5*Math.cos(angle+.55),y-5*Math.sin(angle+.55));ctx.closePath();ctx.fill();
 }
}
function initials(name){return name.replace(/[^\p{L}\p{N} ]/gu,' ').trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase()}
function drawCirclePhoto(n,x,y,r){ctx.save();ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.clip();ctx.fillStyle='#e5e5e5';ctx.fillRect(x-r,y-r,2*r,2*r);if(photo[n.id]&&photo[n.id].complete&&photo[n.id].naturalWidth){let im=photo[n.id],ratio=Math.max(2*r/im.width,2*r/im.height),iw=im.width*ratio,ih=im.height*ratio;ctx.drawImage(im,x-iw/2,y-ih/2,iw,ih)}else{ctx.fillStyle='#5b5b5b';ctx.font=`800 ${Math.round(r*.65)}px Manrope,Arial`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(initials(n.name),x,y)}ctx.restore();ctx.strokeStyle='#88888866';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,r+.8,0,Math.PI*2);ctx.stroke()}
function nodeDisplay(n,p){const isSel=n.id===selected,isHover=n.id===hover,hot=hasFocus(n),inPath=onPath(n.id),notDim=inSector(n);let isHub=['pact','s1','s2','s3','talks','kieksidoc','bailu','sliki','kasinok','ylilauta'].includes(n.id);let visible=mode==='full'||mode==='links'||isImportant(n)||hot||inPath;if(!visible && sector==='all' && !isHub){ctx.fillStyle=tint(groupMeta[n.group][1],.36);ctx.beginPath();ctx.arc(p.x,p.y,Math.max(1,2.5*p.sc),0,Math.PI*2);ctx.fill();return}
let active=notDim||hot||inPath;let fade=sector!=='all'&&!active? .2:1;if(pathNodes.length&& !inPath)fade*=.21;
const col=groupMeta[n.group][1];let scale=Math.max(.43,Math.min(1.48,p.sc*2.75)),r=(isSel?12:Math.max(3.2,isHub?8:5))*scale;
ctx.save();ctx.globalAlpha=fade*Math.max(.3,Math.min(1,(dist+1800-p.z)/2300));ctx.shadowColor=col;ctx.shadowBlur=isSel?19:isHover?12:hot?8:4;
const sphere=ctx.createRadialGradient(p.x-r*.4,p.y-r*.5,r*.08,p.x,p.y,r*1.3);sphere.addColorStop(0,'#ffffff');sphere.addColorStop(.24,tint(col,.92));sphere.addColorStop(1,tint(col,.98));
ctx.fillStyle=sphere;ctx.beginPath();ctx.arc(p.x,p.y,r,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
if(isSel||isHover||inPath){ctx.strokeStyle=isSel?'#222222':'#808080';ctx.lineWidth=isSel?2:1;ctx.beginPath();ctx.arc(p.x,p.y,r+6,0,Math.PI*2);ctx.stroke();}
let needLabel=isSel||isHover||inPath||n.featured||mode==='full'||sector===n.group&&sector!=='all';
if(needLabel&&p.sc>.12){let withPic=!!n.image;let enlarged=isSel||isHover;let w=Math.min(185,Math.max(93,(enlarged?157:134)*Math.min(1.1,Math.max(.75,p.sc*2.5)))),h=withPic?(enlarged?68:52):(enlarged?52:38);let bx=p.x+10*scale,by=p.y-h/2-22*scale;
 if(bx+w>W-8)bx=p.x-w-10*scale;if(by<15)by=p.y+20;if(by+h>H-10)by=H-h-10;
 ctx.shadowColor='#999';ctx.shadowBlur=8;RR(bx,by,w,h,4);ctx.fillStyle=isSel?'#f4f4f4f5':'#ffffffed';ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle=tint(col,isSel?.85:hot?.55:.22);ctx.lineWidth=isSel?1.5:.8;ctx.stroke();
 let tx=bx+9,txtmax=w-17;if(withPic){let sz=h-12;drawCirclePhoto(n,bx+8+sz/2,by+h/2,sz/2);tx=bx+sz+13;txtmax=w-(tx-bx)-5}
 ctx.textAlign='left';ctx.textBaseline='middle';ctx.font=`700 ${enlarged?11:10}px Manrope,Arial`;ctx.fillStyle='#202020';let name=n.name,fit=name;while(fit.length>3&&ctx.measureText(fit).width>txtmax)fit=fit.slice(0,-2);if(fit!==name)fit+='…';ctx.fillText(fit,tx,by+(withPic?19:16));ctx.font='9px IBM Plex Mono,monospace';ctx.fillStyle=tint(col,.82);ctx.fillText(isHub?'● KESKUSSOLMU':(catNames[n.cat]||n.cat).slice(0,17),tx,by+(withPic?36:29));
 visiblePoints.push({id:n.id,x:bx,y:by,w,h,r:Math.max(12,r+4),cx:p.x,cy:p.y,depth:p.z});
}else visiblePoints.push({id:n.id,x:p.x-10,y:p.y-10,w:20,h:20,r:Math.max(9,r+4),cx:p.x,cy:p.y,depth:p.z});ctx.restore();}
function drawRelationshipLabels(ps){
 if(!selected)return;
 const occupied=[];
 ctx.save();ctx.textBaseline='middle';ctx.font='700 11px DM Sans,Arial';
 for(const e of E){
  if(!showLevels.has(e.level)||(e.a!==selected&&e.b!==selected))continue;
  const p=ps[e.a],q=ps[e.b];if(!p||!q)continue;
  const dx=q.x-p.x,dy=q.y-p.y,len=Math.hypot(dx,dy);
  if(len<67)continue;
  const word=e.verb||e.label,w=Math.ceil(ctx.measureText(word).width)+23,h=23;
  if(w>W-20)continue;
  const nx=-dy/len,ny=dx/len;
  let box=null;
  for(const t of [.5,.36,.66,.25,.78]){
   for(const offset of [0,17,-17,34,-34,52,-52]){
    const x=Math.max(8,Math.min(W-w-8,p.x+dx*t+nx*offset-w/2));
    const y=Math.max(66,Math.min(H-h-10,p.y+dy*t+ny*offset-h/2));
    const overlaps=occupied.some(r=>x<r.x+r.w+5&&x+w+5>r.x&&y<r.y+r.h+4&&y+h+4>r.y);
    const nodeCover=visiblePoints.some(r=>(r.id===e.a||r.id===e.b)&&x<r.x+r.w+4&&x+w+4>r.x&&y<r.y+r.h+4&&y+h+4>r.y);
    if(!overlaps&&!nodeCover){box={x,y,w,h};break}
   }if(box)break;
  }
  if(!box)continue;
  occupied.push(box);
  const color=levels[e.level].color;
  ctx.shadowColor='rgba(26,44,60,.18)';ctx.shadowBlur=9;ctx.shadowOffsetY=2;
  RR(box.x,box.y,box.w,box.h,6);ctx.fillStyle='rgba(255,255,255,.96)';ctx.fill();
  ctx.shadowBlur=0;ctx.shadowOffsetY=0;ctx.strokeStyle=tint(color,.46);ctx.lineWidth=1;ctx.stroke();
  ctx.fillStyle=color;ctx.beginPath();ctx.arc(box.x+9,box.y+h/2,3.5,0,Math.PI*2);ctx.fill();
  ctx.textAlign='left';ctx.fillStyle='#1f3442';ctx.fillText(word,box.x+17,box.y+h/2+.5);
 }
 ctx.restore();
}
function draw(){
 if(!W||!H)return;frame++;
 drawBackground();
 const c=projection(),ps={};for(const n of N)ps[n.id]=pr(n.pos3,c);
 drawWorldGrid(c);drawPactHierarchy(c);drawCluster(c);drawDepthGuides(c,ps);
 visiblePoints=[];
 E.forEach((e,i)=>{if(!showLevels.has(e.level))return;const a=ps[e.a],b=ps[e.b];if(!a||!b)return;if((a.x<-W&&b.x<-W)||(a.x>W*2&&b.x>W*2))return;
  const hi=pathEdges.includes(i)||(!!selected&&(e.a===selected||e.b===selected));
  let dim=sector!=='all'&&(by[e.a].group!==sector&&by[e.b].group!==sector)&&!hi;
  if(pathNodes.length&&!pathEdges.includes(i))dim=true;
  drawLink(a,b,e,hi,dim);
 });
 N.map(n=>({n,p:ps[n.id]})).filter(x=>x.p&&x.p.x>-190&&x.p.x<W+200&&x.p.y>-170&&x.p.y<H+200).sort((a,b)=>b.p.z-a.p.z).forEach(x=>nodeDisplay(x.n,x.p));
 drawRelationshipLabels(ps);
 document.getElementById('cameraInfo').textContent=`AZ ${Math.round(yaw*180/Math.PI)}° / EL ${Math.round(pitch*180/Math.PI)}° / D ${Math.round(dist)}`;
 if(dirty){updateTooltip();dirty=false}requestAnimationFrame(draw);
}
let dirty=false;requestAnimationFrame(draw);
function touchInfo(id){selected=id;pathNodes=[];pathEdges=[];showDetails(id);dirty=true;document.getElementById('rightpanel').classList.add('mobileopen')}
function flyTo(id,zoom=true){const n=by[id];if(!n)return;if(location.hash!=='#/node/'+id)history.pushState({node:id},'','#/node/'+id);touchInfo(id);const p=n.pos3;let start={...target},stDist=dist;let end=vec(p[0],p[1],p[2]),dest=zoom?Math.max(700,Math.min(1450,dist)) : dist;let t0=performance.now();function anim(t){let v=Math.min(1,(t-t0)/650);v=1-(1-v)**3;target=vec(start.x+(end.x-start.x)*v,start.y+(end.y-start.y)*v,start.z+(end.z-start.z)*v);dist=stDist+(dest-stDist)*v;if(v<1)requestAnimationFrame(anim)}requestAnimationFrame(anim)}
function reset(){sector='all';mode='focus';query='';document.getElementById('search').value='';pathNodes=[];pathEdges=[];selected='pact';target=vec(0,-70,0);dist=3650;yaw=-.35;pitch=.22;renderSectors();renderModes();showDetails('pact');document.getElementById('pathresult').textContent='Valitse kaksi nimeä ja näytä yhteyspolku.'}
function showDetails(id){
 const n=by[id];if(!n)return;
 selected=id;document.title=n.name+' — Rappiopedia';
 if(location.hash!=='#/node/'+id)history.replaceState({node:id},'','#/node/'+id);
 const related=E.filter(e=>e.a===id||e.b===id).map(e=>({...e,other:by[e.a===id?e.b:e.a]}))
  .sort((a,b)=>({verified:0,reported:1,observed:2,lead:3})[a.level]-({verified:0,reported:1,observed:2,lead:3})[b.level]);
 renderNodeArticle({node:n,related,nodes:by,sources:S,levels,group:groupMeta[n.group][0],category:catNames[n.cat]||n.cat});
 document.getElementById('rightpanel').scrollTop=0;
 document.getElementById('wikiArticleTab').classList.add('active');
 document.getElementById('wikiSourcesTab').classList.remove('active');
}
function renderSectors(){let box=document.getElementById('sectors');box.innerHTML=`<button class="sector ${sector==='all'?'active':''}" data-sector="all"><span class="led" style="color:#444;background:#444"></span><span class="title">KOKO AVARUUS</span><span class="count">${N.length}</span></button>`+Object.entries(groupMeta).map(([id,[name,color]])=>`<button class="sector ${id===sector?'active':''}" data-sector="${id}"><span class="led" style="color:${color};background:${color}"></span><span class="title">${name}</span><span class="count">${N.filter(n=>n.group===id).length}</span></button>`).join('');box.querySelectorAll('[data-sector]').forEach(b=>b.onclick=()=>{sector=b.dataset.sector;renderSectors();if(sector!=='all'){let p=centers[sector],n=N.find(n=>n.group===sector);let st={...target},ed=vec(...p),start=performance.now();let a=(time)=>{let t=Math.min(1,(time-start)/620);t=1-(1-t)**3;target=vec(st.x+(ed.x-st.x)*t,st.y+(ed.y-st.y)*t,st.z+(ed.z-st.z)*t);dist=Math.max(1250,dist+(1450-dist)*.08);if(t<1)requestAnimationFrame(a)};requestAnimationFrame(a);if(n)showDetails(n.id)}else{target=vec(0,0,0);dist=3650}})}
function renderModes(){document.querySelectorAll('[data-mode]').forEach(b=>b.classList.toggle('on',b.dataset.mode===mode))}document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;renderModes()});
document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{let k=b.dataset.level;if(showLevels.has(k))showLevels.delete(k);else showLevels.add(k);b.classList.toggle('on',showLevels.has(k));b.setAttribute('aria-pressed',String(showLevels.has(k)))});
function jumpSearch(){let q=document.getElementById('search').value.trim().toLowerCase();query=q;if(!q)return;let matches=N.filter(n=>n.name.toLocaleLowerCase('fi').includes(q));document.getElementById('searchhint').textContent=matches.length?`${matches.length} osumaa. Enter → lähimpään osumaan.`:'Ei osumia';if(matches.length===1)flyTo(matches[0].id)}
document.getElementById('search').addEventListener('input',jumpSearch);document.getElementById('search').addEventListener('keydown',e=>{if(e.key==='Enter'){let q=e.target.value.trim().toLocaleLowerCase('fi');let n=N.find(n=>n.name.toLocaleLowerCase('fi').includes(q));if(n)flyTo(n.id)}});window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();document.getElementById('search').focus()}if(e.key==='Escape'){document.getElementById('leftpanel').classList.remove('mobileopen');document.getElementById('rightpanel').classList.remove('mobileopen')}});
function fillSelects(){let sorted=N.slice().sort((a,b)=>a.name.localeCompare(b.name,'fi'));for(let id of ['from','to'])document.getElementById(id).innerHTML=sorted.map(n=>`<option value="${esc(n.id)}">${esc(n.name)}</option>`).join('');document.getElementById('from').value='iippa';document.getElementById('to').value='sliki'}
function route(from,to){return shortestPath(from,to,E,showLevels)}
function doRoute(a,b){let r=route(a,b);if(!r){document.getElementById('pathresult').textContent='Polkua ei löydy näillä näytönsuodattimilla.';pathNodes=[];pathEdges=[];return}pathNodes=r.ns;pathEdges=r.es;let names=r.ns.map(id=>by[id].name);document.getElementById('pathresult').innerHTML=`<strong>${r.es.length} välivaihetta:</strong><br/>${names.map(esc).join(' → ')}<br/><span style="color:#777">Polku ei osoita sopimusta tai osallisuutta välikäsien tekoihin.</span>`;selected=a;showDetails(a);if(r.ns.length){let pts=r.ns.map(id=>by[id].pos3),m=[0,1,2].map(i=>pts.reduce((s,p)=>s+p[i],0)/pts.length);target=vec(...m);dist=Math.max(1450,Math.min(3150,550+Math.max(...pts.map(p=>Math.hypot(p[0]-m[0],p[1]-m[1],p[2]-m[2])))*3.2))}}
const tours={pact:['pact','s3','jethro','talks','ruusu'],bridge:['iippa','sami','bailu','korelon','sastamala','ossi'],casino:['kasinok','kp','s1','pact'],ylilauta:['sami','ylilauta']};document.querySelectorAll('[data-tour]').forEach(b=>b.onclick=()=>{let t=tours[b.dataset.tour];document.getElementById('from').value=t[0];document.getElementById('to').value=t[t.length-1];doRoute(t[0],t[t.length-1])});
document.getElementById('pathbtn').onclick=()=>doRoute(document.getElementById('from').value,document.getElementById('to').value);document.getElementById('clearpath').onclick=()=>{pathNodes=[];pathEdges=[];document.getElementById('pathresult').textContent='Polku tyhjennetty.'};
function openSources(){
 document.title='Lähteet — Rappiopedia';
 renderSourceArchive(S);
 document.getElementById('rightpanel').classList.add('mobileopen');
 document.getElementById('rightpanel').scrollTop=0;
 document.getElementById('wikiSourcesTab').classList.add('active');
 document.getElementById('wikiArticleTab').classList.remove('active');
}
document.getElementById('allSources').onclick=openSources;
document.getElementById('wikiSourcesTab').onclick=openSources;
document.getElementById('wikiArticleTab').onclick=()=>showDetails(selected);
document.getElementById('rightpanel').addEventListener('click',event=>{
 const el=event.target.closest('[data-focus]');
 if(el&&by[el.dataset.focus])flyTo(el.dataset.focus);
});
function updateTooltip(){let e=document.getElementById('tooltip');if(!hover){e.style.display='none';return}let n=by[hover];if(!n){e.style.display='none';return}e.style.display='block';e.innerHTML=`<b>${esc(n.name)}</b><small>${esc(groupMeta[n.group][0])} / ${esc(catNames[n.cat]||n.cat)}</small><p>${esc(n.note||'')}</p>`;let v=visiblePoints.find(p=>p.id===hover);if(v){e.style.left=Math.min(W-300,v.cx+17)+'px';e.style.top=Math.min(H-130,v.cy+15)+'px'}}
function hit(x,y){let hit=null,d=Infinity;for(let p of visiblePoints){if(x>=p.x-3&&x<=p.x+p.w+3&&y>=p.y-3&&y<=p.y+p.h+3){if(p.depth<d){hit=p.id;d=p.depth}}else if(Math.hypot(x-p.cx,y-p.cy)<p.r&&p.depth<d){hit=p.id;d=p.depth}}return hit}
space.addEventListener('pointerdown',e=>{if(e.button!==0&&e.button!==1)return;pointer={x:e.clientX,y:e.clientY,yaw,pitch,target:{...target},moved:false,pan:e.shiftKey||e.button===1};space.setPointerCapture(e.pointerId);space.classList.add('drag')});space.addEventListener('pointermove',e=>{let r=space.getBoundingClientRect(),x=e.clientX-r.left,y=e.clientY-r.top;if(pointer){let dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(Math.hypot(dx,dy)>3)pointer.moved=true;if(pointer.pan){let c=projection(),p=dist/Math.min(W,H)*1.05;target=vec(pointer.target.x-(c.right.x*dx-c.up.x*dy)*p,pointer.target.y-(c.right.y*dx-c.up.y*dy)*p,pointer.target.z-(c.right.z*dx-c.up.z*dy)*p)}else{yaw=pointer.yaw-dx*.005;pitch=Math.max(-1.35,Math.min(1.35,pointer.pitch+dy*.005))}}else{let h=hit(x,y);if(h!==hover){hover=h;dirty=true}space.style.cursor=h?'pointer':'grab'}});space.addEventListener('pointerup',e=>{let r=space.getBoundingClientRect();if(pointer&&!pointer.moved){let n=hit(e.clientX-r.left,e.clientY-r.top);if(n)flyTo(n)}pointer=null;space.classList.remove('drag')});space.addEventListener('pointerleave',()=>{if(!pointer){hover=null;dirty=true}});space.addEventListener('wheel',e=>{e.preventDefault();dist=Math.max(450,Math.min(7600,dist*Math.exp(e.deltaY*.001)))},{passive:false});
document.getElementById('zoomIn').onclick=()=>dist=Math.max(450,dist*.75);document.getElementById('zoomOut').onclick=()=>dist=Math.min(7600,dist*1.32);document.getElementById('home').onclick=reset;document.getElementById('reset').onclick=reset;
document.getElementById('leftmenu').onclick=()=>{document.getElementById('rightpanel').classList.remove('mobileopen');document.getElementById('leftpanel').classList.toggle('mobileopen')};document.getElementById('rightmenu').onclick=()=>{document.getElementById('leftpanel').classList.remove('mobileopen');document.getElementById('rightpanel').classList.toggle('mobileopen')};document.getElementById('nodecount').textContent=N.length;document.getElementById('edgecount').textContent=E.length;fillSelects();renderSectors();renderModes();
function openUrlNode(){
 const id=decodeURIComponent(location.hash.replace(/^#\/node\//,''));
 if(by[id]){selected=id;target=vec(...by[id].pos3);dist=1550;showDetails(id)}else{showDetails('pact')}
}
window.addEventListener('popstate',openUrlNode);
window.addEventListener('hashchange',openUrlNode);
openUrlNode();
