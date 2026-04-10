import { useEffect, useState } from 'react';
import { fetchPageContent, db, loginWithDiscord } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { PageHero, Loader } from '../components/ui';

function ContactForm() {
  const { user, loginProvider, setLoginProvider, getDiscordUser, doLogout } = useAuth();
  const [message,    setMessage]    = useState('');
  const [status,     setStatus]     = useState({ type: '', text: '' });
  const [sending,    setSending]    = useState(false);
  const [email,      setEmail]      = useState('');
  const [otp,        setOtp]        = useState('');
  const [otpStep,    setOtpStep]    = useState(false);
  const [emailErr,   setEmailErr]   = useState('');
  const [otpErr,     setOtpErr]     = useState('');
  const [sendingOtp, setSendingOtp] = useState(false);

  const discordUser = getDiscordUser();
  const viaEmail    = loginProvider === 'email';
  const displayName = viaEmail ? user?.email : (discordUser?.username || 'Inconnu');

  const handleSend = async () => {
    if (!user)           { setStatus({ type: 'error', text: "⚠️ Identifie-toi d'abord." }); return; }
    if (!message.trim()) { setStatus({ type: 'error', text: '⚠️ Le message ne peut pas être vide.' }); return; }
    setSending(true);
    const name      = viaEmail ? user.email : (discordUser?.username || 'Inconnu');
    const contactId = viaEmail ? user.email : user.id;
    try {
      const { error } = await db.from('contact_messages').insert([{
        name, discord_id: contactId, message: message.trim(), created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      setStatus({ type: 'success', text: `✅ Message envoyé ! Je te répondrai via ${viaEmail ? 'email' : 'Discord'} dès que possible.` });
      setMessage('');
    } catch (e) {
      setStatus({ type: 'error', text: `❌ Erreur : ${e.message}` });
    } finally { setSending(false); }
  };

  const handleSendOtp = async () => {
    if (!email || !email.includes('@')) { setEmailErr('⚠️ Entre une adresse email valide.'); return; }
    setSendingOtp(true); setEmailErr('');
    const { error } = await db.auth.signInWithOtp({ email, options: { shouldCreateUser: true } });
    setSendingOtp(false);
    if (error) { setEmailErr(`❌ ${error.message}`); return; }
    setOtpStep(true);
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length < 6) { setOtpErr('⚠️ Entre le code à 6 chiffres.'); return; }
    setSendingOtp(true); setOtpErr('');
    const { error } = await db.auth.verifyOtp({ email, token: otp, type: 'email' });
    setSendingOtp(false);
    if (error) { setOtpErr('❌ Code incorrect ou expiré.'); return; }
    localStorage.setItem('loginProvider', 'email');
    setLoginProvider('email');
  };

  if (user) {
    return (
      <div className="contact-form-card">
        <h3>📬 Envoyer un message</h3>
        <div className="contact-user-badge">
          {!viaEmail && discordUser?.avatar_url
            ? <img src={discordUser.avatar_url} className="comment-avatar" alt={displayName} />
            : <div className="contact-badge-icon"><i className={viaEmail ? 'fas fa-envelope' : 'fab fa-discord'} /></div>
          }
          <div>
            <span className="comment-username">{displayName}</span>
            <p className="form-hint" style={{ marginTop: 2 }}>{viaEmail ? 'Connecté via email' : 'Connecté via Discord'}</p>
          </div>
          <button className="comment-change-btn" onClick={doLogout} style={{ marginLeft: 'auto' }}>Déconnexion</button>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="c-message">Message *</label>
          <textarea
            className="form-textarea"
            id="c-message"
            placeholder="Bonjour Nathan ! Je voulais te dire..."
            rows={5}
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
        </div>
        <button className="btn-submit" onClick={handleSend} disabled={sending}>
          {sending ? <i className="fas fa-spinner fa-spin" /> : <><i className="fas fa-paper-plane" /> Envoyer</>}
        </button>
        {status.text && <div className={`form-status ${status.type}`}>{status.text}</div>}
      </div>
    );
  }

  return (
    <div className="contact-form-card">
      <h3>📬 Envoyer un message</h3>
      <p className="contact-auth-intro">Identifie-toi pour m'envoyer un message. Je te répondrai via le moyen choisi.</p>
      <div className="contact-auth-choice">
        <button className="contact-auth-btn discord" onClick={loginWithDiscord}>
          <i className="fab fa-discord" />
          <span><strong>Discord</strong><small>Connexion via ton compte Discord</small></span>
        </button>
        <div className="contact-auth-divider"><span>ou</span></div>
        <div className="contact-email-flow">
          {!otpStep ? (
            <div>
              <div className="contact-email-input-row">
                <input
                  className="form-input"
                  type="email"
                  placeholder="ton@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendOtp()}
                />
                <button className="contact-auth-send-btn" onClick={handleSendOtp} disabled={sendingOtp}>
                  {sendingOtp ? <i className="fas fa-spinner fa-spin" /> : <><i className="fas fa-paper-plane" /> Envoyer le code</>}
                </button>
              </div>
              {emailErr && <div className="contact-auth-error">{emailErr}</div>}
            </div>
          ) : (
            <div>
              <p className="form-hint">Code envoyé à <strong>{email}</strong>. Vérifie ta boîte mail.</p>
              <div className="contact-email-input-row">
                <input
                  className="form-input contact-otp-input"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  inputMode="numeric"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleVerifyOtp()}
                  autoFocus
                />
                <button className="contact-auth-send-btn" onClick={handleVerifyOtp} disabled={sendingOtp}>
                  {sendingOtp ? <i className="fas fa-spinner fa-spin" /> : <><i className="fas fa-check" /> Vérifier</>}
                </button>
              </div>
              <button className="contact-otp-resend" onClick={() => { setOtpStep(false); setOtp(''); setOtpErr(''); }}>
                Renvoyer le code
              </button>
              {otpErr && <div className="contact-auth-error">{otpErr}</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPageContent('contact').then(d => { setContent(d); setLoading(false); });
  }, []);

  if (loading) return <Loader />;

  return (
    <>
      <PageHero content={content} label="Contact" title="Écris-moi" subtitle="Tu as une question, une idée de collab ou juste envie de discuter ? Je réponds vite." />
      <div className="page-content">
        <div className="contact-layout">
          <div id="contact-form-area">
            <ContactForm />
          </div>
          <div className="contact-sidebar">
            <div className="contact-info-card">
              <h4>Retrouve-moi aussi ici</h4>
              <a className="contact-link-item" href="https://github.com/nathan260300" target="_blank" rel="noopener"><i className="fab fa-github" /> GitHub — nathan260300</a>
              <a className="contact-link-item" href="https://discord.gg/hvK9dhSKQF" target="_blank" rel="noopener"><i className="fab fa-discord" /> Serveur Discord</a>
              <a className="contact-link-item" href="https://youtube.com/@nathan26060" target="_blank" rel="noopener"><i className="fab fa-youtube" /> YouTube — @nathan26060</a>
            </div>
            <div className="contact-info-card">
              <h4>💡 Bon à savoir</h4>
              <p style={{ fontSize: '.85rem', color: 'var(--text-muted)', lineHeight: 1.65 }}>
                Ton message est sauvegardé dans ma base de données.
                Je te contacte via Discord dès que possible.
                Pas de spam, promis !
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}