import React, { useRef } from "react";
import cn from "classnames";

export default function Popover({
  button,
  children,
  className,
  contentClassName,
  isOpen,
}) {
  const containerRef = useRef(null);

  const classes = cn(
    "c-popover o-grid",
    {
      "is-open": isOpen,
      "u-hide": !isOpen
    },
    className
  );
  const contentClasses = cn(
    "c-popover__content o-grid__item u-1/1",
    {
      "is-open": isOpen,
    },
    contentClassName
  );

  return (
    <div className={classes} ref={containerRef}>
      {button}
      {isOpen && <div className={contentClasses}>{children}</div>}
    </div>
  );
}
