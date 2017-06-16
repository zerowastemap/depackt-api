export const rest = (router, controller) => {
  if (controller.create) {
    router
      .route('/')
      .post(controller.create)
  }

  if (controller.list) {
    router
      .route('/')
      .get(controller.list)
  }

  if (controller.show) {
    router
      .route('/:id')
      .get(controller.show)
  }

  if (controller.remove) {
    router
      .route('/:id')
      .delete(controller.remove)
  }

  if (controller.update) {
    router
      .route('/:id')
      .put(controller.update)
  }
}
