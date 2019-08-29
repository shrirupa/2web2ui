/* eslint-disable max-lines */
import {
  abTesting,
  AccountSettingsPage,
  ImmediateCancelAccountPage,
  alerts,
  apiKeys,
  AuthPage,
  billing,
  DashboardPage,
  DefaultRedirect,
  EnableTfaPage,
  ipPools,
  JoinPage,
  PageNotFound,
  passwordReset,
  PremiumSupportPage,
  recipientLists,
  RecipientValidationPage,
  SingleResultPage,
  UploadedListPage,
  RegisterPage,
  reports,
  sendingDomains,
  signals,
  SmtpPage,
  snippets,
  SsoAuthPage,
  SSOPage,
  subaccounts,
  suppressions,
  TfaPage,
  trackingDomains,
  users,
  webhooks
} from 'src/pages';

import LogoutPage from 'src/pages/logout/LogoutPage';

import onboarding from 'src/pages/onboarding';
import { default as emailVerification } from 'src/components/emailVerification/EmailVerification';
import SecretBillingPlanOrBillingSummaryPage from '../SecretBillingPlanOrBillingSummaryPage';

import { all, hasGrants, not } from 'src/helpers/conditions';
import {
  hasAccountOptionEnabled,
  isAws,
  isCustomBilling,
  isEnterprise,
  isSelfServeBilling
} from 'src/helpers/conditions/account';
import { isAzure, isHeroku, isSubaccountUser } from 'src/helpers/conditions/user';
import { configEquals, configFlag } from 'src/helpers/conditions/config';
import App from 'src/components/layout/App';
import LargeForm from 'src/components/layout/LargeForm';

import {
  AUTH_ROUTE,
  DEFAULT_REDIRECT_ROUTE,
  ENABLE_TFA_AUTH_ROUTE,
  SIGN_UP_ROUTE,
  SSO_AUTH_ROUTE,
  TFA_ROUTE
} from 'src/constants';
//route modules
import { emailRedirects, emailVerificationRedirect } from './emailRoutes';
import templateRoutes from './templates';
import inboxPlacementRoutes from './inboxPlacement';

// See @sparkpost/access for role to grant mappings

