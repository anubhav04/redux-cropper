import React, {Component} from 'react';
import ReactSimpleUsageApp from './reactSimpleUsageApp';
import ReduxUsageApp from './reduxUsageApp';
import { Router, Route, Link, IndexRoute, browserHistory } from 'react-router'

class App extends Component {
  render() {
    return <div>{this.props.children}</div>;
  }
}

class Links extends Component {
  render() {
    return (<div>
    	<Link to='react'>Redux app used as react component</Link>
    	<br/>
    	<Link to='redux'>Redux app used directly as redux bundled app(Not Available for now!)</Link>
    </div>)
  }
}

React.render(
	(
	  <Router history={browserHistory}>
	    <Route path="/" component={App}>
	      <IndexRoute component={Links}/>
	      <Route path="react" component={ReactSimpleUsageApp}/>
	      <Route path="redux" component={ReduxUsageApp}/>
	    </Route>
	  </Router>
	),
	document.getElementById('root')
);
