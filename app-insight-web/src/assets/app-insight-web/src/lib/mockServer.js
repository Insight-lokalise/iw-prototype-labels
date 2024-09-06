import {rest} from 'msw'
import {setupServer} from 'msw/node'

const server = setupServer (
    rest.post(`/insightweb/endUser/forgotPassword`, (req, res, ctx) => {
        switch(req.body) {
            case 'ok@def.com': return res(ctx.status(200), ctx.json('OK'))
            case 'notFound@def.com': return res(ctx.status(200), ctx.json('NOT_FOUND'))
            case 'forbidden@def.com': return res(ctx.status(200), ctx.json('FORBIDDEN'))
            case 'error@def.com': return res(ctx.status(200), ctx.json('error'))
            case 'undefined@def.com': return res(ctx.status(200), ctx.json('undefined'))
            default: return res(ctx.status(500), ctx.json('undefined'))
        }
    }),
    rest.get("*", (req, res, ctx) => {
        console.warn(`Please setup API handler for URL ${req.url.toString()}`)
        return res(ctx.status(500), ctx.json({error: `Please setup API handler for URL ${req.url.toString()}`}))
    }),
    rest.post("*", (req, res, ctx) => {
        console.warn(`Please setup API handler for URL ${req.url.toString()}`)
        return res(ctx.status(500), ctx.json({error: `Please setup API handler for URL ${req.url.toString()}`}))
    }),        
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

export { rest, server }