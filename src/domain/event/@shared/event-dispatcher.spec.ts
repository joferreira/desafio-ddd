import Adrress from "../../entity/address";
import Customer from "../../entity/customer";
import CustomerChangedAddressEvent from "../customer/customer-changed-address.event";
import CustomerCreatedEvent from "../customer/customer-created.event";
import SendConsoleLog1WhenCustomerIsCreatedHandler from "../customer/handler/envia-console-log-1.handler";
import SendConsoleLog2WhenCustomerIsCreatedHandler from "../customer/handler/envia-console-log-2.handler";
import SendConsoleLogWhenCustomerChangedAddressHandler from "../customer/handler/envia-console-log.handler";
import SendEmailWhenProductIsCreatedHandler from "../product/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../product/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {

    it("should register an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

    });

    it("should unregister an event handler", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregister("ProductCreatedEvent", eventHandler);

        // expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
    } );

    it("should unregister all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        eventDispatcher.unregisterAll();

        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
    });

    it("should notify all event handlers", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendEmailWhenProductIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("ProductCreatedEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toMatchObject(eventHandler);

        const productCreatedEvent = new ProductCreatedEvent({
            name: "Product 1",
            description: "Product 1 description",
            price: 10.0,
        });

        // Quando o notify for executado, o SendEmailWhenProductIsCreatedHandler.handler() deverá ser chamado
        eventDispatcher.notify(productCreatedEvent);

        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should notify when the customer is created", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLog1WhenCustomerIsCreatedHandler();
        const eventHandler2 = new SendConsoleLog2WhenCustomerIsCreatedHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);

        const customer = new Customer("1", "Customer 1")
        const address = new Adrress("Street 1", 123,"13330-250","São Paulo");
        customer.Address = address;

        const customerCreatedEvent = new CustomerCreatedEvent({
            name: customer.name,
            id: customer.id,
        });

        eventDispatcher.notify(customerCreatedEvent);
        expect(spyEventHandler).toHaveBeenCalled();
    });

    it("should notify when the customer is changed address", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new SendConsoleLogWhenCustomerChangedAddressHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerChangedAddressEvent", eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerChangedAddressEvent"][0]).toMatchObject(eventHandler);

        const customer = new Customer("1", "Customer 1")
        const address = new Adrress("Street 1", 123,"13330-250","São Paulo");
        customer.Address = address;

        const address2 = new Adrress("Street 2", 123,"13330-000","São Paulo");
        customer.changeAddress(address2);

        const customerChangedAddressEvent = new CustomerChangedAddressEvent({
            ID: customer.id,
            name: customer.name,
            street: address2.street,
            number: address2.number,
            zipCode: address2.zip,
            city: address2.city
        });
        
        eventDispatcher.notify(customerChangedAddressEvent);
        expect(spyEventHandler).toHaveBeenCalled();

    });    
});
        