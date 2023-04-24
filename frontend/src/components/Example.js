/**
 * This is an example of a functional react component.
 * Not intended for practical use, just for learning.
 */
import React, { useEffect, useState } from 'react';

function Example({ propValue }) {
    let [data, setData] = useState('data');

    const internalFunction = (foo) => {
        console.log(foo);
    };

    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <div>
            <p>{propValue}</p>
            <p>{data}</p>
        </div>
    );
}

export default Example;
