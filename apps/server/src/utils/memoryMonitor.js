const logMemoryUsage = () => {
  const mem = process.memoryUsage();
  const formatMb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  console.log(`[memory] RSS: ${formatMb(mem.rss)} | Heap: ${formatMb(mem.heapUsed)} / ${formatMb(mem.heapTotal)}`);
};

module.exports = { logMemoryUsage };
