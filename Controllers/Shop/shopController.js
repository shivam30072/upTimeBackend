// routes/shopRoutes.js
const express = require("express");
const Shop = require("../../Models/Shop");

const createShop = async (req, res) => {
  try {
    const shopData = {
      ...req.body,
      owner: req.user._id,
    };

    const shop = new Shop(shopData);
    await shop.save();
    res.status(201).json({ message: "Shop created successfully", shop });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getAllShops = async (req, res) => {
  try {
    const query = {};
    const { type, owner, page = 1, limit = 10 } = req.query;

    if (type) query.type = type;
    if (owner) query.owner = owner;

    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = Math.min(Math.max(parseInt(limit), 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const shops = await Shop.find(query)
      .populate("owner", "name")
      .skip(skip)
      .limit(limitNumber)
      .sort({ createdAt: -1 });

    const totalShops = await Shop.countDocuments(query);

    res.status(200).json({
      page: pageNumber,
      limit: limitNumber,
      totalShops,
      totalPages: Math.ceil(totalShops / limitNumber),
      shops,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a shop by ID
const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate("owner", "name");
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    res.json({ shop });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a shop by ID
const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    res.json({ message: "Shop updated successfully", shop });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete a shop by ID
const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findByIdAndDelete(req.params.id);
    if (!shop) return res.status(404).json({ error: "Shop not found" });
    res.json({ message: "Shop deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all shops for a specific owner
const getShopsByOwner = async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.params.ownerId });
    res.json(shops);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const searchShops = async (req, res) => {
  try {
    const { query, page = 1, limit = 10 } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const regex = new RegExp(query, "i");

    const pageNumber = parseInt(page) > 0 ? parseInt(page) : 1;
    const limitNumber = Math.min(Math.max(parseInt(limit), 1), 100);
    const skip = (pageNumber - 1) * limitNumber;

    const filter = {
      $or: [{ name: regex }, { type: regex }],
    };

    const [shops, total] = await Promise.all([
      Shop.find(filter)
        .populate("owner", "name")
        .skip(skip)
        .limit(limitNumber)
        .sort({ createdAt: -1 }),
      Shop.countDocuments(filter),
    ]);

    if (shops.length === 0) {
      return res.status(200).json({
        query,
        page: pageNumber,
        limit: limitNumber,
        totalResults: total,
        totalPages: Math.ceil(total / limitNumber),
        shops,
      });
    }

    res.status(200).json({
      query,
      page: pageNumber,
      limit: limitNumber,
      totalResults: total,
      totalPages: Math.ceil(total / limitNumber),
      shops,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createShop,
  getAllShops,
  getShopById,
  updateShop,
  deleteShop,
  getShopsByOwner,
  searchShops,
};
