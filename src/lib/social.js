const twitterTweetIntent = 'https://twitter.com/intent/tweet';

export function createTweetAction({ message = [], hashtags = [], via, related = [] } = {}) {
  const text = message.map((m) => encodeURIComponent(m)).join('%0A');

  const intent = {
    text,
    hashtags: hashtags.join(','),
    via,
    related: related.join(','),
  };

  const paramString = Object.keys(intent)
    .filter((key) => !!intent[key])
    .map((key) => `${key}=${intent[key]}`)
    .join('&');

  return `${twitterTweetIntent}?${paramString}`;
}

export function openTweet({ message }) {
  window.open(message, 'share-twitter', 'width=550, height=235');
}
