import { ClientRequest, ServerResponse } from 'node:http'
import { once } from 'node:events'
import { DEFAULT_HEADER } from '../util/util.js'
import Hero from '../entities/hero.js'

const routes = ({heroService}) => ({
    /**
     * 
     * @param {ClientRequest} request 
     * @param {ServerResponse} response 
     */
    '/heroes:get': async (request, response) => {

        const data = await heroService.find()
        response.writeHead(200, DEFAULT_HEADER)
        response.write(JSON.stringify(data))
        response.end()
    },
    /**
     * 
     * @param {ClientRequest} request 
     * @param {ServerResponse} response 
     */
    '/heroes:post': async (request, response) => {
        const data = await once(request, 'data')
        const item = JSON.parse(data)
        const hero = new Hero(item)
        const heroId = await heroService.create(hero)
        response.writeHead(201, DEFAULT_HEADER)
        response.write(JSON.stringify({
            message: 'Hero created',
            data: heroId
        }))
        response.end()
    }
})

export { routes }