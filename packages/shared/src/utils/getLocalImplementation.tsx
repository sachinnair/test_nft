import { isEnvironment, Environment } from '@dimensiondev/holoflows-kit'

// key = channel; value = local implementation
const RPCCache = new WeakMap<object, object>()
/**
 * This function provides a localImplementation that is HMR ready.
 * To update, call this function with the SAME CHANNEL object.
 * It will "clone" all methods that impl returns.
 * @param name The name of the local implementation, used for logging
 * @param impl The implementation. Can be an async function.
 * @param ref The reference object that must be the same if you're updating.
 */
export async function getLocalImplementation<T extends object>(name: string, impl: () => T | Promise<T>, ref: object) {
    // console.log('getLocalImplementation', name)
    if (name === 'Plugin(com.maskbook.collectibles)') {
        console.log('CAPTURE', name, ref)
    }
    const isBackground = isEnvironment(Environment.ManifestBackground)
    console.log('isBackground', isBackground)
    if (!isBackground) return {}

    const isUpdate = RPCCache.has(ref)
    const localImpl: T = RPCCache.get(ref) || ({} as any)
    RPCCache.set(ref, localImpl)

    const result: any = await impl()
    console.log('result', result, RPCCache)
    for (const key in localImpl) {
        // if (name === 'Plugin(com.maskbook.collectibles)') {
        console.log('KEY::: ', key)
        // }
        if (!Reflect.has(result, key)) {
            delete localImpl[key]
            isUpdate && console.log(`[HMR] ${name}.${key} removed.`)
        } else if (result[key] !== localImpl[key]) {
            isUpdate && console.log(`[HMR] ${name}.${key} updated.`)
        }
    }
    for (const key in result) {
        // if (name === 'Plugin(com.maskbook.collectibles)') {
        console.log('KEY::: ', key)
        // }
        if (key === 'then') console.error('!!! Do not use "then" as your method name !!!')
        if (!Reflect.has(localImpl, key)) isUpdate && console.log(`[HMR] ${name}.${key} added.`)
        Object.defineProperty(localImpl, key, { configurable: true, enumerable: true, value: result[key] })
    }
    return localImpl
}

export async function getLocalImplementationExotic<T extends object>(
    name: string,
    impl: () => T | Promise<T>,
    ref: object,
) {
    const isBackground = isEnvironment(Environment.ManifestBackground)
    if (!isBackground) return {}

    RPCCache.set(ref, await impl())
    return new Proxy(
        {},
        {
            get(_, key) {
                // if (name === 'Plugin(com.maskbook.collectibles)') {
                console.log('KEY::: ', key)
                // }
                if (key === 'then') return
                // @ts-ignore
                return RPCCache.get(ref)?.[key]
            },
        },
    )
}
