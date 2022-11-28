import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import getRecipeData from '../.';

const App = () => {
  getRecipeData('https://stryve.life/recipes/creamy-courgette-potato-bake');
  return <div>test</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
