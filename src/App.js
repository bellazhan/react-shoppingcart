import React, { useEffect, useState } from 'react';
import {Container, Grid, Typography, Button, Toolbar, Paper, List, 
        Divider, ListItem, IconButton, Drawer, AppBar} from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  const [inCart, setInCart] = useState({});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch('./data/products.json');
      const json = await response.json();
      setData(json);
    };
    fetchProducts();
  }, []);

  function getTotal(){
    var total = 0;
    Object.entries(inCart).map(([key, value]) => {
      if (value){
        total += value.price * value.quantity;
      }
    })
    return total;
  }

  const list = () => {
    return(
    <div role="presentation">
      <List>
      {
        Object.entries(inCart).map(([key, value]) => {
          if (value.quantity > 0){
            return(
              <ListItem button key={key}>
              <CartCard prod_info={value} /> 
            </ListItem> 
            )
          }
        })
      }
      </List>
      <Divider />
      <Typography variant='h5'>Total: {format(getTotal())} </Typography>
    </div>
    )
  };

  const handleDrawerOpen = () => {
    setVisible(true);
    console.log(inCart)
  };

  const handleDrawerClose = () => {
    setVisible(false);
  };

  const CartDrawer = () => {
    return(
    <div>
      <React.Fragment>
        <AppBar position="fixed" color="primary">
          <div style={{display:'flex', flexDirection: 'row'}}>
            <Typography variant="h6" style={{flex: 6, paddingLeft: 25, paddingTop: 10, fontSize: 28}}>
              T-Shirt Shop
            </Typography>
            <div style={{display: 'flex', flex: 1}}>
              <IconButton
                color="default"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="end"
              >
                <ShoppingCartIcon />
              </IconButton>
            </div>
          </div>         
        </AppBar>
        <Drawer variant='persistent' anchor='right' open={visible} 
                style={{width: 300, flexShrink: 0}}>
          <Toolbar>
            <IconButton onClick={handleDrawerClose}>
              <ChevronRightIcon />
            </IconButton>
            <ShoppingCartIcon />
            <Typography variant="h6" noWrap>
              Shopping Cart
            </Typography>
          </Toolbar>
          {list()}
        </Drawer>
      </React.Fragment>
    </div>
    )
  }

  const CartCard = (prod_info) => {
    let item = prod_info.prod_info;
    var newCart = inCart;
    return(
    <div style={{margin: 5, display: 'flex', flexDirection:'row'}}>
      <img src={'data/products/' + item.sku + '_2.jpg'} alt={item.title} height={100}/>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Typography>{item.title}</Typography>
        <Typography>M | {item.description} </Typography>
        <Typography>Quantity: {item.quantity} </Typography>
        <Typography>{format(item.price)}</Typography>
        <div>
          <Button
            onClick={() => {
              if((item.quantity - 1) === 0){
                newCart[item.sku] = null
              }else{
                newCart[item.sku] -= 1
              }
              setInCart(newCart)
            }}
            variant='outlined'>
            -
          </Button>
          <Button onClick={() => {
            newCart[item.sku].quantity += 1
            setInCart(newCart)
          }}             
          variant='outlined'>
            +
          </Button>
        </div>
      </div>
      <Button 
          onClick={() => {
            newCart[item.sku] = null
            setInCart(newCart)
        }}>
          X
        </Button>
    </div>
    )
  }

  const Card = ({prod_info}) => {
    var newCart = inCart;
    return(
    <div style={{margin: 15, justifyContent: 'center', alignItems: 'center'}}>
      <Paper variant='outlined' style={{width: 300, height: 360}}>
        <div style={{display: 'flex', flexDirection: 'column', padding:10, alignItems:'center', justifyContent: 'center'}}>
          <img src={'data/products/' + prod_info.sku + '_2.jpg'} alt={prod_info.title}/>
          <Typography variant='h6'>{prod_info.title}</Typography>
          <Typography>{prod_info.description}</Typography>
          <Typography>{format(prod_info.price)}</Typography>
          <Sizes />
          <Button 
            onClick={() => {
              if (inCart[prod_info.sku]){
                newCart[prod_info.sku].quantity += 1;
                setInCart(newCart);
                handleDrawerOpen();
              }
              else{
                newCart[prod_info.sku] = prod_info;
                newCart[prod_info.sku].quantity = 1;
                setInCart(newCart);
                handleDrawerOpen();
              }            
            }}
          >
            Add to Cart
          </Button>
        </div>
      </Paper>
    </div>
    )
  };
  
  function format(num) {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }
  
  const Sizes = () => {
    return(
    <Grid container justify="left" spacing={1}>
        {["S", "M", "L", "XL"].map((value) => (
        <Grid key={value} item>
            <Button size='small'>{value}</Button>
        </Grid>
        ))}
    </Grid>
    )
  }

  return (
    <Container style={{display:'flex', flexDirection: 'column'}}>
      <CartDrawer />
      <div style={{display: 'flex',flexDirection: 'row', flexWrap:'wrap', justify:'center', alignItems:'center', marginTop: 100}}>
        {products.map(product => {return(<Card key={product.sku} prod_info={product} />)})}
      </div>
    </Container>
  );
};

export default App;
