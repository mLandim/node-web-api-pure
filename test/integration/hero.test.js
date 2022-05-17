import test from 'node:test'
import assert from 'node:assert'
import { promisify } from 'node:util'

test('Teste de integração para Heros', async (t) => {
    
    const testPort = 9009
    // BAD PRACTICE -> BECAUSE IT MUTATE DE ENVIRONMENT
    process.env.PORT = testPort
    const { server } = await import('../../src/index.js')
    const testServerAddress = `http://localhost:${testPort}/heroes`

    await t.test('deveria criar um herói', async (t) => {
        const data = {
            name: "Batman",
            age: 50,
            power: "rich"
        }

        const request = await fetch(testServerAddress, {
            method: 'POST',
            body: JSON.stringify(data)
        })

        assert.deepStrictEqual(
            request.headers.get('content-type'), 'application/json'
        )

        assert.strictEqual(request.status, 201)

        const result = await request.json()

        assert.deepStrictEqual(
            result.success,
            'user created with success',
            'it should return a valid text message'
        )

        assert.ok(
            result.id.length > 30,
            'it should be a valid uuid'
        )


    })

    await promisify(server.close.bind(server))()

})