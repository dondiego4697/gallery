export const commands = {
    lint: 'server/cli/api/lint',
    tests: 'server/cli/api/tests',

    'server:compile': 'server/cli/api/server/compile',
    'server:dev': 'server/cli/api/server/dev',

    'db:mock': 'server/cli/api/db/mock'
} as const;
