// Stub — always active for v1. Wire up Stripe in v2.
export async function hasActiveSubscription(_userId: string): Promise<boolean> {
  return true
}
