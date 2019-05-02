const shell = require("shelljs")
const argv = require("yargs").argv

const functionName = argv._[0]

if (!functionName) {
    throw new Error("You need to provide a function name as script invoking paramter number 1.")
}

let version

console.log(">>>>>> Publishing new version for lambda function.")
shell.exec(`aws lambda publish-version --function-name ${functionName}`, (code, stdout, stderr) => {
    const output = JSON.parse(stdout)
    console.log(output)
    version = output.Version

    if (!version) {
        throw new Error(`Could not create a new version for the function ${functionName} you specified.`)
    }

    console.log(">>>>>> Aliasing new version as production")
    shell.exec(`aws lambda update-alias --function-name ${functionName} --name production --function-version ${version}`)
})

