import React, { useEffect, useState } from 'react';
import Card from './Components/Card';
import {Container} from '@material-ui/core';

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  return (
    <Container style={{display:'flex', flexDirection: 'row'}}>
      <div style={{display: 'flex', flexDirection: 'row', flexWrap:'wrap', justify:'center', alignItems:'center'}}>
        {products.map(product => {return(<Card prod_info={product} />)})}
      </div>
    </Container>
  );
};

export default App;
