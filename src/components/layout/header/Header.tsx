import Image from 'next/image';
import darkMode from '@assets/logo/darkMode.svg';
import lightMode from '@assets/logo/lightMode.svg';
import logoDark from '@assets/images/image.png';
import logoLight from '@assets/images/imageL.png';
import style from './header.module.scss';
import { useTheme } from '@context/use-theme';
import { Themes } from '@shared/types/response-types';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={style.header}>
      <div className={style.controls}>
        <div className={style.linkWrapper}>
          <a href="/">
            <Image
              src={theme === Themes.dark ? logoDark : logoLight}
              alt="White tree"
              className={style.whiteTree}
            />
          </a>
          <a href="/about" className={style.aboutPage}>
            To about page
          </a>
        </div>
        <button
          onClick={toggleTheme}
          className={style.themeButton}
          aria-label={
            theme === Themes.dark
              ? 'Switch to light theme'
              : 'Switch to dark theme'
          }
        >
          <Image
            src={theme === Themes.dark ? lightMode : darkMode}
            width={24}
            height={24}
            alt={
              theme === Themes.dark
                ? 'Toggle to light theme'
                : 'Toggle to dark theme'
            }
          />
        </button>
      </div>
      <div>
        <h1 className={style.h1}>Middle Earth</h1>
        <h2 className={style.subheader}>Search</h2>
      </div>
    </header>
  );
};

export default Header;
