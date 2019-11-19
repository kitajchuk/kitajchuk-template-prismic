const fs = require( "fs" );
const path = require( "path" );
const files = require( "./server/core/files" );
const root = path.resolve( __dirname );
const rootConfig = files.read( path.join( root, ".clutch", "config.json" ), true );
const config = {
    // The URL of your actual site
    url: rootConfig.clutch.urls.production || process.env.PRODUCTION_URL,
    // Homepage UID
    homepage: "home",
    // Page Not Found UID — 404
    notfound: "404",
    // Page Server Error UID - 500
    notright: "500",
    // Timestamp ( Stamp of instantiation )
    timestamp: Date.now(),
    // Environments
    env: {
        sandbox: (process.env.NODE_ENV === "sandbox"),
        development: (process.env.NODE_ENV === "development"),
        production: (process.env.NODE_ENV === "production")
    },
    // API CMS config ( Prismic )
    api: {
        // Prismic
        adapter: "prismic",
        // This is your API URL from Prismic's settings panel
        access: rootConfig.prismic.apiAccess || process.env.PRISMIC_API_ACCESS,
        token: rootConfig.prismic.accessToken || process.env.PRISMIC_API_TOKEN,
        secret: rootConfig.prismic.webhookSecret || process.env.PRISMIC_API_SECRET
    },
    // Deployment config ( AWS )
    aws: {
        cdn: "" // Turn on to use CDN ( You can just use S3 or add CloudFront if you want )
    },
    // Templating config
    template: {
        module: "ejs",
        dir: path.join( root, "template" ),
        layout: path.join( root, "template/index.html" ),
        pagesDir: path.join( root, "template", "pages" ),
        partialsDir: path.join( root, "template", "partials" ),
        staticDir: path.join( root, "static" )
    },
    // Express.js config
    express: {
        port: 8000,
        portHttps: 8443
    },
    // Browser-sync config
    browser: {
        port: 8001
    },
    // Static assets config
    static: {
        // One day
        maxAge: 86400000,
        endJS: `/js/clutch.${process.env.NODE_ENV}.js`,
        endCSS: `/css/screen.${process.env.NODE_ENV}.css`,
        // Enable static site server+generator+deploy+websub
        site: true
    },
    // Compression js config
    compression: {
        level: 9,
        threshold: 0
    },
    // Generators config ( sitemap, robots, cache manifest )
    generate: {
        sitemap: {
            site: false
        },
        robots: {
            site: false,
            page: false
        },
        mappings: {
            // Useful for prismic collection forms
            // contentType => collectionId
            // e.g. casestudy: "work"
            // Ensures you get /work/:uid rather than /casestudy/:uid
        }
    },
    // Third-party app Oauth authorizations
    authorizations: {
        token: rootConfig.clutch.authorizationsToken,
        apps: []
    },
    // letsencrypt
    letsencrypt: rootConfig.letsencrypt,
    // https
    https: true
};



// Serves assets from either CDN or App Server/Static site
config.static.js = (config.aws.cdn && config.env.production) ? `${config.aws.cdn}${config.static.endJS}` : config.static.endJS;
config.static.css = (config.aws.cdn && config.env.production) ? `${config.aws.cdn}${config.static.endCSS}` : config.static.endCSS;



// Configure URLs & HTTPS
if ( config.env.sandbox ) {
    config.url = `http://localhost:${config.browser.port}`;
    config.https = false;

} else if ( config.env.development && config.https ) {
    config.url = rootConfig.clutch.urls.development || process.env.DEVELOPMENT_URL;

    if ( rootConfig.letsencrypt.developmentPath ) {
        config.letsencrypt.privkey = `${rootConfig.letsencrypt.developmentPath}privkey.pem`;
        config.letsencrypt.cert = `${rootConfig.letsencrypt.developmentPath}cert.pem`;
        config.letsencrypt.chain = `${rootConfig.letsencrypt.developmentPath}chain.pem`;
    }

} else if ( config.env.production && config.https ) {
    config.url = rootConfig.clutch.urls.production || process.env.PRODUCTION_URL;

    if ( rootConfig.letsencrypt.productionPath ) {
        config.letsencrypt.privkey = `${rootConfig.letsencrypt.productionPath}privkey.pem`;
        config.letsencrypt.cert = `${rootConfig.letsencrypt.productionPath}cert.pem`;
        config.letsencrypt.chain = `${rootConfig.letsencrypt.productionPath}chain.pem`;
    }
}



module.exports = config;
