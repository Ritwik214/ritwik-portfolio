import {useEffect,useState,useRef,Fragment} from 'react'
import Fx from './Fx'
import {Hov,Hint,Icon} from './ui'
import {LINKS,PROFILE,EXP,PROJ,SKILLS,KHAT} from './data'
import hero from './art/hero.png'
import logo from './art/logo.png'
import friendship from './art/friendship.png'
import romance from './art/romance.png'
import support from './art/support.png'
import meaningful from './art/meaningful.png'
import casual from './art/casual.png'
const KIDS=[[friendship,'Friendship'],[romance,'Romance'],[support,'Support'],[meaningful,'Meaningful'],[casual,'Casual']]
// background-image crop of the hero art, like a close-up comic panel
const crop=(cx,cy,z,asp)=>{const Hc=1/asp,Hi=z/1.139;return{backgroundImage:`url(${hero})`,backgroundSize:`${z*100}% auto`,backgroundPosition:`${(cx*z-.5)/(z-1)*100}% ${(Hc/2-cy*Hi)/(Hc-Hi)*100}%`}}
const goto=(e,k)=>{e.preventDefault();const s=document.getElementById('s'+k);scrollTo({top:s.offsetTop+(k===5?0:.1)*(s.offsetHeight-innerHeight),behavior:'smooth'})}

const Defs=()=><svg width="0" height="0" style={{position:'absolute'}} aria-hidden="true"><defs>
 <filter id="rough"><feTurbulence baseFrequency=".03" numOctaves="2" seed="5"/><feDisplacementMap in="SourceGraphic" scale="4"/></filter>
 <pattern id="hdk" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(38)"><line y2="5" stroke="#0e0d0c" strokeWidth=".9"/></pattern></defs></svg>
const CloudTop=()=><svg className="ct" data-m="0,-8" viewBox="0 0 1000 220" preserveAspectRatio="none" aria-hidden="true"><g fill="#2a2b36" filter="url(#rough)"><rect width="1000" height="110"/>
 {[40,130,215,300,395,480,575,660,750,840,930].map((x,i)=><circle key={x} cx={x} cy="112" r={[44,60,38,66,48,58,40,64,46,56,42][i]}/>)}</g></svg>

// Smooth scroll-driven scenes: each scene is a tall block with a pinned stage; progress is eased.
function useScenes(){
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('rm');return}
  const C=v=>v<0?0:v>1?1:v
  const S=[...document.querySelectorAll('.scene')].map(el=>({el,cur:0,it:[...el.querySelectorAll('[data-a],[data-m]')]}))
  const nav=[...document.querySelectorAll('nav a')],bar=document.getElementById('prog');let id,vh=innerHeight
  const rs=()=>{vh=innerHeight};addEventListener('resize',rs)
  const frame=()=>{
   const mx=document.documentElement.scrollHeight-vh;bar.style.height=(mx>0?scrollY/mx*100:0)+'%';let act=0
   S.forEach((s,k)=>{const r=s.el.getBoundingClientRect()
    if(r.top<vh*.5&&r.bottom>vh*.5)act=k
    if(r.bottom<-60||r.top>vh+60)return
    const t=C(-r.top/(r.height-vh));s.cur+=(t-s.cur)*.11;if(Math.abs(t-s.cur)<.0005)s.cur=t;const pr=s.cur
    s.it.forEach(el=>{let a=el.dataset.a,f=el.dataset.f,m=el.dataset.m,p=1,tf=''
     if(a){a=a.split(',').map(Number);p=C((pr-a[0])/Math.max(a[1]-a[0],.001));p=p*p*(3-2*p);el.style.opacity=p}
     if(f){f=f.split(',').map(Number);tf+=`translate(${f[0]*(1-p)}vw,${f[1]*(1-p)}vh) scale(${1+(f[2]-1)*(1-p)}) `}
     if(m){m=m.split(',').map(Number);tf+=`translate(${m[0]*pr}vw,${m[1]*pr}vh)`}
     el.style.transform=tf})
    // finale dissolve
    if(s.el.id==='s5'){const q=pr;const g=n=>document.getElementById(n).style
     const h=document.querySelector('.hold'),fn=document.querySelector('.fin');if(h)h.style.pointerEvents=q>.5?'none':'auto';if(fn)fn.style.pointerEvents=q>.78?'auto':'none';g('st').opacity=C((q-.45)*3.5);g('blk').opacity=C((q-.58)*3);g('cols').opacity=C((q-.7)*3.5);g('cols').transform=`translateY(${(1-C((q-.7)*2.5))*40}%)`}})
   nav.forEach(a=>a.classList.toggle('on',+a.dataset.s===act))
   id=requestAnimationFrame(frame)}
  id=requestAnimationFrame(frame)
  return()=>{cancelAnimationFrame(id);removeEventListener('resize',rs)}
 },[])
}
const pick=(set,i)=>({onPointerEnter:e=>e.pointerType==='mouse'&&set(i),onFocus:()=>set(i),onClick:()=>set(i)})

