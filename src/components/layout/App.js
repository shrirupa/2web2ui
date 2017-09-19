import React from 'react';

import ScrollToTop from './ScrollToTop';
import { Loading, Navigation, GlobalAlert } from 'components';
import styles from './Layout.module.scss';

const App = ({ children, loading }) => (
  <div className={`${styles.wrapper} ${styles.accent}`}>
    <div className={styles.aside}>
      <Navigation />
    </div>
    <main role="main" className={styles.content}>
      <div className={styles.container}>
        { loading ? <div className={styles.loading}><Loading /></div> : children }
      </div>
      <div className={styles.appError}>
        <GlobalAlert />
      </div>
    </main>
    <ScrollToTop/>
  </div>
);

export default App;
