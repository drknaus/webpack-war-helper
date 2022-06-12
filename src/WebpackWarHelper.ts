
import * as archiver from "archiver";
import { resolve, basename, posix } from "path";
const normalize = posix.normalize;
import { createWriteStream } from "fs";

import { bold, red } from "colors/safe";
import * as filesize from "filesize";
import { lstatSync } from "fs";
import { readFileSync } from "fs";

export type WebpackWarHelperOptions = {
    archiveName?: string,
    addVersion?: boolean,
    webInf?: string,
    additionalElements?: { path: string, destPath?: string }[],
    archiverZipOptions?: archiver.ZipOptions,
}

export class WebpackWarHelper {
    static defaultOptions = {
        outputFile: "assets.md",
        addVersion: true
    };

    // private archiver property to inject a Mock archiver in tests
    //private archiver = archiver;

    private options: any = {};
    private archiver: any = archiver;

    private package: any;

    constructor(options = {}) {
        this.options = { ...WebpackWarHelper.defaultOptions, ...options };
    }

    apply(compiler) {
        const pluginName = WebpackWarHelper.name;
        const { webpack } = compiler;
        const { Compilation } = webpack;
        //const { RawSource } = webpack.sources;

        const context = compiler["context"];

        this.package = JSON.parse(readFileSync(resolve(context, "package.json")).toString());

        const archiveBaseName = basename(this.options.archiveName || this.package.name);
        const archiveName = this.options.addVersion ? `${archiveBaseName}##${this.package.version}.war` : archiveBaseName;
        const archiverOptions = this.options.archiverZipOptions || { store: true };
        const additionalElements = (this.options.additionalElements || [])
            .concat(this.options.webInf ? { path: this.options.webInf, destPath: "WEB-INF" } : []);
        const outputPath = (compiler["options"]["output"] ? compiler["options"]["output"]["path"] : null) || compiler["outputPath"];

        compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {

            const archive = this.archiver("zip", archiverOptions);

            compilation.hooks.processAssets.tap({name: pluginName, stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE}, (assets) => {
                
                const outStream = createWriteStream(resolve(outputPath, archiveName));
                archive.pipe(outStream);

                Object.getOwnPropertyNames(compilation.assets).forEach(asset => {
                    archive.append(compilation.assets[asset].source(), { name: normalize(asset) });
                });

                additionalElements.forEach(({ path, destPath }) => {
                    const srcPath = resolve(context, path);

                    if (lstatSync(srcPath).isDirectory()) {
                        archive.directory(srcPath, destPath || normalize(path));
                    } else {
                        archive.append(srcPath, { name: destPath || normalize(path) });
                    }
                });
        
                outStream.on("close", () => {
                    const archiveSize = filesize(archive["pointer"]());

                    console.log(bold(`\nWAR created: ${archiveName}\t${archiveSize}`));
                });

                archive.on("error", (err) => {
                    console.error(bold(red(`Error while creating WAR: ${err}`)));
                });
            });

            compiler.hooks.done.tap("done", stats => {
                archive.finalize();
            });

            compiler.hooks.failed.tap("failed", stats => {
                archive.finalize();
            });
        });
    }
}