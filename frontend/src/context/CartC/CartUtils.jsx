export function mergeCarts (cartLocal, cartServer) {
  const map = new Map()

  cartServer.forEach(item => {
    map.set(item.id, { ...item })
  })

  cartLocal.forEach(item => {
    if (map.has(item.id)) {
      map.set(item.id, {
        ...map.get(item.id),
        quantity: map.get(item.id).quantity + item.quantity
      })
    } else {
      map.set(item.id, { ...item })
    }
  })

  return Array.from(map.values())
}
