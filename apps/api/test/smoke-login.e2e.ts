type LoginResponse = {
  user: {
    id: string;
    email: string;
    role: "DOCENTE" | "ALUMNO";
    tenantId: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

async function run() {
  const apiUrl = process.env.E2E_API_URL ?? "http://localhost:3001/api";
  const email = process.env.E2E_LOGIN_EMAIL ?? "docente.demo@foxmind.app";
  const password = process.env.E2E_LOGIN_PASSWORD ?? "foxmind123";

  const loginResponse = await fetch(`${apiUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  if (!loginResponse.ok) {
    throw new Error(`Login smoke failed with status ${loginResponse.status}`);
  }

  const loginBody = (await loginResponse.json()) as LoginResponse;
  if (!loginBody.tokens.accessToken || !loginBody.tokens.refreshToken) {
    throw new Error("Login smoke failed: missing tokens in response");
  }

  const meResponse = await fetch(`${apiUrl}/auth/me`, {
    headers: { Authorization: `Bearer ${loginBody.tokens.accessToken}` }
  });

  if (!meResponse.ok) {
    throw new Error(`/auth/me smoke failed with status ${meResponse.status}`);
  }

  const meBody = (await meResponse.json()) as LoginResponse["user"];
  if (meBody.email !== email) {
    throw new Error("Smoke mismatch: /auth/me returned unexpected user");
  }

  console.log("E2E smoke login OK", {
    email: meBody.email,
    role: meBody.role,
    tenantId: meBody.tenantId
  });
}

run().catch((error: unknown) => {
  console.error("E2E smoke login FAILED", error);
  process.exit(1);
});
