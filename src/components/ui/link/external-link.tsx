'use client';
import Link from 'next/link';
import type { ComponentProps } from 'react';

export function ExternalLink({ href, ...rest }: ComponentProps<typeof Link>) {
  return (
    <>
      {href !== '#' && (
        <Link href={href} target="_blank" rel="noopener noreferrer" {...rest} />
      )}
      {href === '#' && (
        <div className="disabled">
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            {...rest}
            onClick={(e) => e.preventDefault()}
          />
        </div>
      )}
    </>
  );
}
