import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useLocation, useNavigate } from 'react-router-dom';
import DeliveryAddressForm from './DeliveryAddressForm';
import OrderSummary from './OrderSummary';
import axios from 'axios';
import { getAuthHeaders } from "../../../api/GetAuthHeaders";

const steps = ['Login', 'Add delivery address', 'Order summary', 'Payment'];

export default function Checkout() {
    const [activeStep, setActiveStep] = React.useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    const querySearch = new URLSearchParams(location.search);
    const step = querySearch.get("step");

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleCreateOrder = async (address) => {
        try {
            const payload = {
                city: address.city,
                street_address: address.streetAddress,
                zip_code: address.zipCode
            };

            // Gọi API tạo order
            const res = await axios.post(
                "http://localhost:8080/api/orders/",
                payload,
                { headers: getAuthHeaders() }
            );

            console.log("Order created:", res.data);

            // Nếu tạo thành công, chuyển sang step 3 (Order summary / Payment)
            navigate("/checkout?step=3");
        } catch (err) {
            // Log lỗi chi tiết
            console.error("Error creating order:", err.response?.data || err.message);

            // Có thể hiện thông báo cho user
            alert("Đặt hàng thất bại! Vui lòng thử lại.");
        }
    };


    return (
        <div className='px-10 lg:px-20'>
            <Box sx={{ width: '100%' }}>
                <Stepper activeStep={step}>
                    {steps.map((label, index) => {
                        const stepProps = {};
                        const labelProps = {};

                        return (
                            <Step key={label} {...stepProps}>
                                <StepLabel {...labelProps}>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>

                {activeStep === steps.length ? (
                    <>
                        <Typography sx={{ mt: 2, mb: 1 }}>
                            All steps completed - you&apos;re finished
                        </Typography>
                    </>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                            <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                            >
                                Back
                            </Button>
                        </Box>

                        <div className='mt-10'>
                            {step == 2 ? (
                                <DeliveryAddressForm onSubmitAddress={handleCreateOrder} />
                            ) : (
                                <OrderSummary />
                            )}
                        </div>
                    </>
                )}
            </Box>
        </div>
    );
}
