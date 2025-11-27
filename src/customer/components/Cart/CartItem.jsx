import React, { useState } from 'react';
import { Button, Chip } from '@mui/material';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { formatCurrency } from '../../../comon/formatCurrency';
import axios from 'axios';
import { getAuthHeaders } from '../../../api/GetAuthHeaders';
import placeholderImage from '../../../assets/images/placeholder.png';

const CartItem = ({ item, fetchCart }) => {
    const [imageError, setImageError] = useState(false);

    // Get product image with fallback
    const productImage = !imageError && item.productImageUrl
        ? item.productImageUrl
        : placeholderImage;

    const handleRemoveItem = () => {
        if (window.confirm(`Remove "${item.productName}" from cart?`)) {
            axios.delete(`http://localhost:8080/api/cartItem/${item.id}`,
                { headers: getAuthHeaders() }
            )
                .then(() => {
                    fetchCart(); // Reload cart from backend
                })
                .catch(err => console.log("Delete cart item error:", err));
        }
    };

    return (
        <div className='p-5 shadow-lg border rounded-lg mb-4 bg-white hover:shadow-xl transition-shadow'>
            <div className='flex flex-col sm:flex-row items-start gap-4'>
                {/* Product Image */}
                <div className='w-full sm:w-32 h-32 flex-shrink-0'>
                    <img
                        src={productImage}
                        className='w-full h-full object-cover object-center rounded-lg border border-gray-200'
                        alt={item.productName}
                        onError={() => setImageError(true)}
                    />
                </div>

                {/* Product Details */}
                <div className='flex-1 space-y-2'>
                    <h3 className='font-semibold text-lg text-gray-900 line-clamp-2'>
                        {item.productName}
                    </h3>

                    {/* Brand/Seller */}
                    {item.brand && (
                        <p className='text-sm text-gray-600'>
                            Brand: <span className='font-medium'>{item.brand}</span>
                        </p>
                    )}

                    {/* Color if available */}
                    {item.color && (
                        <div className='flex items-center gap-2'>
                            <span className='text-sm text-gray-600'>Color:</span>
                            <Chip
                                label={item.color}
                                size="small"
                                variant="outlined"
                            />
                        </div>
                    )}

                    {/* Quantity - Display Only */}
                    <p className='text-sm text-gray-600'>
                        Quantity: <span className='font-semibold text-gray-900'>{item.quantity}</span>
                    </p>

                    {/* Price */}
                    <div className='flex items-center gap-3 pt-2'>
                        <p className='text-lg text-gray-900'>
                            Subtotal:
                        </p>
                        <p className='font-bold text-xl text-green-600'>
                            {formatCurrency(item.price * item.quantity, '$')}
                        </p>
                        <p className='text-sm text-gray-400 line-through'>
                            {formatCurrency(item.price * item.quantity * 1.2, '$')}
                        </p>
                        <Chip
                            label="20% OFF"
                            size="small"
                            color="error"
                            sx={{ fontWeight: 600 }}
                        />
                    </div>

                    {/* Unit Price */}
                    <p className='text-xs text-gray-500'>
                        Unit price: {formatCurrency(item.price, '$')} each
                    </p>
                </div>
            </div>

            {/* Remove Button */}
            <div className='flex justify-end mt-4 pt-4 border-t border-gray-200'>
                <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<DeleteOutlineIcon />}
                    onClick={handleRemoveItem}
                    sx={{
                        textTransform: 'none',
                        fontWeight: 600
                    }}
                >
                    Remove from Cart
                </Button>
            </div>
        </div>
    );
};

export default CartItem;
