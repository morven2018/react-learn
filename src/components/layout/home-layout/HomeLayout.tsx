import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';
import { DetailCard } from '../detail-view/detailCard';

const HomeLayout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const detailsId = searchParams.get('details');
  const currentPage = searchParams.get('page') ?? '1';

  const handleCloseDetails = () => {
    const newParams = new URLSearchParams();
    newParams.set('page', currentPage);

    if (searchParams.has('search')) {
      newParams.set('search', searchParams.get('search')!);
    }

    navigate(`?${newParams.toString()}`);
  };

  return (
    <div>
      <div>
        <Outlet />
      </div>

      {detailsId && (
        <div>
          <DetailCard id={detailsId} onClose={handleCloseDetails} />
        </div>
      )}
    </div>
  );
};

export default HomeLayout;
