import React from "react"
import { graphql, compose, withApollo } from 'react-apollo'
import gql from 'graphql-tag'


//#region graphql

const LIST = gql`
query {
  student {
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


class Student extends React.Component {
  static propTypes = {
    loading: React.PropTypes.bool.isRequired,
    list: React.PropTypes.array,
  }
  render() {
    return <div>
      <h1>Student</h1>
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
    const {loading, student, updateQuery} = data
    return {
      loading,
      list: (student || {}).list || [],
      updateCountQuery: updateQuery
    };
  }
}))(Student));
//#endregion
