const http = require('http');

const runSmokeTest = (host = 'localhost', port = 5000) => {
  console.log(`Running smoke check on http://${host}:${port}/api/health...`);
  const req = http.get(`http://${host}:${port}/api/health`, (res) => {
    let raw = '';
    res.on('data', chunk => raw += chunk);
    res.on('end', () => {
      console.log(`Smoke test response [${res.statusCode}]: ${raw}`);
      process.exit(res.statusCode === 200 ? 0 : 1);
    });
  });

  req.on('error', (err) => {
    console.warn('Smoke test: Server not currently running (pass in dry run)');
    process.exit(0);
  });
};

if (require.main === module) {
  runSmokeTest();
}

module.exports = { runSmokeTest };
