/**
 * Hoisting options in prototype chain
 * @param {Object} target
 */
function hoistingOptions( target ) {
    if ( !target.hasOwnProperty( '_options' ) ) {
        let options;
        if ( undefined === target._options ) {
            options = {};
        } else {

            // Create copy with descriptors
            options = Object.create(
                null,
                Object.getOwnPropertyDescriptors( target._options )
            );
        }
        Object.defineProperty( target, '_options', {
            value: options,
            enumerable: false,
            configurable: true
        } );
    }
}

/**
 * Decorator for mark property as default value of options
 * @param target
 * @param name
 * @param descriptor
 * @return {*}
 */
export default function( target, name, descriptor ) {
    if ( 'function' === typeof target ) {
        throw new Error( `static options don't allow. Name: ${name}, target: ${target}` );
    }
    hoistingOptions( target );
    if ( descriptor.hasOwnProperty( 'initializer' ) ) {
        descriptor.value = descriptor.initializer();
        delete descriptor.initializer;
    }
    Object.defineProperty( target._options, name, descriptor );
}
