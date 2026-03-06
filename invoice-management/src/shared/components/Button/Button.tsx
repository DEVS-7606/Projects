import React from 'react';
import './Button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    children,
    className = '',
    ...props
}) => {
    const buttonClassName = `btn btn-${variant} btn-${size} ${className}`.trim();

    return (
        <button className={buttonClassName} {...props}>
            {children}
        </button>
    );
};

export default Button;
