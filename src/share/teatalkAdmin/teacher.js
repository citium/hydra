import React from "react"
import { graphql, compose, withApollo } from 'react-apollo'
import ApolloClient from 'apollo-client'
import gql from 'graphql-tag'
import update from 'react-addons-update'

//#region graphql

const LIST = gql`
query {
  teacher {
    list {
      _id
      updateAt
      createAt
      type
      name
    }
  }
}`;

//#endregion

class Teacher extends React.Component {
  static propTypes = {
    loading: React.PropTypes.bool.isRequired,
    list: React.PropTypes.array,
  };
  render() {
    return <div>
      <h1>Teacher</h1>
      {this.list()}
    </div>
  }

  list() {
    let {loading, list} = this.props
    if (loading) {
      return "Loading"
    } else {
      return list.map(item => <div key={item._id}>{item.name}</div>)
    }
  }
}

//#region export
export default withApollo(compose(graphql(LIST, {
  props({data}) {
    const {loading, teacher, updateQuery} = data
    return {
      loading,
      list: (teacher || {}).list || [],
      updateCountQuery: updateQuery
    };
  }
}))(Teacher));
//#endregion
