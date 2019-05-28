import { curry } from 'ramda'
export const range = (min, max) => {
  let arr = []
  for (let i=min; i<=max; i++) {
    arr.push(i)
  }
  return arr
}

// mapObjValues :: (a -> b) -> Obj a -> Obj b
export const mapObjValues = curry(fn => obj => {
  return Object.keys(obj).reduce(
    (accum, key) => {
      accum[key] = fn(obj[key])
      return accum
    },
    {}
  )
})
