import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import WorkerList from '../components/WorkerList/WorkerList';  // Correct import for WorkerList

const WorkerListPage = () => {
    const { category } = useParams();  // Get the category from the URL params
    const [workers, setWorkers] = useState([]);
    useEffect(() => {
        // Simulate fetching workers for the given category (replace with actual API call)
        console.log(`Fetching workers for category: ${category}`);
        
        // Example: You could call an API to fetch workers based on the category
        // api.get(`/workers?category=${category}`)
        //     .then(response => {
        //         setWorkers(response.data);
        //     })
        //     .catch(error => {
        //         console.error('Error fetching workers:', error);
        //     });

        // For now, let's just simulate a list of workers
        setWorkers([
            { id: 1, name: 'John Doe', role: category, location: 'Mumbai' },
            { id: 2, name: 'Jane Smith', role: category, location: 'Delhi' }
        ]);
    }, [category]);

    return (
        <div>
            <h1>Workers in {category} category</h1>
            <WorkerList workers={workers} />  {/* Pass workers as a prop */}
        </div>
    );
};

export default WorkerListPage;
