import {useState} from 'react'
import icons from './icons.json'
// Hover on mouse, tap on touch, Enter/Space or Tab-focus on keyboard.
export function Hov({className='',children,label}){
 const [o,setO]=useState(false),mouse=e=>e.pointerType==='mouse'
 return <div className={'hov '+className+(o?' open':'')} tabIndex={0} role="group" aria-label={label}
  onPointerEnter={e=>mouse(e)&&setO(true)} onPointerLeave={e=>mouse(e)&&setO(false)}
  onPointerUp={e=>!mouse(e)&&setO(v=>!v)}
  onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&e.target===e.currentTarget&&(e.preventDefault(),setO(v=>!v))}
  onFocus={e=>e.target.matches(':focus-visible')&&setO(true)} onBlur={()=>setO(false)}>{children}</div>
}
export const Hint=()=><span className="hint mono" aria-hidden="true"/>
export const Icon=({k})=>icons[k]?<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={icons[k]}/></svg>
 :<svg viewBox="0 0 40 24" aria-hidden="true"><text x="20" y="16" textAnchor="middle" fontFamily="IBM Plex Mono,monospace" fontWeight="500" fontSize={k.length>3?9:11} fill="currentColor">{k.slice(0,4).toUpperCase()}</text></svg>
