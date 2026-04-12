import { useAppReady } from '../App';

export function useReadyAnimate() {
  const ready = useAppReady();
  return ready ? 'visible' : 'hidden';
}