// Press and hold the portal: the ring fills, and when the circle completes LinkedIn opens.
function HoldRing(){
 const [p,setP]=useState(0),[done,setDone]=useState(false),S=useRef({hold:false,p:0,t:0,done:false,id:0}),C=298.45
 useEffect(()=>{
  const s=S.current;s.t=performance.now()
  const loop=t=>{const dt=t-s.t;s.t=t
   if(!s.done){const np=Math.max(0,Math.min(1,s.p+(s.hold?dt/1100:-dt/600)));if(np!==s.p){s.p=np;setP(np)}
    if(np>=1){s.done=true;setDone(true);const w=window.open(LINKS.linkedin,'_blank');if(w)w.opener=null;else location.assign(LINKS.linkedin)
     setTimeout(()=>{s.done=false;s.hold=false;s.p=0;setDone(false);setP(0)},2500)}}
   s.id=requestAnimationFrame(loop)}
  s.id=requestAnimationFrame(loop);return()=>cancelAnimationFrame(s.id)
 },[])
 const down=e=>{e.currentTarget.setPointerCapture&&e.currentTarget.setPointerCapture(e.pointerId);S.current.hold=true},up=()=>{S.current.hold=false}
 const key=v=>e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();S.current.hold=v}}
 return <div className="hold" role="button" tabIndex={0} aria-label="Press and hold to open my LinkedIn profile" style={{'--p':p}}
  onPointerDown={down} onPointerUp={up} onPointerCancel={up} onPointerLeave={up} onKeyDown={key(true)} onKeyUp={key(false)} onContextMenu={e=>e.preventDefault()}>
  <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="47.5" className="trk"/><circle cx="50" cy="50" r="47.5" className="bar" strokeDasharray={C} strokeDashoffset={C*(1-p)}/></svg>
  <span className="hl mono">{done?'Opening LinkedIn…':p>0?'Keep holding…':'Hold the circle to open LinkedIn'}</span></div>
}
function Title(){return <section className="scene" id="s0" style={{height:'260vh'}}><div className="stage navy">
 <svg className="swirl" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true"><g fill="none" stroke="#0b0b10" strokeWidth="15" strokeLinecap="round" opacity=".6" filter="url(#rough)">
  <path d="M-20 90C200 20 330 170 520 90S860 30 1040 130"/><path d="M-20 200C150 150 300 260 520 190S880 140 1040 240"/><path d="M-20 330C240 270 380 400 600 320S900 300 1040 380"/><path d="M-20 450C180 400 360 500 560 430"/></g></svg>
 <div className="abs ttl" style={{left:'50%',top:'30%'}}><h1 className="vt big">Ritwik<br/>Gupta</h1></div>
 <svg className="abs cloud" data-m="0,-30" viewBox="0 0 800 300" aria-hidden="true"><g filter="url(#rough)" fill="#f3ece8"><circle cx="400" cy="170" r="130"/><circle cx="300" cy="190" r="90"/><circle cx="510" cy="190" r="100"/><circle cx="210" cy="230" r="70"/><circle cx="620" cy="235" r="75"/><rect y="230" width="800" height="140"/><circle cx="365" cy="62" r="14"/><circle cx="440" cy="48" r="9"/></g></svg>
 <div className="cap" data-a=".12,.35" data-f="-6,0,1" style={{left:'27%',top:'84%'}}>Senior Software Engineer. Java backend, Spring Boot and EDI integrations. Bengaluru.</div>
 <div className="abs scr mono" style={{left:'50%',top:'58%',zIndex:3}}>Scroll</div>
</div></section>}

