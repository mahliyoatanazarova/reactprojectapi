import { useState } from 'react';

export default function PasswordInput({ value, onChange, autoComplete, invalid }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="pw">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-invalid={invalid || undefined}
      />
      <button type="button" className="pw-toggle" onClick={() => setVisible((v) => !v)}>
        {visible ? 'Yashirish' : "Ko'rsatish"}
      </button>
    </div>
  );
}