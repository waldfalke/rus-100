import React from 'react';
import Link from 'next/link';
import { Layout } from '../../components/Layout';
import { ThemeProvider } from '../../lib/providers/ThemeProvider';
import { ElevationDemo } from '../../components/demos/elevation-demo';
import { minimalThemeConfig } from '../../lib/theme-config';

const ElevationDemoPage: React.FC = () => {
  return (
    <ThemeProvider config={minimalThemeConfig}>
      <Layout 
        title="Elevation Tokens - Demo"
        description="Демонстрация системы токенов возвышения с контекстно-зависимыми тенями и поддержкой доступности"
      >
        <div data-testid="elevation-demo-page" style={{ backgroundColor: 'var(--colors-background-primary)' }}>
          {/* Header */}
          <header style={{
            padding: '2rem',
            backgroundColor: 'var(--colors-background-secondary)',
            borderBottom: '1px solid var(--colors-border-primary)',
          }}>
            <div style={{
              maxWidth: '1200px',
              margin: '0 auto',
              textAlign: 'center',
            }}>
              <h1 style={{
                fontSize: 'var(--typography-heading-xlarge-fontSize)',
                fontWeight: 'var(--typography-heading-xlarge-fontWeight)',
                color: 'var(--colors-text-primary)',
                marginBottom: '1rem',
              }}>
                Система токенов возвышения
              </h1>
              
              <p style={{
                fontSize: 'var(--typography-body-large-fontSize)',
                color: 'var(--colors-text-secondary)',
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: 1.6,
              }}>
                Контекстно-зависимые тени, которые автоматически адаптируются к теме, 
                платформе и настройкам доступности. Создавайте визуальную иерархию 
                с помощью семантических уровней возвышения.
              </p>
            </div>
          </header>

          {/* Main Content */}
          <main style={{ 
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {/* Features Overview */}
            <section style={{ marginBottom: '3rem' }}>
              <h2 style={{
                fontSize: 'var(--typography-heading-large-fontSize)',
                fontWeight: 'var(--typography-heading-large-fontWeight)',
                color: 'var(--colors-text-primary)',
                marginBottom: '2rem',
                textAlign: 'center',
              }}>
                Возможности системы
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem',
              }}>
                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--spacing-md)',
                  border: '1px solid var(--colors-border-primary)',
                }}>
                  <h3 style={{
                    fontSize: 'var(--typography-heading-medium-fontSize)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '0.5rem',
                  }}>
                    🎯 Контекстная адаптация
                  </h3>
                  <p style={{
                    fontSize: 'var(--typography-body-medium-fontSize)',
                    color: 'var(--colors-text-secondary)',
                    lineHeight: 1.5,
                  }}>
                    Тени автоматически адаптируются к размеру компонента, 
                    платформе и пользовательским предпочтениям.
                  </p>
                </div>

                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--spacing-md)',
                  border: '1px solid var(--colors-border-primary)',
                }}>
                  <h3 style={{
                    fontSize: 'var(--typography-heading-medium-fontSize)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '0.5rem',
                  }}>
                    ♿ Доступность
                  </h3>
                  <p style={{
                    fontSize: 'var(--typography-body-medium-fontSize)',
                    color: 'var(--colors-text-secondary)',
                    lineHeight: 1.5,
                  }}>
                    Поддержка высокого контраста, уменьшенной анимации 
                    и других настроек доступности.
                  </p>
                </div>

                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--spacing-md)',
                  border: '1px solid var(--colors-border-primary)',
                }}>
                  <h3 style={{
                    fontSize: 'var(--typography-heading-medium-fontSize)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '0.5rem',
                  }}>
                    🎨 OKLCH интеграция
                  </h3>
                  <p style={{
                    fontSize: 'var(--typography-body-medium-fontSize)',
                    color: 'var(--colors-text-secondary)',
                    lineHeight: 1.5,
                  }}>
                    Цвета теней рассчитываются в цветовом пространстве OKLCH 
                    для максимальной точности.
                  </p>
                </div>

                <div style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--spacing-md)',
                  border: '1px solid var(--colors-border-primary)',
                }}>
                  <h3 style={{
                    fontSize: 'var(--typography-heading-medium-fontSize)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '0.5rem',
                  }}>
                    📐 Семантические уровни
                  </h3>
                  <p style={{
                    fontSize: 'var(--typography-body-medium-fontSize)',
                    color: 'var(--colors-text-secondary)',
                    lineHeight: 1.5,
                  }}>
                    6 уровней возвышения (0-5) с предустановками 
                    для различных типов компонентов.
                  </p>
                </div>
              </div>
            </section>

            {/* Interactive Demo */}
            <section>
              <h2 style={{
                fontSize: 'var(--typography-heading-large-fontSize)',
                fontWeight: 'var(--typography-heading-large-fontWeight)',
                color: 'var(--colors-text-primary)',
                marginBottom: '2rem',
                textAlign: 'center',
              }}>
                Интерактивная демонстрация
              </h2>

              <ElevationDemo />
            </section>

            {/* Usage Examples */}
            <section style={{ marginTop: '4rem' }}>
              <h2 style={{
                fontSize: 'var(--typography-heading-large-fontSize)',
                fontWeight: 'var(--typography-heading-large-fontWeight)',
                color: 'var(--colors-text-primary)',
                marginBottom: '2rem',
                textAlign: 'center',
              }}>
                Примеры использования
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}>
                {/* React Hook Example */}
                <div style={{
                  padding: '2rem',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--spacing-md)',
                  border: '1px solid var(--colors-border-primary)',
                }}>
                  <h3 style={{
                    fontSize: 'var(--typography-heading-medium-fontSize)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '1rem',
                  }}>
                    React Hook
                  </h3>
                  <pre style={{
                    backgroundColor: 'var(--colors-background-primary)',
                    padding: '1rem',
                    borderRadius: 'var(--spacing-sm)',
                    fontSize: '0.875rem',
                    color: 'var(--colors-text-primary)',
                    overflow: 'auto',
                    border: '1px solid var(--colors-border-secondary)',
                  }}>
{`import { useComponentElevation } from '@/lib/hooks/use-elevation';

function Card({ children }) {
  const { shadowCSS } = useComponentElevation('card');
  
  return (
    <div style={{ boxShadow: shadowCSS }}>
      {children}
    </div>
  );
}`}
                  </pre>
                </div>

                {/* CSS Properties Example */}
                <div style={{
                  padding: '2rem',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--spacing-md)',
                  border: '1px solid var(--colors-border-primary)',
                }}>
                  <h3 style={{
                    fontSize: 'var(--typography-heading-medium-fontSize)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '1rem',
                  }}>
                    CSS Custom Properties
                  </h3>
                  <pre style={{
                    backgroundColor: 'var(--colors-background-primary)',
                    padding: '1rem',
                    borderRadius: 'var(--spacing-sm)',
                    fontSize: '0.875rem',
                    color: 'var(--colors-text-primary)',
                    overflow: 'auto',
                    border: '1px solid var(--colors-border-secondary)',
                  }}>
{`import { generateElevationCSS } from '@/lib/tokens/elevation';

const cssProps = generateElevationCSS(2, {
  level: 2,
  variant: 'moderate',
  size: 'md',
  platform: 'web'
});

// Результат:
// {
//   '--elevation-shadow': '0 4px 8px rgba(...)',
//   '--elevation-level': '2'
// }`}
                  </pre>
                </div>

                {/* Tailwind Example */}
                <div style={{
                  padding: '2rem',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--spacing-md)',
                  border: '1px solid var(--colors-border-primary)',
                }}>
                  <h3 style={{
                    fontSize: 'var(--typography-heading-medium-fontSize)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '1rem',
                  }}>
                    Tailwind Integration
                  </h3>
                  <pre style={{
                    backgroundColor: 'var(--colors-background-primary)',
                    padding: '1rem',
                    borderRadius: 'var(--spacing-sm)',
                    fontSize: '0.875rem',
                    color: 'var(--colors-text-primary)',
                    overflow: 'auto',
                    border: '1px solid var(--colors-border-secondary)',
                  }}>
{`import { generateElevationTailwind } from '@/lib/tokens/elevation';

const classes = generateElevationTailwind(3, context);

return (
  <div className={\`bg-white \${classes.boxShadow}\`}>
    Content with Tailwind elevation
  </div>
);`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Navigation */}
            <section style={{ 
              marginTop: '4rem',
              padding: '2rem',
              backgroundColor: 'var(--colors-background-secondary)',
              borderRadius: 'var(--spacing-md)',
              border: '1px solid var(--colors-border-primary)',
              textAlign: 'center',
            }}>
              <h3 style={{
                fontSize: 'var(--typography-heading-medium-fontSize)',
                color: 'var(--colors-text-primary)',
                marginBottom: '1rem',
              }}>
                Дополнительные ресурсы
              </h3>
              
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                flexWrap: 'wrap',
              }}>
                <a
                  href="/demo"
                  style={{
                    color: 'var(--colors-brand-primary)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    padding: '0.5rem 1rem',
                    border: '1px solid var(--colors-brand-primary)',
                    borderRadius: 'var(--spacing-sm)',
                    transition: 'all 0.2s',
                  }}
                >
                  ← Главная демо
                </a>
                
                <a
                  href="/demo/tokens"
                  style={{
                    color: 'var(--colors-brand-primary)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    padding: '0.5rem 1rem',
                    border: '1px solid var(--colors-brand-primary)',
                    borderRadius: 'var(--spacing-sm)',
                    transition: 'all 0.2s',
                  }}
                >
                  Токены →
                </a>
                
                <a
                  href="/demo/context"
                  style={{
                    color: 'var(--colors-brand-primary)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    padding: '0.5rem 1rem',
                    border: '1px solid var(--colors-brand-primary)',
                    borderRadius: 'var(--spacing-sm)',
                    transition: 'all 0.2s',
                  }}
                >
                  Контекст →
                </a>
              </div>
            </section>
          </main>

          {/* Footer */}
          <footer style={{
            padding: '2rem',
            borderTop: '1px solid var(--colors-border-primary)',
            backgroundColor: 'var(--colors-background-secondary)',
            textAlign: 'center',
            marginTop: '3rem',
          }}>
            <p style={{
              fontSize: 'var(--typography-body-small-fontSize)',
              color: 'var(--colors-text-secondary)',
              margin: 0,
            }}>
              Elevation Token System • Часть функциональной системы дизайн-токенов
            </p>
          </footer>
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default ElevationDemoPage;