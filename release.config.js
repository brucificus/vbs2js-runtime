/* eslint-disable unicorn/prefer-module */

const { promisify } = require('node:util');
const joinPath = require('node:path').join;
const dateFormat = require('dateformat');
const readFileAsync = promisify(require('node:fs').readFile);

const TEMPLATE_DIR =
    'node_modules/semantic-release-gitmoji/lib/assets/templates/';

const template = readFileAsync(joinPath(TEMPLATE_DIR, 'default-template.hbs'));
const commitTemplate = readFileAsync(
    joinPath(TEMPLATE_DIR, 'commit-template.hbs')
);

module.exports = {
    branches: [
        '+([0-9])?(.{+([0-9]),x}).x',
        'master',
        { name: 'beta', prerelease: true },
        { name: 'alpha', prerelease: true },
    ],
    plugins: [
        [
            'semantic-release-gitmoji',
            {
                releaseRules: {
                    major: ['💥'],
                    minor: ['✨', '🏗', '⚡'],
                    patch: [
                        '🐛',
                        '🚑',
                        '🔒',
                        '♻',
                        '💚',
                        '⬆',
                        '⬇',
                        '➕',
                        '➖',
                        '🔧',
                        '📝',
                        '🔥',
                        '👷‍♂️',
                        '🔨',
                        '⏪',
                        '🚚',
                    ],
                },
                releaseNotes: {
                    template: template,
                    partials: { commitTemplate },
                    helpers: {
                        datetime: (format = 'UTC:yyyy-mm-dd') => {
                            return dateFormat(new Date(), format);
                        },
                    },
                    issueResolution: {
                        template: '{baseUrl}/{owner}/{repo}/issues/{ref}',
                        baseUrl: 'https://github.com',
                        source: 'github.com',
                    },
                },
            },
        ],
        [
            '@semantic-release/npm',
            {
                npmPublish: true,
                tarballDir: './dist/',
            },
        ],
        [
            '@semantic-release/git',
            {
                message:
                    '🔖 ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}',
            },
        ],
        [
            '@semantic-release/github',
            {
                assets: [
                    {
                        path: './dist/*.tgz',
                        name: 'vbs2js-runtime-${nextRelease.version}.tgz',
                    },
                ],
            },
        ],
    ],
};

/* eslint-enable unicorn/prefer-module */
