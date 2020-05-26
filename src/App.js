import React, { useEffect, useState } from 'react';
import {Container, Grid, Typography, Button, Toolbar, Paper, List, 
        Divider, ListItem, IconButton, Drawer, AppBar} from '@material-ui/core';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
// import inven from '../inventory.json';
import firebase from './Firebase'
// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

const db = firebase.database().ref();

const App = () => {
  const [data, setData] = useState({});
  const products = Object.values(data);
  const [inCart, setInCart] = useState({});
  const [visible, setVisible] = useState(false);
  const [inventory, setInventory] = useState({});

  useEffect(() => {
    const handleData = snap => {
      if (snap.val()) setInventory(snap.val());
    };
    db.on('value', handleData, error => alert(error));
    return () => { db.off('value', handleData); };
  }, []);

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
      const quantity = getCartShirts(value)
      if (value){
        total += value.price * quantity;
      }
    })
    return total;
  }

  const CartList = () => {
    return(
    <div role="presentation">
      <List>
      {
        Object.entries(inCart).map(([key, value]) => {
          if (value){
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
  };

  const handleDrawerClose = () => {
    setVisible(false);
  };

  const handleNewCart = (newCart) => {
    setInCart(newCart);
    setVisible(true);
  }

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
          <CartList />
        </Drawer>
      </React.Fragment>
    </div>
    )
  }

  const getCartShirts = (item) => {
    var count = 0;
    if (item){
      if(item.S){
        count += item.S;
      }
      if(item.M){
        count += item.M;
      }
      if(item.L){
        count += item.L;
      }
      if(item.XL){
        count += item.XL;
      } 
    }    
    return count;
  }

  const CartCard = (prod_info) => {
    let item = prod_info.prod_info;
    const numItem = getCartShirts(item);
    var newCart = inCart;
    return(
    <div style={{margin: 5, display: 'flex', flexDirection:'row'}}>
      <img src={'data/products/' + item.sku + '_2.jpg'} alt={item.title} height={100}/>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Typography>{item.title}</Typography>
        <Typography>{item.description} </Typography>
        <Typography>Quantity: {numItem} </Typography>
        <Typography>{format(item.price)}</Typography>
      </div>
      <Button 
          onClick={() => {
            const returned = item
            {['S', 'M', 'L', 'XL'].map(size => {
              if(returned.size){
                db.child(returned.sku).child(size).update(inventory[returned.sku].size += returned.size)
                .catch(error => alert(error));
              }
            })}
            newCart[item.sku] = null
            handleNewCart(newCart)
        }}>
          X
        </Button>
    </div>
    )
  }

  const Card = ({prod_info}) => {
    var newCart = inCart;
    const numShirts = getNumShirts(inventory[prod_info.sku.toString()]);
    return(
    <div style={{margin: 15, justifyContent: 'center', alignItems: 'center'}}>
      <Paper variant='outlined' style={{width: 300, height: 360}}>
        <div style={{display: 'flex', flexDirection: 'column', padding:10, alignItems:'center', justifyContent: 'center'}}>
          <img src={'data/products/' + prod_info.sku + '_2.jpg'} alt={prod_info.title}/>
          <Typography variant='h6'>{prod_info.title}</Typography>
          <Typography>{prod_info.description}</Typography>
          <Typography>{format(prod_info.price)}</Typography>
          {numShirts === 0 ? 
          <Typography variant='h6'>Out of Stock</Typography> :
          <Grid container spacing={1}>
            {Object.keys(inventory[prod_info.sku.toString()]).map((value) => {
              return(
                <Grid key={value} item>
                  {inventory[prod_info.sku.toString()][value] === 0 ? <div /> :
                  <Button 
                  onClick={() => {
                    db.child(prod_info.sku).child(value).update(inventory[prod_info.sku.toString()][value]-=1)
                    .catch(error => alert(error));
                    if (inCart[prod_info.sku] && inCart[prod_info.sku][value]){
                      newCart[prod_info.sku][value] += 1;
                      handleNewCart(newCart);
                      handleDrawerOpen();
                    }
                    else{
                      newCart[prod_info.sku] = prod_info;
                      newCart[prod_info.sku][value] = 1;
                      handleNewCart(newCart);
                      handleDrawerOpen();
                    }          
                  }} 
                  size='small'>
                    {value}
                  </Button>}
                </Grid>
              )}
            )}
          </Grid>
          } 
        </div>
      </Paper>
    </div>
    )
  };
  
  function format(num) {
    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  const getNumShirts = (data) => {
    var count = 0;
    for(var d in data){
      count += data[d]
    }
    return count
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
