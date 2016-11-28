import React from "react"
import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag'

//#region graphql

const LIST = gql`
query {
  location {
    list {
      _id
      updateAt
      createAt
      type
      name
      address
    }
  }
}`;

//#endregion

class Location extends React.Component {
  static propTypes = {
    loading: React.PropTypes.bool.isRequired,
    list: React.PropTypes.array,
  }
  render() {
    return <div>
      <h1>Location</h1>
      {this.list()}
    </div>
  }

  list() {
    let {loading, list} = this.props
    if (loading) {
      return "Loading"
    } else {
      return list.map(item => <div key={item._id}>{item.name} {item.address}</div>)
    }
  }
}



//#region export
export default withApollo(compose(graphql(LIST, {
  props({data}) {
    const {loading, location, updateQuery} = data
    return {
      loading,
      list: (location || {}).list || [],
      updateCountQuery: updateQuery
    };
  }
}))(Location));
//#endregion
