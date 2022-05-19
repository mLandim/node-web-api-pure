import { ServerResponse, ClientRequest } from 'node:http'
import { parse, fileURLToPath } from 'node:url'
import { generateInstance } from './factories/heroFactory.js'
import { routes } from './routes/heroRoutes.js'
import { DEFAULT_HEADER } from './util/util.js'
import { join, dirname } from 'node:path'

const currentDir = dirname(fileURLToPath(import.meta.url))
const filePath = join(currentDir, '../database', 'data.json')
const heroService = generateInstance({
    filePath
})

const heroRoutes = routes({ heroService})
const allRoutes = {
    ...heroRoutes,
    /**
     * 
     * @param {ClientRequest} request 
     * @param {ServerResponse} response 
     */
    default: (request, response) => {
        response.writeHead(404, DEFAULT_HEADER)
        response.write(JSON.stringify({
            error: 'Resource not found'
        }))
        response.end()
    }
}

/**
 * Função importada em index.js, informada como parâmetros em http.createServer e 
 * executada sempre que uma requisição é recebida pelo servidor.
 * @param {ClientRequest} request 
 * @param {ServerResponse} response 
 * @returns 
 */
function handler (request, response) {
    // Destructuring no argumento request para capturar url e o método da requisição
    const { url, method } = request
    // Usando parse para pegar apenas a parte principal do texto recebido na url
    const { pathname } = parse(url, true)
    // Montando uma key que será usada no mapeamento das funções chamadas com o objeto allRoutes
    const key = `${pathname}:${method.toLowerCase()}`
    console.log(key)
    // Define a função desejada de acordo com a key ou chama o default 404 
    const chosen = allRoutes[key] || allRoutes.default
    // Retorna uma promise que resolve a execução da função de rota (chosen) e trata erro no catch
    return Promise.resolve(chosen(request, response)).catch(handlerError(response))

    
}


/**
 * 
 * @param {ServerResponse} response 
 * @returns 
 */
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