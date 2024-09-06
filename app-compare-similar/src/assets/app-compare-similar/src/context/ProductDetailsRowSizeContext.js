import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
} from 'react'

export class MatchRowSizeWatcher {
  map = {}

  _observer = null

  enabled = true

  get observer() {
    if (!this._observer /*&& isClient()*/) {
      this._observer = new ResizeObserver(() => {
        if (this.enabled) {
          this.update()
        }
      })
    }

    return this._observer
  }

  disable() {
    if (this.enabled) {
      this.enabled = false
      this.resetStyles()
    }
  }

  enable() {
    if (!this.enabled) {
      this.enabled = true
      this.update()
    }
  }

  register(key, el) {
    if (!this.map[key]) {
      this.map[key] = []
    }

    this.map[key].push({
      el,
      size: el.offsetHeight,
    })

    this.observer?.observe(el, {
      box: 'border-box',
    })
  }

  unregister(key, el) {
    const bucket = this.map[key]

    if (!bucket) {
      return
    }

    this.observer?.unobserve(el)

    this.map[key] = bucket.filter((entry) => entry.el !== el)
  }

  update() {
    this.resetStyles()
    this.measure()
    this.writeBack()
  }

  writeBack() {
    for (const [key, items] of Object.entries(this.map)) {
      const max = this.getKeyMax(key)
      for (const item of items) {
        item.el.style.height = `${max}px`
      }
    }
  }

  getKeyMax(key) {
    const bucket = this.map[key]
    if (!bucket) {
      return 0
    }

    return Math.max(...bucket.map((item) => item.size))
  }

  measure() {
    for (const items of Object.values(this.map)) {
      for (const item of items) {
        item.size = item.el.offsetHeight
      }
    }
  }

  resetStyles() {
    for (const items of Object.values(this.map)) {
      for (const item of items) {
        item.el.style.height = 'auto'
      }
    }
  }

  destroy() {
    this.observer?.disconnect()
  }
}

const ProductDetailsRowSizeContext = createContext(null)
ProductDetailsRowSizeContext.displayName = 'ProductDetailsRowSizeContext'

export const useProductDetailsRowSizeContext = () => {
  const value = useContext(ProductDetailsRowSizeContext)
  if (!value) {
    throw new Error('No provider present for ProductRowSizeContext')
  }

  return value
}

export const ProductDetailsRowSizeContextProvider = (props) => {
  const [watcher] = useState(() => new MatchRowSizeWatcher())

  useLayoutEffect(() => {
    window.addEventListener('resize', () => {
      window.innerWidth < 768 ? watcher.disable() : watcher.enable()
    })

    return () => {
      watcher.destroy()
    }
  }, [watcher])

  return (
    <ProductDetailsRowSizeContext.Provider value={watcher}>
      {props.children}
    </ProductDetailsRowSizeContext.Provider>
  )
}
