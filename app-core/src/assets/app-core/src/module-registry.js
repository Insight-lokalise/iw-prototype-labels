export default function createModuleRegistry() {
    const methods = new Map()
    const moduleNames = new Set()
    const pendingActionQueue = new Map()


    async function registerModule(name, mod) {
        if (!name || typeof name !== 'string') {
            throw new TypeError(`
                App-core: registerModule expected the first argument to be a string of the module
                name or it's absolute url. Received ${typeof name} instead
            `)
        }

        let actionsToTrigger = []
        const hasPromisedMod = mod && typeof mod === 'object' && typeof mod.then === 'function'
        // If no mod is provided, or mod is a promise then we are waiting on an async module
        const isResourceURL = mod === undefined || hasPromisedMod
        const moduleName = findModuleName(name, hasPromisedMod, isResourceURL)
    
        if (!isResourceURL && typeof mod !== 'object') {
            throw new TypeError(`
                App-core: registerModule expected a second argument to be an object, a promise, or undefined.\n
                Received ${typeof mod}
            `)
        }

        if (!moduleNames.has(name)) {
            moduleNames.add(name)
            // If we aren't a resource url we are being registered from a function
            if (!isResourceURL) {
                actionsToTrigger = getModuleMethods(mod)
            } else if (hasPromisedMod) {
                // If mod is a promise then we can just await it
                const modInstance = await mod()
                actionsToTrigger = getModuleMethods(modInstannce)
            } else if (isResourceURL) {
                // Deal with the resource url here. Use an async import/fetch to grab the script.
                // TODO:
            }

            if (actionsToTrigger.length > 0) {
                Promise.all(actionsToTrigger)
            }
        }
    }

    function triggerExternalAction(method, ...payload) {
        if (typeof method !== 'string') {
            throw new TypeError(`
                App-core: triggerExternalAction expected the first argument to be a string
                for the name of the action. Received ${typeof method} instead
            `)
        }

        const fn = methods.get(method)
        // Register pending methods to be called after the module has registered
        if (!fn) {
            pendingActionQueue.set(method, ...payload)
            return
        }

        return fn(...payload)
    }

    function getModuleMethods(mod) {
        const actionsToTrigger = []
        Object.keys(mod).forEach(key => {
            methods.set(mod[key])
            if (pendingActionQueue.has(key)) {
                const fn = () => mod[key](pendingActionQueue.get(key))
                actionsToTrigger.push(fn)
            }
        })
        return actionsToTrigger
    }

    return { registerModule, triggerExternalAction }
}

function findModuleName(name, hasPromisedMod, isResourceURL) {
    // If Mod is promise, then assume the user is providing a module name
    if (!isResourceUrl || hasPromisedMod) return name
    const splitName = name.split('/')
    return splitName[splitName.length - 1]
}
