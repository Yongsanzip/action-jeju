const fix_url = 'http://www.actionjeju.com/societive';

module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: fix_url + '/api',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            },
            '/ajax': {
                target: fix_url + '/ajax',
                changeOrigin: true,
                pathRewrite: {
                    '^/ajax': ''
                }
            }
        },
        compress: true,
        disableHostCheck: true,
    }
};