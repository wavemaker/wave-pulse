const { readFileSync, writeFileSync, copySync, readJSONSync } = require('fs-extra');
const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const execa = require('execa');


const projectDir = '.';

async function updatePackageVersion(packagePath, key, version) {
    let content = readFileSync(packagePath, 'utf8');
    content = content.replace(new RegExp(`"${key}"\\s*:\\s*"[^"]*"`), `"${key}": "${version}"`);
    writeFileSync(packagePath, content);
}

async function postBuild(runtimeVersion) {
    copySync(`${projectDir}/build/src`, `${projectDir}/dist/module`);
    copySync(`${projectDir}/package.json`, `${projectDir}/dist/module/package.json`);
    const packageData = readJSONSync(`${projectDir}/package.json`, {
        encoding: "utf8"
    });
    packageData.main = 'index';
    packageData.module = 'index';
    packageData.exports = {
      "./": "./"
    };
    writeFileSync(`${projectDir}/dist/module/package.json`, JSON.stringify(packageData, null, 2))
    await updatePackageVersion(`${projectDir}/dist/module/package.json`, 'version', runtimeVersion);
    console.log('Post Build successful!!!');
}

async function prepareNpmPackages() {
    copySync(`${projectDir}/dist/module`, `${projectDir}/dist/npm-packages/app-rn-runtime`, {
        filter: p => !p.startsWith('/node_modules/')
    });
    await execa('tar', ['-czf', 'dist/npm-packages/wavepulse-agent.tar.gz', '-C', 'dist/npm-packages', 'app-rn-runtime']);
}

async function pushToLocalRepo() {
    writeFileSync(`${projectDir}/dist/new-build`, '' + Date.now);
    await execa('yalc', ['publish' , '--no-sig', '--push'], {
        'cwd': `${projectDir}/dist/module`
    });
    console.log('Published to yalc local repo!!!');
}

yargs(hideBin(process.argv)).command('post-build',
    'to run post processing after project build',
    (yargs) => {
        yargs.option('runtimeVersion', {
            describe: 'version number',
            type: 'string',
            default: '1.0.0-dev'
        }).option('production', {
            describe: 'to perform a production build',
            type: 'boolean',
            default: false
        });
    }, (argv) => {
        postBuild(argv.runtimeVersion).then(() => {
            if (argv.production) {
                return prepareNpmPackages();
            } else {
                return pushToLocalRepo();
            }
        });
    }).showHelpOnFail().argv;
