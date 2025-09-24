import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { useAppDispatch } from "../../hooks/hooks";
import { getServices } from "../../services/local-service";
import ServiceCard from "../../components/services/ServiceCard";

const NewBooking = () => {
  const { services } = useSelector((state: RootState) => state.services);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getServices());
  }, [services, dispatch]);

  return (
    <div>
      {services.map((service) => (
        <ServiceCard service={service} />
      ))}
    </div>
  );
};

export default NewBooking;
