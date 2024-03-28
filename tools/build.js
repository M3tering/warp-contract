import * as esbuild from "esbuild"
import replace from "replace-in-file"

await esbuild.build({
    entryPoints: ['contract/contract.ts'],
    minify: false,
    bundle: true,
    outdir: 'bundle',
    format: "iife"
})
.catch(()=> process.exit(1))
.finally(()=>{
    replace.sync({
        files: ['bundle/contract.js'],
        from: [/\(\(\) => {/g, /}\)\(\);/g],
        to: "",
        countMatches: true
    })
})