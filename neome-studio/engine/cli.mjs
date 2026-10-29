#!/usr/bin/env node
// Neome Studio engine. Skills call it; Consultants never run it directly.
// Commands load their module on demand, so `setup-check` runs even before `npm ci` (no node_modules yet).
const lazy = (file, fn, wrap = (args) => [args]) => async (args) => (await import(file))[fn](...wrap(args));

const COMMANDS = {
  check: lazy("./check.mjs", "check", ([pluginDir]) => [pluginDir]),
  "build-brd": lazy("./build-brd.mjs", "buildBrd"),
  "mmdc-check": lazy("./build-brd.mjs", "mmdcCheck"),
  "init-engagement": lazy("./ingest.mjs", "initEngagement"),
  "add-source": lazy("./ingest.mjs", "addSource"),
  lock: lazy("./ingest.mjs", "lock"),
  unlock: lazy("./ingest.mjs", "unlock"),
  glossary: lazy("./glossary.mjs", "glossary"),
  module: lazy("./modules.mjs", "modules"),
  "spec-check": lazy("./spec-check.mjs", "specCheck"),
  "build-prototype": lazy("./build-prototype.mjs", "buildPrototype"),
  "new-questionnaire": lazy("./questionnaire.mjs", "newQuestionnaire"),
  "export-questionnaire": lazy("./questionnaire.mjs", "exportQuestionnaire"),
  reply: lazy("./reply.mjs", "reply"),
  "setup-check": lazy("./setup-check.mjs", "setupCheck"),
  status: lazy("./status.mjs", "status"),
};

const [name, ...args] = process.argv.slice(2);
const command = COMMANDS[name];
if (!command) {
  console.error(`Unknown command: ${name ?? "(none)"}. Known: ${Object.keys(COMMANDS).join(", ")}`);
  process.exit(2);
}
process.exit(await command(args));
