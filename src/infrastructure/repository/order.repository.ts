import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async update(entity: Order): Promise<void> {
        await OrderItemModel.destroy({
            where: {order_id: entity.id},
        });

        const items = entity.items.map((item) => ({
            id: item.id,
            name: item.name,
            price: item.price,
            product_id: item.productId,
            quantity: item.quantity,
            order_id: entity.id,
          }));
       
        await OrderItemModel.bulkCreate(items);
        await OrderModel.update(
            {
                total: entity.total()
            },
            {
              where: {
                id: entity.id,
              },
            }
        );
    }
    async find(id: string): Promise<Order> {
        let orderModel;
        try {
            orderModel = await OrderModel.findOne({where: {id: id}, rejectOnEmpty: true,  include: [{model: OrderItemModel}]});
        } catch (error) {
            throw new Error("Order not found");
        }

        const order = new Order(
            id,
            orderModel.customer_id,
            orderModel.items.map((item) => new OrderItem(
                item.id,
                item.name,
                item.price,
                item.product_id,
                item.quantity
            )),
        );

        return order;
    }
    async findAll(): Promise<Order[]> {
        const orderModels = OrderModel.findAll({
            include: [{model: OrderItemModel}],
        });

        const orders = (await orderModels).map((orderModel) => {
            const order = new Order(
                orderModel.id,
                orderModel.customer_id,
                orderModel.items.map((item) => new OrderItem(
                    item.id,
                    item.name,
                    item.price,
                    item.product_id,
                    item.quantity
                )),
            );

            return order;
        });

        return orders;
    }
    async create(entity: Order): Promise<void> {
        await OrderModel.create({
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total(),
            items: entity.items.map((item) => ({
                id: item.id,
                product_id: item.productId,
                quantity: item.quantity,
                name: item.name,
                price: item.price,
            })),
        },
        {
            include: [{model: OrderItemModel}],
        }
        );
    }
    
}
