"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { login, roleHomePath, saveSessionCookies } from "../../lib/auth";

interface FormState {
  email: string;
  password: string;
}

const initialFormState: FormState = {
  email: "",
  password: ""
};

export function LoginForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const disabled = useMemo(
    () => submitting || !form.email.trim() || form.password.length < 8,
    [form.email, form.password, submitting]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const session = await login(form);
      saveSessionCookies(session);
      router.replace(roleHomePath(session.user.role));
    } catch {
      setError("Credenciales inválidas o servicio no disponible.");
      setSubmitting(false);
    }
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        value={form.email}
        onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
        autoComplete="email"
        required
      />
      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        value={form.password}
        onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
        autoComplete="current-password"
        minLength={8}
        required
      />
      {error ? <p className="error-text">{error}</p> : null}
      <button type="submit" disabled={disabled}>
        {submitting ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
