function buildConfig() {
  const defaults = require('./config.default').default;
  return Object.assign(defaults, {
    network: defaults.networks[defaults.defaultNetwork],
  });
}

export default buildConfig();
