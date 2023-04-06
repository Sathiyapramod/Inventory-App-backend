import { client } from "../index.js";
import express from "express";
import { ObjectId } from "mongodb";

const inventory = express.Router();

//READ inventory
inventory.get("/", async (req, res) => {
  const getAllInventory = await client
    .db("capstone")
    .collection("inventory")
    .find({})
    .toArray();
  getAllInventory
    ? res.send(getAllInventory)
    : res.status(401).send({ message: "failed to load the data" });
});
inventory.get("/:id", async (req, res) => {
  const { id } = req.params;
  const getInventoryfromDB = await client
    .db("capstone")
    .collection("inventory")
    .findOne({ _id: new ObjectId(id) });
  console.log(getInventoryfromDB);
  getInventoryfromDB
    ? res.send(getInventoryfromDB)
    : res.status(401).send({ message: "failed to load the data" });
});
//CREATE inventory

inventory.post("/", async (req, res) => {
  const { name, units, totalQty, rate } = req.body;
  if (
    units == null ||
    units == "" ||
    totalQty == null ||
    rate == null
  )
    res.status(401).send({ message: "Check input !!!!" });
  else {
    const newInventory = await client
      .db("capstone")
      .collection("inventory")
      .insertOne({
        name,
        units,
        billedQty: 0,
        totalQty: Number(totalQty),
        availableQty: Number(totalQty),
        rate: Number(rate),
      });

    newInventory
      ? res.send({ message: "New Inventory added successfully" })
      : res.status(401).send({ message: "failed to load the data" });
  }
});


//UPDATE inventory

inventory.put("/:id", async (req, res) => {
  //considered as rate can be updated
  //totalQty will be updated while making stock changes 


  const { rate } = req.body;
  const { id } = req.params;
  const checkIdInsideDB = await client
    .db("capstone")
    .collection("inventory")
    .findOne({ _id: new ObjectId(id) });
  console.log(checkIdInsideDB);
  if (!checkIdInsideDB) res.status(401).send({ message: "Invalid Id" });
  else {
    const updatedEntryinsideDB = await client
      .db("capstone")
      .collection("inventory")
      .findOneAndUpdate({ _id: new ObjectId(id) }, { $set: { rate: rate } });
    console.log(updatedEntryinsideDB);
    updatedEntryinsideDB
      ? res.send({ message: "Price updated successfully" })
      : res.status(401).send({ message: "failed to update the data" });
  }
});

//DELETE inventory
inventory.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const checkIdInsideDB = await client
    .db("capstone")
    .collection("inventory")
    .findOne({ _id: new ObjectId(id) });
  if (!checkIdInsideDB) res.status(401).send({ message: "Invalid Id" });
  else {
    const deleteInventory = await client
      .db("capstone")
      .collection("inventory")
      .deleteOne({ _id: new ObjectId(id) });
    //   console.log(deleteInventory);
    deleteInventory.deletedCount == 1
      ? res.send({ message: "Deleted Inventory successfully" })
      : res.status(401).send({ message: "failed to delete inventory" });
  }
});

export default inventory;
