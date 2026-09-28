import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { ThemeClassNames } from '@docusaurus/theme-common';
import LogoLoop from './LogoLoop';

export interface FooterLayoutProps {
  style?: 'light' | 'dark';
  links?: ReactNode;
  logo?: ReactNode;
  copyright?: ReactNode;
}

export default function FooterLayout({
  style,
  links,
  logo,
  copyright,
}: FooterLayoutProps): ReactNode {
  return (
    <footer
      className={clsx(ThemeClassNames.layout.footer.container, 'footer', {
        'footer--dark': style === 'dark',
      })}>
      <div className="container container-fluid">
        {links}
        {(logo || copyright) && (
          <div className="footer__bottom footer-bottom-custom">
            {logo && <div className="margin-bottom--sm">{logo}</div>}
            {copyright && <div className="footer-copyright-container">{copyright}</div>}
            <div className="footer-partner-logos">
              <LogoLoop
                logos={[
                  {
                    src: useBaseUrl('/assets/UA.png'),
                    alt: 'Universidade de Aveiro',
                    title: 'Universidade de Aveiro',
                    href: 'https://www.ua.pt/',
                    className: 'logo-ua',
                  },
                  {
                    src: useBaseUrl('/assets/IEETA-4272665924.png'),
                    alt: 'IEETA',
                    title: 'IEETA',
                    href: 'https://www.ieeta.pt/',
                    className: 'logo-ieeta',
                  },
                ]}
                speed={85}
                direction="left"
                logoHeight={30}
                gap={24}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                ariaLabel="Institutional partner logos"
              />
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
