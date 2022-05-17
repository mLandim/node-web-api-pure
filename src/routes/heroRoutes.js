
const routes = ({heroService}) => ({
    '/heroes:get': async (request, response) => {
        // throw new Error('Teste erro')
        response.write('GET')
        response.end()
    },
    '/heroes:post': async (request, response) => {
        // throw new Error('Teste erro')
        response.write('POST')
        response.end()
    }
})

export { routes }