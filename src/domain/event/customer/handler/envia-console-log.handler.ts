import EventHandlerInterface from "../../@shared/event-handler.interface";
import CustomerChangedAddressEvent from "../customer-changed-address.event";

export default class SendConsoleLogWhenCustomerChangedAddressHandler implements EventHandlerInterface<CustomerChangedAddressEvent> {
    handle(event: CustomerChangedAddressEvent): void {
        console.log(`${event.eventData.name} changed address to ${event.eventData.street}, ${event.eventData.number} - ${event.eventData.zipCode} - ${event.eventData.city} `);
    }
}