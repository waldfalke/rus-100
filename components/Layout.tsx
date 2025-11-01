import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { spacingMd, spacingLg, spacing2Xl } from '@/lib/tokens';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'Functional Design Tokens',
  description = 'Система функциональных дизайн-токенов с поддержкой OKLCH и контекстно-зависимого разрешения'
}) => {
  const router = useRouter();

  const navigation = [
    { href: '/demo', label: 'Главная', active: router.pathname === '/demo' },
    { href: '/demo/context', label: 'Context Demo', active: router.pathname === '/demo/context' },
    { href: '/demo/tokens', label: 'Token Inspector', active: router.pathname === '/demo/tokens' },
    { href: '/demo/elevation', label: 'Elevation Demo', active: router.pathname === '/demo/elevation' },
    { href: '/demo/comprehensive-showcase', label: 'Comprehensive Showcase', active: router.pathname === '/demo/comprehensive-showcase' },
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'var(--colors-background-primary)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Global Navigation */}
        <header style={{
          padding: `var(--theme-space-md) var(--theme-space-2xl)`,
          borderBottom: '1px solid var(--colors-border-primary)',
          backgroundColor: 'var(--colors-background-secondary)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}>
          <nav style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
              <Link 
                href="/demo" 
                style={{
                  fontSize: 'var(--typography-heading-medium-fontSize)',
                  fontWeight: 'var(--typography-heading-medium-fontWeight)',
                  color: 'var(--colors-brand-primary)',
                  textDecoration: 'none',
                }}
              >
                Functional Design Tokens
              </Link>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: item.active 
                        ? 'var(--colors-brand-primary)' 
                        : 'var(--colors-background-tertiary)',
                      color: item.active 
                        ? 'var(--colors-text-inverse)' 
                        : 'var(--colors-text-primary)',
                      textDecoration: 'none',
                      borderRadius: 'var(--spacing-xs)',
                      fontSize: 'var(--typography-body-medium-fontSize)',
                      border: '1px solid var(--colors-border-primary)',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <a
                href="https://github.com/your-repo/functional-design-tokens"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '0.5rem',
                  color: 'var(--colors-text-secondary)',
                  textDecoration: 'none',
                  borderRadius: 'var(--spacing-xs)',
                  border: '1px solid var(--colors-border-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
            </div>
          </nav>
        </header>

        {/* Main Content */}
        <main style={{ flex: 1 }}>
          {children}
        </main>

        {/* Global Footer */}
        <footer style={{
          padding: 'var(--theme-space-2xl)',
          borderTop: '1px solid var(--colors-border-primary)',
          backgroundColor: 'var(--colors-background-secondary)',
          textAlign: 'center',
        }}>
          <div style={{ 
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem',
              textAlign: 'left',
            }}>
              <div>
                <h4 style={{
                  fontSize: 'var(--typography-heading-small-fontSize)',
                  fontWeight: 'var(--typography-heading-small-fontWeight)',
                  color: 'var(--colors-text-primary)',
                  marginBottom: '1rem',
                }}>
                  Features
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: 'var(--typography-body-medium-fontSize)',
                  color: 'var(--colors-text-secondary)',
                  lineHeight: 1.6,
                }}>
                  <li>🎨 OKLCH Color System</li>
                  <li>📱 Context-Aware Resolution</li>
                  <li>♿ Accessibility Support</li>
                  <li>🔧 TypeScript Integration</li>
                </ul>
              </div>

              <div>
                <h4 style={{
                  fontSize: 'var(--typography-heading-small-fontSize)',
                  fontWeight: 'var(--typography-heading-small-fontWeight)',
                  color: 'var(--colors-text-primary)',
                  marginBottom: '1rem',
                }}>
                  Platforms
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: 'var(--typography-body-medium-fontSize)',
                  color: 'var(--colors-text-secondary)',
                  lineHeight: 1.6,
                }}>
                  <li>🌐 Web (React)</li>
                  <li>📱 iOS (React Native)</li>
                  <li>🤖 Android (React Native)</li>
                  <li>💻 Desktop (Electron)</li>
                </ul>
              </div>

              <div>
                <h4 style={{
                  fontSize: 'var(--typography-heading-small-fontSize)',
                  fontWeight: 'var(--typography-heading-small-fontWeight)',
                  color: 'var(--colors-text-primary)',
                  marginBottom: '1rem',
                }}>
                  Testing
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: 'var(--typography-body-medium-fontSize)',
                  color: 'var(--colors-text-secondary)',
                  lineHeight: 1.6,
                }}>
                  <li>✅ Token Validation</li>
                  <li>📸 Visual Regression</li>
                  <li>♿ Accessibility Audits</li>
                  <li>⚡ Performance Monitoring</li>
                </ul>
              </div>

              <div>
                <h4 style={{
                  fontSize: 'var(--typography-heading-small-fontSize)',
                  fontWeight: 'var(--typography-heading-small-fontWeight)',
                  color: 'var(--colors-text-primary)',
                  marginBottom: '1rem',
                }}>
                  Resources
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  fontSize: 'var(--typography-body-medium-fontSize)',
                  color: 'var(--colors-text-secondary)',
                  lineHeight: 1.6,
                }}>
                  <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>📚 Documentation</a></li>
                  <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>🎯 Examples</a></li>
                  <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>🐛 Issues</a></li>
                  <li><a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>💬 Discussions</a></li>
                </ul>
              </div>
            </div>

            <div style={{
              paddingTop: '2rem',
              borderTop: '1px solid var(--colors-border-primary)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
            }}>
              <p style={{
                fontSize: 'var(--typography-body-small-fontSize)',
                color: 'var(--colors-text-secondary)',
                margin: 0,
              }}>
                © 2024 Functional Design Tokens. Создано для современных интерфейсов.
              </p>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{
                  fontSize: 'var(--typography-body-small-fontSize)',
                  color: 'var(--colors-text-secondary)',
                }}>
                  Made with ❤️ and TypeScript
                </span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;