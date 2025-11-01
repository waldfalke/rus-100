import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Layout } from '../../components/Layout';
import { ThemeProvider } from '../../lib/providers/ThemeProvider';
import { useTheme, usePerformance } from '../../lib/hooks';
import { PerformanceMonitor } from '../../components/PerformanceMonitor';
import { colorTokens, spacingTokens, typographyTokens } from '../../lib/tokens';
import { contextResolver } from '../../lib/context';
import { minimalThemeConfig } from '../../lib/theme-config';

interface TokenInfo {
  name: string;
  value: any;
  resolvedValue: string;
  category: string;
  description?: string;
}

const TokenInspector: React.FC = () => {
  const { context } = useTheme();
  const { metrics } = usePerformance({ realTime: true });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showPerformance, setShowPerformance] = useState(false);

  const allTokens = useMemo(() => {
    const tokens: TokenInfo[] = [];

    // Color tokens
    Object.entries(colorTokens).forEach(([key, token]) => {
      const resolvedValue = contextResolver.resolveToken(token, context);
      tokens.push({
        name: `colors.${key}`,
        value: token,
        resolvedValue: resolvedValue.toString(),
        category: 'colors',
        description: `Color token: ${key}`,
      });
    });

    // Spacing tokens
    Object.entries(spacingTokens).forEach(([key, token]) => {
      const resolvedValue = contextResolver.resolveToken(token, context);
      tokens.push({
        name: `spacing.${key}`,
        value: token,
        resolvedValue: resolvedValue.toString(),
        category: 'spacing',
        description: `Spacing token: ${key}`,
      });
    });

    // Typography tokens
    Object.entries(typographyTokens).forEach(([key, token]) => {
      const resolvedValue = contextResolver.resolveToken(token, context);
      tokens.push({
        name: `typography.${key}`,
        value: token,
        resolvedValue: typeof resolvedValue === 'object' ? JSON.stringify(resolvedValue, null, 2) : resolvedValue.toString(),
        category: 'typography',
        description: `Typography token: ${key}`,
      });
    });

    return tokens;
  }, [context]);

  const filteredTokens = useMemo(() => {
    return allTokens.filter(token => {
      const matchesCategory = selectedCategory === 'all' || token.category === selectedCategory;
      const matchesSearch = token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           token.resolvedValue.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allTokens, selectedCategory, searchTerm]);

  const categories = ['all', 'colors', 'spacing', 'typography'];

  const renderTokenValue = (token: TokenInfo) => {
    if (token.category === 'colors') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: '24px',
              height: '24px',
              backgroundColor: token.resolvedValue,
              borderRadius: '4px',
              border: '1px solid var(--colors-border-primary)',
            }}
          />
          <code style={{
            fontSize: 'var(--typography-body-small-fontSize)',
            fontFamily: 'monospace',
            color: 'var(--colors-text-secondary)',
          }}>
            {token.resolvedValue}
          </code>
        </div>
      );
    }

    if (token.category === 'spacing') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div
            style={{
              width: token.resolvedValue,
              height: '8px',
              backgroundColor: 'var(--colors-brand-primary)',
              borderRadius: '2px',
              minWidth: '4px',
              maxWidth: '100px',
            }}
          />
          <code style={{
            fontSize: 'var(--typography-body-small-fontSize)',
            fontFamily: 'monospace',
            color: 'var(--colors-text-secondary)',
          }}>
            {token.resolvedValue}
          </code>
        </div>
      );
    }

    if (token.category === 'typography') {
      try {
        const typographyValue = JSON.parse(token.resolvedValue);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <div
              style={{
                fontSize: typographyValue.fontSize || '16px',
                fontWeight: typographyValue.fontWeight || 'normal',
                lineHeight: typographyValue.lineHeight || 'normal',
                color: 'var(--colors-text-primary)',
              }}
            >
              Sample Text
            </div>
            <code style={{
              fontSize: 'var(--typography-body-small-fontSize)',
              fontFamily: 'monospace',
              color: 'var(--colors-text-secondary)',
            }}>
              {typographyValue.fontSize} / {typographyValue.fontWeight}
            </code>
          </div>
        );
      } catch {
        return (
          <code style={{
            fontSize: 'var(--typography-body-small-fontSize)',
            fontFamily: 'monospace',
            color: 'var(--colors-text-secondary)',
          }}>
            {token.resolvedValue}
          </code>
        );
      }
    }

    return (
      <code style={{
        fontSize: 'var(--typography-body-small-fontSize)',
        fontFamily: 'monospace',
        color: 'var(--colors-text-secondary)',
      }}>
        {token.resolvedValue}
      </code>
    );
  };

  return (
    <div data-testid="token-inspector" style={{ backgroundColor: 'var(--colors-background-primary)' }}>

      {/* Main Content */}
      <main style={{ 
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        {/* Controls */}
        <section style={{ 
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: 'var(--colors-background-secondary)',
          borderRadius: 'var(--spacing-md)',
          border: '1px solid var(--colors-border-primary)',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            alignItems: 'end',
          }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--typography-body-medium-fontSize)',
                fontWeight: 'var(--typography-body-medium-fontWeight)',
                color: 'var(--colors-text-primary)',
                marginBottom: '0.5rem',
              }}>
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: 'var(--typography-body-medium-fontSize)',
                  backgroundColor: 'var(--colors-background-primary)',
                  color: 'var(--colors-text-primary)',
                  border: '1px solid var(--colors-border-primary)',
                  borderRadius: 'var(--spacing-xs)',
                }}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: 'var(--typography-body-medium-fontSize)',
                fontWeight: 'var(--typography-body-medium-fontWeight)',
                color: 'var(--colors-text-primary)',
                marginBottom: '0.5rem',
              }}>
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tokens..."
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  fontSize: 'var(--typography-body-medium-fontSize)',
                  backgroundColor: 'var(--colors-background-primary)',
                  color: 'var(--colors-text-primary)',
                  border: '1px solid var(--colors-border-primary)',
                  borderRadius: 'var(--spacing-xs)',
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              fontSize: 'var(--typography-body-small-fontSize)',
              color: 'var(--colors-text-secondary)',
            }}>
              <span>Found: {filteredTokens.length} tokens</span>
              <span>•</span>
              <span>Context: {context.platform.name}</span>
              <button
                onClick={() => setShowPerformance(!showPerformance)}
                style={{
                  padding: '0.25rem 0.5rem',
                  fontSize: 'var(--typography-body-small-fontSize)',
                  backgroundColor: showPerformance ? 'var(--colors-brand-primary)' : 'var(--colors-background-primary)',
                  color: showPerformance ? 'var(--colors-text-inverse)' : 'var(--colors-text-primary)',
                  border: '1px solid var(--colors-border-primary)',
                  borderRadius: 'var(--spacing-xs)',
                  cursor: 'pointer',
                }}
              >
                {showPerformance ? 'Hide' : 'Show'} Performance
              </button>
              {metrics && (
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  fontSize: 'var(--typography-body-small-fontSize)',
                  color: 'var(--colors-text-secondary)',
                }}>
                  <span>{metrics.totalResolutions} resolutions</span>
                  <span>{(metrics.averageResolutionTime).toFixed(2)}ms avg</span>
                  <span>{(metrics.cacheHitRate * 100).toFixed(1)}% cache hit</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {showPerformance && (
          <section style={{
            marginBottom: '2rem',
            padding: '1.5rem',
            backgroundColor: 'var(--colors-background-secondary)',
            borderRadius: 'var(--spacing-md)',
            border: '1px solid var(--colors-border-primary)',
          }}>
            <PerformanceMonitor detailed={true} />
          </section>
        )}

        {/* Token Grid */}
        <section>
          <div style={{
            display: 'grid',
            gap: '1rem',
          }}>
            {filteredTokens.map((token, index) => (
              <div
                key={`${token.name}-${index}`}
                style={{
                  padding: '1.5rem',
                  backgroundColor: 'var(--colors-background-secondary)',
                  borderRadius: 'var(--spacing-md)',
                  border: '1px solid var(--colors-border-primary)',
                  display: 'grid',
                  gridTemplateColumns: '1fr 2fr 1fr',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h3 style={{
                    margin: 0,
                    fontSize: 'var(--typography-body-medium-fontSize)',
                    fontWeight: 'var(--typography-body-medium-fontWeight)',
                    color: 'var(--colors-text-primary)',
                    fontFamily: 'monospace',
                  }}>
                    {token.name}
                  </h3>
                  <p style={{
                    margin: '0.25rem 0 0 0',
                    fontSize: 'var(--typography-body-small-fontSize)',
                    color: 'var(--colors-text-secondary)',
                  }}>
                    {token.description}
                  </p>
                </div>

                <div>
                  {renderTokenValue(token)}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}>
                  <span style={{
                    padding: '0.25rem 0.5rem',
                    fontSize: 'var(--typography-body-small-fontSize)',
                    backgroundColor: 'var(--colors-brand-primary)',
                    color: 'var(--colors-text-inverse)',
                    borderRadius: 'var(--spacing-xs)',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                  }}>
                    {token.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {filteredTokens.length === 0 && (
            <div style={{
              padding: '3rem',
              textAlign: 'center',
              backgroundColor: 'var(--colors-background-secondary)',
              borderRadius: 'var(--spacing-md)',
              border: '1px solid var(--colors-border-primary)',
            }}>
              <p style={{
                fontSize: 'var(--typography-body-large-fontSize)',
                color: 'var(--colors-text-secondary)',
                margin: 0,
              }}>
                No tokens found matching your criteria
              </p>
            </div>
          )}
        </section>

        {/* Context Information */}
        <section style={{ 
          marginTop: '3rem',
          padding: '1.5rem',
          backgroundColor: 'var(--colors-background-secondary)',
          borderRadius: 'var(--spacing-md)',
          border: '1px solid var(--colors-border-primary)',
        }}>
          <h3 style={{
            fontSize: 'var(--typography-heading-medium-fontSize)',
            fontWeight: 'var(--typography-heading-medium-fontWeight)',
            color: 'var(--colors-text-primary)',
            marginBottom: '1rem',
          }}>
            Current Context
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            <div>
              <strong style={{ color: 'var(--colors-text-primary)' }}>Platform:</strong>
              <br />
              <span style={{ color: 'var(--colors-text-secondary)' }}>
                {context.platform}
              </span>
            </div>
            <div>
              <strong style={{ color: 'var(--colors-text-primary)' }}>Theme:</strong>
              <br />
              <span style={{ color: 'var(--colors-text-secondary)' }}>
                {context.mode}
              </span>
            </div>
            <div>
              <strong style={{ color: 'var(--colors-text-primary)' }}>Contrast:</strong>
              <br />
              <span style={{ color: 'var(--colors-text-secondary)' }}>
                {context.accessibility.highContrast ? 'High' : 'Normal'}
              </span>
            </div>
            <div>
              <strong style={{ color: 'var(--colors-text-primary)' }}>Motion:</strong>
              <br />
              <span style={{ color: 'var(--colors-text-secondary)' }}>
                {context.accessibility.reducedMotion ? 'Reduced' : 'Normal'}
              </span>
            </div>
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
        <div style={{ marginBottom: '1rem' }}>
          <Link 
            href="/demo" 
            style={{
              color: 'var(--colors-brand-primary)',
              textDecoration: 'none',
              marginRight: '2rem',
            }}
          >
            ← Назад к главной демо
          </Link>
          <Link 
            href="/demo/context" 
            style={{
              color: 'var(--colors-brand-primary)',
              textDecoration: 'none',
            }}
          >
            Context Demo →
          </Link>
        </div>
        <p style={{
          fontSize: 'var(--typography-body-small-fontSize)',
          color: 'var(--colors-text-secondary)',
          margin: 0,
        }}>
          Token Inspector • Исследуйте и анализируйте дизайн-токены
        </p>
      </footer>
    </div>
  );
};

const TokenInspectorPage: React.FC = () => {
  return (
    <ThemeProvider config={minimalThemeConfig}>
      <Layout 
        title="Token Inspector - Demo"
        description="Инспектор дизайн-токенов для детального анализа и просмотра"
      >
        <TokenInspector />
      </Layout>
    </ThemeProvider>
  );
};

export default TokenInspectorPage;