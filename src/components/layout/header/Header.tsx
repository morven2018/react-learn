import darkMode from '@assets/logo/darkMode.svg';
import lightMode from '@assets/logo/lightMode.svg';
import logoDark from '@assets/images/image.png';
import logoLight from '@assets/images/imageL.png';
import style from './Header.module.scss';
import { useTheme } from '@context/useTheme';
import { Themes } from '@shared/types/responseTypes';

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={style.header}>
      <div className={style.linkWrapper}>
        <a href="/">
          <img
            src={theme === Themes.dark ? logoDark : logoLight}
            alt="White tree"
            className={style.whiteTree}
          />
        </a>
        <a href="/about" className={style.aboutPage}>
          To about page
        </a>
      </div>
      <div>
        <h1 className={style.h1}>Middle Earth</h1>
        <h2 className={style.subheader}>Search</h2>
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
        <img
          src={theme === Themes.dark ? lightMode : darkMode}
          alt={
            theme === Themes.dark
              ? 'Toggle to light theme'
              : 'Toggle to dark theme'
          }
        />
      </button>
    </header>
  );
};

export default Header;
