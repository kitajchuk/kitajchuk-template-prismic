const config = require( "./clutch.config" );
const router = require( "./server/core/router" );
const stasis = require( `./server/generators/${config.api.adapter}.static` );
const lager = require( "properjs-lager" );

if ( config.static.site ) {
    // Explicit false for static, even if the node app IS using https: true
    config.https = false;

    const clean = Number( process.env.CLUTCH_CLEAN );

    router.init().then(() => {
        if ( clean ) {
            stasis.clean( config ).then(() => {
                lager.cache( "Static files have been cleaned." );
                process.exit( 0 );
            });

        } else {
            stasis.generate( config ).then(() => {
                lager.cache( "Static files have been created." );
                process.exit( 0 );
            });
        }
    });
}