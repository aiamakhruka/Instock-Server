const router = require("express").Router();
const warehouseController = require("../controllers/warehouse-controller");
const { validateWarehouse } = require("../middleware/warehouse-validator");

router
  .route("/")
  .get(warehouseController.getWarehouses)
  .post(validateWarehouse, warehouseController.postWarehouse);
router
  .route("/:id")
  .get(warehouseController.findWarehouse)
  .put(validateWarehouse, warehouseController.editWarehouse)
  .delete(warehouseController.removeWarehouse);
router.route("/:id/inventories").get(warehouseController.getWarehouseItems);

module.exports = router;
