// PreToolUse guard: blocks Claude from writing to `main` (see CLAUDE.md §1).
// Deny rules in settings.json catch commands that name `main`; this catches
// branch-dependent writes (e.g. a plain `git commit` while main is checked out).
import { execSync } from "node:child_process";

const PROTECTED = "main";

const input = JSON.parse(await new Promise((resolve) => {
  let data = "";
  process.stdin.on("data", (c) => (data += c));
  process.stdin.on("end", () => resolve(data || "{}"));
}));

const command = String(input.tool_input?.command ?? "");
const block = (reason) => {
  process.stderr.write(`BLOCKED by protect-main hook: ${reason}\nmain is user-only. Work on dev or a feature branch.`);
  process.exit(2);
};

if (!/\bgit\b|\bgh\b/.test(command)) process.exit(0);

// Always blocked, whatever branch is checked out
if (/\bgit\s+push\b[^;&|]*(--force\b|--force-with-lease\b|\s-f\b)/.test(command)) block("force push");
if (/\bgit\s+push\b[^;&|]*[\s:+]main\b(?![-/\w])/.test(command)) block("push to main");
if (/\bgit\s+push\b[^;&|]*--(delete|mirror|all)\b/.test(command)) block("push --delete/--mirror/--all");
if (/\b(checkout|switch)\s+(-[-\w]+\s+)*main\b(?![-/\w])/.test(command)) block("switching to main");
if (/\bgit\s+branch\s+[^;&|]*-[dDmMfC]\b[^;&|]*\bmain\b(?![-/\w])/.test(command)) block("modifying the main branch ref");
if (/\bgit\s+update-ref\b[^;&|]*refs\/heads\/main\b/.test(command)) block("update-ref on main");
if (/\bgh\s+pr\s+merge\b/.test(command)) block("gh pr merge");
if (/\bgh\s+pr\s+create\b[^;&|]*(--base|-B)[\s=]+main\b/.test(command)) block("PR targeting main");
if (/--no-verify\b/.test(command)) block("--no-verify");

// Blocked only while main is checked out
const WRITE = /\bgit\s+(commit|merge|rebase|reset|revert|cherry-pick|am|pull|push|stash\s+pop|restore|clean)\b/;
if (WRITE.test(command)) {
  let branch = "";
  try {
    branch = execSync("git branch --show-current", { cwd: input.cwd || process.cwd(), encoding: "utf8" }).trim();
  } catch {
    process.exit(0); // not a git repo
  }
  if (branch === PROTECTED) block(`git write while on ${PROTECTED}`);
}

process.exit(0);
