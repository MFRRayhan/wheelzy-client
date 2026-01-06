import React from "react";
import { useQuery } from "@tanstack/react-query";
import HeroSlider from "../components/HeroSlider";
import HowItWorks from "../components/HowItWorks";
import WhyJoin from "../components/WhyJoin";
import useAxiosSecure from "../hooks/useAxiosSecure";
import Cars from "./Cars";

const HomePage = () => {
  const axiosSecure = useAxiosSecure();

  const { data: cars = [], isLoading } = useQuery({
    queryKey: ["homeHeroCars"],
    queryFn: async () => {
      const res = await axiosSecure.get("/cars?status=approved");
      return res.data;
    },
  });

  const latestCars = cars
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 9);

  return (
    <div className="space-y-20">
      {!isLoading && <HeroSlider cars={latestCars} />}
      <Cars isFeatured={true} />
      <HowItWorks />
      <WhyJoin />
    </div>
  );
};

export default HomePage;
