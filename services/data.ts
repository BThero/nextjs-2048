globalThis.unusedId = globalThis.unusedId ?? 0;
globalThis.records = globalThis.records ?? [];

export function peekId() {
  const res = globalThis.unusedId;
  globalThis.unusedId += 1;
  return res;
}

export function addRecord(score: number, seconds: number) {
  globalThis.records.push({ score, seconds });
  globalThis.records.sort((a, b) => {
    if (a.score != b.score) {
      return b.score - a.score;
    }

    return a.seconds - b.seconds;
  });

  if (globalThis.records.length > 5) {
    globalThis.records = globalThis.records.slice(0, 5);
  }
}

export function fetchRecords() {
  return globalThis.records;
}
