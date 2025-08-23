import style from './result.module.scss';
import { useEffect, useState } from 'react';
import { Submission } from '../../shared/types/types';

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
      if (!newSubmissions.has(lastIndex)) {
        const updatedSet = new Set(newSubmissions);
        updatedSet.add(lastIndex);
        setNewSubmissions(updatedSet);

        const timer = setTimeout(() => {
          setNewSubmissions((prev) => {
            const updated = new Set(prev);
            updated.delete(lastIndex);
            return updated;
          });
        }, 50000);

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

  return (
    <div className={style.results}>
      <h2>Results</h2>
      <div className={style.resultsList}>
        {submissions.map((submission: Submission, index: number) => {
          const isNew = newSubmissions.has(index);
          const isPasswordVisible = visiblePasswords.has(index);

          return (
            <div
              key={index}
              className={`${style.resultItem} ${isNew ? style.newItem : ''}`}
            >
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
                    onClick={() => togglePasswordVisibility(index)}
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
