export function encodePatreonUrl(url: string): string {
  return url.replace(/[\[\]]/g, function (a) {
    return (
      {
        '[': '%5B',
        ']': '%5D',
      }[a] || ''
    );
  });
}

export const patreonAuth = {
  headers: {
    Authorization: `Bearer ${process.env.METADATA_API_PATREON_API_KEY}`,
  },
};
