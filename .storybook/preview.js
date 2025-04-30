import '../app/globals.css';
import { ThemeProvider } from '../components/theme-provider';
import { withNextClientDirective } from './decorators';

export const decorators = [
  withNextClientDirective,
  (Story) => (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <Story />
    </ThemeProvider>
  ),
];

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: { expanded: true },
}; 