module.exports = {
  launch: {
    headless: true,
    dumpio: true,
  },
  server: {
    command: `npm run serve-dist`,
    debug: true,
    port: process.env.TEST_PORT_NUM,
    launchTimeout: 10000,
    usedPortAction: 'kill',
  },
}
