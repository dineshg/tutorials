import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {execFileSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const buildDir = path.join(root, "build");
const temporaryDirectory = await fs.mkdtemp(
  path.join(os.tmpdir(), "tutorials-gh-pages-"),
);

try {
  const sourceEntries = await fs.readdir(buildDir);
  await Promise.all(
    sourceEntries.map((entry) =>
      fs.cp(path.join(buildDir, entry), path.join(temporaryDirectory, entry), {
        recursive: true,
      }),
    ),
  );

  const remote = gitOutput(["remote", "get-url", "origin"], root);
  const revision = gitOutput(["rev-parse", "--short=12", "HEAD"], root);
  const authorName =
    optionalGitOutput(["config", "user.name"], root) || "Dinesh Gamage";
  const authorEmail =
    optionalGitOutput(["config", "user.email"], root) ||
    "dineshg@users.noreply.github.com";

  runGit(["init", "-q"], temporaryDirectory);
  runGit(["add", "."], temporaryDirectory);
  runGit(
    [
      "-c",
      `user.name=${authorName}`,
      "-c",
      `user.email=${authorEmail}`,
      "commit",
      "-q",
      "-m",
      `Deploy Docusaurus site from ${revision}`,
    ],
    temporaryDirectory,
  );
  runGit(["remote", "add", "origin", remote], temporaryDirectory);
  runGit(["push", "--force", "origin", "HEAD:gh-pages"], temporaryDirectory);
  console.log(`Published build from ${revision} to gh-pages.`);
} finally {
  await fs.rm(temporaryDirectory, {recursive: true, force: true});
}

function runGit(args, cwd) {
  execFileSync("git", args, {cwd, stdio: "inherit"});
}

function gitOutput(args, cwd) {
  return execFileSync("git", args, {cwd, encoding: "utf8"}).trim();
}

function optionalGitOutput(args, cwd) {
  try {
    return gitOutput(args, cwd);
  } catch {
    return "";
  }
}
