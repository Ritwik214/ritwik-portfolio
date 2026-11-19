import {useEffect,useRef} from 'react'
const SFX=['ドン','バッ','ズバッ','ドドド','ピカッ','ゴッ','シュッ']
// Ambient embers, ink cursor, click sound-effects, intro cover and impact flash.
export default function Fx(){
 const cv=useRef(),dot=useRef(),ring=useRef(),plane=useRef()
 useEffect(()=>{
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return
  const fine=matchMedia('(pointer:fine)').matches
  const c=cv.current,x=c.getContext('2d'),root=document.documentElement
  let W,H,id
  const rs=()=>{W=c.width=innerWidth;H=c.height=innerHeight}
  rs()
  const mk=(px,py,sp)=>({x:px??Math.random()*W,y:py??H+8,vx:(Math.random()-.5)*(sp?3:.4),vy:sp?-Math.random()*2-.4:-(Math.random()*.6+.25),r:Math.random()*2+.8,l:1,d:sp?.03:.0025+Math.random()*.002,ph:Math.random()*6})
  const ps=Array.from({length:42},()=>{const p=mk();p.y=Math.random()*H;return p})
  const m={x:W/2,y:H/2,rx:W/2,ry:H/2},pl={x:W/2,y:H*.8,px:W/2,py:H*.8,tx:0,ty:0,a:0},trail=[]
  const move=e=>{m.x=e.clientX;m.y=e.clientY;document.body.classList.add('moved')
   root.style.setProperty('--mx',(e.clientX/W*2-1).toFixed(3));root.style.setProperty('--my',(e.clientY/H*2-1).toFixed(3))
   if(fine&&Math.random()<.6)ps.push(mk(e.clientX,e.clientY,1))
   document.querySelectorAll('.btn').forEach(b=>{const r=b.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2);b.style.translate=Math.hypot(dx,dy)<150?`${dx*.18}px ${dy*.18}px`:'0 0'})}
  const over=e=>ring.current&&ring.current.classList.toggle('big',!!(e.target.closest&&e.target.closest('a,.pnl')))
  const click=e=>{const s=document.createElement('span');s.className='pop';s.textContent=SFX[Math.random()*SFX.length|0]
   s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';s.style.setProperty('--rot',(Math.random()*30-15)+'deg')
   document.body.appendChild(s);setTimeout(()=>s.remove(),850)}
  const loop=()=>{
   x.clearRect(0,0,W,H);x.globalCompositeOperation='lighter'
   for(let i=ps.length-1;i>=0;i--){const p=ps[i];p.ph+=.02;p.x+=p.vx+Math.sin(p.ph)*.3;p.y+=p.vy;p.l-=p.d
    if(p.l<=0||p.y<-10){ps.splice(i,1);continue}
    x.fillStyle=`rgba(255,${40+p.l*40|0},30,${p.l*.8})`;x.beginPath();x.arc(p.x,p.y,p.r*(.5+p.l),0,6.3);x.fill()}
   while(ps.length<42)ps.push(mk())
   const ms=root.scrollHeight-H,pr=ms>0?scrollY/ms:0
   pl.x+=(W*(.5+.38*Math.sin(pr*Math.PI*9))-pl.x)*.1;pl.y+=(H*(.8+.05*Math.sin(pr*52))-pl.y)*.1
   const dx=pl.x-pl.px,dy=pl.y-pl.py;if(Math.hypot(dx,dy)>.4)pl.a=Math.atan2(dy,dx)
   if(Math.hypot(pl.x-pl.tx,pl.y-pl.ty)>14){trail.push({x:pl.x,y:pl.y});if(trail.length>16)trail.shift();pl.tx=pl.x;pl.ty=pl.y}
   pl.px=pl.x;pl.py=pl.y
   x.globalCompositeOperation='source-over'
   trail.forEach((t,k)=>{x.fillStyle=`rgba(242,238,230,${k/trail.length*.6})`;x.fillRect(t.x-1.5,t.y-1.5,3,3)})
   if(plane.current)plane.current.style.transform=`translate(${pl.x}px,${pl.y}px) rotate(${pl.a*57.3-16}deg)`
   m.rx+=(m.x-m.rx)*.16;m.ry+=(m.y-m.ry)*.16
   if(dot.current)dot.current.style.transform=`translate(${m.x}px,${m.y}px)`
   if(ring.current)ring.current.style.transform=`translate(${m.rx}px,${m.ry}px)`
   id=requestAnimationFrame(loop)}
  loop()
  addEventListener('resize',rs);addEventListener('pointermove',move,{passive:true});addEventListener('pointerover',over);addEventListener('pointerdown',click)
  return()=>{cancelAnimationFrame(id);removeEventListener('resize',rs);removeEventListener('pointermove',move);removeEventListener('pointerover',over);removeEventListener('pointerdown',click)}
 },[])
 return <>
  <div id="intro" aria-hidden="true"><i/><b className="disp">第零章</b></div>
  <div id="flash" aria-hidden="true"/>
  <canvas id="fx" ref={cv} aria-hidden="true"/>
  <svg className="plane" ref={plane} viewBox="0 0 60 40" aria-hidden="true"><path d="M2 20L58 2 38 38 27 24z" fill="#f2eee6" stroke="#0b0b0c" strokeWidth="1.5"/><path d="M27 24L58 2M27 24l-2 12 8-8" fill="none" stroke="#0b0b0c" strokeWidth="1.2"/><circle cx="58" cy="2" r="2.5" fill="#e5121b"/></svg>
  <div className="cur dot" ref={dot}/><div className="cur ring" ref={ring}/>
 </>
}
