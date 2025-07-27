import git from '@assets/logo/git.svg';
import rss from '@assets/logo/rss.svg';
import style from './about.module.scss';

export const AboutPage = () => {
  return (
    <main>
      <div className={style.aboutPage}>
        <h2 className={style.header}>About page</h2>
        <p className={style.data}>
          <span>Done by Alena Pudina</span>
          <a
            href="https://github.com/morven2018"
            target="_blank"
            rel="noreferrer"
            aria-label="Alena Pudina GitHub profile"
            className={style.link}
          >
            <img src={git} alt="git logo" />
          </a>
        </p>
        <div className={style.data}>
          Completed as part of the course{' '}
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noreferrer"
            className={style.link}
          >
            React Course <img src={rss} alt="rss logo" />
          </a>
        </div>
      </div>
    </main>
  );
};
export default AboutPage;
