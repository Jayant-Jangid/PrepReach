class MemoryCache {
  constructor(ttlSeconds = 300) {
    this.cache = new Map();
    this.ttl = ttlSeconds * 1000;
  }
  get(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }
    return entry.data;
  }
  set(key, data, customTtl) {
    const expiry = Date.now() + (customTtl ? customTtl * 1000 : this.ttl);
    this.cache.set(key, { data, expiry });
  }
  del(key) {
    this.cache.delete(key);
  }
  flush() {
    this.cache.clear();
  }
}

module.exports = new MemoryCache();
