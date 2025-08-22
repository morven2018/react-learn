import { Submission } from '../../shared/types/types';

type ResultsProps = {
  submissions: Submission[];
};

function Results({ submissions }: Readonly<ResultsProps>) {
  if (submissions.length === 0) {
    return (
      <div className="results">
        <h2>Result</h2>
      </div>
    );
  }

  return (
    <div className="results">
      <h2>Result</h2>
      {submissions.map((submission: Submission, index: number) => (
        <div key={index} className="result-item">
          <strong>form:</strong> {submission.type}
          <br />
          <strong>name:</strong> {submission.name}
        </div>
      ))}
    </div>
  );
}

export default Results;
