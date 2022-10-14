import React, {useEffect} from 'react';
import axios from 'axios'


function Example() {
    useEffect(() => {
        axios.get('/api/test').then()
    }, [])

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Example Component asdfg</div>

                        <div className="card-body">I'm an example component!</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Example;
