import './Button.scss';

import React from 'react';

import Spinner from '../Spinner/Spinner';

type IconProps =
  | { startIcon: React.ReactElement; endIcon?: never }
  | { endIcon: React.ReactElement; startIcon?: never }
  | { endIcon?: undefined; startIcon?: undefined };

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
} & IconProps;

// eslint-disable-next-line react/display-name
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ type = 'button', className = '', isLoading = false, startIcon, endIcon, ...props }, ref): JSX.Element => {
    return (
      <button ref={ref} type={type} className={`button`} {...props}>
        {isLoading && <Spinner height="10px" />}
        {!isLoading && startIcon}
        <span className="mx-2">{props.children}</span> {!isLoading && endIcon}
      </button>
    );
  },
);

export default Button;
