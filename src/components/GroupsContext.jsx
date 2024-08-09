import { createContext } from 'react';

const GroupContext = createContext([{id: -1, name: 'All Groups', totalSprints: 0}]);

export default GroupContext;