import { Text, View, ScrollArea } from "@nodegui/react-nodegui";
import React from "react";

class ErrorBoundary extends React.Component<any, any> {
  constructor(props:{}) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }
  
  componentDidCatch(error:any, errorInfo:any) {
    // Catch errors in any components below and re-render with error message
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
    // You can also log error messages to an error reporting service here
  }
  
  render() {
    if (this.state?.errorInfo) {
      console.log(this.state.error && this.state.error.toString());
      console.log(this.state.errorInfo.componentStack);
      return (
        <ScrollArea>
          <Text>
            Something went wrong.
          </Text>
        </ScrollArea>
      );
    }
    return this.props.children;
  }  
}

export default ErrorBoundary;