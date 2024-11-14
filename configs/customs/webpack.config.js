const { EnvironmentPlugin } = require('webpack');

require('dotenv').config();

module.exports = {
    plugins: [
        new EnvironmentPlugin([
            'APIGATEWAY_URL',
            'APIGATEWAY_PATH',
            'SECURITY_PATH',
            'RESULTS_PATH',
            'CRYPTO_KEY'
        ])
    ]
}