function Profile(){return <section className="scene" id="s1" style={{height:'330vh'}}><div className="stage paper">
 <CloudTop/>
 <div className="abs art" data-a=".04,.26" data-f="0,12,.94" style={{left:'50%',top:'56%'}}>
  <img src={hero} alt="Two friends sit facing each other with coffee, a chat bubble and a heart floating between them. Artwork from ख़त." width="2000" height="1756"/>
  <Hov className="hs hg" label="Profile. Hover or tap for the character sheet."><span className="ping" style={{left:'52%',top:'16%'}}><b className="mono">Profile</b></span>
   <div className="sheets">{PROFILE.map((s,i)=><div className="sheet em" key={s.h} style={{'--i':i,'--dx':'0px','--dy':'40px','--rr':(i%2?4:-4)+'deg'}}><h4>{s.h}</h4><dl>{s.rows.map(([a,b])=><Fragment key={a}><dt>{a}</dt><dd>{b}</dd></Fragment>)}</dl></div>)}</div></Hov>
  <Hov className="hs hbk" label="ख़त. Hover or tap to see my side project."><span className="ping" style={{left:'36%',top:'22%'}}><b className="mono">ख़त</b></span>
   <div className="kcard em" style={{'--dx':'0px','--dy':'40px'}}><img className="plate" src={logo} alt="ख़त Khat" height="56"/><p className="hi">{KHAT.tagline}</p><p className="mono" style={{fontSize:'.66rem'}}>Early beta · live now</p><a className="btn sm" href={KHAT.url} title={KHAT.title} target="_blank" rel="noopener">Try the beta</a></div></Hov>
 </div>
 <div className="abs inset" data-a=".18,.4" data-f="-25,0,1" style={{left:'14%',top:'27%',...crop(.23,.44,4.2,4/3)}}/>
 <div className="abs inset r" data-a=".26,.48" data-f="25,0,1" style={{left:'86%',top:'27%',...crop(.72,.46,4.2,4/3)}}/>
 <div className="cap" data-a=".08,.26" data-f="0,-8,1" style={{left:'50%',top:'25%'}}><b className="mono">Profile</b>Ritwik Kumar Gupta. Senior Software Engineer at Justransform, Bengaluru.</div>
 <div className="cap" data-a=".5,.7" data-f="0,8,1" style={{left:'50%',top:'88%'}}>10+ integrations live. Java, Spring Boot, EDI, e-invoicing.</div>
 <div className="cap" data-a=".72,.9" style={{left:'84%',top:'86%',width:'min(190px,40vw)'}}>Hover the two characters.</div>
</div></section>}

