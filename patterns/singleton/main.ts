class Connection{
    constructor(public readonly id:number) {
        console.log(`Connection constructor - creating connection ${id}`)
    }
}

class Database {
    private static instance: Database;

    private freeConnections: Connection[] = [];
    private inUseConnections: Connection[] = [];
    private totalConnections = 5;

    private constructor() {
        for (let i = 0; i < this.totalConnections; i++) {
            this.freeConnections.push(new Connection(i));
        }
    }

    public static getInstance() {
        if (!Database.instance) {
            console.log("getInstance - creating instance")
            Database.instance = new Database();
        }
        else{
            console.log("getInstance - returning existing instance")
        }
        return Database.instance;
    }

    public getConnection() {
        const connection = this.freeConnections.pop();
        if(!connection){
            console.log(`getConnection - waiting due to lack of free connections`)
            return this.waitForFreeConnection()
        }
        console.log(`getConnection - returning connection ${connection.id}`)
        this.inUseConnections.push(connection);
        return connection;
    }

    private waitForFreeConnection(){
        return new Promise<Connection>((resolve)=>{
            const interval = setInterval(()=>{
                const connection = this.freeConnections.pop();
                if(!connection){
                    console.log(`waitForFreeConnection - waiting due to lack of free connections`)
                    return;
                }
                console.log(`waitForFreeConnection - returning connection ${connection.id}`)
                clearInterval(interval)
                this.inUseConnections.push(connection);
                resolve(connection)
            },300)
        })
    }

    public releaseConnection(connection: Connection) {
        if (this.inUseConnections.indexOf(connection) === -1) {
            console.log("releaseConnection - given connection does not exist in this pool");
            return;
        }
        console.log(`releaseConnection - releasing connection ${connection.id}`);
        this.inUseConnections = this.inUseConnections.filter(con => con !== connection);
        this.freeConnections.push(connection);
    }
}


const run  = async() => {

    console.log('\n\n Test - returning existing instance \n\n')

    const instance1 = Database.getInstance();
    const instance2 = Database.getInstance();

    const connection1 = await instance1.getConnection();
    const connection2 = await instance2.getConnection();
    instance2.releaseConnection(connection1);
    const connection3 = await instance1.getConnection();
    instance1.releaseConnection(connection2);
    instance1.releaseConnection(connection3);

    console.log('\n\n Test - waiting for free connection \n\n')

    const connection4 = await instance2.getConnection()
    await instance1.getConnection()
    await instance1.getConnection()
    await instance1.getConnection()
    await instance1.getConnection()

    setTimeout(()=>{
        instance1.releaseConnection(connection4)
    },1000)

    await instance2.getConnection()

    console.log('\n\n Test - checking whether given connection exists \n\n')

    const connection5 = new Connection(123);
    instance1.releaseConnection(connection5);
}
run()

