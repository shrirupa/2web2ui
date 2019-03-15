import React from 'react';
import propTypes from 'prop-types';
import { ApiErrorBanner } from 'src/components';

const ErrorBanner = ({ loadItems, error, noun }) =>
  error ? (
    <ApiErrorBanner
      errorDetails={error.message}
      message={`Sorry, we seem to have had some trouble loading your ${noun.toLowerCase()}s .`}
      reload={loadItems}
    />
  ) : null;

ErrorBanner.displayName = 'ListPage.ErrorBanner';

ErrorBanner.propTypes = {
  errorDetails: propTypes.string.isRequired,
  message: propTypes.string,
  reload: propTypes.func
};

export default ErrorBanner;
