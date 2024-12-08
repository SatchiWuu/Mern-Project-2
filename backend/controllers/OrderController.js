import Order from "../models/Order.js";
// const Order = require('../models/Order')
// import Order from "../models/newOrders";
import User from '../models/User.js'

export const get = async(req, res) => {
  try {
    const orders = await Order.find({})

    res.status(200).json({ success: true, data: orders })
  } catch(e) {
    return res.status(500).json({ success: false, error: e.message })
  }
}

export const newOrder = async (req, res) => {
  try {
    console.log(req.body)

    const order = await Order.create(req.body);
    await User.updateMany({}, { $set: { cart: [] } });
    console.log(order);
    res.status(200).json(order);
  } catch (e) {
    console.log(e);
  }
};

export const getChartData = async(req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const orders = await Order.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err });
  }
}