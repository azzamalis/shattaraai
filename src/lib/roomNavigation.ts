
import { Room } from '@/hooks/useRooms';

export interface WaitForRoomOptions {
  maxWaitTime?: number;
  pollInterval?: number;
  onProgress?: (status: string) => void;
}

export const waitForRoomAndNavigate = async (
  roomId: string,
  rooms: Room[],
  navigate: (path: string) => void,
  options: WaitForRoomOptions = {}
): Promise<boolean> => {
  const {
    maxWaitTime = 5000,
    pollInterval = 200,
    onProgress
  } = options;

  const startTime = Date.now();
  
  // Show initial progress
  onProgress?.('Creating room...');

  return new Promise((resolve) => {
    const checkRoom = () => {
      const roomExists = rooms.some(room => room.id === roomId);
      
      if (roomExists) {
        onProgress?.('Redirecting...');
        setTimeout(() => {
          navigate(`/rooms/${roomId}`);
          resolve(true);
        }, 100);
        return;
      }

      const elapsed = Date.now() - startTime;
      
      if (elapsed >= maxWaitTime) {
        onProgress?.('Timeout - room creation may have failed');
        resolve(false);
        return;
      }

      // Update progress message based on elapsed time
      if (elapsed > 1000) {
        onProgress?.('Setting up room...');
      }

      setTimeout(checkRoom, pollInterval);
    };

    checkRoom();
  });
};
