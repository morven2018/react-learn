import style from './result.module.scss';
import { useEffect, useState } from 'react';
import { Submission } from '../../shared/types/types';

const delay = 20000;

type ResultsProps = {
  submissions: Submission[];
};

function Results({ submissions }: Readonly<ResultsProps>) {
  const [newSubmissions, setNewSubmissions] = useState<Set<number>>(new Set());
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    if (submissions.length > 0) {
      const lastIndex = submissions.length - 1;
      const lastSubmission = submissions[lastIndex];

      const isNew = Date.now() - lastSubmission.timestamp < delay;

      if (isNew && !newSubmissions.has(lastIndex)) {
        const updatedSet = new Set(newSubmissions);
        updatedSet.add(lastIndex);
        setNewSubmissions(updatedSet);

        const timer = setTimeout(() => {
          setNewSubmissions((prev) => {
            const updated = new Set(prev);
            updated.delete(lastIndex);
            return updated;
          });
        }, delay);

        return () => clearTimeout(timer);
      }
    }
  }, [submissions, newSubmissions]);

  const togglePasswordVisibility = (index: number) => {
    setVisiblePasswords((prev) => {
      const updated = new Set(prev);
      if (updated.has(index)) {
        updated.delete(index);
      } else {
        updated.add(index);
      }
      return updated;
    });
  };

  const maskPassword = (password: string) => {
    return '*'.repeat(password.length);
  };

  if (submissions.length === 0) {
    return (
      <div className={style.results}>
        <h2>Results</h2>
        <p>No submissions yet</p>
      </div>
    );
  }

  const reversedSubmissions = [...submissions].reverse();

  return (
    <div className={style.results}>
      <h2>Results ({submissions.length})</h2>
      <div className={style.resultsList}>
        {reversedSubmissions.map((submission: Submission, index: number) => {
          const originalIndex = submissions.length - 1 - index;
          const isNew = newSubmissions.has(originalIndex);
          const isPasswordVisible = visiblePasswords.has(originalIndex);

          return (
            <div
              key={`${submission.timestamp}-${originalIndex}`}
              className={`${style.resultItem} ${isNew ? style.newItem : ''}`}
            >
              {isNew && <div className={style.newIndicator}>NEW</div>}

              <div className={style.resultHeader}>
                <strong>Form Type:</strong> {submission.type}
              </div>

              <div className={style.resultContent}>
                <div className={style.field}>
                  <strong>Name:</strong> {submission.name}
                </div>
                <div className={style.field}>
                  <strong>Email:</strong> {submission.email}
                </div>
                <div className={style.field}>
                  <strong>Age:</strong> {submission.age}
                </div>
                <div className={style.field}>
                  <strong>Gender:</strong> {submission.gender}
                </div>
                <div className={style.field}>
                  <strong>Country:</strong> {submission.country}
                </div>
                <div className={style.passwordField}>
                  <strong>Password:</strong>
                  <span className={style.passwordValue}>
                    {isPasswordVisible
                      ? submission.password
                      : maskPassword(submission.password)}
                  </span>
                  <button
                    type="button"
                    className={style.togglePassword}
                    onClick={() => togglePasswordVisibility(originalIndex)}
                    aria-label={
                      isPasswordVisible ? 'Hide password' : 'Show password'
                    }
                  >
                    {isPasswordVisible ? 'Hide' : 'Show'}
                  </button>
                </div>
                {submission.picture && (
                  <div className={style.field}>
                    <strong>Picture:</strong>
                    <img
                      src={submission.picture}
                      alt="Profile"
                      className={style.profileImage}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Results;
