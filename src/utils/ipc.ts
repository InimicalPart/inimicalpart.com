import ipc from "node-ipc";
const IRISSocketPath = process.platform == "win32" ? "IRIS" : "/tmp/IRIS.sock"


export default class IPCSocket {
    private static instance: any;
    public static connected: boolean = false;
    
    public static getInstance(): any {
        if (!IPCSocket.instance) {
            ipc.config.silent = true;
            ipc.config.id = "website"
            ipc.config.retry = 0;
            ipc.config.stopRetrying = true;

            ipc.connectTo("iris", IRISSocketPath);

            ipc.of.iris.on("connect", () => {
                IPCSocket.connected = true;
            });

            ipc.of.iris.on("disconnect", () => {
                IPCSocket.connected = false;
                IPCSocket.instance.disconnect("iris");
            });

            ipc.of.iris.on("socket.disconnected", () => {
                IPCSocket.connected = false;
                IPCSocket.instance.disconnect("iris");
            });


            
            IPCSocket.instance = ipc;
        }
    
        if (!IPCSocket.instance.of.iris || !IPCSocket.connected) {
            IPCSocket.instance.connectTo("iris", IRISSocketPath);

            IPCSocket.instance.of.iris.on("connect", () => {
                IPCSocket.connected = true;
            });

            IPCSocket.instance.of.iris.on("disconnect", () => {
                IPCSocket.connected = false;
            });
            
            IPCSocket.instance.of.iris.on("socket.disconnected", () => {
                IPCSocket.connected = false;
            });
        }

        return IPCSocket.instance;
    }
}