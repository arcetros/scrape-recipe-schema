import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import getRecipeData from '../dist';
// import getRecipeData from 'scrape-recipe-schema';

const App = () => {
    React.useEffect(() => {
        const getData = async () => {
            const data = await getRecipeData({ url: 'https://stackoverflow.com/questions/62162731/skipping-loop-iteration-after-catch-javascript' });
            console.log(data);
        };
        getData();
    }, []);
    return <div>scrape-recipe-schema</div>;
};

ReactDOM.render(<App />, document.getElementById('root'));
