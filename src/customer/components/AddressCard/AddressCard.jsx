import React from 'react'

const AddressCard = ({ address }) => {
    // Default values if address is not provided
    const defaultAddress = {
        firstName: "",
        lastName: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        phoneNumber: "",
    };

    const addr = address || defaultAddress;

    return (
        <div>
            <div className='space-y-3'>
                <p className='font-semibold'>
                    {addr.firstName || addr.lastName
                        ? `${addr.firstName} ${addr.lastName}`.trim()
                        : "Your Name"}
                </p>
                <p>
                    {addr.address || addr.city || addr.state || addr.zip
                        ? `${addr.address}${addr.city ? ', ' + addr.city : ''}${addr.state ? ', ' + addr.state : ''}${addr.zip ? ' ' + addr.zip : ''}`
                        : "Your address will appear here"}
                </p>
                <div className='space-y-1'>
                    <p className='font-semibold'>Phone Number</p>
                    <p>{addr.phoneNumber || "Not provided"}</p>
                </div>
            </div>
        </div>
    );
};

export default AddressCard