function Exp(){const [a,setA]=useState(null),E=[...EXP].reverse(),c=a===null?null:E[a],lab=['2012 · Shop','2023 · LaserPay','2025 · Engineer','2026 · Senior']
 return <section className="scene" id="s2" style={{height:'320vh'}}><div className="stage paper">
 <CloudTop/><div className="abs moon" data-m="0,5" style={{left:'80%',top:'23%'}}/><div className="abs sunS" style={{left:'92%',top:'42%'}}/>
 <div className="abs sframe" data-a=".03,.25" data-f="14,0,1" style={{left:'69%',top:'59%'}}>
  <svg viewBox="0 0 400 300" preserveAspectRatio="none" aria-hidden="true">{Array.from({length:12},(_,i)=>{const y=290-i*22,x=20+i*12;return <g key={i}><rect x={x} y={y} width={360-i*20} height="18" rx="5" fill="#f3ece8" stroke="#0e0d0c" strokeWidth="1.3" vectorEffect="non-scaling-stroke"/><rect x={x+4} y={y+9} width={352-i*20} height="8" fill="url(#hdk)" opacity=".55"/></g>})}</svg>
  {E.map((e,i)=><button key={i} className={'stp'+(a===i?' on':'')} style={{left:i%2?'70%':'30%',top:[90,68,46,24][i]+'%'}} {...pick(setA,i)}><b className="mono">{lab[i]}</b>{e.role}</button>)}
  <svg className="plane2" data-m="0,-40" viewBox="0 0 60 40" aria-hidden="true"><path d="M2 20L58 2 38 38 27 24z" fill="#fff" stroke="#0e0d0c" strokeWidth="2"/><path d="M27 24L58 2" stroke="#0e0d0c" strokeWidth="1.5"/></svg></div>
 {c?<div className="xcard" key={a}><div className="cap pi" style={{'--i':0}}><b className="mono">{c.when}</b><h3 className="disp">{c.role}</h3><span className="mono">{c.org}</span></div>
  {c.bul.map((b,i)=><div className="bb pi" key={b} style={{'--i':i+1,'--dx':i%2?'40px':'-40px','--dy':'0px'}}>{b}</div>)}
  {c.stats.length>0&&<div className="stats">{c.stats.map(([n,l],i)=><div className="stamp pi" key={l} style={{'--i':i+c.bul.length+1,'--rr':(i%2?6:-6)+'deg'}}><b className="disp">{n}</b><span className="mono">{l}</span></div>)}</div>}
  <div className="tags">{c.tags.map((t,i)=><span className="pi" key={t} style={{'--i':i+c.bul.length+2,'--dy':'-24px'}}>{t}</span>)}</div></div>
 :<div className="cap xh" data-a=".1,.3"><b className="mono">Experience</b>Hover a step on the stairs to open that chapter of my career.</div>}
</div></section>}

function Proj(){const [a,setA]=useState(null),p=a===null?null:PROJ[a]
 return <section className="scene" id="s3" style={{height:'300vh'}}><div className="stage paper">
 <div className="abs pil" data-a=".02,.2" data-f="-10,0,1" style={{left:'5%',top:'46%'}}/><div className="abs pil" data-a=".02,.2" data-f="10,0,1" style={{left:'95%',top:'46%'}}/>
 <div className="abs sun3" data-a="0,.3" data-f="0,14,.6" data-m="0,-3" style={{left:'50%',top:'44%'}}/>
 {p?<div className="fp" key={a}>
  <div className="cap pi" style={{'--i':0}}>{p.khat&&<img className="plate" src={logo} alt="ख़त Khat" height="44"/>}<b className="mono">{p.client}</b><h3 className="disp">{p.title}</h3><span className="mono">{p.met} · {p.ml}</span></div>
  <div className="nds">{p.flow.map(([x,y],i)=><Fragment key={x}><div className="nd pi" style={{'--i':i+1,'--n':p.flow.length,'--dx':'-26px','--dy':'0px'}}><i className="mono">{String(i+1).padStart(2,'0')}</i><b>{x}</b><span className="mono">{y}</span></div>{i<p.flow.length-1&&<i className="ar pi" style={{'--i':i+1.5}} aria-hidden="true"/>}</Fragment>)}</div>
  {p.khat&&<div className="kids">{KIDS.map(([s,l],i)=><figure className="kid pi" key={l} style={{'--i':p.flow.length+i,'--rr':(i%2?3:-3)+'deg'}}><img src={s} alt=""/><figcaption className="mono">{l}</figcaption></figure>)}<a className="btn sm" href={KHAT.url} title={KHAT.title} target="_blank" rel="noopener">Try the beta</a></div>}
  <p className="mono nt">Simplified flow</p></div>
 :<div className="cap xh2" data-a=".1,.3"><b className="mono">Projects</b>Hover a project below to trace how its data moves.</div>}
 <div className="pbs" data-a=".08,.28" data-f="0,10,1">{PROJ.map((q,i)=><button key={q.title} className={'pb'+(a===i?' on':'')} {...pick(setA,i)}><b className="disp">{q.khat?'ख़त':q.client}</b><span className="mono">{q.met}</span></button>)}</div>
</div></section>}

