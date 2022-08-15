import JSZip = require("jszip");
import { resolve, basename } from "path";
import * as fs from "fs";

import { bold } from "colors/safe";

export type WebpackWarHelperOptions = {
    archiveName?: string,
    addVersion?: boolean
}

export class WebpackWarHelper {
    static defaultOptions = {
        addVersion: true
    };

    // private archiver property to inject a Mock archiver in tests
    //private archiver = archiver;

    private options: any = {};

    private package: any;

    constructor(options = {}) {
        this.options = { ...WebpackWarHelper.defaultOptions, ...options };
    }

    apply(compiler) {
        const pluginName = WebpackWarHelper.name;
        const { webpack } = compiler;
        const { Compilation } = webpack;
        const { RawSource } = webpack.sources;

        const context = compiler["context"];

        this.package = JSON.parse(fs.readFileSync(resolve(context, "package.json")).toString());

        const archiveBaseName = basename(this.options.archiveName || this.package.name);
        const archiveName = this.options.addVersion ? `${archiveBaseName}##${this.package.version}.war` : `${archiveBaseName}.war`;
        //const outputPath = (compiler["options"]["output"] ? compiler["options"]["output"]["path"] : null) || compiler["outputPath"];

        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
            compilation.hooks.processAssets.tapAsync({ name: pluginName, stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER }, (assets, callback) => {
                const zip = new JSZip();
                Object.keys(assets).map(name => {
                    if (name !== archiveName) {
                        zip.file(name, compilation.getAsset(name).source.buffer());
                    }
                });
                zip.generateAsync({ type: "nodebuffer" })
                    .then((data) => {
                        compilation.emitAsset(archiveName, new RawSource(data));
                        console.log(bold(`\nWAR created: ${archiveName}`));
                        callback();
                    });
            });
        });
    }
}