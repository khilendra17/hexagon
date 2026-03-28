import { createContext, useContext, useEffect, useState } from 'react';
import { socket } from '../socket';

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const [connected, setConnected] = useState(false);
  const [lastSync, setLastSync] = useState(null);

  useEffect(() => {
    // Only attempt real WebSocket connection in non-demo mode
    const token = localStorage.getItem('smartiv_token') || '';
    const isDemo = token.startsWith('demo_jwt_token_');

    if (!isDemo) {
      socket.connect();
    }

    socket.on('connect', () => {
      setConnected(true);
      setLastSync(new Date());
    });
    socket.on('disconnect', () => setConnected(false));
    socket.on('vitals', () => setLastSync(new Date()));

    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('vitals');
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected, lastSync }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => useContext(SocketContext);
