import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { validateLogin, validateRegister } from '../utils/validators.js';
import PasswordInput from './PasswordInput.jsx';

function Field({ label, error, children }) {
  return (
    <label className="field">
      {label}
      {children}
      {error && <span className="field-err">{error}</span>}
    </label>
  );
}

export default function AuthForm({ mode }) {
  const isRegister = mode === 'register';
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from?.pathname ?? '/';

  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
    if (errors[key]) setErrors({ ...errors, [key]: undefined });
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError('');
    const found = isRegister ? validateRegister(form) : validateLogin(form);
    setErrors(found);
    if (Object.keys(found).length) return;

    setLoading(true);
    try {
      if (isRegister) {
        await register({
          username: form.username.trim(),
          email: form.email.trim(),
          password: form.password,
        });
      } else {
        await login({ username: form.username.trim(), password: form.password });
      }
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.message);
      setLoading(false);
    }
  };

  return (
    <form className="card-form" onSubmit={submit} noValidate>
      <h1>{isRegister ? "Ro'yxatdan o'tish" : 'Kirish'}</h1>

      <Field label="Foydalanuvchi nomi" error={errors.username}>
        <input
          value={form.username}
          onChange={set('username')}
          autoComplete="username"
          aria-invalid={!!errors.username || undefined}
        />
      </Field>

      {isRegister && (
        <Field label="Email" error={errors.email}>
          <input
            type="email"
            value={form.email}
            onChange={set('email')}
            autoComplete="email"
            aria-invalid={!!errors.email || undefined}
          />
        </Field>
      )}

      <Field label="Parol" error={errors.password}>
        <PasswordInput
          value={form.password}
          onChange={set('password')}
          autoComplete={isRegister ? 'new-password' : 'current-password'}
          invalid={!!errors.password}
        />
      </Field>

      {isRegister && (
        <Field label="Parolni takrorlang" error={errors.confirm}>
          <PasswordInput
            value={form.confirm}
            onChange={set('confirm')}
            autoComplete="new-password"
            invalid={!!errors.confirm}
          />
        </Field>
      )}

      {serverError && <p className="err" role="alert">{serverError}</p>}

      <button className="btn primary big" disabled={loading}>
        {loading ? 'Yuborilmoqda...' : isRegister ? "Ro'yxatdan o'tish" : 'Kirish'}
      </button>

      <p className="alt">
        {isRegister ? (
          <>Akkauntingiz bormi? <Link to="/login" state={{ from: { pathname: from } }}>Kirish</Link></>
        ) : (
          <>Akkauntingiz yo'qmi? <Link to="/register" state={{ from: { pathname: from } }}>Ro'yxatdan o'tish</Link></>
        )}
      </p>
    </form>
  );
}