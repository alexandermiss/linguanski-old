module.exports = function(grunt) {

    grunt.config.set('webpack', {
        dev: {
            entry: "./vue/main.js", //Entry point of our vue application
            output: {
                path: "./assets/js/vue",
                filename: "build.js"
            },
            stats: {
                // Configure the console output
                colors: false,
                modules: false,
                reasons: false
            },
            progress: false,
            failOnError: true,
            devtool: "#source-map",
            module: {
                loaders: [
                    { test: /\.vue$/, loader: "vue" },
                ]
            }
        }
    });

    grunt.registerTask('webpack', [
        'webpack:dev'
    ]);

    grunt.loadNpmTasks('grunt-webpack');
};