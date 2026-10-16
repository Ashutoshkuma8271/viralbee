import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  showTagline?: boolean;
}

const markSize = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10 lg:h-12 lg:w-12',
  lg: 'h-12 w-12 sm:h-14 sm:w-14',
  xl: 'h-16 w-16 sm:h-20 sm:w-20',
};

const wordSize = {
  sm: 'text-lg',
  md: 'text-[22px] lg:text-[26px]',
  lg: 'text-2xl sm:text-3xl',
  xl: 'text-3xl sm:text-4xl',
};

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showWordmark = true,
  showTagline = false,
}) => {
  return (
    <div className={`flex select-none items-center gap-3 ${className}`}>
      <img
        src="/logo.svg"
        alt=""
        aria-hidden="true"
        width={40}
        height={40}
        className={`${markSize[size]} shrink-0 object-contain`}
        loading="eager"
        decoding="async"
      />

      {showWordmark && (
        <div className="flex flex-col justify-center text-left">
          <span className={`font-display font-semibold leading-none text-white ${wordSize[size]}`}>
            Vyral <span className="text-gold">Bee</span>
          </span>
          {showTagline && (
            <span className="mt-1.5 text-xs font-medium text-white/60">Create, connect, convert</span>
          )}
        </div>
      )}
    </div>
  );
};
