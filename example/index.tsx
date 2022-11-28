import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import getRecipeData from '../.';

const App = () => {
    React.useEffect(() => {
        const getData = async () => {
            const data = await getRecipeData('https://www.hiddenvalley.com/recipe/truffalo-chicken-ranch-dip/');
            console.log(data);
        };
        getData();
    }, []);
    return <div>scrape-recipe-schema</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
