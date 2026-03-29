import { useState, useEffect } from 'react';
import { socket } from '../socket';

/**
 * useSocket()
 * Returns { socket, connected }
 * The socket instance is already connected (autoConnect: true in socket.js).
 */
export function useSocket() {
  const [connected, setConnected] = useState(socket.connected);
  const [reconnecting, setReconnecting] = useState(false);

  useEffect(() => {
    const onConnect = () => {
      setConnected(true);
      setReconnecting(false);
    };
    const onDisconnect = () => {
      setConnected(false);
      setReconnecting(true);
    };
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

  return { socket, connected, reconnecting: reconnecting && !connected };
}

export default useSocket;
