class User{
    private fullName = "Name Surname";
    private deliveryAddress = "Mercury";

    public getDeliveryAddress = () =>{
        return this.deliveryAddress
    }
    public getFullName = () =>{
        return this.fullName
    }
}
class Order{
    private readonly orderId:string;
    constructor(private productId:string,private user:User){
        this.orderId = Math.round(Math.random()*100).toString()
    }
    public getProductId(){
        return this.productId
    }
    public getUser(){
        return this.user
    }

    public getOrderId(){
        return this.orderId
    }
}

interface Subscriber<T>{
    update(newOrder:T):void
}

interface SubscriptionManagingPublisher<T> {
    subscribe(subscriber: Subscriber<T>):void
    unsubscribe(subscriber: Subscriber<T>):void
}

interface NotifyingPublisher<T> {
    notify(obj:T):void
}

abstract class Publisher<T> implements SubscriptionManagingPublisher<T>, NotifyingPublisher<T>{
    private subscribers:Subscriber<T>[] = [];

    public subscribe(subscriber: Subscriber<T>) {
        this.subscribers.push(subscriber)
    }

    public notify(obj: T): void {
        for(const subscriber of this.subscribers){
            subscriber.update(obj)
        }
    }

    public unsubscribe(subscriber: Subscriber<T>): void {
        this.subscribers = this.subscribers.filter(sub => sub !== subscriber)
    }
}

class OrderPublisher extends Publisher<Order>{}

class OrderProductUseCase{
    constructor(private newOrderPublisher:NotifyingPublisher<Order>) {
    }
    public orderProduct = (productId:string, user:User) => {
        const order = new Order(productId,user)
        this.newOrderPublisher.notify(order)
        // persist order
    }
}

class WarehouseService implements Subscriber<Order> {

    constructor(private newOrderPublisher:SubscriptionManagingPublisher<Order>) {
        newOrderPublisher.subscribe(this)
    }

    public update(newOrder: Order): void {
        this.prepareForDelivery(newOrder.getProductId())
    }

    private prepareForDelivery(productId:string){
        console.log(`Product ${productId} prepared for delivery`)
    }

}

class CourierService implements Subscriber<Order>{
    constructor(private newOrderPublisher:SubscriptionManagingPublisher<Order>) {
        newOrderPublisher.subscribe(this)
    }

    public update(newOrder: Order): void {
        this.scheduleDelivery(newOrder.getProductId(),newOrder.getUser().getFullName())
    }

    private scheduleDelivery(productId:string, userDeliveryAddress:string){
        console.log(`Delivery of product ${productId} scheduled for 01.01.2077 to ${userDeliveryAddress}`)
    }
}

class NotificationService implements Subscriber<Order>{
    constructor(private newOrderPublisher:SubscriptionManagingPublisher<Order>) {
        newOrderPublisher.subscribe(this)
    }

    public update(newOrder: Order): void {
        this.notifyUser(newOrder.getUser().getFullName(),newOrder.getOrderId())
    }

    private notifyUser(userFullName:string,orderId:string){
        console.log(`Sent email to user: "Hi ${userFullName},\nYour order ${orderId} will arrive soon"`)
    }
}

class Main{
    public start(){
        const publisher = new OrderPublisher()
        const orderProductUseCase = new OrderProductUseCase(publisher)

        new WarehouseService(publisher)
        new CourierService(publisher)
        new NotificationService(publisher)

        orderProductUseCase.orderProduct("testId1",new User)
        console.log("\n\n")
        orderProductUseCase.orderProduct("testId2",new User)
        console.log("\n\n")
        orderProductUseCase.orderProduct("testId3",new User)
    }
}

new Main().start()
