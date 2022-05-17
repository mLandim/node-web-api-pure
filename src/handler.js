import { parse } from 'node:url'
import { routes } from './routes/heroRoutes.js'
import { DEFAULT_HEADER } from './util/util.js'

const heroRoutes = routes({heroRoutes: {}})
const allRoutes = {
    ...heroRoutes,
    // 404 routes
    default: (request, response) => {
        
        response.writeHead(404, DEFAULT_HEADER)
        response.write('opps, not found')
        response.end()
    }
}
function handler (request, response) {
    const { url, method } = request
    const { pathname } = parse(url, true)
    const key = `${pathname}:${method.toLowerCase()}`
    console.log(key)

    const chosen = allRoutes[key] || allRoutes.default

    return Promise.resolve(chosen(request, response)).catch(handlerError(response))

    
}

function handlerError(response) {
    return error => {
        console.log('Something bad has happened**', error.stack)
        response.writeHead(500, DEFAULT_HEADER)
        response.write(JSON.stringify({
            error: 'Internal server error!'
        }))
        return response.end()
    }
}

export {handler}