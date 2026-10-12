const isValidAvatarUrl = (url) => {
  if (!url) return true;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && /\.(png|jpg|jpeg|webp|svg)$/i.test(parsed.pathname);
  } catch {
    return false;
  }
};

module.exports = { isValidAvatarUrl };
