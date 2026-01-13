import { useEffect, useRef } from "react";
import { socket } from "@/lib/socket/socket";
import { useAppDispatch, useAppSelector } from "./redux";
import toast from "react-hot-toast";
import {
  SocketBidHiredPayload,
  SocketBidReceivedPayload,
} from "@/types/socket.types";

export function useSocket() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (isAuthenticated && user && !isConnectedRef.current) {
      // Connect to socket
      socket.connect();

      socket.on("connect", () => {
        isConnectedRef.current = true;
        // Register user with their ID
        socket.emit("register-user", user._id);
      });

      socket.on("disconnect", () => {
        isConnectedRef.current = false;
      });

      // Listen for bid-hired event (freelancer gets hired)
      socket.on("bid-hired", (data: SocketBidHiredPayload) => {
        // Update myBids state - mark the hired bid as "hired"
        dispatch({
          type: "bids/updateBidStatusFromSocket",
          payload: {
            bidId: data.bidId,
            status: "hired",
          },
        });

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

      // Listen for bid-received event (gig owner receives a new bid)
      socket.on("bid-received", (data: SocketBidReceivedPayload) => {        
        // Update myGigs state - increment bid count for the gig
        dispatch({
          type: "gigs/incrementBidCountFromSocket",
          payload: {
            gigId: data.gigId,
          },
        });

        toast.success(
          <div>
            <div className="font-semibold">New Bid Received!</div>
            <div className="text-sm mt-1">
              {data.freelancerName} bid on &quot;{data.gigTitle}&quot;
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
  }, [isAuthenticated, user, dispatch]);

  return {
    socket,
  };
}