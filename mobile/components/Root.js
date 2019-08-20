import React from 'react';
import IsLoading from './Isloading'
class Initial extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    }
  }
  componentDidMount() {
    console.log("\nRoot->componentDidMount: component is mounted")
    this.props.navigation.push('HomeScreen')
  }
  componentDidUpdate() {
    console.log("\nRoot->componentDidUpdate")
  }
  componentWillUnmount() {
    this.setState({})
  }
  render() {
    return (
      this.state.isLoading ? (
        <IsLoading isLoadingFromHome={this.state.isLoading} />
      ) : (null)
    )
  }
}
export default Initial;
