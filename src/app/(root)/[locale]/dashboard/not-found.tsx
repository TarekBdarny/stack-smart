import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div>
      ops... you are not allowed here
      <div>
        <Link href={`/`}>Back home</Link>
      </div>
    </div>
  );
};

export default NotFound;
