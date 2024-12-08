import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import toast from 'react-hot-toast';

export default function DataGridDemo() {
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [productData, setProductData] = useState({ title: '', description: '', price: '', images: [] });
  const [editingProductId, setEditingProductId] = useState(null);
  const [imagePreview, setImagesPreview] = useState([])

  const retrieve = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/product');
      setRows(res.data.data);
      console.log(res.data.data)
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    retrieve();
  }, []);

  const createProduct = async () => {
    try {
      await axios.post('http://localhost:8000/api/product', productData);
      setOpenDialog(false);
      toast.success('Success! Product has been created.')
      retrieve();
    } catch (e) {
      toast.error('Something went wrong! Could not create Product.')
    }
  };

  const onChange = e => {
    const files = Array.from(e.target.files)
    const newImages = [];
    setImagesPreview([]);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview(oldArray => [...oldArray, reader.result])
          newImages.push(reader.result);
        }
      }
      reader.readAsDataURL(file)
    })
    setProductData((prevState) => ({
      ...prevState,
      images: newImages,
    }));
  }

  const updateProduct = async () => {
    try {
      await axios.put(`http://localhost:8000/api/product/${editingProductId}`, productData);
      setOpenDialog(false);
      toast.success('Success! Product has been updated.')
      retrieve();
    } catch (e) {
      toast.error('Soemthing went wrong! Could not update Product.')
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:8000/api/product/${productId}`);
      toast.success("Successful! Product has been deleted.")
      retrieve();
    } catch (e) {
      toast.error('Something went wrong! Could not delete product.')
      console.error(e);
    }
  };

  const openDialogForEdit = (product) => {
    setProductData({
      title: product?.title || '',
      description: product?.description || '',
      price: product?.price || '',
      images: []
    });
    setEditingProductId(product?._id || null);
    setOpenDialog(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const columns = [
    { field: '_id', headerName: 'ID', width: 200 },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'price', headerName: 'Price', type: 'number', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => openDialogForEdit(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => deleteProduct(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      ),
      flex: 1,
    },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Box sx={{ marginBottom: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={() => openDialogForEdit(null)}>
          Create New Product
        </Button>
      </Box>

      <Box sx={{ height: 400 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row._id}
          pageSizeOptions={[5]}
          initialState={{
            pagination: { paginationModel: { pageSize: 5 } },
          }}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editingProductId ? 'Edit Product' : 'Create New Product'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Title"
            name="title"
            value={productData.title}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Description"
            name="description"
            value={productData.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            label="Price"
            name="price"
            type="number"
            value={productData.price}
            onChange={handleInputChange}
            fullWidth
          />
          <input type="file" onChange={onChange}
            multiple />
          <div className="images">
            {
              imagePreview.map((image, index) => (
                <img className='img-preview' key={index} src={image} alt="Product Image" />
              ))
            }
          </div>
          <div className="images">
            {
              imagePreview.map((image, index) => (
                <img className='img-preview' key={index} src={image} alt="Product Image" />
              ))
            }
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary">
            Cancel
          </Button>
          <Button
            onClick={editingProductId ? updateProduct : createProduct}
            variant="contained"
            color="primary"
          >
            {editingProductId ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
