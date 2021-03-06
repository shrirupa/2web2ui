/**
 * This is a list of all production tenants and their specific configurations
 * @example
 *   {
 *     // the unique tenant id
 *     myTenant: {
 *
 *       // host to "next" deployment
 *       nextHost: 'next.tst.sparkpost.com'
 *
 *       // host to back door
 *       originHost: 'origin.tst.sparkpost.com'
 *
 *       // all other values are overrides for the default template
 *     }
 *   }
 *
 * @note DO NOT ADD ENTERPRISE
 */
const productionTenants = {
  spceu: {
    apiBase: 'https://api.eu.sparkpost.com/api',
    bounceDomains: {
      cnameValue: 'eu.sparkpostmail.com',
      mxValue: 'smtp.eu.sparkpostmail.com'
    },
    brightback: {
      downgradeToFreeConfig: {
        cancel_confirmation_url: '/account/billing/plan/change?immediatePlanChange=free500-SPCEU-0419' // Return URL from Brightback for end-users who cancel
      }
    },
    crossLinkTenant: 'spc',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true,
      has_signup: true
    },
    gtmId: 'GTM-WN7C84',
    host: 'app.eu.sparkpost.com',
    siftScience: {
      accountPrefix: 'spceu-',
      id: '7c5f68d795'
    },
    smtpAuth: {
      host: 'smtp.eu.sparkpostmail.com',
      username: 'SMTP_Injection',
      alternativePort: 2525
    },
    splashPage: '/dashboard',
    trackingDomains: {
      cnameValue: 'eu.spgo.io'
    },
    zuora: {
      baseUrl: 'https://rest.zuora.com/v1'
    }
  },
  spc: {
    apiBase: 'https://api.sparkpost.com/api',
    bounceDomains: {
      cnameValue: 'sparkpostmail.com',
      mxValue: 'smtp.sparkpostmail.com'
    },
    crossLinkTenant: 'spceu',
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true,
      has_signup: true
    },
    gtmId: 'GTM-WN7C84',
    host: 'app.sparkpost.com',
    nextHost: 'phoenix-next-prd.sparkpost.com',
    originHost: 'phoenix-origin-prd.sparkpost.com',
    siftScience: {
      id: '7c5f68d795'
    },
    smtpAuth: {
      host: 'smtp.sparkpostmail.com',
      username: 'SMTP_Injection',
      alternativePort: 2525
    },
    splashPage: '/dashboard',
    trackingDomains: {
      cnameValue: 'spgo.io'
    },
    zuora: {
      baseUrl: 'https://rest.zuora.com/v1'
    }
  },
  demo: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    trackingDomains: {
      cnameValue: 'track.demo-t.sparkpostelite.com'
    }
  },
  mtas4tenant: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    smtpAuth: {
      alternativePort: 2525
    }
  },
  productionmtas: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    smtpAuth: {
      alternativePort: 2525
    }
  },
  productionmtas2: {
    featureFlags: {
      allow_anyone_at_verification: true,
      allow_default_signing_domains_for_ip_pools: true
    },
    smtpAuth: {
      alternativePort: 2525
    }
  }
};

module.exports = productionTenants;
