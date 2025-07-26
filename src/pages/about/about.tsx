import git from '@assets/logo/git.svg';
import rss from '@assets/logo/rss.svg';

export const AboutPage = () => {
  return (
    <main>
      <div>
        <h2>About page</h2>
        <p>
          <span>Done by Alena Pudina</span>
          <a
            href="https://github.com/morven2018"
            target="_blank"
            rel="noreferrer"
            aria-label="Alena Pudina GitHub profile"
          >
            <img src={git} alt="git logo" />
          </a>
        </p>
        <div>
          Completed as part of the course{' '}
          <a
            href="https://rs.school/courses/reactjs"
            target="_blank"
            rel="noreferrer"
          >
            React Course <img src={rss} alt="rss logo" />
          </a>
        </div>
      </div>
    </main>
  );
};
export default AboutPage;
