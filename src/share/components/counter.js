import React from 'react'
import { graphql, compose, withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import update from 'react-addons-update'
import { Button } from 'react-bootstrap'

//#region graphql
const COUNT_UPDATE_SUBSCRIPTION = gql`
  subscription onCountUpdated {
    countUpdated {
      amount
    }
  }
`;

const GET_COUNT_QUERY = gql `
  query getCount {
    count {
      amount
    }
  }
`;

const ADD_COUNT_MUTATION = gql `
  mutation addCount(
    $amount: Int!
  ) {
    addCount(amount: $amount) {
      amount
    }
  }
`;
//#endregion

class Counter extends React.Component {
  static propTypes = {
    loading: React.PropTypes.bool.isRequired,
    count: React.PropTypes.object,
    updateCountQuery: React.PropTypes.func,
    addCount: React.PropTypes.func.isRequired,
    client: React.PropTypes.instanceOf(ApolloClient).isRequired
  };

  componentDidMount() {
    if (this.props.loading === false) {
      this.subscribe();
    }
  }

  componentWillUnmount() {
    if (this.subscriptionObserver) {
      this.subscriptionObserver.unsubscribe();
    }
  }

  subscribe() {
    const {client, updateCountQuery} = this.props;
    this.subscriptionObserver = client.subscribe({
      query: COUNT_UPDATE_SUBSCRIPTION,
      variables: {},
    }).subscribe({
      next(data) {
        updateCountQuery(prev => {
          let newAmount = data.countUpdated.amount;
          return update(prev, {
            count: {
              amount: {
                $set: newAmount,
              },
            },
          });
        });
      },
      error(err) {
        console.log(err);
      },
    });
  }

  render() {
    const {loading, count, addCount} = this.props;
    if (loading) {
      return <div> Still Loading... </div>
    } else {
      if (count.amount < 0) {
        throw new Error('OMG its negative');
      }
      return (
        <div>
          <div> Counter {count.amount} </div>
          <br />
          <Button bsStyle="primary" onClick={addCount(1)}> + </Button>
          -
          <Button bsStyle="primary" onClick={addCount(-1)}> - </Button>
        </div>
        );
    }
  }
}

//#region export
export default withApollo(compose(graphql(GET_COUNT_QUERY, {
  props({data}) {
    const {loading, count, updateQuery} = data
    return {
      loading,
      count,
      updateCountQuery: updateQuery
    };
  }
}), graphql(ADD_COUNT_MUTATION, {
  props: ({ownProps, mutate}) => ({
    addCount(amount) {
      return () => mutate({
        variables: {
          amount
        },
        updateQueries: {
          getCount: (prev, {mutationResult}) => {
            return update(prev, {
              count: {
                amount: {
                  $set: mutationResult.data.addCount.amount
                }
              }
            });
          }
        },
        optimisticResponse: {
          __typename: 'Mutation',
          addCount: {
            __typename: 'Count',
            amount: ownProps.count.amount + amount
          }
        }
      });
    }
  })
}))(Counter));
//#endregion
