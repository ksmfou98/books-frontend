import * as React from 'react';
import Favicon from 'src/pages/Favicon';
import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

afterEach(cleanup);

test('should be render Index Component', () => {
  render(<Favicon />);
});
