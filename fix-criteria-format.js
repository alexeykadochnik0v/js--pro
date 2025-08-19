const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "lessons");

function listTaskFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listTaskFiles(p));
    } else if (entry.isFile() && entry.name === "task.md") {
      out.push(p);
    }
  }
  return out;
}

function fixCriteria(md) {
  const lines = md.split(/\r?\n/);
  const out = [];
  let i = 0;
  while (i < lines.length) {
    out.push(lines[i]);
    if (lines[i].trim() === "## Критерии") {
      i++;
      // Copy pass/fail line(s) as-is
      while (i < lines.length && lines[i].trim() === "") {
        out.push(lines[i++]);
      }
      if (i < lines.length) {
        out.push(lines[i++]);
      }

      // Normalize list until we reach a blank line followed by "Максимальный балл - 5" or until next heading
      while (i < lines.length) {
        const cur = lines[i];
        const trimmed = cur.trim();
        const next = lines[i + 1] ?? "";
        if (trimmed.startsWith("## ") || trimmed.startsWith("# ")) break;
        // Stop before max score line so we can re-insert with proper spacing
        if (trimmed.replace(/\s+/g, " ") === "Максимальный балл - 5") {
          i++;
          break;
        }

        // Convert numbered list to bullets
        const m = cur.match(/^(\s*)(\d+)\.\s+(.*)$/);
        if (m) {
          out.push(`${m[1]}- ${m[3]}`);
          i++;
          continue;
        }
        // Already bullet, keep
        if (trimmed.startsWith("- ")) {
          out.push(cur);
          i++;
          continue;
        }
        // Empty line inside list: keep
        if (trimmed === "") {
          out.push(cur);
          i++;
          continue;
        }
        // If it's an indented continuation of previous bullet/number, keep
        if (/^\s{2,}\S/.test(cur)) {
          out.push(cur);
          i++;
          continue;
        }
        // Otherwise, if it's the pass/fail line or other paragraph, keep
        out.push(cur);
        i++;
      }

      // Ensure a blank line before max score and the exact line
      if (out.length && out[out.length - 1].trim() !== "") out.push("");
      out.push("Максимальный балл - 5");

      // Skip any duplicate/variant max score lines that might follow
      while (
        i < lines.length &&
        lines[i].trim().replace(/\s+/g, " ") === "Максимальный балл - 5"
      )
        i++;

      // Continue loop without pushing current line (already handled)
      continue;
    }
    i++;
  }
  return out.join("\n");
}

function run() {
  const files = listTaskFiles(ROOT);
  let changed = 0;
  for (const file of files) {
    const orig = fs.readFileSync(file, "utf8");
    const next = fixCriteria(orig);
    if (next !== orig) {
      fs.writeFileSync(file, next, "utf8");
      changed++;
      console.log(`fixed: ${path.relative(process.cwd(), file)}`);
    }
  }
  console.log(`Done. Changed ${changed} file(s).`);
}

run();
