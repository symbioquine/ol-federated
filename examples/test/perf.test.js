const fs = require('fs');
const { performance } = require('perf_hooks');
const { v4: uuidv4 } = require('uuid');

const createNetworkThrottledScenario = (params) => {
  return async (page, client) => {
    await client.send('Network.emulateNetworkConditions', params);
  };
};

const TEST_SCENARIOS = {
  'Unthrottled': async (page, client) => {},
  'Regular2G': createNetworkThrottledScenario({
    'offline': false,
    'downloadThroughput': 250 * 1024 / 8,
    'uploadThroughput': 50 * 1024 / 8,
    'latency': 300
  }),
  'Regular4G': createNetworkThrottledScenario({
    'offline': false,
    'downloadThroughput': 4 * 1024 * 1024 / 8,
    'uploadThroughput': 3 * 1024 * 1024 / 8,
    'latency': 20
  }),
  'DSL': createNetworkThrottledScenario({
    'offline': false,
    'downloadThroughput': 2 * 1024 * 1024 / 8,
    'uploadThroughput': 1 * 1024 * 1024 / 8,
    'latency': 5
  }),
  'SlowCPU': async (page, client) => {
    await client.send('Emulation.setCPUThrottlingRate', { rate: 8 });
  },
}

beforeAll(async () => {
  await fs.mkdirSync(`${process.cwd()}/perfData`, { recursive: true });
});

describe('PerformanceTest', () => {

  for (const [scenarioName, scenarioFn] of Object.entries(TEST_SCENARIOS)) {

    for (const stage of ['uncached', 'cached']) {

      it(`${scenarioName}-${stage}: measure metrics and take screenshot`, async () => {
        console.log(`Starting ${scenarioName}-${stage}...`);

        const page = await browser.newPage();

        page.setCacheEnabled(true);

        const client = await page.target().createCDPSession();
        await client.send('Network.enable');

        if (stage === 'uncached') {
          await client.send('Network.clearBrowserCache');
        }

        await scenarioFn(page, client);

        const testRunId = uuidv4();

        const sentinelNavPromise = page.waitForNavigation({ waitUntil: 'networkidle0' });

        await page.goto(`http://0.0.0.0:${process.env.TEST_PORT_NUM}/sentinel.html`);
        await sentinelNavPromise;

        await page.waitForSelector('#sentinel-div');

        const navPromise = page.waitForNavigation({ waitUntil: 'networkidle0' });

        const start = performance.now();

        await page.goto(`http://0.0.0.0:${process.env.TEST_PORT_NUM}/`);
        await navPromise;

        const end = performance.now();

        const navToNetIdle = end - start;

        await page.screenshot({ path: `perfData/${testRunId}.png` });

        const perfEntries = JSON.parse(
          await page.evaluate(() => JSON.stringify(performance.getEntries()))
        );

        const firstContentfulPaint = perfEntries
          .find(e => e.entryType === 'paint' && e.name === 'first-contentful-paint')
          .startTime;

        const jsEntries = perfEntries
          .filter(e => e.entryType === 'resource' && e.name.endsWith('.js'));

        const jsTotalTransferBytes = jsEntries
          .map(e => e.transferSize)
          .reduce((a, b) => a + b, 0);

        const jsTotalDecodedBytes = jsEntries
          .map(e => e.decodedBodySize)
          .reduce((a, b) => a + b, 0);

        const sample = {
          scenario: `${scenarioName}-${stage}`,
          data: {
            'first-contentful-paint': firstContentfulPaint,
            'nav-to-net-idle': navToNetIdle,
            'js-resource-count': jsEntries.length,
            'js-resource-total-transfer-bytes': jsTotalTransferBytes,
            'js-resource-total-decoded-bytes': jsTotalDecodedBytes,
          },
        };

        if (!process.env.SUPPRESS_INDIVIDUAL_TEST_METRIC_OUTPUT) {
          console.log(sample);
        }

        fs.writeFileSync(`perfData/${testRunId}.json`, JSON.stringify(sample));

        await client.detach();
      }, 30 * 1000);

    }

  }
});
