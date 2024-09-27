const useRole = () => {
  const getIsAdmin = () => {
    //@ts-expect-error: crm_object is defined in the global scope
    if (typeof crm_object !== 'undefined') {
      //@ts-expect-error: crm_object is defined in the global scope
      return crm_object && !!crm_object.is_admin;
    }

    return true;
  }

  const getWpUserId = () => {
    //@ts-expect-error: crm_object is defined in the global scope
    if (typeof crm_object !== 'undefined') {
      //@ts-expect-error: crm_object is defined in the global scope
      return crm_object && crm_object.current_user_id;
    }

    return null;
  }

  return {
    getIsAdmin,
    getWpUserId,
  }
}

export default useRole;
