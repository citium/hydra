import { browserHistory } from 'react-router'

export default function go(link) {
  return (event) => {
    browserHistory.push(link)
    event.preventDefault();
  }
}
