import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-card">
        <h1>FoxMind</h1>
        <p>Ingresá con tu cuenta para continuar.</p>
        <LoginForm />
      </section>
    </main>
  );
}
