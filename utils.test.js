import test from "node:test";
import assert from "node:assert/strict";
import { escapeHTML, formatDate, storageGet, storageSet, storageRemove } from "../js/utils.js";

test("escapeHTML encodes markup-sensitive characters", () => assert.equal(escapeHTML(`<tag a="x">'`), "&lt;tag a=&quot;x&quot;&gt;&#39;"));
test("formatDate returns an empty string for invalid dates", () => assert.equal(formatDate("not-a-date"), ""));
test("storage helpers safely handle a storage-like object", () => {
  const data = new Map(); const fake = { getItem:k=>data.get(k)??null, setItem:(k,v)=>data.set(k,String(v)), removeItem:k=>data.delete(k) };
  assert.equal(storageSet(fake,"x",3), true); assert.equal(storageGet(fake,"x"), "3"); storageRemove(fake,"x"); assert.equal(storageGet(fake,"x"), null);
});
