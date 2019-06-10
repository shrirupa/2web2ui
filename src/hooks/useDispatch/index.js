import store from 'src/store';

const useDispatch = (func) => ({ ...args }) => {
  store.dispatch(func(args));
};

export default useDispatch;
