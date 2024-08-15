interface ICOMGlobal extends NodeJS.Global {
    global: any;
    botConfig: {
        [key: string]: { //! Bot ID
            id: string;
            name: string;
            connection: {
                type: "ws";
                uuid?: string; //! Only for ws
            },
            verificationKey: string;
        }
    },
    connections: {
        [key: string]: { //! Bot ID
            type: "ws";
            connection: WebSocket | any,
            verified: boolean
        }
    },
    servers: {
        [key: string]: {
            id: string;
            name: string;
            iconURL: string;
            managingBot: string;
        }
    },
    caches: {
        [key: string]: {
            [key: string]: {
                timestamp?: number;
                cached?: any;
            }
        }   
    }
}