export interface SocketBidHiredPayload {
  gigTitle: string;
  bidId: string;
  message: string;
}

export interface SocketBidReceivedPayload {
  gigId: string;
  gigTitle: string;
  freelancerName: string;
  bidId: string;
}

export type SocketEvents = {
  'register-user': (userId: string) => void;
  'deregister-user': (userId: string) => void;
  'bid-hired': (data: SocketBidHiredPayload) => void;
  'bid-received': (data: SocketBidReceivedPayload) => void;
};
