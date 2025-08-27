import { fetchCO2Data } from '../../shared/api/api';

const MainContent: React.FC = () => {
  const data = fetchCO2Data();

  return <div>{JSON.stringify(data, null, 2)}</div>;
};
export default MainContent;
