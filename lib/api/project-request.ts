export async function readJsonObject(
  request: Request,
): Promise<Record<string, unknown> | null> {
  let rawBody: string;

  try {
    rawBody = await request.text();
  } catch {
    return null;
  }

  if (!rawBody.trim()) {
    return {};
  }

  try {
    const body: unknown = JSON.parse(rawBody);

    if (typeof body !== "object" || body === null || Array.isArray(body)) {
      return null;
    }

    return body as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function parseProjectName(
  value: unknown,
  defaultMissing = false,
): string | null {
  if (value === undefined && defaultMissing) {
    return "Untitled Project";
  }

  if (typeof value !== "string") {
    return null;
  }

  const name = value.trim();
  return name.length > 0 ? name : null;
}
