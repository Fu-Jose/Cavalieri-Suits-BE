import Order from "../models/Order.js";

export const getOrderAll = async (req, res, next) => {
  const orders = await Order.find();
  if (orders) {
    res.send(orders);
  } else {
    res.status(404).send({ message: "No hay ordenes recientes" });
  }
};

export const getOrderById = async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: "Orden no existe" });
  }
};

export const createOrder = async (req, res, next) => {
  if (req.body.orderItems.length === 0) {
    res.status(400).send({ message: "Carrito está vacío" });
  } else {
    const order = new Order({
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: {
        id: req.user.id,
        username: req.user.username,
      },
    });
    const createdOrder = await order.save();
    res
      .status(201)
      .send({ message: "Orden creada con éxito", order: createdOrder });
  }
};

export const payOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.send({ message: "Orden pagada", order: updatedOrder });
  } else {
    res.status(404).send({ message: "Orden no encontrada" });
  }
};

export const deliverOrder = async (req, res, id) => {
  const order = await Order.findById(req.params.id);
  if (order && order.isDelivered === false) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.send({ message: "Orden entregada", order: updatedOrder });
  } else if (order && order.isDelivered === true) {
    order.isDelivered = false;
    order.deliveredAt = null;
    const updatedOrder = await order.save();
    res.send({ message: "Orden no entregada", order: updatedOrder });
  } else {
    res.status(404).send({ message: "Orden no encontrada" });
  }
};

export const getMyOrderList = async (req, res) => {
  const orders = await Order.find({ "user.id": `${req.user.id}` });
  res.send(orders);
};
