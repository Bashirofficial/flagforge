// In-memory mock backend. Only loaded when VITE_USE_MOCKS=true (`npm run dev:mock`).
// URL scenarios: ?mock=empty | ?mock=error | ?mock=slow

import {
  mockOrganization,
  mockUser,
  seedApiKeys,
  seedAuditLogs,
  seedEnvironments,
  seedFlags,
  type MockApiKey,
  type MockAuditLog,
  type MockFlag,
} from "./data";

const scenario = new URLSearchParams(window.location.search).get("mock");
const isEmpty = scenario === "empty";

const db = {
  environments: seedEnvironments(),
  flags: isEmpty ? [] : seedFlags(),
  apiKeys: isEmpty ? [] : seedApiKeys(),
  auditLogs: isEmpty ? [] : seedAuditLogs(),
};

const PAGE_SIZE = 20;
const mockTokens = { accessToken: "mock-access-token", refreshToken: "mock-refresh-token" };

class MockHttpError extends Error {}
const notFound = (what: string): never => {
  throw new MockHttpError(`${what} not found`);
};

const uid = (prefix: string) => `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
const now = () => new Date().toISOString();

const envById = (id: string) =>
  db.environments.find((e) => e.id === id) ?? notFound("Environment");
const flagById = (id: string) => db.flags.find((f) => f.id === id) ?? notFound("Flag");
const keyById = (id: string) => db.apiKeys.find((k) => k.id === id) ?? notFound("API key");

const log = (entry: Pick<MockAuditLog, "action" | "resourceType" | "resourceId" | "resourceName"> & Partial<MockAuditLog>) => {
  db.auditLogs.unshift({
    id: uid("log"),
    environmentKey: null,
    ipAddress: "127.0.0.1",
    userAgent: navigator.userAgent,
    timestamp: now(),
    userId: mockUser.id,
    userEmail: mockUser.email,
    ...entry,
  });
};

const envSummary = (env: (typeof db.environments)[number]) => ({
  ...env,
  apiKeyCount: db.apiKeys.filter((k) => k.environmentId === env.id && k.status === "ACTIVE").length,
  flagCount: db.flags.length,
});

const flagSummary = (f: MockFlag) => ({
  id: f.id,
  key: f.key,
  name: f.name,
  description: f.description,
  type: f.type,
  isActive: f.isActive,
  createdAt: f.createdAt,
  updatedAt: f.updatedAt,
});

const apiKeyView = (k: MockApiKey) => {
  const env = envById(k.environmentId);
  return {
    id: k.id,
    name: k.name,
    keyPrefix: k.keyPrefix,
    environment: env.name,
    environmentKey: env.key,
    status: k.status,
    lastUsedAt: k.lastUsedAt,
    usageCount: k.usageCount,
    createdAt: k.createdAt,
    createdBy: k.createdBy,
    revokedAt: k.revokedAt,
  };
};

type Body = Record<string, unknown>;
type Handler = (params: string[], body: Body, query: URLSearchParams) => unknown;

const routes: Array<[method: string, pattern: RegExp, handler: Handler]> = [
  // ---- Auth ----
  ["POST", /^\/user\/login$/, () => ({ user: mockUser, tokens: mockTokens })],
  ["POST", /^\/user\/register$/, (_, b) => ({ user: { ...mockUser, email: String(b.email ?? mockUser.email) }, tokens: mockTokens })],
  ["POST", /^\/user\/refresh$/, () => ({ accessToken: mockTokens.accessToken })],
  ["POST", /^\/user\/logout$/, () => null],

  // ---- Organization ----
  ["GET", /^\/organization$/, () => mockOrganization],
  ["GET", /^\/organization\/stats$/, () => ({
    totalFlags: db.flags.length,
    totalApiKeys: db.apiKeys.length,
    activeApiKeys: db.apiKeys.filter((k) => k.status === "ACTIVE").length,
  })],

  // ---- Environments ----
  ["GET", /^\/environments$/, () => db.environments.map(envSummary)],
  ["GET", /^\/environments\/([^/]+)$/, ([id]) => envSummary(envById(id))],
  ["POST", /^\/environments$/, (_, b) => {
    const env = {
      id: uid("env"),
      name: String(b.name),
      key: String(b.key),
      description: String(b.description ?? ""),
      sortOrder: db.environments.length,
      createdAt: now(),
      updatedAt: now(),
    };
    db.environments.push(env);
    db.flags.forEach((f) => (f.values[env.id] = null));
    return { id: env.id };
  }],
  ["PATCH", /^\/environments\/([^/]+)$/, ([id], b) => {
    Object.assign(envById(id), b, { updatedAt: now() });
    return null;
  }],
  ["DELETE", /^\/environments\/([^/]+)$/, ([id]) => {
    envById(id);
    db.environments = db.environments.filter((e) => e.id !== id);
    return null;
  }],

  // ---- Flags ----
  ["GET", /^\/flags$/, () => db.flags.map(flagSummary)],
  ["GET", /^\/flags\/([^/]+)$/, ([id]) => {
    const f = flagById(id);
    return {
      ...flagSummary(f),
      environmentValues: db.environments.map((env) => ({
        value: f.values[env.id] ?? null,
        environment: { id: env.id, name: env.name, key: env.key },
      })),
    };
  }],
  ["POST", /^\/flags$/, (_, b) => {
    if (db.flags.some((f) => f.key === b.key)) throw new MockHttpError("Flag key already exists");
    const type = (b.type as MockFlag["type"]) ?? "BOOLEAN";
    const defaultValue = (b.defaultValue as MockFlag["values"][string]) ?? (type === "BOOLEAN" ? false : null);
    const f: MockFlag = {
      id: uid("flg"),
      key: String(b.key),
      name: String(b.name ?? b.key),
      description: String(b.description ?? ""),
      type,
      isActive: true,
      createdAt: now(),
      updatedAt: now(),
      values: Object.fromEntries(db.environments.map((e) => [e.id, defaultValue])),
    };
    db.flags.unshift(f);
    log({ action: "FLAG_CREATED", resourceType: "FLAG", resourceId: f.id, resourceName: f.key });
    return { id: f.id };
  }],
  ["PATCH", /^\/flags\/([^/]+)$/, ([id], b) => {
    const f = flagById(id);
    Object.assign(f, b, { updatedAt: now() });
    log({ action: "FLAG_UPDATED", resourceType: "FLAG", resourceId: f.id, resourceName: f.key, changes: b });
    return null;
  }],
  ["DELETE", /^\/flags\/([^/]+)$/, ([id]) => {
    const f = flagById(id);
    db.flags = db.flags.filter((x) => x.id !== id);
    log({ action: "FLAG_DELETED", resourceType: "FLAG", resourceId: f.id, resourceName: f.key });
    return null;
  }],
  ["PUT", /^\/flags\/([^/]+)\/environments\/([^/]+)$/, ([flagId, envId], b) => {
    const f = flagById(flagId);
    const env = envById(envId);
    const before = f.values[envId];
    f.values[envId] = b.value as MockFlag["values"][string];
    f.updatedAt = now();
    log({
      action: "FLAG_VALUE_CHANGED", resourceType: "FLAG", resourceId: f.id, resourceName: f.key,
      environmentKey: env.key, changes: { before, after: b.value },
    });
    return null;
  }],

  // ---- API keys ----
  ["GET", /^\/api-keys$/, () => db.apiKeys.map(apiKeyView)],
  ["POST", /^\/api-keys$/, (_, b) => {
    const env = envById(String(b.environmentId));
    const secret = `ff_${env.key.slice(0, 4)}_${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
    const k: MockApiKey = {
      id: uid("key"),
      name: String(b.name ?? `${env.name} key`),
      keyPrefix: secret.slice(0, 12),
      environmentId: env.id,
      status: "ACTIVE",
      lastUsedAt: null,
      usageCount: 0,
      createdAt: now(),
      createdBy: mockUser.email,
      revokedAt: null,
    };
    db.apiKeys.unshift(k);
    log({ action: "API_KEY_CREATED", resourceType: "API_KEY", resourceId: k.id, resourceName: k.name, environmentKey: env.key });
    return { id: k.id, key: secret, keyPrefix: k.keyPrefix, environment: { name: env.name, key: env.key } };
  }],
  ["PATCH", /^\/api-keys\/([^/]+)\/revoke$/, ([id]) => {
    const k = keyById(id);
    k.status = "REVOKED";
    k.revokedAt = now();
    log({ action: "API_KEY_REVOKED", resourceType: "API_KEY", resourceId: k.id, resourceName: k.name });
    return null;
  }],
  ["DELETE", /^\/api-keys\/([^/]+)$/, ([id]) => {
    keyById(id);
    db.apiKeys = db.apiKeys.filter((k) => k.id !== id);
    return null;
  }],

  // ---- Audit logs ----
  ["GET", /^\/audit-logs$/, (_, __, q) => {
    const action = q.get("action");
    const logs = action ? db.auditLogs.filter((l) => l.action === action) : db.auditLogs;
    const page = Math.max(1, Number(q.get("page")) || 1);
    return {
      logs: logs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
      pagination: {
        page,
        totalPages: Math.max(1, Math.ceil(logs.length / PAGE_SIZE)),
        totalItems: logs.length,
        pageSize: PAGE_SIZE,
      },
    };
  }],
];

export async function mockRequest(endpoint: string, options: RequestInit = {}): Promise<unknown> {
  const method = (options.method ?? "GET").toUpperCase();
  const [path, queryString = ""] = endpoint.split("?");
  const body: Body = typeof options.body === "string" ? JSON.parse(options.body) : {};

  await new Promise((r) => setTimeout(r, scenario === "slow" ? 2000 : 300));

  if (scenario === "error") throw new Error("Mock server error (?mock=error)");

  for (const [m, pattern, handler] of routes) {
    const match = m === method && path.match(pattern);
    if (match) {
      // structuredClone so components can't mutate the mock DB by reference
      return structuredClone(handler(match.slice(1), body, new URLSearchParams(queryString)));
    }
  }

  console.warn(`[mock] No handler for ${method} ${endpoint} — add one in src/services/mock/handlers.ts`);
  throw new Error(`Mock: no handler for ${method} ${path}`);
}
