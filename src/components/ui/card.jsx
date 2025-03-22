import React from "react";

const Card = ({ children, className = "" }) => (
  <div className={`border rounded-lg shadow-md p-4 bg-white ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }) => (
  <div className="m-4 pb-2 mb-3">{children}</div>
);

const CardTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

const CardContent = ({ children }) => <div>{children}</div>;

export { Card, CardHeader, CardTitle, CardContent };
