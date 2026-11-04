import { test } from "node:test";
import assert from "node:assert/strict";
import { sections } from "../markdown.mjs";

test("sections: headings inside ``` and ~~~ fences are body text", () => {
  const text = "# Doc\n\n## How\n\n```md\n## Execute\n\njunk\n```\n\n## Next\n\n~~~\n## Fake\n```\n## Still fake\n~~~\n";
  const s = sections(text, 2);
  assert.deepEqual(s.map((x) => x.title), ["How", "Next"]);
  assert.match(s[0].body, /## Execute/);
  assert.match(s[1].body, /## Still fake/);
});
