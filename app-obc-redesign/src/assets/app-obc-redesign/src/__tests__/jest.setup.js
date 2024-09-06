import '@testing-library/jest-dom'

global.console = {
    error: jest.fn(),
    debug: console.debug,
    trace: console.trace,
    log:console.log
}