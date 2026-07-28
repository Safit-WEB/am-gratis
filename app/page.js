'use client';

import { useState, useEffect } from 'react';

export default function Home() {
  const [step, setStep] = useState('landing'); // landing | ad | method | process | result
  const [method, setMethod] = useState(null); // 'email' | 'ready'
  const [email, setEmail] = useState('');
  const [link, setLink] = useState('');
  const [invoice, setInvoice] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [adClicked, setAdClicked] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Simulasi countdown iklan (bisa diganti dengan real ad)
  useEffect(() => {
    if (step === 'ad' && countdown > 0) {
      const t = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [step, countdown]);

  const startClaim = () => {
    setStep('ad');
    setCountdown(8); // 8 detik wajib nonton
    setAdClicked(false);
    setError('');
  };

  const handleAdClick = () => {
    setAdClicked(true);
    // Di sini bisa tracking klik iklan / affiliate
    // window.open('https://link-iklan-kamu.com', '_blank');
  };

  const continueAfterAd = () => {
    if (!adClicked && countdown > 0) {
      setError('Klik iklan dulu atau tunggu countdown selesai!');
      return;
    }
    setStep('method');
    setError('');
  };

  const selectMethod = (m) => {
    setMethod(m);
    setStep('process');
    setResult(null);
    setError('');
  };

  // ===== BUY SINGLE (Email Sendiri) =====
  const handleBuySingle = async () => {
    if (!email || !email.includes('@')) {
      setError('Masukkan email yang valid');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/am', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'buy_single', email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Gagal kirim verifikasi');
      setInvoice(data.invoice);
      setResult({ type: 'buy_single', message: data.message, email: data.email });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifySingle = async () => {
    if (!link || !link.includes('alight.link')) {
      setError('Masukkan link verifikasi yang valid dari email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/am', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'verify_single',
          invoice,
          email,
          link,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Gagal verifikasi');
      setResult({ type: 'success', message: 'Berhasil! Alight Motion Premium sudah aktif di email kamu.' });
      setStep('result');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ===== BUY BULK (Akun Siap Pakai) =====
  const handleBuyBulk = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/am', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'buy_bulk', qty: 1 }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Gagal generate akun');
      setResult({
        type: 'ready',
        accounts: data.data || [],
        invoice: data.invoice,
      });
      setStep('result');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <div style={styles.logo}>✨ Bagi AM Gratis</div>
          <p style={styles.subtitle}>Alight Motion Premium • 100% Gratis</p>
        </div>

        {/* LANDING */}
        {step === 'landing' && (
          <div style={styles.section}>
            <h1 style={styles.title}>Dapatkan Alight Motion Premium Gratis</h1>
            <p style={styles.desc}>
              Pilih cara kamu: pakai email sendiri atau ambil akun siap pakai.
              Cukup klik iklan dulu biar website ini tetap hidup.
            </p>
            <button style={styles.primaryBtn} onClick={startClaim}>
              Mulai Claim Gratis →
            </button>
          </div>
        )}

        {/* AD GATE */}
        {step === 'ad' && (
          <div style={styles.section}>
            <h2 style={styles.title}>Dukung Website Ini</h2>
            <p style={styles.desc}>
              Klik iklan di bawah atau tunggu {countdown} detik untuk melanjutkan.
              Iklan membantu kami menutup biaya server & stok AM.
            </p>

            {/* PLACEHOLDER IKLAN - Ganti dengan AdSense / PopAds / dll */}
            <div
              style={styles.adBox}
              onClick={handleAdClick}
            >
              <div style={{ fontSize: 14, opacity: 0.7 }}>
                {adClicked ? '✅ Iklan diklik' : '📢 Klik di sini untuk buka iklan'}
              </div>
              <div style={{ marginTop: 8, fontSize: 12, color: '#a1a1aa' }}>
                (Ganti area ini dengan unit AdSense / banner affiliate kamu)
              </div>
            </div>

            <button
              style={{
                ...styles.primaryBtn,
                opacity: adClicked || countdown === 0 ? 1 : 0.5,
                cursor: adClicked || countdown === 0 ? 'pointer' : 'not-allowed',
              }}
              onClick={continueAfterAd}
              disabled={!adClicked && countdown > 0}
            >
              {countdown > 0 && !adClicked
                ? `Tunggu ${countdown}s atau klik iklan`
                : 'Lanjutkan →'}
            </button>
            {error && <p style={styles.error}>{error}</p>}
          </div>
        )}

        {/* PILIH METHOD */}
        {step === 'method' && (
          <div style={styles.section}>
            <h2 style={styles.title}>Pilih Metode</h2>
            <div style={styles.methodGrid}>
              <button style={styles.methodCard} onClick={() => selectMethod('email')}>
                <div style={{ fontSize: 28 }}>📧</div>
                <div style={{ fontWeight: 600, marginTop: 8 }}>Email Sendiri</div>
                <div style={{ fontSize: 13, color: '#a1a1aa', marginTop: 4 }}>
                  Premium langsung ke email kamu
                </div>
              </button>
              <button style={styles.methodCard} onClick={() => selectMethod('ready')}>
                <div style={{ fontSize: 28 }}>⚡</div>
                <div style={{ fontWeight: 600, marginTop: 8 }}>Akun Siap Pakai</div>
                <div style={{ fontSize: 13, color: '#a1a1aa', marginTop: 4 }}>
                  Langsung dapat email + password
                </div>
              </button>
            </div>
            <button style={styles.secondaryBtn} onClick={() => setStep('landing')}>
              ← Kembali
            </button>
          </div>
        )}

        {/* PROCESS */}
        {step === 'process' && (
          <div style={styles.section}>
            {method === 'email' && (
              <>
                <h2 style={styles.title}>Pakai Email Sendiri</h2>
                {!result && (
                  <>
                    <p style={styles.desc}>Masukkan email yang ingin diaktifkan Premium AM-nya.</p>
                    <input
                      style={styles.input}
                      type="email"
                      placeholder="email@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <button
                      style={styles.primaryBtn}
                      onClick={handleBuySingle}
                      disabled={loading}
                    >
                      {loading ? 'Mengirim...' : 'Kirim Link Verifikasi'}
                    </button>
                  </>
                )}

                {result?.type === 'buy_single' && (
                  <>
                    <p style={styles.success}>
                      ✅ Link verifikasi sudah dikirim ke <b>{result.email}</b>
                    </p>
                    <p style={styles.desc}>
                      Buka email → copy link dari Alight Motion → paste di bawah.
                    </p>
                    <input
                      style={styles.input}
                      type="text"
                      placeholder="https://alight.link/..."
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                    <button
                      style={styles.primaryBtn}
                      onClick={handleVerifySingle}
                      disabled={loading}
                    >
                      {loading ? 'Memverifikasi...' : 'Verifikasi & Aktifkan'}
                    </button>
                  </>
                )}
              </>
            )}

            {method === 'ready' && (
              <>
                <h2 style={styles.title}>Ambil Akun Siap Pakai</h2>
                <p style={styles.desc}>
                  Klik tombol di bawah untuk generate 1 akun Alight Motion Premium.
                </p>
                <button
                  style={styles.primaryBtn}
                  onClick={handleBuyBulk}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Akun Sekarang'}
                </button>
              </>
            )}

            {error && <p style={styles.error}>{error}</p>}
            <button style={styles.secondaryBtn} onClick={() => setStep('method')}>
              ← Ganti Metode
            </button>
          </div>
        )}

        {/* RESULT */}
        {step === 'result' && (
          <div style={styles.section}>
            <h2 style={styles.title}>🎉 Berhasil!</h2>
            {result?.type === 'ready' && result.accounts?.length > 0 && (
              <div style={styles.resultBox}>
                {result.accounts.map((acc, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <div><b>Email:</b> {acc.email}</div>
                    {acc.link && (
                      <div style={{ marginTop: 4 }}>
                        <b>Link:</b>{' '}
                        <a href={acc.link} target="_blank" rel="noreferrer" style={{ color: '#818cf8' }}>
                          Buka Generator
                        </a>
                      </div>
                    )}
                    {acc.password && <div><b>Password:</b> {acc.password}</div>}
                  </div>
                ))}
              </div>
            )}
            {result?.type === 'success' && (
              <p style={styles.success}>{result.message}</p>
            )}
            <p style={{ fontSize: 13, color: '#a1a1aa', marginTop: 16 }}>
              Simpan data ini. Jangan share ke publik.
            </p>
            <button style={styles.primaryBtn} onClick={() => {
              setStep('landing');
              setResult(null);
              setEmail('');
              setLink('');
              setInvoice('');
            }}>
              Claim Lagi
            </button>
          </div>
        )}

        {/* FOOTER */}
        <div style={styles.footer}>
          <p>Powered by premku.com API • Website ini gratis berkat iklan</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    background: 'linear-gradient(135deg, #0f0f13 0%, #1a1a2e 100%)',
  },
  card: {
    width: '100%',
    maxWidth: 440,
    background: '#18181b',
    borderRadius: 20,
    border: '1px solid #27272a',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
  },
  header: {
    padding: '24px 24px 16px',
    textAlign: 'center',
    borderBottom: '1px solid #27272a',
  },
  logo: {
    fontSize: 22,
    fontWeight: 700,
    background: 'linear-gradient(90deg, #a78bfa, #818cf8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    margin: '6px 0 0',
    fontSize: 13,
    color: '#a1a1aa',
  },
  section: {
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    margin: '0 0 12px',
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    color: '#a1a1aa',
    textAlign: 'center',
    lineHeight: 1.5,
    marginBottom: 20,
  },
  primaryBtn: {
    width: '100%',
    padding: '14px 20px',
    background: 'linear-gradient(90deg, #7c3aed, #4f46e5)',
    color: 'white',
    border: 'none',
    borderRadius: 12,
    fontSize: 15,
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 8,
  },
  secondaryBtn: {
    width: '100%',
    padding: '12px',
    background: 'transparent',
    color: '#a1a1aa',
    border: '1px solid #3f3f46',
    borderRadius: 12,
    fontSize: 14,
    cursor: 'pointer',
    marginTop: 12,
  },
  methodGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 16,
  },
  methodCard: {
    background: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: 14,
    padding: 16,
    textAlign: 'center',
    cursor: 'pointer',
    color: '#e4e4e7',
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    background: '#27272a',
    border: '1px solid #3f3f46',
    borderRadius: 12,
    color: '#e4e4e7',
    fontSize: 15,
    marginBottom: 12,
    boxSizing: 'border-box',
  },
  adBox: {
    background: '#27272a',
    border: '2px dashed #52525b',
    borderRadius: 14,
    padding: 32,
    textAlign: 'center',
    marginBottom: 16,
    cursor: 'pointer',
  },
  resultBox: {
    background: '#27272a',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    wordBreak: 'break-all',
  },
  error: {
    color: '#f87171',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 12,
  },
  success: {
    color: '#4ade80',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
  },
  footer: {
    padding: '16px 24px',
    borderTop: '1px solid #27272a',
    textAlign: 'center',
    fontSize: 11,
    color: '#71717a',
  },
};
