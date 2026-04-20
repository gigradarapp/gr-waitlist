import React from 'react'
import { TWEAK_DEFAULTS } from './tweaks'

// ── Helpers ──────────────────────────────────────────────────────────
const O = '#E24325';
const genCode = () => 'buzo-' + Math.random().toString(36).slice(2,8).toUpperCase();
const genPos  = () => Math.floor(Math.random() * 400) + 700;

// ── Live Counter ─────────────────────────────────────────────────────
type LiveCounterProps = { initialCount: number; city: string }

const LiveCounter = ({ initialCount, city }: LiveCounterProps) => {
  const [count, setCount] = React.useState(initialCount);
  const [ticking, setTicking] = React.useState(false);

  React.useEffect(() => {
    const tick = () => {
      const delay = 6000 + Math.random() * 10000;
      return setTimeout(() => {
        setTicking(true);
        setTimeout(() => {
          setCount((c: number) => c + Math.floor(Math.random() * 3) + 1);
          setTicking(false);
        }, 500);
        tick();
      }, delay);
    };
    const t = tick();
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:999, padding:'7px 16px'}}>
      <span style={{width:6, height:6, borderRadius:'50%', background:O, display:'inline-block', animation:'pulse 2s ease-in-out infinite'}} />
      <span style={{fontSize:13, color:'#C0C0C0'}}>
        <span className={ticking ? 'counter-tick' : ''} style={{fontWeight:700, color:'#fff'}}>{count.toLocaleString()}</span>
        {' '}people waiting in {city}
      </span>
    </div>
  );
};

