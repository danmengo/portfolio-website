export interface BudgetState { day: string; used: number }
export interface BudgetStorage {
  transaction<T>(callback: (txn: {
    get<T>(key: string): Promise<T | undefined>;
    put(key: string, value: unknown): Promise<void>;
  }) => Promise<T>): Promise<T>;
}

// One fixed Durable Object ID is shared by all requests, across regions.
// Reserve BEFORE paid work; one slot permits one query embedding and one answer.
// Failed requests remain counted (no unsafe refunds/retries).
export async function reserve(storage: BudgetStorage, limit: number, now = new Date()) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 1000) return false;
  const day = now.toISOString().slice(0, 10);
  return storage.transaction(async (txn) => {
    const previous = await txn.get<BudgetState>("daily");
    const used = previous?.day === day ? previous.used : 0;
    if (used >= limit) return false;
    await txn.put("daily", { day, used: used + 1 });
    return true;
  });
}

export class ChatBudget {
  private storage: BudgetStorage;
  private limit: number;
  constructor(ctx: { storage: BudgetStorage }, env: { DAILY_AI_LIMIT?: string }) {
    this.storage = ctx.storage;
    this.limit = Number(env.DAILY_AI_LIMIT);
  }
  async fetch() {
    return Response.json({ allowed: await reserve(this.storage, this.limit) });
  }
}
