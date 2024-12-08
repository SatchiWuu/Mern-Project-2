import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, Stack, Grid, Divider, Box, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext'

const Profile = () => {
  const { user } = useAuth()
  const [checkout, setCheckout] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const navigate = useNavigate();

  // Fetch checkout items from the API
  const retrieve = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:8000/order')
      setCheckout(res.data.data)
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate the total cost of the checkout items
  const calculateTotalCost = (cartItems) => {
    let total = 0;
    cartItems.forEach(order => {
      // Ensure that items and productId are properly defined before accessing them
      if (Array.isArray(order.items) && order.items.length > 0) {
        total += order.items.reduce((acc, curr) => {
          const itemPrice = curr.productId?.price || 0; // Check if price exists
          return acc + (itemPrice * curr.quantity);
        }, 0);
      }
    });
    setTotalCost(total);
  };

  useEffect(() => {
    retrieve();
  }, []);

  const handleCheckout = async () => {
    // Proceed to checkout action (This could be the same API you used for checkout)
    // For now, we'll assume that checkout will be processed and the user will be redirected.
    navigate('/order-success');  // Redirect to order success page after checkout
  };

  return (
    <div style={{ padding: '20px' }}>
  <Typography variant="h4" gutterBottom>Checkout</Typography>

  {isLoading ? (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
      <CircularProgress />
    </Box>
  ) : (
    <Grid container spacing={3}>
      {checkout.map((order, index) => (
        <Grid item xs={12} md={6} key={order._id}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Order {index + 1} - {new Date(order.createdAt).toLocaleString()}
              </Typography>

              <Typography variant="body1" color="textSecondary" gutterBottom>
                <strong>Status:</strong> {order.orderStatus}
              </Typography>

              <Typography variant="body1" gutterBottom>
                <strong>Shipping Info:</strong>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.region}, {order.shippingInfo.zip}, {order.shippingInfo.country}
              </Typography>

              {order.orderItems.length > 0 ? (
                order.orderItems.map((item) => (
                  <Box key={item._id} mb={2}>
                    <Grid container spacing={2}>
                      <Grid item xs={8}>
                        <Typography variant="h6">{item.name}</Typography>
                        <Typography variant="body2">
                          Quantity: {item.quantity}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Price: ${item.price}
                        </Typography>
                        <Typography variant="body1" color="primary" fontWeight="bold">
                          Subtotal: ${item.price * item.quantity}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Divider sx={{ marginY: 2 }} />
                  </Box>
                ))
              ) : (
                <Typography variant="h6" color="textSecondary">
                  No items in this order.
                </Typography>
              )}

              <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2}>
                <Typography variant="h6" color="primary">
                  Total: ${order.totalPrice}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )}
</div>

  );
};

export default Profile;
