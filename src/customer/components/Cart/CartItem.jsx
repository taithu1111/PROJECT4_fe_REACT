import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Button from '@mui/material/Button'
import { formatCurrency } from '../../../comon/formatCurrency';
import axios from 'axios';
import { getAuthHeaders } from '../../../api/GetAuthHeaders';

const CartItem = ({ item, fetchCart }) => {
    const [quantity, setQuantity] = useState(item.quantity);

    const handleUpdateQuantity = (newQty) => {
        if (newQty < 1) return; // không giảm < 1
        axios.put(`http://localhost:8080/api/cartItem/${item.id}`,
            { quantity: newQty },
            { headers: getAuthHeaders() }
        )
            .then(() => {
                setQuantity(newQty);
                fetchCart(); // reload cart từ BE
            })
            .catch(err => console.log("Update quantity error:", err));
    };

    const handleRemoveItem = () => {
        axios.delete(`http://localhost:8080/api/cartItem/${item.id}`,
            { headers: getAuthHeaders() }
        )
            .then(() => {
                fetchCart(); // reload cart từ BE
            })
            .catch(err => console.log("Delete cart item error:", err));
    };

    return (
        <div className='p-5 shadow border rounded-md'>
            {/* product card info */}
            <div className='flex items-center'>
                <div className='w-[5rem] h-[5rem] lg:w-[9rem] lg:h-[9rem]'>
                    <img src={item.productImageUrl}
                        className='w-full h-full object-cover object-top'
                        alt={item.productName} />
                </div>
                <div className='ml-5 space-y-1'>
                    <p className='font-semibold'>{item.productName}</p>
                    <p className='opacity-70 mt-2'>Seller: {item.brand}</p>
                    <div className='flex space-x-5 items-center text-gray-900 pt-6 '>
                        <p className='font-semibold'>{formatCurrency(item.price)} VND</p>
                        <p className='opacity-50 line-through'>{formatCurrency(item.price * 1.1)} VND</p>
                    </div>
                </div>
            </div>

            {/* button add or remove product */}
            <div className='lg:flex items-center lg:space-x-10 pt-4'>
                <div className='flex items-center space-x-2 '>
                    <IconButton sx={{ color: "red" }} onClick={() => handleUpdateQuantity(quantity - 1)}>
                        <RemoveCircleOutlineIcon />
                    </IconButton>
                    <span className='py-1 px-7 border rounded-sm'>{quantity}</span>
                    <IconButton sx={{ color: "purple" }} onClick={() => handleUpdateQuantity(quantity + 1)}>
                        <AddCircleOutlineIcon />
                    </IconButton>
                </div>

                <div>
                    <Button sx={{ color: "purple" }} onClick={handleRemoveItem}>Remove</Button>
                </div>
            </div>
        </div>
    )
}

export default CartItem;
