import * as React from 'react';
import { darkTheme, defaultTheme } from 'src/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import NotificationPage from 'src/pages/notification';

interface InAppNotificationProps {
  theme?: string;
  // tslint:disable-next-line
}

// eslint-disable-next-line react/prefer-stateless-function
function InAppNotification(props: InAppNotificationProps) {
  const { theme } = props;

  return (
    <ThemeProvider theme={theme === 'dark' ? darkTheme : defaultTheme}>
      <NotificationPage isTitleHidden />
    </ThemeProvider>
  );
}

export default InAppNotification;
