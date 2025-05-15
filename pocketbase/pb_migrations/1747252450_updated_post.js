/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_2106002237")

  // add field
  collection.fields.addAt(4, new Field({
    "cascadeDelete": false,
    "collectionId": "pbc_2895558688",
    "hidden": false,
    "id": "relation1378257072",
    "maxSelect": 1,
    "minSelect": 0,
    "name": "post_image",
    "presentable": false,
    "required": false,
    "system": false,
    "type": "relation"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_2106002237")

  // remove field
  collection.fields.removeById("relation1378257072")

  return app.save(collection)
})
