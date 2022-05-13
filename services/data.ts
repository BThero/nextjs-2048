globalThis.unusedId = globalThis.unusedId ?? 0;

export function peekId() {
  const res = globalThis.unusedId;
  globalThis.unusedId += 1;
  return res;
}
