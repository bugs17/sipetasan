export function validateApiKey(request) {
  const { searchParams } = new URL(request.url);
  const apiKey = searchParams.get("key");

  if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
    return false;
  }
  return true;
}
