const vite = require('vite');
const ts = require('ts-node')

ts.create({
    cwd: process.cwd(),
    
})
async function createServer() {

    const server = await vite.createServer({
        root: process.cwd(),
        esbuild: true
    })
    server.listen(3001, true)
        .then(res => {
        })
        .catch(error => {
            console.log(error);
        })

}
createServer()