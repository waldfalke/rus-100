module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: [
      'tests/e2e/support/**/*.ts',
      'tests/e2e/**/*.ts'
    ],
    format: ['progress', 'html:test-results/cucumber-report.html'],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true
  }
};
