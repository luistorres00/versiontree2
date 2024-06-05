server: {
    https: {
        key: fs.readFileSync(path.resolve(pwa, '192.168.0.2-key.pem'))
        cert: fs.readFileSync(path.resolve(pwa, '192.168.0.2.pem'))
    }
 }