const routes = [
  {
    path: '/',
    public: true,
    redirect: AUTH_ROUTE
  },
  {
    path: AUTH_ROUTE,
    public: true,
    component: AuthPage,
    title: 'Log In'
  },
  {
    path: TFA_ROUTE,
    public: true,
    component: TfaPage,
    title: 'Two-factor Authentication'
  },
  {
    path: SSO_AUTH_ROUTE,
    public: true,
    component: SsoAuthPage,
    title: 'SSO Log In'
  },
  {
    path: '/sso',
    public: true,
    component: SSOPage,
    title: 'Single Sign-On'
  },
  {
    path: ENABLE_TFA_AUTH_ROUTE,
    public: true,
    component: EnableTfaPage,
    layout: LargeForm,
    title: 'Enable TFA'
  },
  {
    path: '/register',
    public: true,
    forceLogout: true,
    component: RegisterPage,
    title: 'Finish Your Registration'
  },
  {
    path: '/sign-up',
    public: true,
    redirect: SIGN_UP_ROUTE
  },
  {
    path: SIGN_UP_ROUTE,
    public: true,
    forceLogout: true,
    component: JoinPage,
    condition: configFlag('featureFlags.has_signup'),
    title: 'Join'
  },
  {
    path: '/forgot-password',
    public: true,
    forceLogout: true,
    component: passwordReset.ForgotPasswordPage,
    title: 'Reset Password'
  },
  {
    path: '/reset-password/:token',
    public: true,
    forceLogout: true,
    component: passwordReset.ResetPasswordPage,
    title: 'Choose a New Password'
  },

  /**
   * This "DefaultRedirect" route is where we send _everyone_ once they first
   * log in, through Auth or Register or SSO or anything else. It will display
   * a loading icon until the access control state is loaded, then make a decision
   * on where to send them based on config, role, etc.
   *
   * TODO: Once the Dashboard is universally accessible, this can probably go away
   */
  {
    path: DEFAULT_REDIRECT_ROUTE,
    component: DefaultRedirect,
    layout: App,
    condition: () => true, // this route MUST be accessible to all logged-in app users
    title: 'Loading...'
  },

  /**
   * Handles route redirects for cutover to GA from old email template links
   * TODO: Should remove at a later date
   */
  ...emailRedirects,

  {
    path: '/dashboard',
    component: DashboardPage,
    layout: App,
    title: 'Dashboard',
    condition: all(
      not(isSubaccountUser),
      configEquals('splashPage', '/dashboard') // want to hide if not a splash page https://jira.int.messagesystems.com/browse/FAD-6046
    ),
    // TODO: implement some kind of blockedRoutes check that runs on every route so we can
    // hide routes based on config, account/user settings, etc. without having to mess
    // around with grants in the web UI keys
    supportDocSearch: 'started'
  },
  {
    path: '/reports',
    redirect: '/reports/summary'
  },
  {
    path: '/reports/summary',
    component: reports.SummaryPage,
    layout: App,
    title: 'Summary Report',
    supportDocSearch: 'reporting'
  },
  {
    path: '/reports/bounce',
    component: reports.BouncePage,
    layout: App,
    title: 'Bounce Report',
    supportDocSearch: 'bounce'
  },
  {
    path: '/reports/rejections',
    component: reports.RejectionPage,
    layout: App,
    title: 'Rejection Report',
    supportDocSearch: 'reject'
  },
  {
    path: '/reports/accepted',
    component: reports.AcceptedPage,
    layout: App,
    title: 'Accepted Report',
    supportDocSearch: 'accept'
  },
  {
    path: '/reports/delayed',
    component: reports.DelayPage,
    layout: App,
    title: 'Delayed Report',
    supportDocSearch: 'delay'
  },
  {
    path: '/reports/engagement',
    component: reports.EngagementPage,
    layout: App,
    title: 'Engagement Report',
    supportDocSearch: 'engagement'
  },
  {
    path: '/reports/message-events',
    component: reports.MessageEventsPage,
    layout: App,
    title: 'Events Search Report',
    supportDocSearch: 'event'
  },
  {
    path: '/reports/message-events/details/:messageId/:eventId?',
    component: reports.EventPage,
    layout: App,
    title: 'Message History',
    supportDocSearch: 'event'
  },
  {
    path: '/signals',
    redirect: '/signals/health-score'
  },
  {
    path: '/signals/health-score',
    component: signals.HealthScoreDashboard,
    condition: hasGrants('signals/manage'),
    layout: App,
    title: 'Signals',
    supportDocSearch: 'signals'
  },
  {
    path: '/signals/spam-traps',
    component: signals.SpamTrapDashboard,
    condition: hasGrants('signals/manage'),
    layout: App,
    title: 'Signals',
    supportDocSearch: 'signals'
  },
  {
    path: '/signals/engagement',
    component: signals.EngagementRecencyDashboard,
    condition: hasGrants('signals/manage'),
    layout: App,
    title: 'Signals',
    supportDocSearch: 'signals'
  },
  {
    path: '/signals/health-score/:facet/:facetId',
    component: signals.HealthScorePage,
    condition: hasGrants('signals/manage'),
    layout: App,
    title: 'Signals',
    supportDocSearch: 'signals'
  },
  {
    path: '/signals/spam-traps/:facet/:facetId',
    component: signals.SpamTrapPage,
    condition: hasGrants('signals/manage'),
    layout: App,
    title: 'Signals',
    supportDocSearch: 'signals'
  },
  {
    path: '/signals/engagement/cohorts/:facet/:facetId',
    component: signals.EngagementRecencyPage,
    condition: hasGrants('signals/manage'),
    layout: App,
    title: 'Signals',
    supportDocSearch: 'signals'
  },
  {
    path: '/signals/engagement/engagement-rate/:facet/:facetId',
    component: signals.EngagementRateByCohortPage,
    condition: hasGrants('signals/manage'),
    layout: App,
    title: 'Signals',
    supportDocSearch: 'signals'
  },
  {
    path: '/signals/engagement/unsubscribes/:facet/:facetId',
    component: signals.UnsubscribeRateByCohortPage,
    condition: hasGrants('signals/manage'),
    layout: App,
    title: 'Signals',
    supportDocSearch: 'signals'
  },
  {
    path: '/signals/engagement/complaints/:facet/:facetId',
    component: signals.ComplaintsByCohortPage,
    condition: hasGrants('signals/manage'),
    layout: App,
    title: 'Signals',
    supportDocSearch: 'signals'
  },
  {
    path: '/signals/integration',
    component: signals.Integration,
    condition: hasAccountOptionEnabled('allow_events_ingest'),
    layout: App,
    title: 'Signals | Integration',
    supportDocSearch: 'signals'
  },
  {
    path: '/account/security',
    redirect: '/account/profile'
  },
  {
    path: '/account/email-verification/:token',
    component: emailVerification,
    title: 'Verify Your Email',
    supportDocSearch: 'verification'
  },
  {
    path: '/account/subaccounts',
    component: subaccounts.ListPage,
    condition: hasGrants('subaccount/manage', 'api_keys/manage', 'sending_domains/manage'),
    layout: App,
    title: 'Subaccounts',
    supportDocSearch: 'subaccout'
  },
  {
    path: '/account/subaccounts/create',
    component: subaccounts.CreatePage,
    condition: hasGrants('subaccount/manage', 'api_keys/manage', 'sending_domains/manage'),
    layout: App,
    title: 'New Subaccount',
    supportDocSearch: 'subaccout'
  },
  {
    path: '/account/subaccounts/:id',
    component: subaccounts.DetailsPage,
    condition: hasGrants('subaccount/manage', 'api_keys/manage', 'sending_domains/manage'),
    layout: App,
    title: 'Subaccount Details',
    exact: false,
    supportDocSearch: 'subaccout'
  },
  {
    path: '/account/users',
    component: users.ListPage,
    condition: hasGrants('users/manage'),
    layout: App,
    title: 'Users',
    supportDocSearch: 'user'
  },
  {
    path: '/account/users/create',
    component: users.CreatePage,
    condition: hasGrants('users/manage'),
    layout: App,
    title: 'Invite User',
    supportDocSearch: 'user'
  },
  {
    path: '/account/users/edit/:id',
    component: users.EditPage,
    condition: hasGrants('users/manage'),
    layout: App,
    title: 'Edit User',
    supportDocSearch: 'user'
  },
  {
    path: '/snippets',
    component: snippets.ListPage,
    condition: hasGrants('templates/view'),
    layout: App,
    title: 'Snippets',
    supportDocSearch: 'snippet'
  },
  {
    path: '/snippets/create',
    component: snippets.CreatePage,
    condition: hasGrants('templates/modify'),
    layout: App,
    title: 'New Snippet',
    supportDocSearch: 'snippet'
  },
  {
    path: '/snippets/edit/:id',
    component: snippets.EditPage,
    condition: hasGrants('templates/view'),
    layout: App,
    title: 'Edit Snippet',
    supportDocSearch: 'snippet'
  },

  {
    path: '/lists/recipient-lists',
    component: recipientLists.ListPage,
    condition: hasGrants('recipient_lists/manage'),
    layout: App,
    title: 'Recipient Lists',
    supportDocSearch: 'recipient list'
  },
  {
    path: '/lists/recipient-lists/create',
    component: recipientLists.CreatePage,
    condition: hasGrants('recipient_lists/manage'),
    layout: App,
    title: 'New Recipient List',
    supportDocSearch: 'recipient list'
  },
  {
    path: '/lists/recipient-lists/edit/:id',
    component: recipientLists.EditPage,
    condition: hasGrants('recipient_lists/manage'),
    layout: App,
    title: 'Edit Recipient List',
    supportDocSearch: 'recipient list'
  },
  {
    path: '/lists/suppressions',
    component: suppressions.ListPage,
    condition: hasGrants('suppression_lists/manage'),
    layout: App,
    title: 'Suppression List',
    supportDocSearch: 'suppression list'
  },
  {
    path: '/lists/suppressions/create',
    component: suppressions.CreatePage,
    condition: hasGrants('suppression_lists/manage'),
    layout: App,
    title: 'New Suppression',
    supportDocSearch: 'suppression list'
  },
  {
    path: '/webhooks',
    component: webhooks.ListPage,
    condition: hasGrants('webhooks/view'),
    layout: App,
    title: 'Webhooks',
    supportDocSearch: 'webhook'
  },
  {
    path: '/webhooks/create',
    component: webhooks.CreatePage,
    condition: hasGrants('webhooks/modify'),
    layout: App,
    title: 'New Webhook',
    supportDocSearch: 'webhook'
  },
  {
    path: '/webhooks/details/:id',
    component: webhooks.DetailsPage,
    condition: hasGrants('webhooks/modify'),
    layout: App,
    title: 'Webhook Details',
    exact: false,
    supportDocSearch: 'webhook'
  },
  {
    path: '/account/api-keys',
    component: apiKeys.ListPage,
    condition: hasGrants('api_keys/manage'),
    layout: App,
    title: 'API Keys',
    supportDocSearch: 'api key'
  },
  {
    path: '/account/api-keys/create',
    component: apiKeys.CreatePage,
    condition: hasGrants('api_keys/manage'),
    layout: App,
    title: 'New API Key',
    supportDocSearch: 'api key'
  },
  {
    path: '/account/api-keys/edit/:id',
    component: apiKeys.EditPage,
    condition: hasGrants('api_keys/manage'),
    layout: App,
    title: 'Edit API Key',
    supportDocSearch: 'api key'
  },
  {
    path: '/account/api-keys/view/:id',
    component: apiKeys.DetailsPage,
    condition: hasGrants('api_keys/manage'),
    layout: App,
    title: 'View API Key',
    supportDocSearch: 'api key'
  },
  {
    path: '/account/tracking-domains',
    component: trackingDomains.ListPage,
    condition: hasGrants('tracking_domains/manage'),
    layout: App,
    title: 'Tracking Domains',
    supportDocSearch: 'tracking domain'
  },
  {
    path: '/account/tracking-domains/create',
    component: trackingDomains.CreatePage,
    condition: hasGrants('tracking_domains/manage'),
    layout: App,
    title: 'New Tracking Domain',
    supportDocSearch: 'tracking domain'
  },
  {
    path: '/account/settings',
    component: AccountSettingsPage,
    condition: hasGrants('users/manage'),
    layout: App,
    title: 'Account settings',
    supportDocSearch: 'account settings'
  },
  {
    path: '/account/cancel',
    component: ImmediateCancelAccountPage,
    condition: all(hasGrants('account/manage'), not(isEnterprise), not(isHeroku), not(isAzure)),
    layout: App,
    title: 'Account | Cancellation In Progress'
  },
  {
    path: '/account/profile',
    component: emailVerificationRedirect,
    condition: hasGrants('users/self-manage'),
    layout: App,
    title: 'My Profile',
    supportDocSearch: 'account profile'
  },
  {
    path: '/account/sending-domains',
    component: sendingDomains.ListPage,
    condition: hasGrants('sending_domains/manage'),
    layout: App,
    title: 'Sending Domains',
    supportDocSearch: 'sending domain'
  },
  {
    path: '/account/sending-domains/create',
    component: sendingDomains.CreatePage,
    condition: hasGrants('sending_domains/manage'),
    layout: App,
    title: 'New Sending Domain',
    supportDocSearch: 'sending domain'
  },
  {
    path: '/account/sending-domains/edit/:id',
    component: sendingDomains.EditPage,
    condition: hasGrants('sending_domains/manage'),
    layout: App,
    title: 'Edit Sending Domain',
    supportDocSearch: 'sending domain'
  },
  {
    path: '/account/smtp',
    component: SmtpPage,
    condition: hasGrants('api_keys/manage'),
    layout: App,
    title: 'SMTP Settings',
    supportDocSearch: 'smtp'
  },
  {
    path: '/account/billing',
    component: SecretBillingPlanOrBillingSummaryPage,
    condition: all(hasGrants('account/manage'), not(isEnterprise), not(isHeroku), not(isAzure)),
    layout: App,
    title: 'Billing',
    supportDocSearch: 'billing'
  },
  {
    path: '/account/billing/enable-automatic',
    component: billing.EnableAutomaticBillingPage,
    condition: all(
      hasGrants('account/manage'),
      not(isSelfServeBilling),
      isCustomBilling
    ),
    layout: App,
    title: 'Billing | Enable Automatic Billing',
    supportDocSearch: 'upgrade account'
  },
  {
    path: '/account/billing/plan',
    component: billing.ChangePlanPage,
    condition: all(
      hasGrants('account/manage'),
      not(isEnterprise),
      not(isHeroku),
      not(isAzure),
      not(isCustomBilling)
    ),
    layout: App,
    title: 'Billing | Change My Plan',
    supportDocSearch: 'upgrade account'
  },
  {
    path: '/account/billing/plan/change',
    component: billing.ImmediateChangePlanPage,
    condition: all(hasGrants('account/manage'), not(isEnterprise), not(isHeroku), not(isAzure)),
    layout: App,
    title: 'Billing | Plan Change In Progress',
    supportDocSearch: 'upgrade account'
  },
  {
    path: '/account/ip-pools',
    component: ipPools.ListPage,
    condition: hasGrants('ip_pools/manage'),
    layout: App,
    title: 'IP Pools',
    supportDocSearch: 'ip pool'
  },
  {
    path: '/account/ip-pools/create',
    component: ipPools.CreatePage,
    condition: hasGrants('ip_pools/manage'),
    layout: App,
    title: 'New IP Pool',
    supportDocSearch: 'ip pool'
  },
  {
    path: '/account/ip-pools/edit/:poolId',
    component: ipPools.EditPage,
    condition: hasGrants('ip_pools/manage'),
    layout: App,
    title: 'Edit IP Pool',
    supportDocSearch: 'ip pool'
  },
  {
    path: '/account/ip-pools/edit/:poolId/:ip',
    component: ipPools.EditIpPage,
    condition: hasGrants('ip_pools/manage'),
    layout: App,
    title: 'Edit IP',
    supportDocSearch: 'ip pool'
  },
  {
    path: '/ab-testing',
    component: abTesting.ListPage,
    condition: hasGrants('ab-testing/manage'),
    layout: App,
    title: 'A/B Testing',
    supportDocsSearch: 'A/B test'
  },
  {
    path: '/ab-testing/create',
    component: abTesting.CreatePage,
    condition: hasGrants('ab-testing/manage'),
    layout: App,
    title: 'Create A/B Test',
    supportDocsSearch: 'A/B test'
  },
  {
    path: '/ab-testing/:id/:version',
    component: abTesting.DetailsPage,
    condition: hasGrants('ab-testing/manage'),
    layout: App,
    title: 'A/B Testing',
    supportDocsSearch: 'A/B test'
  },
  {
    path: '/alerts',
    component: alerts.ListPage,
    condition: hasGrants('alerts/manage'),
    layout: App,
    title: 'Alerts',
    supportDocsSearch: 'Alerts'
  },
  {
    path: '/alerts/details/:id',
    component: alerts.DetailsPage,
    condition: hasGrants('alerts/manage'),
    layout: App,
    title: 'View Details',
    supportDocsSearch: 'Alerts'
  },
  {
    path: '/alerts/create/:id?',
    component: alerts.CreatePage,
    condition: hasGrants('alerts/manage'),
    layout: App,
    title: 'Create Alert',
    supportDocsSearch: 'Alerts'
  },
  {
    path: '/alerts/edit/:id',
    component: alerts.EditPage,
    condition: hasGrants('alerts/manage'),
    layout: App,
    title: 'Edit Alert',
    supportDocsSearch: 'Alerts'
  },
  {
    path: '/onboarding/plan',
    component: onboarding.ChoosePlan,
    condition: configFlag('featureFlags.has_signup'),
    title: 'Onboarding | Choose Your Plan',
    supportDocSearch: 'upgrade account'
  },
  {
    path: '/onboarding/sending-domain',
    component: onboarding.SendingDomainPage,
    condition: configFlag('featureFlags.has_signup'),
    title: 'Onboarding | Create a Sending Domain',
    supportDocSearch: 'sending domain'
  },
  {
    path: '/onboarding/email',
    component: onboarding.SmtpOrApiPage,
    condition: configFlag('featureFlags.has_signup'),
    title: 'Onboarding | REST and SMTP',
    supportDocSearch: 'smtp'
  },
  {
    path: '/onboarding/email/smtp',
    component: onboarding.SmtpPage,
    condition: configFlag('featureFlags.has_signup'),
    title: 'Onboarding | Send a Test Email (SMTP)',
    supportDocSearch: 'smtp'
  },
  {
    path: '/onboarding/email/api',
    component: onboarding.ApiPage,
    condition: configFlag('featureFlags.has_signup'),
    title: 'Onboarding | Send a Test Email (REST)',
    supportDocSearch: 'smtp'
  },
  {
    path: '/recipient-validation',
    redirect: '/recipient-validation/list'
  },
  {
    path: '/recipient-validation/single/:email',
    component: SingleResultPage,
    condition: hasGrants('recipient-validation/manage'),
    layout: App,
    title: 'Recipient Validation | Results',
    supportDocsSearch: 'Recipient Validation'
  },
  {
    path: '/recipient-validation/list/:listId',
    component: UploadedListPage,
    condition: hasGrants('recipient-validation/manage'),
    layout: App,
    title: 'Recipient Validation | List',
    supportDocsSearch: 'Recipient Validation'
  },
  {
    path: '/recipient-validation/:category',
    component: RecipientValidationPage,
    condition: hasGrants('recipient-validation/manage'), // must manual keep in sync with nav item
    layout: App,
    title: 'Recipient Validation',
    supportDocsSearch: 'Recipient Validation'
  },
  {
    path: '/support/aws-premium',
    component: PremiumSupportPage,
    condition: isAws,
    title: 'Support | Request Premium Support',
    layout: App,
    supportDocSearch: 'upgrade plan'
  },
  {
    path: '/logout',
    component: LogoutPage,
    title: 'Logging out...'
  },
  ...templateRoutes,
  ...inboxPlacementRoutes
];

// ensure 404 is always last in routes
routes.push({
  path: '*',
  component: PageNotFound,
  layout: App,
  title: 'Page Not Found'
});

export default routes;
