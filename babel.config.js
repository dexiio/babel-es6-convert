const presets = [
    [
        "@babel/env",
        {
            targets: {
                safari: "9.0"
            }
        }
    ]
];

const  plugins = [
    "@babel/plugin-transform-exponentiation-operator"
];

module.exports = { presets, plugins };