import React, { useState, useEffect } from "react";
import { Spin } from "antd";
import Image from "next/image";
import Check from "/public/check.gif";

export default function Loader() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    // Function to update value from 0 to 100 in 300ms
    const updateValue = () => {
      const targetValue = 100;
      const duration = 2000;
      const interval = duration / targetValue;

      let currentValue = 0;

      const timer = setInterval(() => {
        currentValue += 1;
        setValue(currentValue);

        if (currentValue >= targetValue) {
          clearInterval(timer);
        }
      }, interval);
    };

    updateValue();

    return () => {
     
    };
  }, []);
  const barStyle = {
    width: `${value * 7}px`,
  };
  return (
    <div className="mx-60 max-sm:mx-4 max-sm:mt-40">
      <div className="m-auto block ">
        {value == 100 ? (
          <div>
            <Image src={Check} className="m-auto block rounded-full" />
          </div>
        ) : (
          <Spin size="large" className="my-5 m-auto block" />
        )}
      </div>
      {value == 100 ? (
        <p className="text-center text-sm text-gray-600">Successful</p>
      ) : (
        <p className="text-center text-sm text-gray-600">
          Please wait a moment Loading........
        </p>
      )}
      <div className="mt-10">
        <p className="text-center font-bold">{value}%</p>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <div style={barStyle} className="h-2 bg-blue-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
