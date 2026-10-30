// Seed data for mock mode (`npm run dev:mock`). Shapes mirror api.ts responses.

type FlagValue = string | number | boolean | Record<string, unknown> | null;

const daysAgo = (n: number) =>
  new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();

export const mockUser = {
  id: "usr_mock_admin",
  email: "admin@flagforge.dev",
  role: "ADMIN",
  organizationId: "org_mock",
};

export const mockOrganization = {
  id: "org_mock",
  name: "FlagForge Demo",
  slug: "flagforge-demo",
  createdAt: daysAgo(120),
  updatedAt: daysAgo(3),
};

export interface MockEnvironment {
  id: string;
  name: string;
  key: string;
  description: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface MockFlag {
  id: string;
  key: string;
  name: string;
  description: string;
  type: "BOOLEAN" | "STRING" | "NUMBER" | "JSON";
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  values: Record<string, FlagValue>; // environmentId -> value
}

export interface MockApiKey {
  id: string;
  name: string;
  keyPrefix: string;
  environmentId: string;
  status: "ACTIVE" | "REVOKED";
  lastUsedAt: string | null;
  usageCount: number;
  createdAt: string;
  createdBy: string;
  revokedAt: string | null;
}

export interface MockAuditLog {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  resourceName: string | null;
  environmentKey: string | null;
  changes?: Record<string, unknown>;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: string;
  userId: string;
  userEmail: string;
}

export const seedEnvironments = (): MockEnvironment[] => [
  { id: "env_dev", name: "Development", key: "development", description: "Local and preview builds", sortOrder: 0, createdAt: daysAgo(120), updatedAt: daysAgo(10) },
  { id: "env_stg", name: "Staging", key: "staging", description: "Pre-release QA", sortOrder: 1, createdAt: daysAgo(120), updatedAt: daysAgo(10) },
  { id: "env_prod", name: "Production", key: "production", description: "Live customer traffic", sortOrder: 2, createdAt: daysAgo(120), updatedAt: daysAgo(2) },
];

const flag = (
  id: string,
  key: string,
  name: string,
  description: string,
  type: MockFlag["type"],
  isActive: boolean,
  age: number,
  values: [FlagValue, FlagValue, FlagValue],
): MockFlag => ({
  id, key, name, description, type, isActive,
  createdAt: daysAgo(age),
  updatedAt: daysAgo(Math.max(0, age - 5)),
  values: { env_dev: values[0], env_stg: values[1], env_prod: values[2] },
});

export const seedFlags = (): MockFlag[] => [
  flag("flg_1", "new-checkout-flow", "New checkout flow", "Single-page checkout redesign", "BOOLEAN", true, 40, [true, true, false]),
  flag("flg_2", "dark-mode", "Dark mode", "Enable dark theme toggle in settings", "BOOLEAN", true, 75, [true, true, true]),
  flag("flg_3", "pricing-banner-text", "Pricing banner text", "Headline on the pricing page", "STRING", true, 30, ["Try it free", "Try it free", "Start your 14-day trial"]),
  flag("flg_4", "max-upload-mb", "Max upload size (MB)", "Per-file upload limit", "NUMBER", true, 60, [500, 100, 50]),
  flag("flg_5", "recommendation-config", "Recommendation config", "Tuning params for the recommender", "JSON", true, 20, [{ model: "v3", limit: 20 }, { model: "v3", limit: 10 }, { model: "v2", limit: 10 }]),
  flag("flg_6", "legacy-dashboard", "Legacy dashboard", "Old dashboard kept for rollback", "BOOLEAN", false, 110, [false, false, false]),
  flag("flg_7", "ai-search", "AI search", "Semantic search beta", "BOOLEAN", true, 8, [true, false, false]),
  flag("flg_8", "rate-limit-rpm", "Rate limit (rpm)", "Public API requests per minute", "NUMBER", true, 90, [1000, 300, 120]),
];

export const seedApiKeys = (): MockApiKey[] => [
  { id: "key_1", name: "Web app (prod)", keyPrefix: "ff_prod_a1b2", environmentId: "env_prod", status: "ACTIVE", lastUsedAt: daysAgo(0), usageCount: 184_223, createdAt: daysAgo(90), createdBy: mockUser.email, revokedAt: null },
  { id: "key_2", name: "Mobile app (prod)", keyPrefix: "ff_prod_c3d4", environmentId: "env_prod", status: "ACTIVE", lastUsedAt: daysAgo(1), usageCount: 52_901, createdAt: daysAgo(60), createdBy: mockUser.email, revokedAt: null },
  { id: "key_3", name: "QA runner", keyPrefix: "ff_stg_e5f6", environmentId: "env_stg", status: "ACTIVE", lastUsedAt: daysAgo(2), usageCount: 4_310, createdAt: daysAgo(45), createdBy: "qa@flagforge.dev", revokedAt: null },
  { id: "key_4", name: "Old CI key", keyPrefix: "ff_dev_g7h8", environmentId: "env_dev", status: "REVOKED", lastUsedAt: daysAgo(30), usageCount: 912, createdAt: daysAgo(100), createdBy: mockUser.email, revokedAt: daysAgo(29) },
];

const ACTIONS = ["FLAG_CREATED", "FLAG_UPDATED", "FLAG_VALUE_CHANGED", "FLAG_DELETED", "API_KEY_CREATED", "API_KEY_REVOKED", "USER_LOGIN"];
const ENV_KEYS = ["development", "staging", "production"];

export const seedAuditLogs = (): MockAuditLog[] =>
  Array.from({ length: 47 }, (_, i) => {
    const action = ACTIONS[i % ACTIONS.length];
    const isKey = action.startsWith("API_KEY");
    const isLogin = action === "USER_LOGIN";
    const f = seedFlags()[i % 8];
    return {
      id: `log_${i + 1}`,
      action,
      resourceType: isLogin ? "USER" : isKey ? "API_KEY" : "FLAG",
      resourceId: isLogin ? mockUser.id : isKey ? `key_${(i % 4) + 1}` : f.id,
      resourceName: isLogin ? mockUser.email : isKey ? "Web app (prod)" : f.key,
      environmentKey: action === "FLAG_VALUE_CHANGED" ? ENV_KEYS[i % 3] : null,
      changes: action === "FLAG_VALUE_CHANGED" ? { before: false, after: true } : undefined,
      ipAddress: "203.0.113." + ((i * 7) % 255),
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
      timestamp: new Date(Date.now() - i * 5.5 * 60 * 60 * 1000).toISOString(),
      userId: mockUser.id,
      userEmail: i % 5 === 0 ? "qa@flagforge.dev" : mockUser.email,
    };
  });
