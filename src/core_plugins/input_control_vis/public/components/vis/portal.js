import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const kibanaRoot = document.getElementById('kibana-body');

export class Portal extends React.Component {
  constructor(props) {
    super(props);
    this.el = document.createElement('div');
  }

  componentDidMount() {
    kibanaRoot.appendChild(this.el);
  }

  componentWillUnmount() {
    kibanaRoot.removeChild(this.el);
  }

  render() {
    return ReactDOM.createPortal(
      this.props.children,
      this.el,
    );
  }
}
