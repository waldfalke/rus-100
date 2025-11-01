import React from 'react';
import Layout from '../../components/Layout';
import { ThemeProvider } from '../../lib/providers/ThemeProvider';
import { ContextDemo } from '../../lib/components/ContextDemo';
import { minimalThemeConfig } from '../../lib/theme-config';

const ContextDemoPage: React.FC = () => {
  return (
    <ThemeProvider config={minimalThemeConfig}>
      <Layout 
        title="Context-Aware Resolution - Demo"
        description="Демонстрация контекстно-зависимого разрешения дизайн-токенов"
      >
        <div data-testid="context-demo-page" style={{ backgroundColor: 'var(--colors-background-primary)' }}>

          {/* Main Content */}
          <main style={{ 
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {/* Page Header */}
            <section style={{ 
              marginBottom: '3rem',
              padding: '2rem',
              backgroundColor: 'var(--colors-background-secondary)',
              borderRadius: 'var(--spacing-md)',
              border: '1px solid var(--colors-border-primary)',
            }}>
              <h2 style={{
                fontSize: 'var(--typography-heading-large-fontSize)',
                fontWeight: 'var(--typography-heading-large-fontWeight)',
                color: 'var(--colors-text-primary)',
                marginBottom: '1rem',
              }}>
                Контекстно-зависимое разрешение токенов
              </h2>
              
              <p style={{
                fontSize: 'var(--typography-body-large-fontSize)',
                color: 'var(--colors-text-secondary)',
                marginBottom: '1.5rem',
                lineHeight: 1.6,
              }}>
                Эта демонстрация показывает, как система автоматически адаптирует дизайн-токены 
                в зависимости от контекста: платформы, настроек доступности и пользовательских предпочтений.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
              }}>
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--colors-semantic-info)',
                  color: 'var(--colors-text-inverse)',
                  borderRadius: 'var(--spacing-sm)',
                  textAlign: 'center',
                }}>
                  <strong>Platform Detection</strong>
                  <br />
                  <small>Автоматическое определение платформы</small>
                </div>
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--colors-semantic-success)',
                  color: 'var(--colors-text-inverse)',
                  borderRadius: 'var(--spacing-sm)',
                  textAlign: 'center',
                }}>
                  <strong>Accessibility</strong>
                  <br />
                  <small>Адаптация под настройки доступности</small>
                </div>
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--colors-semantic-warning)',
                  color: 'var(--colors-text-inverse)',
                  borderRadius: 'var(--spacing-sm)',
                  textAlign: 'center',
                }}>
                  <strong>User Preferences</strong>
                  <br />
                  <small>Учет пользовательских предпочтений</small>
                </div>
                <div style={{
                  padding: '1rem',
                  backgroundColor: 'var(--colors-brand-primary)',
                  color: 'var(--colors-text-inverse)',
                  borderRadius: 'var(--spacing-sm)',
                  textAlign: 'center',
                }}>
                  <strong>Real-time Updates</strong>
                  <br />
                  <small>Обновления в реальном времени</small>
                </div>
              </div>
            </section>

            {/* Interactive Demo */}
            <section>
              <ContextDemo />
            </section>

            {/* Technical Details */}
            <section style={{ 
              marginTop: '3rem',
              padding: '2rem',
              backgroundColor: 'var(--colors-background-secondary)',
              borderRadius: 'var(--spacing-md)',
              border: '1px solid var(--colors-border-primary)',
            }}>
              <h3 style={{
                fontSize: 'var(--typography-heading-medium-fontSize)',
                fontWeight: 'var(--typography-heading-medium-fontWeight)',
                color: 'var(--colors-text-primary)',
                marginBottom: '1.5rem',
              }}>
                Технические детали
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}>
                <div>
                  <h4 style={{
                    fontSize: 'var(--typography-heading-small-fontSize)',
                    fontWeight: 'var(--typography-heading-small-fontWeight)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '1rem',
                  }}>
                    🔍 Platform Detection
                  </h4>
                  <ul style={{
                    fontSize: 'var(--typography-body-medium-fontSize)',
                    color: 'var(--colors-text-secondary)',
                    lineHeight: 1.5,
                    paddingLeft: '1.5rem',
                  }}>
                    <li>User Agent анализ</li>
                    <li>Touch/Hover capabilities</li>
                    <li>Screen size и DPI</li>
                    <li>Platform-specific APIs</li>
                  </ul>
                </div>

                <div>
                  <h4 style={{
                    fontSize: 'var(--typography-heading-small-fontSize)',
                    fontWeight: 'var(--typography-heading-small-fontWeight)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '1rem',
                  }}>
                    ♿ Accessibility Features
                  </h4>
                  <ul style={{
                    fontSize: 'var(--typography-body-medium-fontSize)',
                    color: 'var(--colors-text-secondary)',
                    lineHeight: 1.5,
                    paddingLeft: '1.5rem',
                  }}>
                    <li>prefers-reduced-motion</li>
                    <li>prefers-contrast</li>
                    <li>prefers-color-scheme</li>
                    <li>font-size preferences</li>
                  </ul>
                </div>

                <div>
                  <h4 style={{
                    fontSize: 'var(--typography-heading-small-fontSize)',
                    fontWeight: 'var(--typography-heading-small-fontWeight)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '1rem',
                  }}>
                    ⚡ Performance
                  </h4>
                  <ul style={{
                    fontSize: 'var(--typography-body-medium-fontSize)',
                    color: 'var(--colors-text-secondary)',
                    lineHeight: 1.5,
                    paddingLeft: '1.5rem',
                  }}>
                    <li>Lazy token resolution</li>
                    <li>Memoized calculations</li>
                    <li>Efficient context updates</li>
                    <li>Minimal re-renders</li>
                  </ul>
                </div>
              </div>
            </section>
          </main>
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default ContextDemoPage;