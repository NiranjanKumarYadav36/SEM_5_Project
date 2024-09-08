import React, { useEffect, useState } from 'react';
import axios from "axios";

// Define the Item type
type Item = {
  id: number;
  name: string;
  description: string;
};

function ItemList() {
  // Specify the type for the items array
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    axios.get<Item[]>('http://127.0.0.1:8000')
      .then(response => {
        setItems(response.data);
      })
      .catch(error => {
        console.error('There was an error fetching the data!', error);
      });
  }, []);

  return (
    <div>
      <h1>Item List</h1>
      <ul>
        {items.map(item => (
          <li key={item.id}>
            {item.id}:-{item.name}{item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ItemList;