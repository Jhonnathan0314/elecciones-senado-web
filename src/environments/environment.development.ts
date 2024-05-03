import { AppSettings } from "appsettings-json-reader";

export const environment = {
    APIGATEWAY_URL: AppSettings.readAppSettings().apigatewayUrl,
    APIGATEWAY_PATH: AppSettings.readAppSettings().apigatewayPath,
    SECURITY_PATH: AppSettings.readAppSettings().securityPath,
    RESULTS_PATH: AppSettings.readAppSettings().resultsPath,
    CRYPTO_KEY: AppSettings.readAppSettings().cryptoKey
};
