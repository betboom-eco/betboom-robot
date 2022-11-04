import React from 'react';
import { Icon, IconProps } from './Icon';

interface CreateIconOptions {
  path: React.ReactElement | React.ReactElement[];
  rectFill?: string;
}

/**
 * Convenience function around the Icon component for making icons.
 */
export function createIcon(options: CreateIconOptions) {
  const { path, rectFill } = options;

  return React.forwardRef<SVGSVGElement, IconProps>((props, ref) => {
    const { badgeRadius = 8, ...rest } = props;

    return (
      <Icon {...rest} ref={ref}>
        {rectFill && (
          <rect height="24" width="24" rx={badgeRadius} fill={rectFill} />
        )}
        {path}
      </Icon>
    );
  });
}
