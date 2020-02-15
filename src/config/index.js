import _ from 'lodash';
import defaultConfig from './default';
import envConfig from './env';

const hostname =
  window.location.hostname === 'master.d18wzh4dgs4ce0.amplifyapp.com'
    ? 'app-staging.sparkpost.com'
    : window.location.hostname;
const nodeEnv = process.env.NODE_ENV;
const tenantConfig = TENANT_CONFIGS[hostname] || {}; // eslint-disable-line no-undef

const mergedConfig = _.merge(
  {},
  defaultConfig(hostname),
  envConfig(nodeEnv, tenantConfig.environment),
  tenantConfig,
);

window.SP = {
  productionConfig: mergedConfig,
};

export default mergedConfig;
