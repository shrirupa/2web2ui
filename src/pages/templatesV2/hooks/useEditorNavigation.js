import { useMemo } from 'react';
import useRouter from 'src/hooks/useRouter';
import links from '../constants/editNavigationLinks';
import { routeNamespace } from '../constants/routes';
import { setSubaccountQuery } from '../../../helpers/subaccounts';

const useEditorNavigation = () => {
  const { history, requestParams: { id, version = 'draft', navKey = '', subaccount: subaccountId }} = useRouter();
  const setNavigation = (nextNavigationKey) => {
    history.push(`/${routeNamespace}/edit/${id}/${version}/${nextNavigationKey}${setSubaccountQuery(subaccountId)}`);
  };

  return useMemo(() => {
    let index = links.findIndex((link) => link.routeKey === navKey.toLowerCase());

    if (index === -1) { // no match
      index = 0;
    }

    return {
      currentNavigationIndex: index,
      currentNavigationKey: links[index].key,
      setNavigation
    };
  }, [navKey, setNavigation]);
};

export default useEditorNavigation;
