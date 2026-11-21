import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext.jsx';
import { getErrorMessage } from '../services/api.js';
import { ErrorMessage } from '../components/Feedback.jsx';

export default function AuthPage({ register = false }) {
  const { login, register: createAccount } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });
  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const user = register
        ? await createAccount(form.name, form.email, form.password)
        : await login(form.email, form.password);
      navigate(user.role === 'ADMIN' ? '/admin' : (location.state?.from || '/shop'), { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-photo" />
      <section className="auth-panel">
        <Link className="back-link" to="/">← Back to WatchHub</Link>
        <span className="eyebrow">{register ? 'A GOOD PLACE TO START' : 'WELCOME BACK'}</span>
        <h1>{register ? 'Make time for you.' : 'Good to see you.'}</h1>
        <p>{register ? 'Create an account to save your favourites and keep your orders close.' : 'Sign in to find your next favourite.'}</p>
        <form onSubmit={submit} className="auth-form">
          <ErrorMessage>{error}</ErrorMessage>
          {register && <><label htmlFor="name">Your name</label><input id="name" name="name" value={form.name} onChange={change} maxLength="100" autoComplete="name" required /></>}
          <label htmlFor="email">Email address</label><input id="email" name="email" type="email" value={form.email} onChange={change} maxLength="180" autoComplete="email" required />
          <label htmlFor="password">Password</label><input id="password" name="password" type="password" value={form.password} onChange={change} minLength="8" maxLength="72" autoComplete={register ? 'new-password' : 'current-password'} required />
          <button className="button-dark auth-submit" type="submit" disabled={submitting}>{submitting ? 'One moment...' : register ? 'Create account' : 'Sign in'} <span>→</span></button>
        </form>
        <div className="auth-switch">{register ? 'Already have an account?' : 'New to WatchHub?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create an account'}</Link></div>
      </section>
    </main>
  );
}
