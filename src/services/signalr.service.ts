import * as signalR from "@microsoft/signalr";

export class SignalRService {
    private connection: signalR.HubConnection;

    /** Initializes SignalR connection. */
    constructor() {
        this.connection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:3209/messenger/hub", { withCredentials: false })
            .withAutomaticReconnect() // Auto-reconnect on failure
            .build();
    }

    /**
     * Connects to SignalR Hub. Retries on failure.
     * @returns {Promise<void>}
     */
    public async startConnection(): Promise<void> {
        try {
            await this.connection.start();
            console.log("SignalR Connected");
        } catch (err) {
            console.error("SignalR Connection Error: ", err);
            setTimeout(() => this.startConnection(), 5000); // Retry after 5 seconds
        }
    }

    /**
     * Handles incoming messages.
     * @param callback - Function to handle messages.
     * @param callback.user - Sender's username.
     * @param callback.message - Message content.
     */
    public onReceiveMessage(callback: (user: string, message: string) => void): void {
        this.connection.on("ReceiveMessage", callback);
    }

    /**
     * Sends a message to the server.
     * @param user - Sender's username.
     * @param message - Message content.
     * @returns {Promise<void>}
     */
    public async sendMessage(user: string, message: string): Promise<void> {
        await this.connection.invoke("SendMessage", user, message);
    }
}