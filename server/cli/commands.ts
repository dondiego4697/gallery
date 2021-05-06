export const commands = {
    lint: 'server/cli/api/lint',
    test: 'server/cli/api/test',
    dev: 'server/cli/api/dev',

    'server:compile': 'server/cli/api/server/compile',
    'server:dev': 'server/cli/api/server/dev',

    'client:compile': 'server/cli/api/client/compile',

    'db:mock': 'server/cli/api/db/mock',
    'db:migrate': 'server/cli/api/db/migrate'
} as const;
