const isValidThumbnailUrl = (url) => {
  if (!url) return true;
  return /^(https?:\/\/)?.*\.(jpg|jpeg|png|webp)$/i.test(url);
};

module.exports = { isValidThumbnailUrl };
