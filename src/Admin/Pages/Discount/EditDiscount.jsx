import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import DiscountForm from './DiscountForm';

const EditDiscount = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/admin/discounts');
  };

  return (
    <div className="admin-edit-discount">
      <DiscountForm discountId={id} onSuccess={handleSuccess} />
    </div>
  );
};

export default EditDiscount;
