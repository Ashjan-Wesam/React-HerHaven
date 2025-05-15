import React from 'react';
import { useNavigate } from 'react-router-dom';
import DiscountForm from './DiscountForm';

const AddDiscount = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/discounts');
  };

  return (
    <div className="admin-add-discount">
      
      <DiscountForm onSuccess={handleSuccess} />
    </div>
  );
};

export default AddDiscount;
