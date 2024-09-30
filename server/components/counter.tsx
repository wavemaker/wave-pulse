"use client";

import * as React from "react";
import { Button } from "@nextui-org/button";

export const Counter = () => {
  const [count, setCount] = React.useState(0);

  return (
    <Button radius="full" onPress={() => setCount(count + 1)}>
      Count is {count}
    </Button>
  );
};
