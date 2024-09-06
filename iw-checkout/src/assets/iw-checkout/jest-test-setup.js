/**
 * This file prepares the Jest environment before each test file is run.
 * Prefer other methods of preparing your environment, such as beforeAll,
 * beforeEach, or performing setup at above describe declarations,
 *
 * Use cases include configuration that is useful in the majority of our
 * test suites (perhaps fetch), or code that must be executed before test suites
 * are executed.
 */

/**
 * react-slick Slider requires matchMedia in be available before importing it.
 * This causes its test to crash before right before execution of the test suites
 * for iw-carousel.js
 */
window.matchMedia = window.matchMedia || jest.fn(() => {
    return {
        matches : false,
        addListener : function() {},
        removeListener: function() {}
    }
})
