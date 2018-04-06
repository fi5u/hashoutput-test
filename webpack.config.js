/* global module, require */

function buildConfig(env) {
    return require('./conf/webpack.config.' + env.environment + '.js')(env)
}

module.exports = buildConfig
