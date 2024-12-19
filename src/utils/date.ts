export const secondsToIsoTimestamp = (seconds: string): string => {
  const milliseconds = BigInt(seconds) * BigInt(1000);
  return new Date(Number(milliseconds)).toISOString();
};
