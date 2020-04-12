import React from 'react';
import {Container, Grid, Typography, Button} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';

const Card = ({prod_info}) => {
    return(
        <div style={{margin: 15, justifyContent: 'center', alignItems: 'center'}}>
            <Paper variant='outlined'>
                <div style={{display: 'flex', flexDirection: 'column', padding:10, alignItems:'center', justify: 'center', justifyContent: 'center'}}>
                    <img src={'data/products/' + prod_info.sku + '_2.jpg'} alt='shirt'/>
                    <Typography variant='h6'>{prod_info.title}</Typography>
                    <Typography>{prod_info.description}</Typography>
                    <Typography>{format(prod_info.price)}</Typography>
                    <Sizes />
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

export default Card;