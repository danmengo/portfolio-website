export class DeadlineError extends Error {}
export async function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try { return await Promise.race([work, new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new DeadlineError("Deadline exceeded")), ms); })]); }
  finally { clearTimeout(timer); }
}
