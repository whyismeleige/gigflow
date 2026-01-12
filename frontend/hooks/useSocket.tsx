// frontend/hooks/useSocket.ts
import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket/socket";
import { useAppSelector } from "./redux";
import toast from "react-hot-toast";
import {
  SocketBidHiredPayload,
  SocketBidReceivedPayload,
} from "@/types/socket.types";

export function useSocket() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && user && !isConnectedRef.current) {
      // Connect to socket
      socket.connect();

      socket.on("connect", () => {
        console.log("Socket connected");
        isConnectedRef.current = true;
        // Register user with their ID
        socket.emit("register-user", user._id);
      });

      socket.on("disconnect", () => {
        console.log("Socket disconnected");
        isConnectedRef.current = false;
      });

      // Listen for bid-hired event
      socket.on("bid-hired", (data: SocketBidHiredPayload) => {
        
        toast.success(
          <div>
            <div className="font-semibold">🎉 Congratulations!</div>
            <div className="text-sm mt-1">{data.message}</div>
          </div>,
          {
            duration: 6000,
            style: {
              background: "#10b981",
              color: "#fff",
            },
          }
        );
      });

      // Listen for bid-received event
      socket.on("bid-received", (data: SocketBidReceivedPayload) => {
        console.log("Bid received notification:", data);
        toast.success(
          <div>
            <div className="font-semibold">New Bid Received!</div>
            <div className="text-sm mt-1">
              {data.freelancerName} bid on "{data.gigTitle}"
            </div>
          </div>,
          {
            duration: 5000,
          }
        );
      });

      // Cleanup function
      return () => {
        if (user) {
          socket.emit("deregister-user", user._id);
        }
        socket.off("connect");
        socket.off("disconnect");
        socket.off("bid-hired");
        socket.off("bid-received");
        socket.disconnect();
        isConnectedRef.current = false;
      };
    }
  }, [isAuthenticated, user]);

  return {
    socket,
    isConnected: isConnectedRef.current,
  };
}
