import { useRef } from "react";

const useThrottle = () => {
  const throttleSeed = useRef(null);

  const throttleFunction = useRef((func, delay=200) => {
    if (!throttleSeed.current) {
      // Call the callback immediately for the first time
      func();

      throttleSeed.current = setTimeout(() => {
        throttleSeed.current = null;
      }, delay);

    }
  });

  return throttleFunction.current;
};

export default useThrottle;
