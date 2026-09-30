import "../../../css/footer.css";
import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { ThemeClassNames } from '@docusaurus/theme-common';

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
            
            <div className="footer-partner-logos" style={{ display: 'flex', gap: '1rem' }}>
              <a href="https://www.ua.pt/" target="_blank" rel="noopener noreferrer" className="footer-logo-link">
                <img src={useBaseUrl('/assets/UA.png')} alt="Universidade de Aveiro" className="footer-logo-img logo-ua" />
              </a>
              <a href="https://www.ieeta.pt/" target="_blank" rel="noopener noreferrer" className="footer-logo-link">
                <img src={useBaseUrl('/assets/IEETA-4272665924.png')} alt="IEETA" className="footer-logo-img logo-ieeta" />
              </a>
            </div>
          </div>
        )}
      </div>
    </footer>
  );
}
