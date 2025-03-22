import { DispatchWithoutAction, useEffect, useReducer, useRef } from 'react'

export const useForceRender = () => {
  const mounted = useRef(false)
  const [count, forceRender] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return {
    count,
    reRender: () => {
      if (mounted.current) {
        forceRender()
      }
    }
  }
}

export default useForceRender
