import { useState, useEffect } from 'react';
import { socket } from '../socket';

/**
 * useIVVision()
 * Subscribes to the iv:vision socket event.
 * Returns { visionStatus } — null until first frame received.
 */
export function useIVVision() {
  const [visionStatus, setVisionStatus] = useState(null);

  useEffect(() => {
    const onVision = ({ status }) => setVisionStatus(status);
    socket.on('iv:vision', onVision);
    return () => socket.off('iv:vision', onVision);
  }, []);

  return { visionStatus };
}

export default useIVVision;
