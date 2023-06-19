const knex = require("knex")(require("../knexfile"));

const getInventoriesJointWarehouse = (_req, res) => {
  knex
    .from("inventories")
    .select(
      "inventories.id",
      "inventories.item_name",
      "inventories.category",
      "inventories.status",
      "inventories.quantity",
      "warehouse_name"
    )
    .join("warehouses", "inventories.warehouse_id", "warehouses.id")
    .then((joined) => {
      res.status(200).json(joined);
    })
    .catch((error) => {
      res.status(500).json({
        message: `Unable to retrieve inventory data. Error: ${error}`,
      });
    });
};

const findInventoryItem = (req, res) => {
  knex("inventories")
    .where({ id: req.params.id })
    .then((inventoryItemFound) => {
      if (inventoryItemFound.length === 0) {
        return res.status(404).json({
          message: `Inventory with ID ${req.params.id} not found`,
        });
      }
      res.json(inventoryItemFound[0]);
    })
    .catch(() => {
      res.status(500).json({
        message: `Unable to retrive inventory data with ID: ${req.params.id}`,
      });
    });
};

const editInventoryItem = (req, res) => {
  knex("inventories")
    .where({ id: req.params.id })
    .update({
      warehouse_id: req.body.warehouse_id,
      item_name: req.body.item_name,
      description: req.body.description,
      category: req.body.category,
      status: req.body.status,
      quantity: req.body.quantity,
    })
    .then((result) => {
      if (result === 0) {
        return res.status(404).json({
          message: `item with ID: ${req.params.id} not found.`,
        });
      }
      return knex("inventories").where({
        id: req.params.id,
      });
    })
    .then((updatedInventory) => {
      res.json(updatedInventory[0]);
    })
    .catch(() => {
      res.status(500).json({
        message: `Unable to update item with ID: ${req.params.id}`,
      });
    });
};

const addInventoryItem = (req, res) => {
  knex("inventories")
    .insert({
      warehouse_id: req.body.warehouse_id,
      item_name: req.body.item_name,
      description: req.body.description,
      category: req.body.category,
      status: req.body.status,
      quantity: req.body.quantity,
    })
    .then((result) => {
      return knex("inventories")
        .where({ id: result[0] })
        .then((createdInventory) => res.status(201).json(createdInventory));
    })
    .catch(() => {
      res.status(500).json({
        message: "Unable to create new inventory",
      });
    });
};
const removeInventory = (req, res) => {
  knex("inventories")
    .where({ id: req.params.id })
    .del()
    .then((result) => {
      if (result === 0) {
        return res.status(404).json({
          message: `User with ID;${req.params.id} not found`,
        });
      }

      res.sendStatus(204);
    })
    .catch(() => {
      return res.status(500).json({
        message: `Server issue can not delete user with id: ${req.params.id}`,
      });
    });
};

module.exports = {
  getInventoriesJointWarehouse,
  findInventoryItem,
  editInventoryItem,
  removeInventory,
  addInventoryItem,
};
