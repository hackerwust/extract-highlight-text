module.exports = function (api) {
    api.cache.never();
    const buildTarget = process.env.BUILD_TARGET;
    return {
        presets: [
            ['@babel/preset-env', {
                useBuiltIns: 'usage',
                modules: buildTarget === 'esm' ? false : 'cjs'
            }],
            '@babel/preset-typescript'
        ]
    };
};