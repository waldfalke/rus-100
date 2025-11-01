import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { ThemeProvider } from '../../lib/providers/ThemeProvider';
import { ThemeExample } from '../../lib/components/ThemeExample';
import { ContextDemo } from '../../lib/components/ContextDemo';
import { minimalThemeConfig } from '../../lib/theme-config';

const DemoPage: React.FC = () => {
  return (
    <ThemeProvider config={minimalThemeConfig}>
      <Layout 
        title="Functional Design Tokens - Demo"
        description="Демонстрация системы функциональных дизайн-токенов с поддержкой OKLCH и контекстно-зависимого разрешения"
      >
        <div data-testid="demo-page" style={{ backgroundColor: 'var(--colors-background-primary)' }}>

          {/* Main Content */}
          <main style={{ 
            padding: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {/* Hero Section */}
            <section style={{ 
              textAlign: 'center',
              marginBottom: '3rem',
              padding: '3rem 2rem',
              backgroundColor: 'var(--colors-background-secondary)',
              borderRadius: 'var(--spacing-md)',
              border: '1px solid var(--colors-border-primary)',
            }}>
              <h2 style={{
                fontSize: 'var(--typography-heading-xlarge-fontSize)',
                fontWeight: 'var(--typography-heading-xlarge-fontWeight)',
                color: 'var(--colors-text-primary)',
                marginBottom: '1rem',
              }}>
                Контекстно-зависимые дизайн-токены
              </h2>
              
              <p style={{
                fontSize: 'var(--typography-body-large-fontSize)',
                color: 'var(--colors-text-secondary)',
                maxWidth: '600px',
                margin: '0 auto 2rem',
                lineHeight: 1.6,
              }}>
                Современная система дизайн-токенов с автоматической адаптацией к платформе, 
                доступности и пользовательским предпочтениям. Поддержка OKLCH цветового пространства, 
                визуальное регрессионное тестирование и CI/CD валидация.
              </p>

              <div style={{ 
                display: 'flex', 
                gap: '1rem', 
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}>
                <div style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--colors-semantic-success)',
                  color: 'var(--colors-text-inverse)',
                  borderRadius: 'var(--spacing-sm)',
                  fontSize: 'var(--typography-body-small-fontSize)',
                  fontWeight: 600,
                }}>
                  ✨ OKLCH Colors
                </div>
                <div style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--colors-semantic-info)',
                  color: 'var(--colors-text-inverse)',
                  borderRadius: 'var(--spacing-sm)',
                  fontSize: 'var(--typography-body-small-fontSize)',
                  fontWeight: 600,
                }}>
                  🎯 Context-Aware
                </div>
                <div style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--colors-semantic-warning)',
                  color: 'var(--colors-text-inverse)',
                  borderRadius: 'var(--spacing-sm)',
                  fontSize: 'var(--typography-body-small-fontSize)',
                  fontWeight: 600,
                }}>
                  ♿ Accessible
                </div>
                <div style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: 'var(--colors-brand-primary)',
                  color: 'var(--colors-text-inverse)',
                  borderRadius: 'var(--spacing-sm)',
                  fontSize: 'var(--typography-body-small-fontSize)',
                  fontWeight: 600,
                }}>
                  🧪 Tested
                </div>
              </div>
            </section>

            {/* Features Grid */}
            <section style={{ marginBottom: '3rem' }}>
              <h3 style={{
                fontSize: 'var(--typography-heading-large-fontSize)',
                fontWeight: 'var(--typography-heading-large-fontWeight)',
                color: 'var(--colors-text-primary)',
                marginBottom: '2rem',
                textAlign: 'center',
              }}>
                Основные возможности
              </h3>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '2rem',
              }}>
                {/* Theme Adaptation */}
                <div style={{
                  padding: '2rem',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--spacing-md)',
                  border: '1px solid var(--colors-border-primary)',
                }}>
                  <h4 style={{
                    fontSize: 'var(--typography-heading-medium-fontSize)',
                    fontWeight: 'var(--typography-heading-medium-fontWeight)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '1rem',
                  }}>
                    🎨 Адаптивные темы
                  </h4>
                  <p style={{
                    fontSize: 'var(--typography-body-medium-fontSize)',
                    color: 'var(--colors-text-secondary)',
                    marginBottom: '1rem',
                    lineHeight: 1.5,
                  }}>
                    Автоматическое переключение между светлой и темной темами, 
                    поддержка высокого контраста и адаптация к системным настройкам.
                  </p>
                  <Link 
                    href="/demo"
                    style={{
                      color: 'var(--colors-brand-primary)',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Посмотреть демо →
                  </Link>
                </div>

                {/* Platform Adaptation */}
                <div style={{
                  padding: '2rem',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--spacing-md)',
                  border: '1px solid var(--colors-border-primary)',
                }}>
                  <h4 style={{
                    fontSize: 'var(--typography-heading-medium-fontSize)',
                    fontWeight: 'var(--typography-heading-medium-fontWeight)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '1rem',
                  }}>
                    📱 Платформенная адаптация
                  </h4>
                  <p style={{
                    fontSize: 'var(--typography-body-medium-fontSize)',
                    color: 'var(--colors-text-secondary)',
                    marginBottom: '1rem',
                    lineHeight: 1.5,
                  }}>
                    Автоматическое определение платформы (Web, iOS, Android) 
                    и адаптация интерфейса под платформенные конвенции.
                  </p>
                  <Link 
                    href="/demo/context"
                    style={{
                      color: 'var(--colors-brand-primary)',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Изучить контекст →
                  </Link>
                </div>

                {/* OKLCH Colors */}
                <div style={{
                  padding: '2rem',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--spacing-md)',
                  border: '1px solid var(--colors-border-primary)',
                }}>
                  <h4 style={{
                    fontSize: 'var(--typography-heading-medium-fontSize)',
                    fontWeight: 'var(--typography-heading-medium-fontWeight)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '1rem',
                  }}>
                    🌈 OKLCH цвета
                  </h4>
                  <p style={{
                    fontSize: 'var(--typography-body-medium-fontSize)',
                    color: 'var(--colors-text-secondary)',
                    marginBottom: '1rem',
                    lineHeight: 1.5,
                  }}>
                    Современное цветовое пространство OKLCH для более точных 
                    и перцептивно-равномерных цветовых палитр.
                  </p>
                  <Link 
                    href="/demo/tokens"
                    style={{
                      color: 'var(--colors-brand-primary)',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Исследовать токены →
                  </Link>
                </div>

                {/* Elevation System */}
                <div style={{
                  padding: '2rem',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--spacing-md)',
                  border: '1px solid var(--colors-border-primary)',
                }}>
                  <h4 style={{
                    fontSize: 'var(--typography-heading-medium-fontSize)',
                    fontWeight: 'var(--typography-heading-medium-fontWeight)',
                    color: 'var(--colors-text-primary)',
                    marginBottom: '1rem',
                  }}>
                    🏔️ Система возвышения
                  </h4>
                  <p style={{
                    fontSize: 'var(--typography-body-medium-fontSize)',
                    color: 'var(--colors-text-secondary)',
                    marginBottom: '1rem',
                    lineHeight: 1.5,
                  }}>
                    Контекстно-зависимые тени с поддержкой доступности, 
                    семантические уровни возвышения и OKLCH интеграция.
                  </p>
                  <Link 
                    href="/demo/elevation"
                    style={{
                      color: 'var(--colors-brand-primary)',
                      textDecoration: 'none',
                      fontWeight: 600,
                    }}
                  >
                    Изучить возвышение →
                  </Link>
                </div>
              </div>
            </section>

            {/* Live Demo Section */}
            <section>
              <h3 style={{
                fontSize: 'var(--typography-heading-large-fontSize)',
                fontWeight: 'var(--typography-heading-large-fontWeight)',
                color: 'var(--colors-text-primary)',
                marginBottom: '2rem',
                textAlign: 'center',
              }}>
                Интерактивная демонстрация
              </h3>

              {/* Theme Example */}
              <div style={{ marginBottom: '3rem' }}>
                <ThemeExample />
              </div>

              {/* Context Demo */}
              <div>
                <ContextDemo />
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
              Functional Design Tokens System • Создано с ❤️ для современных интерфейсов
            </p>
          </footer>
        </div>
      </Layout>
    </ThemeProvider>
  );
};

export default DemoPage;