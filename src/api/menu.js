/**상태 관리를 위해 SWR(stale-while-revalidate) 라이브러리를 사용하여 메뉴 상태를 관리하는 코드 
 * 메뉴 관련 상태 관리를 중앙 집중화하여 쉽게 접근하고 변경할 수 있도록 함
*/

import useSWR, { mutate } from 'swr';
import { useMemo, useState, useCallback } from 'react';

const initialState = {
  openedItem: 'dashboard',
  openedComponent: 'buttons',
  openedHorizontalItem: null,
  isDashboardDrawerOpened: false,
  isComponentDrawerOpened: true
};

export const endpoints = {
  key: 'api/menu',
  master: 'master',
  dashboard: '/dashboard' // server URL
};

export function useGetMenuMaster() { //메뉴 상태를 가져오는 커스텀 훅
  const { data, isLoading } = useSWR(endpoints.key + endpoints.master, () => initialState, { //useSWR를 사용하여 데이터를 가져옴
    revalidateIfStale: false, //다 false로 설정하여 데이터가 새로고침되지 않도록 한다. 
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      menuMaster: data,
      menuMasterLoading: isLoading
    }),
    [data, isLoading]
  );

  return memoizedValue;
}

export function handlerDrawerOpen(isDashboardDrawerOpened) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, isDashboardDrawerOpened };
    },
    false
  );
}

export function handlerActiveItem(openedItem) {
  // to update local state based on key

  mutate(
    endpoints.key + endpoints.master,
    (currentMenuMaster) => {
      return { ...currentMenuMaster, openedItem };
    },
    false
  );
}

// 이 훅은 상태를 관리하는 로직을 포함합니다.
export function useSetActiveItem() {
  const [activeItem, setActiveItem] = useState(null);

  const setActive = useCallback((itemId) => {
    setActiveItem(itemId);
  }, []);

  return {
    activeItem,
    setActive
  };
}
