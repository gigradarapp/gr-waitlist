import React from 'react'
import { TWEAK_DEFAULTS } from './tweaks'
import { TALLY_EMBED_URL, TALLY_FORM_ID, initTallyEmbeds } from './tally'
import { fetchTallyCompletedCount } from './tallyCount'

// ── Helpers ──────────────────────────────────────────────────────────
const O = '#E24325'

// ── Live Counter (Tally count; skeleton while loading if API key is set) ──
type LiveCounterProps = { fallbackCount: number; city: string }

const LiveCounter = ({ fallbackCount, city }: LiveCounterProps) => {
  const [count, setCount] = React.useState<number | null>(null)
  const [fromTally, setFromTally] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    ;(async () => {
      const n = await fetchTallyCompletedCount(TALLY_FORM_ID)
      if (cancelled) return
      if (n !== null) {
        setCount(n)
        setFromTally(true)
      } else {
        setCount(fallbackCount)
        setFromTally(false)
      }
    })()

    return () => {
      cancelled = true
    }
  }, [fallbackCount])

  const loading = count === null

  return (
    <div
      role="status"
      aria-busy={loading}
      aria-live="polite"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 999, padding: '7px 16px' }}
    >
      {loading ? (
        <span className="live-counter-skeleton-dot" aria-hidden />
      ) : (
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: O, display: 'inline-block', animation: fromTally ? 'pulse 2s ease-in-out infinite' : undefined, opacity: fromTally ? 1 : 0.75 }} />
      )}
      <span style={{ fontSize: 13, color: '#C0C0C0' }}>
        {loading ? (
          <>
            <span className="live-counter-skeleton-num" aria-hidden />
            {' '}
            <span style={{ color: '#7a7a7a' }}>people waiting in {city}</span>
          </>
        ) : (
          <>
            <span style={{ fontWeight: 700, color: '#fff' }}>{count.toLocaleString()}</span>
            {' '}people waiting in {city}
          </>
        )}
      </span>
    </div>
  )
}

// ── Main App ─────────────────────────────────────────────────────────
export const App = () => {
  const city = window.__tweakCity ?? TWEAK_DEFAULTS.city
  const [baseCount] = React.useState(window.__tweakCount ?? TWEAK_DEFAULTS.startCount)

  React.useEffect(() => {
    initTallyEmbeds()
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: '#fff' }}>

      {/* ── NAV ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
        <img src="/logo-wordmark.png" alt="buzo" style={{ filter: 'invert(1)', height: 32, width: 'auto' }} />
        <button
          type="button"
          onClick={() => document.getElementById('cta')?.scrollIntoView({ block: 'center' })}
          style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 999, padding: '8px 20px', color: '#fff', fontFamily: "'DM Sans',sans-serif", fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
        >
          Join waitlist
        </button>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(226,67,37,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, width: '100%' }}>

          <div style={{ fontFamily: "'Covered By Your Grace',cursive", fontSize: 26, color: O, marginBottom: 16, transform: 'rotate(-1deg)', display: 'inline-block' }}>
            tonight&apos;s plans, figured out
          </div>

          <h1 style={{ fontSize: 'clamp(36px, 6vw, 68px)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#fff', marginBottom: 20, textWrap: 'balance' }}>
            The AI friend who always knows what&apos;s on tonight.
          </h1>

          <p style={{ fontSize: 'clamp(15px, 2vw, 18px)', color: '#8A8A8A', lineHeight: 1.6, marginBottom: 36, maxWidth: 480, margin: '0 auto 36px' }}>
            buzo pulls from Instagram, TikTok, and your friends — then tells you exactly where to go.
          </p>

          <div style={{ marginBottom: 36 }}>
            <LiveCounter fallbackCount={baseCount} city={city} />
          </div>

          {/* Tally waitlist embed */}
          <div id="cta" style={{ width: '100%', maxWidth: 560, margin: '0 auto' }}>
            <iframe
              data-tally-src={TALLY_EMBED_URL}
              loading="lazy"
              width="100%"
              height={770}
              title="Buzo Waiting List"
              style={{ border: 0, display: 'block', width: '100%', minHeight: 420, colorScheme: 'normal' }}
            />
          </div>

          <div style={{ marginTop: 16, fontSize: 12, color: '#555' }}>
            No spam. Access unlocks in {city} first.
          </div>
        </div>
      </section>

      {/* ── DEMO ── */}
      <section style={{ padding: '80px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 48 }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          <div style={{ fontFamily: "'Covered By Your Grace',cursive", fontSize: 24, color: O, marginBottom: 10, transform: 'rotate(-0.5deg)', display: 'inline-block' }}>how it works</div>
          <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            buzo does the scout work.<br />You just show up.
          </h2>
        </div>

        <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
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
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 280 }}>
            {[
              { num: '01', title: 'Pulls from everywhere', body: "Instagram, TikTok, Facebook, Xiaohongshu. If it's happening tonight, buzo finds it." },
              { num: '02', title: 'Verifies before you show up', body: 'No stale listings. buzo checks sources and timestamps every event.' },
              { num: '03', title: 'Knows what your friends are doing', body: 'See exactly where your people are headed. No group chat needed.' },
            ].map(({ num, title, body }) => (
              <div key={num} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ fontFamily: "'Covered By Your Grace',cursive", fontSize: 22, color: O, flexShrink: 0, lineHeight: 1, marginTop: 2 }}>{num}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color: '#8A8A8A', lineHeight: 1.6 }}>{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CREDIBILITY ── */}
      <section style={{ padding: '60px 24px 100px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ maxWidth: 560, textAlign: 'center' }}>
          <div style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.1)', margin: '0 auto 36px' }} />
          <blockquote style={{ fontFamily: "'Covered By Your Grace',cursive", fontSize: 'clamp(22px,3.5vw,32px)', color: '#fff', lineHeight: 1.4, marginBottom: 24 }}>
            &quot;I&apos;ve spent 14 years watching people miss the best nights out. Buzo fixes that.&quot;
          </blockquote>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: '2px solid rgba(226,67,37,0.4)' }}>
              <img src="/founder.jpg" alt="Clarence Chan" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'grayscale(1)' }} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>Clarence — Co-Founder, Buzo</div>
              <div style={{ fontSize: 12, color: '#8A8A8A', marginTop: 1 }}>Founder of Bandwagon · 15 years in nightlife & live events</div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <img src="/logo-wordmark.png" alt="buzo" style={{ filter: 'invert(1)', height: 22, width: 'auto', opacity: 0.5 }} />
        <div style={{ fontSize: 12, color: '#555' }}>
          © 2026 buzo. Singapore.
        </div>
      </footer>

    </div>
  )
}