function Skills(){return <section className="scene" id="s4" style={{height:'260vh'}}><div className="stage redf">
 <div className="cap" data-a=".02,.18" style={{left:'22%',top:'20%'}}><b className="mono">Skills</b>Hover a symbol to summon the tools.</div>
 <div className="sks" data-a=".08,.3" data-f="0,12,1">{SKILLS.map(s=><Hov key={s.k} className="sk" label={s.k+' skills'}>
  <div className="orbit"><div className="ring" aria-hidden="true"/><div className="kjb disp" aria-hidden="true">{s.kj}</div>
   {s.tools.map(([n,k],i)=><div className="ico" key={n} style={{'--a':(360/s.tools.length*i-90)+'deg','--i':i}}><Icon k={k}/><span className="mono">{n}</span></div>)}</div>
  <h3 className="disp">{s.k}</h3><Hint/></Hov>)}</div>
</div></section>}

function Finale(){return <section className="scene" id="s5" style={{height:'380vh'}}><div className="stage paper">
 <div className="abs ring2" data-a="0,.25" data-f="0,16,.7" data-m="0,-4" style={{left:'50%',top:'46%'}}><div className="disc"><div className="crop" style={crop(.46,.43,3.6,1)}/></div><HoldRing/></div>
 <div className="cap" data-a=".15,.32" style={{left:'27%',top:'20%',zIndex:2}}>Take a deep breath.</div>
 <div className="abs stripes" id="st" style={{left:'50%',top:'50%',width:'100%',height:'100%',opacity:0}}/>
 <div className="abs" id="blk" style={{left:'50%',top:'50%',width:'100%',height:'100%',background:'#1b1c24',opacity:0}}/>
 <div className="abs cols" id="cols" aria-hidden="true">{[3,10,18,27,73,82,90,97].map((x,i)=><i key={x} style={{left:x+'%',height:[62,78,55,70,70,55,78,62][i]+'%',width:(3+i%3)+'vw'}}/>)}</div>
 <div className="fin" data-a=".74,.9"><p className="mono" style={{fontSize:'.7rem'}}>To be continued…</p><h2 className="vt sm">Let's talk.<br/>Let's connect.</h2>
  <div className="links"><a className="btn" href={'mailto:'+LINKS.email}>Email me</a><a className="btn" href={LINKS.linkedin} target="_blank" rel="noopener">LinkedIn</a><a className="btn" href={LINKS.github} target="_blank" rel="noopener">GitHub</a></div></div>
</div></section>}

export default function App(){
 useScenes()
 return <>
 <Defs/><Fx/><div className="fr"/><div id="prog"/>
 <header><a className="lg" href="#s0" onClick={e=>goto(e,0)} aria-label="Ritwik Gupta, top"><i>R</i><span>Ritwik</span></a>
  <nav aria-label="Sections">{['Profile','Experience','Projects','Skills','Contact'].map((n,i)=><a key={n} href={'#s'+(i+1)} data-s={i+1} onClick={e=>goto(e,i+1)}>{n}</a>)}</nav></header>
 <div className="eq" aria-hidden="true"><i/><i/><i/><i/></div>
 <main><Title/><Profile/><Exp/><Proj/><Skills/><Finale/></main></>
}
