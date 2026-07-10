import { useLocation } from 'react-router-dom';

const useFormContext = () => {
  const location = useLocation();
  const state = location.state || {};

  const mode = state.mode || null;

  const is = (key) => mode === key;

  const get = (key, fallback = null) => {
    return state[key] ?? fallback;
  };

  return {
    mode,
    is,
    get,
    raw: state
  };
};

export default useFormContext;