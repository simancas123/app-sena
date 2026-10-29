import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Compass, Lock, Mail, User } from "lucide-react";
import { authClient, GROK_PROVIDERS, signIn } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "signup") {
        if (!name.trim()) throw new Error("Ingresa tu nombre");
        if (password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres");

        const { error: signUpError } = await authClient.signUp.email({
          email,
          password,
          name,
        });

        if (signUpError) {
          throw new Error(signUpError.message || "Error al registrar la cuenta");
        }

        // Auto sign-in after creation
        await authClient.signIn.email({ email, password });
      } else {
        const { error: signInError } = await authClient.signIn.email({
          email,
          password,
        });

        if (signInError) {
          throw new Error(signInError.message || "Credenciales incorrectas");
        }
      }

      void navigate({ to: "/" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado");
    } finally {
      setLoading(false);
    }
  }

  async function handleProviderSignIn(providerId: string) {
    setError(null);
    try {
      await signIn(providerId, { callbackURL: "/" });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión con proveedor");
    }
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-paper px-4 py-8 text-ink">
      <div className="w-full max-w-md space-y-6 rounded-3xl border border-line bg-card p-6 shadow-sm md:p-8">
        <div className="flex flex-col items-center text-center">
          <img
            src="/travel-logo.jpg"
            alt="Travel Planning"
            className="size-16 rounded-full object-cover border border-line shadow-xs"
          />
          <h1 className="mt-3 font-display text-2xl font-bold">
            {mode === "signin" ? "Iniciar Sesión" : "Crear una Cuenta"}
          </h1>
          <p className="mt-1 text-xs text-muted">
            {mode === "signin"
              ? "Accede a tus lugares guardados e itinerarios de viaje"
              : "Regístrate para guardar tus rutas e itinerarios personalizados"}
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex rounded-full bg-paper p-1 border border-line">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setError(null);
            }}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
              mode === "signin" ? "bg-ink text-card" : "text-ink hover:text-ink/80"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setError(null);
            }}
            className={`flex-1 rounded-full py-2 text-sm font-medium transition-all ${
              mode === "signup" ? "bg-ink text-card" : "text-ink hover:text-ink/80"
            }`}
          >
            Registrarse
          </button>
        </div>

        {error ? (
          <div className="rounded-2xl bg-terra/10 p-3 text-center text-xs text-terra font-medium">
            {error}
          </div>
        ) : null}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "signup" ? (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted">Nombre Completo</label>
              <div className="flex items-center gap-2 rounded-2xl border border-line bg-paper px-3 py-2.5">
                <User className="size-4 text-muted shrink-0" />
                <input
                  type="text"
                  required
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
                />
              </div>
            </div>
          ) : null}

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted">Correo Electrónico</label>
            <div className="flex items-center gap-2 rounded-2xl border border-line bg-paper px-3 py-2.5">
              <Mail className="size-4 text-muted shrink-0" />
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted">Contraseña</label>
            <div className="flex items-center gap-2 rounded-2xl border border-line bg-paper px-3 py-2.5">
              <Lock className="size-4 text-muted shrink-0" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full py-3">
            {loading
              ? "Procesando..."
              : mode === "signin"
                ? "Entrar"
                : "Crear Cuenta"}
          </Button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-line" />
          </div>
          <span className="relative bg-card px-3 text-xs text-muted uppercase">o continuar con</span>
        </div>

        {/* SSO Provider Buttons */}
        <div className="space-y-2">
          {GROK_PROVIDERS.map((p) => (
            <button
              key={p.providerId}
              type="button"
              onClick={() => handleProviderSignIn(p.providerId)}
              className="flex w-full items-center justify-center gap-2 rounded-2xl border border-line bg-paper py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper-2"
            >
              Continuar con {p.label}
            </button>
          ))}
          <p className="text-[11px] text-center text-muted leading-tight pt-1">
            Recomendado: usa el formulario de Correo y Contraseña arriba para registrarte e iniciar sesión directamente.
          </p>
        </div>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => void navigate({ to: "/" })}
            className="text-xs text-muted underline hover:text-ink"
          >
            Volver a la aplicación sin iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
