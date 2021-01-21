import React from 'react';


type ErrorBounderProps = {
  placeholder: React.ReactElement
}

type ErrorBounderState = {
  hasError: boolean
}

export class ErrorBounder extends React.Component<ErrorBounderProps, ErrorBounderState> {
  constructor(props: ErrorBounderProps) {
    super(props);
  }

  state = {
    hasError: false
  }

  static getDerivedStateFromError(error: any) {
    return {hasError: true};
  }

  componentDidCatch(error: any, info: any)  {
    console.log(error, info);
  }

  render() {
    if(this.state.hasError) return this.props.placeholder; 

    return this.props.children;
  }
}