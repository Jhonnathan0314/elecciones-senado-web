import { AppSettings } from "appsettings-json-reader";

export const environment = {
    APIGATEWAY_URL: AppSettings.readAppSettings().apigatewayUrl,
    APIGATEWAY_PATH: AppSettings.readAppSettings().apigatewayPath,
    SECURITY_PATH: AppSettings.readAppSettings().apigatewayUrl,
    RESULTS_PATH: AppSettings.readAppSettings().apigatewayUrl,
    CRYPTO_KEY: AppSettings.readAppSettings().cryptoKey
};
