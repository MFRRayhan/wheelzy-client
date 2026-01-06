import React from "react";
import { Link } from "react-router";

const Forbidden = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-5">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-primary drop-shadow-lg">
          403
        </h1>

        <h2 className="text-3xl font-bold mt-5 text-gray-700">
          Access Forbidden
        </h2>

        <p className="mt-3 text-gray-500 max-w-md mx-auto leading-relaxed">
          Sorry! You don’t have permission to access this page. If you believe
          this is an error, please contact support.
        </p>

        <div className="mt-8 flex gap-4 justify-center">
          <Link to="/" className="btn btn-secondary text-white">
            Go Back Home
          </Link>

          <Link to="/dashboard" className="btn btn-primary text-white">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
