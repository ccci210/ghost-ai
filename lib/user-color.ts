const CURSOR_COLORS = [
  "#06B6D4",
  "#F97316",
  "#A78BFA",
  "#34D399",
  "#F472B6",
  "#FACC15",
  "#60A5FA",
  "#FB7185",
] as const;

export function getUserColor(userId: string): string {
  let hash = 0;

  for (let index = 0; index < userId.length; index++) {
    hash = (Math.imul(hash, 31) + userId.charCodeAt(index)) >>> 0;
  }

  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}
