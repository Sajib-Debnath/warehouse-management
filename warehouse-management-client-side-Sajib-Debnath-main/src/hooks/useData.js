import { useEffect, useState } from 'react';

const useData = () => {
    const [services, setServices] = useState([]);
    useEffect(() => {
        fetch('https://calm-ravine-66676.herokuapp.com/services')
            .then(res => res.json())
            .then(data => setServices(data));
    }, []);
    return [services];
};

export default useData;