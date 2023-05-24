
module.exports = {
    devServer: {
        proxy: {
            '/services/todoService': {
                target: 'http://localhost:5000', // paste the copied API url here
                ws: true
            }
        }
    }
}