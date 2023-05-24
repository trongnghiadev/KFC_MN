import { createBoard } from '@wixc3/react-board';
import Users from '../../pages/Validated/Users/users';
import NoDataFound from '../../components/NoDataFound/noDataFound';

export default createBoard({
    name: 'Inventory',
    Board: () => <div>
        <NoDataFound />
    </div>
});
