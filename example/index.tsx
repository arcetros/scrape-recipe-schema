import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
// import getRecipeData from '../dist';
import getRecipeData from 'scrape-recipe-schema';

const App = () => {
    React.useEffect(() => {
        const getData = async () => {
            const data = await getRecipeData('https://stryve.life/recipes/creamy-courgette-potato-bake');
            console.log(data);
        };
        getData();
    }, []);
    return <div>scrape-recipe-schema</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