// ── Main App ─────────────────────────────────────────────────────────
export const App = () => {
  const [email, setEmail]         = React.useState('');
  const [error, setError]         = React.useState('');
  const [loading, setLoading]     = React.useState(false);
  const [city, setCity]           = React.useState(window.__tweakCity || TWEAK_DEFAULTS.city);
  const [baseCount, setBaseCount] = React.useState(window.__tweakCount || TWEAK_DEFAULTS.startCount);
  // Signed-up state
  const [signedUp, setSignedUp] = React.useState(() => {
    if (window.__tweakState) return window.__tweakState === 'post';
    return !!localStorage.getItem('buzo_email');
  });
  const [position, setPosition] = React.useState(() => {
    const raw = localStorage.getItem('buzo_position')
    const n = raw ? parseInt(raw, 10) : NaN
    return Number.isFinite(n) ? n : genPos()
  })
  const [refCode, setRefCode] = React.useState(() => {
    return localStorage.getItem('buzo_ref_code') || genCode();
  });
  const [copied, setCopied] = React.useState(false);

  // Tweak bridges
  React.useEffect(() => {
    window.__tweakStateChange = s => setSignedUp(s === 'post');
    window.__tweakCityChange  = c => setCity(c);
    window.__tweakCountChange = c => setBaseCount(c);
    return () => {
      delete window.__tweakStateChange
      delete window.__tweakCityChange
      delete window.__tweakCountChange
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes('@')) { setError('Enter a valid email'); return; }
    setLoading(true);
    setTimeout(() => {
      const pos = genPos();
      const code = genCode();
      localStorage.setItem('buzo_email', email);
      localStorage.setItem('buzo_position', String(pos));
      localStorage.setItem('buzo_ref_code', code);
      setPosition(pos);
      setRefCode(code);
      setSignedUp(true);
      setLoading(false);
    }, 900);
  };

  const copyLink = () => {
    const link = `https://buzo.app/r/${refCode}`;
    navigator.clipboard.writeText(link).catch(()=>{});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const refLink = `buzo.app/r/${refCode}`;

  return (
    <div style={{minHeight:'100vh', background:'#000', color:'#fff'}}>

      {/* ── NAV ── */}
      <nav style={{position:'fixed', top:0, left:0, right:0, zIndex:100, padding:'20px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', background:'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)'}}>
        <img src={"/logo-wordmark.png"} alt="buzo" style={{filter:'invert(1)', height:32, width:'auto'}} />
        {!signedUp && (
          <button onClick={() => document.getElementById('cta')?.scrollIntoView({ block: 'center' })}
            style={{background:'none', border:'1px solid rgba(255,255,255,0.15)', borderRadius:999, padding:'8px 20px', color:'#fff', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:500, cursor:'pointer'}}>
            Join waitlist
          </button>
        )}
      </nav>

      {/* ── HERO ── */}
      <section style={{minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'120px 24px 80px', textAlign:'center', position:'relative'}}>
        {/* Background grain */}
        <div style={{position:'absolute', inset:0, backgroundImage:'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226,67,37,0.08) 0%, transparent 70%)', pointerEvents:'none'}} />

        <div style={{position:'relative', zIndex:1, maxWidth:680}}>

          {!signedUp ? (<>
            {/* Handwritten pre-headline */}
            <div style={{fontFamily:"'Covered By Your Grace',cursive", fontSize:26, color:O, marginBottom:16, transform:'rotate(-1deg)', display:'inline-block'}}>
              tonight's plans, figured out
            </div>

            {/* Hero headline */}
            <h1 style={{fontSize:'clamp(36px, 6vw, 68px)', fontWeight:700, lineHeight:1.05, letterSpacing:'-0.03em', color:'#fff', marginBottom:20, textWrap:'balance'}}>
              The AI friend who always knows what's on tonight.
            </h1>

            <p style={{fontSize:'clamp(15px, 2vw, 18px)', color:'#8A8A8A', lineHeight:1.6, marginBottom:36, maxWidth:480, margin:'0 auto 36px'}}>
              buzo pulls from Instagram, TikTok, and your friends — then tells you exactly where to go.
            </p>

            {/* Live counter */}
            <div style={{marginBottom:36}}>
              <LiveCounter initialCount={baseCount} city={city} />
            </div>

            {/* Email form */}
            <form id="cta" onSubmit={handleSubmit} style={{display:'flex', gap:10, maxWidth:440, margin:'0 auto', flexWrap:'wrap', justifyContent:'center'}}>
              <input
                type="email" value={email} onChange={e => { setEmail(e.target.value); setError(''); }}
                placeholder="your@email.com"
                style={{flex:1, minWidth:220, background:'#1A1A1A', border:`1px solid ${error ? O : 'rgba(255,255,255,0.12)'}`, borderRadius:10, padding:'14px 16px', fontFamily:"'DM Sans',sans-serif", fontSize:15, color:'#fff', outline:'none'}}
                onFocus={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.25)'
                }}
                onBlur={(e) => {
                  (e.target as HTMLInputElement).style.borderColor = error ? O : 'rgba(255,255,255,0.12)'
                }}
              />
              <button type="submit" disabled={loading}
                style={{background:O, color:'#fff', border:'none', borderRadius:10, padding:'14px 28px', fontFamily:"'DM Sans',sans-serif", fontSize:15, fontWeight:600, cursor: loading ? 'default' : 'pointer', opacity: loading ? 0.7 : 1, whiteSpace:'nowrap', transition:'background 0.18s'}}
                onMouseEnter={(e) => {
                  if (!loading) (e.currentTarget as HTMLButtonElement).style.background = '#C23820'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.background = O
                }}>
                {loading ? 'Joining...' : 'Get early access'}
              </button>
              {error && <div style={{width:'100%', fontSize:12, color:O, marginTop:4}}>{error}</div>}
            </form>

            <div style={{marginTop:16, fontSize:12, color:'#555'}}>
              No spam. Access unlocks in {city} first.
            </div>
          </>) : (<>

            {/* ── POST SIGNUP ── */}
            <div style={{animation:'slideUp 0.5s ease-out'}}>
              <div style={{fontFamily:"'Covered By Your Grace',cursive", fontSize:28, color:O, marginBottom:12, transform:'rotate(-1deg)', display:'inline-block'}}>
                you're in.
              </div>

              {/* Position card */}
              <div style={{background:'#0d0d0d', border:'1px solid rgba(226,67,37,0.2)', borderRadius:16, padding:'32px 36px', marginBottom:28, display:'inline-block', boxShadow:'0 0 40px rgba(226,67,37,0.1)', minWidth:320}}>
                <div style={{fontSize:12, fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'#8A8A8A', marginBottom:10}}>Your position</div>
                <div style={{fontSize:72, fontWeight:700, letterSpacing:'-0.04em', color:'#fff', lineHeight:1}}>
                  #{position.toLocaleString()}
                </div>
                <div style={{fontSize:14, color:'#8A8A8A', marginTop:8}}>in the {city} waitlist</div>
              </div>

              <h2 style={{fontSize:'clamp(22px, 4vw, 36px)', fontWeight:700, letterSpacing:'-0.02em', color:'#fff', marginBottom:12, lineHeight:1.2}}>
                Move up 5 spots for every friend who joins.
              </h2>
              <p style={{fontSize:15, color:'#8A8A8A', marginBottom:28, maxWidth:420, margin:'0 auto 28px', lineHeight:1.6}}>
                Share your link. Each friend who signs up bumps you forward. The earlier you get in, the earlier you get access.
              </p>

              {/* Referral link */}
              <div style={{background:'#111', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:'16px 20px', maxWidth:440, margin:'0 auto 12px', display:'flex', alignItems:'center', gap:12, flexWrap:'wrap'}}>
                <div style={{flex:1, fontFamily:"'DM Sans',sans-serif", fontSize:14, color:'#C0C0C0', wordBreak:'break-all', minWidth:160}}>
                  {refLink}
                </div>
                <button onClick={copyLink}
                  style={{background: copied ? '#1a3d1a' : O, color:'#fff', border:'none', borderRadius:8, padding:'10px 18px', fontFamily:"'DM Sans',sans-serif", fontSize:13, fontWeight:600, cursor:'pointer', flexShrink:0, transition:'background 0.2s'}}>
                  {copied ? 'Copied ✓' : 'Copy link'}
                </button>
              </div>
              <div style={{fontSize:12, color:'#555'}}>Early access — not a newsletter. Your link, your spots.</div>
            </div>
          </>)}
        </div>
      </section>

      {/* ── DEMO ── */}
      <section style={{padding:'80px 24px', display:'flex', flexDirection:'column', alignItems:'center', gap:48}}>
        <div style={{textAlign:'center', maxWidth:480}}>
          <div style={{fontFamily:"'Covered By Your Grace',cursive", fontSize:24, color:O, marginBottom:10, transform:'rotate(-0.5deg)', display:'inline-block'}}>how it works</div>
          <h2 style={{fontSize:'clamp(24px, 4vw, 40px)', fontWeight:700, letterSpacing:'-0.02em', lineHeight:1.15}}>
            buzo does the scout work.<br/>You just show up.
          </h2>
        </div>

        <div style={{display:'flex', gap:40, alignItems:'center', flexWrap:'wrap', justifyContent:'center'}}>
          {/* Video demo in phone shell */}
          <div style={{position:'relative', flexShrink:0}}>
            <div style={{
              width: 260, height: 530,
              background: '#000',
              borderRadius: 36,
              overflow: 'hidden',
              boxShadow: '0 0 0 8px #111, 0 0 0 9px #222, 0 24px 80px rgba(0,0,0,0.9), 0 0 60px rgba(226,67,37,0.06)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <video
                src="/demo.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}
              />
            </div>
          </div>

          {/* Feature callouts */}
          <div style={{display:'flex', flexDirection:'column', gap:20, maxWidth:280}}>
            {[
              { num:'01', title:'Pulls from everywhere', body:'Instagram, TikTok, Facebook, Xiaohongshu. If it\'s happening tonight, buzo finds it.' },
              { num:'02', title:'Verifies before you show up', body:'No stale listings. buzo checks sources and timestamps every event.' },
              { num:'03', title:'Knows what your friends are doing', body:'See exactly where your people are headed. No group chat needed.' },
            ].map(({ num, title, body }) => (
              <div key={num} style={{display:'flex', gap:14, alignItems:'flex-start'}}>
                <div style={{fontFamily:"'Covered By Your Grace',cursive", fontSize:22, color:O, flexShrink:0, lineHeight:1, marginTop:2}}>{num}</div>
                <div>
                  <div style={{fontSize:15, fontWeight:600, color:'#fff', marginBottom:4}}>{title}</div>
                  <div style={{fontSize:13, color:'#8A8A8A', lineHeight:1.6}}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </section>

      {/* ── CREDIBILITY ── */}
      <section style={{padding:'60px 24px 100px', display:'flex', justifyContent:'center'}}>
        <div style={{maxWidth:560, textAlign:'center'}}>
          <div style={{width:48, height:1, background:'rgba(255,255,255,0.1)', margin:'0 auto 36px'}} />
          <blockquote style={{fontFamily:"'Covered By Your Grace',cursive", fontSize:'clamp(22px,3.5vw,32px)', color:'#fff', lineHeight:1.4, marginBottom:24}}>
            "I've spent 14 years watching people miss the best nights out. Buzo fixes that."
          </blockquote>
          <div style={{display:'flex', alignItems:'center', justifyContent:'center', gap:14}}>
            <div style={{width:48, height:48, borderRadius:'50%', overflow:'hidden', flexShrink:0, border:'2px solid rgba(226,67,37,0.4)'}}>
              <img src={"/founder.jpg"} alt="Clarence Chan" style={{width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', filter:'grayscale(1)' }} />
            </div>
            <div style={{textAlign:'left'}}>
              <div style={{fontSize:14, fontWeight:600, color:'#fff'}}>Clarence — Co-Founder, Buzo</div>
              <div style={{fontSize:12, color:'#8A8A8A', marginTop:1}}>Founder of Bandwagon · 15 years in nightlife & live events</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{borderTop:'1px solid rgba(255,255,255,0.06)', padding:'24px 40px', display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:12}}>
        <img src={"/logo-wordmark.png"} alt="buzo" style={{filter:'invert(1)', height:22, width:'auto', opacity:0.5}} />
        <div style={{fontSize:12, color:'#555'}}>
          © 2026 buzo. Singapore.
        </div>
      </footer>

    </div>
  );
};