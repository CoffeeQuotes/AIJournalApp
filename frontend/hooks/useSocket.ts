import { useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

const SOCKET_URL = "http://localhost:8080";

const useSocket = (): void => {

    useEffect(() => {
        const socket: Socket = io(SOCKET_URL);
        
        socket.on("general-notification", (data: { title: string, message: string, clickable_url?: string}) => {
            toast.success(data.title, {
                duration: 5000,
                description: data.message,
                action: data.clickable_url ? { label: "View", onClick: () => window.open(data.clickable_url, "_blank") } : undefined
            });
        });
        return () => socket.disconnect();
    }, []);
}

export default useSocket;