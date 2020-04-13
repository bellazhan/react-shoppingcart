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

  const prod_Obj = {};
  for (let i = 0; i < products.length; i++){
    prod_Obj[products[i].sku] = products[i];
    // console.log("hey" + prod_Obj[i].sku);
  }
  // console.log("hello" + prod_Obj["12064273040195392"].title);

  // function getTotal(){
  //   var total = 0;
  //   for (var prod in inCart){
  //     total += prod.price * inCart[prod.sku];
  //   }
  //   return total;
  // }

  const list = () => {
    return(
    <div
      role="presentation"
      // onClick={setVisible(false)}
      // onKeyDown={setVisible(false)}
    >
      <List>
      {
        Object.entries(inCart).map(([key, value]) => 
        <ListItem button key={key}>
          {/* <Typography>{key} KEY {prod_Obj.key} KEY {prod_Obj["12064273040195392"].title} </Typography> */}
          {/* <CartCard prod_info = {products.key} /> */}
          <CartCard />
        </ListItem> )
      }
      </List>
      <Divider />
      {/* <Typography>Total Price: {getTotal}</Typography> */}
      <Typography>Total Price: $PP.PP</Typography>
    </div>
    )
  };

  const handleDrawerOpen = () => {
    setVisible(true);
  };

  const handleDrawerClose = () => {
    setVisible(false);
  };

  const CartDrawer = (data) => {
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

  const CartCard = () => {
    // const item = prod_Obj[prod_info]
    let prod_info = "12064273040195392";
    let item = prod_Obj["12064273040195392"]
    return(
    <div style={{margin: 5, display: 'flex', flexDirection:'row'}}>
      <img src={'data/products/' + prod_info + '_2.jpg'} alt={item.title} height={100}/>
      <div style={{display: 'flex', flexDirection: 'column'}}>
        <Typography>{item.title}</Typography>
        <Typography>Size | {item.description} </Typography>
        <Typography>Quantity: 1</Typography>
        <Typography>{format(item.price)}</Typography>
      </div>
    </div>
    )
  }

  const Card = ({prod_info}) => {
    var newCart = inCart;
    return(
    <div style={{margin: 15, justifyContent: 'center', alignItems: 'center'}}>
      <Paper variant='outlined' style={{width: 300, height: 360}}>
        <div style={{display: 'flex', flexDirection: 'column', padding:10, alignItems:'center', justify: 'center', justifyContent: 'center'}}>
          <img src={'data/products/' + prod_info.sku + '_2.jpg'} alt={prod_info.title}/>
          <Typography variant='h6'>{prod_info.title}</Typography>
          <Typography>{prod_info.description}</Typography>
          <Typography>{format(prod_info.price)}</Typography>
          <Sizes />
          <Button 
            onClick={() => {
              if (inCart[prod_info.sku]){
                newCart[prod_info.sku]++;
                setInCart({12064273040195392: {title: "HELLO", price: 30}})
              }
              else{
                newCart[prod_info.sku] = 1;
                setInCart({12064273040195392: {title: "BYE", price: 20}})
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
      <CartDrawer data={data} style={{flex: 1, float: 'right'}}/>
      <div style={{display: 'flex',flexDirection: 'row', flexWrap:'wrap', justify:'center', alignItems:'center', marginTop: 100}}>
        {products.map(product => {return(<Card key={product.sku} prod_info={product} />)})}
      </div>
    </Container>
  );
};

export default App;
