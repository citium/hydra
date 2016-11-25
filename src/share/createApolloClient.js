import ApolloClient from 'apollo-client'

const createApolloClient = networkInterface => {
  const params = {
    dataIdFromObject: (result) => {
      return result._id;
    },
    networkInterface,
  };
  if (__CLIENT__) {
    params.initialState = window.__APOLLO_STATE__;
    params.ssrForceFetchDelay = 10;
  } else {
    params.ssrMode = true;
  }
  return new ApolloClient(params);
};

export default createApolloClient;
