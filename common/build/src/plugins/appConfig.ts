// @ts-ignore
import ConfigPlugin from 'unplugin-config/vite';
import type { PluginOption } from 'vite';
import {getEnvConfig,strToHex} from "../utils.ts";

export async function createConfigPluginConfig(
    shouldGenerateConfig: boolean,
): Promise<PluginOption> {
    const config:Record<string, any> = await getEnvConfig();
    const APP_NAME = strToHex(config?.VITE_GLOB_APP_TITLE ?? '__APP');
    // https://github.com/kirklin/unplugin-config
    return ConfigPlugin({
        appName: APP_NAME,
        baseDir:"./",
        envVariables: {
            prefix: 'VITE_GLOB_',
            files: [".env.production", ".env"],
        },
        configFile: {
            generate: shouldGenerateConfig,
            fileName: '_astral3d.config.js',
            outputDir: 'dist',
        },
        htmlInjection: {
            decodeEntities: true,
        },
    });
}