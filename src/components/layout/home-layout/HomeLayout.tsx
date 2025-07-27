import ErrorTestButton from '@components/ui/error-button/ErrorTestButton';
import style from './HomeLayout.module.scss';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { DetailCard } from '../detailView/DetailCard';

const HomeLayout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const detailsId = searchParams.get('details');
  const currentPage = searchParams.get('page') ?? '1';
  const searchQuery = searchParams.get('search');

  const handleCloseDetails = () => {
    const newParams = new URLSearchParams();
    newParams.set('page', currentPage);

    if (searchQuery) {
      newParams.set('search', searchQuery);
    }

    navigate(`?${newParams.toString()}`);
  };

  return (
    <>
      <div className={style.layout}>
        <div className={style.outlet}>
          <Outlet />
        </div>

        {detailsId && (
          <div className={style.detail}>
            <DetailCard id={detailsId} onClose={handleCloseDetails} />
          </div>
        )}
      </div>

      <ErrorTestButton />
    </>
  );
};

export default HomeLayout;
