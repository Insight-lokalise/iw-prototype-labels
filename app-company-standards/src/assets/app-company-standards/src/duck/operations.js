import setToolkitLabels from "@insight/toolkit-react/lib/utils/setToolkitLabels";
import { i18n, getCurrentLocale } from "@insight/toolkit-utils";
import {
  addCache,
  delTag,
  failInitialLoad,
  getInitialLoad,
  removeCache,
  reorderCategory,
  reorderProductGroup,
  saveDifferentWebGroupCategories,
  saveCategories,
  saveCategoryOrder,
  saveInitialLoad,
  saveIpsContracts,
  saveLabFees,
  saveManagerFlag,
  saveProductGroups,
  saveProductSetItems,
  deleteProductSetItems,
  saveProductSets,
  saveSettings,
  saveTags,
  saveWebGroupId,
  publishAllFlush,
} from "./actions";
import { selector_cache, selector_locale, selector_wId } from "./selectors";
import {
  deleteCategory,
  deleteProductGroup,
  deleteProductSet,
  deleteTag,
  fetchCategories,
  fetchCategory,
  fetchIpsContracts,
  fetchLabFeesByLabConfig,
  fetchProductGroup,
  fetchProductGroupsByCategory,
  fetchProductsByProductSet,
  fetchProductSet,
  fetchProductSetsByProductGroup,
  fetchSettings,
  fetchTags,
  getTranslations,
  postCategory,
  postDuplicate,
  postMaterialIdsValidation,
  postProductGroup,
  postProductSet,
  putSettings,
  postTag,
  putCategory,
  putProductGroup,
  putProductList,
  putProductSet,
  putPublish,
  putPublishAll,
  reorderCategories,
  reorderProductGroups,
  reorderProductSets,
} from "../api";

export function changeCategoryOrder(order) {
  return (dispatch, getState) => {
    const wId = selector_wId(getState());
    dispatch(saveCategoryOrder(order));
    reorderCategories({ order, wId })
      .then((response) => {
        const { id } = response;
        dispatch(saveCategories({ [id]: response }));
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
  };
}

export function changeProductGroupOrder({ order, categoryId }) {
  return (dispatch) => {
    dispatch(reorderCategory(categoryId, order));
    reorderProductGroups({ order, categoryId })
      .then((response) => {
        const { id } = response;
        dispatch(saveProductGroups({ [id]: response }));
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
  };
}

export function changeProductSetOrder({ order, productGroupId }) {
  return (dispatch) => {
    dispatch(reorderProductGroup(productGroupId, order));
    reorderProductSets({ order, productGroupId })
      .then((response) => {
        const { id } = response;
        dispatch(saveProductSets({ [id]: response }));
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
  };
}

export function duplicateCategory(formData, messenger, sameWebgroup) {
  return (dispatch, getState) =>
    postDuplicate({
      formData,
      type: "categories",
      messenger,
    }).then((newCategory) => {
      const loggedInWebGroupId = Number(selector_wId(getState()));
      console.log(loggedInWebGroupId, newCategory.parents[0])
      // if we are changing the logged in web group we must update the application state
      if (sameWebgroup || newCategory.parents[0] === loggedInWebGroupId) {
        const { id } = newCategory;
        const nextCategoryOrder = [...getState().categoryOrder, id];
        dispatch(saveCategories({ [id]: newCategory }));
        dispatch(saveCategoryOrder(nextCategoryOrder));
      }
    });
}

export function duplicateProductGroup(formData, messenger, sameWebgroup, categoryId) {
  return (dispatch, getState) =>
    postDuplicate({
      formData,
      type: "productGroups",
      messenger,
    }).then((newProductGroup) => {
      const loggedInWebGroupId = Number(selector_wId(getState()));
      // if we are changing the logged in web group we must update the application state
      if (sameWebgroup || newProductGroup.parents[0] === loggedInWebGroupId) {
        dispatch(saveProductGroups({ [newProductGroup.id]: newProductGroup }));
        dispatch(getCategory({ categoryId }));
        dispatch(saveDifferentWebGroupCategories({}));
      }
    });
}

export function duplicateProductSet(formData, messenger, isManagerView) {
  return (dispatch, getState) =>
    postDuplicate({
      formData,
      type: "productSets",
      messenger,
    }).then((newProductSet) => {
      // if we are changing the logged in web group we must update the application state
      dispatch(saveProductSets({ [newProductSet.id]: newProductSet }));
      const payload = { productGroupId: newProductSet.parents[2] }
      if (!isManagerView) payload.wId = loggedInWebGroupId
      dispatch(getProductGroup(payload));
    });
}

// These 3 operations are used for creating or editing categories, product groups, & product sets.
// The first dispatch saves the entry with a unique ID as the key.
// The second, conditional, dispatch modifies the order property of the parent to contain a reference to the ID for the entry.
// This occurs because each category contains an order property that is an array of product group IDs.
// When rendering a product group, you can iterate over the order array of the category and reference each ID in the productGroups object of the redux store.

export function createCategory({ category, messenger }) {
  return (dispatch, getState) =>
    postCategory({ category, wId: selector_wId(getState()), messenger })
      .then((newCategory) => {
        const { id } = newCategory;
        dispatch(saveCategories({ [id]: newCategory })); // 1st
        const order = [id, ...getState().categoryOrder];
        dispatch(saveCategoryOrder(order)); // 2nd
        return newCategory;
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
}

export function editCategory({ category, categoryId, messenger }) {
  return (dispatch, getState) =>
    putCategory({
      category,
      categoryId,
      wId: selector_wId(getState()),
      messenger,
    })
      .then((updatedCategory) => {
        dispatch(saveCategories({ [categoryId]: updatedCategory })); // 1st
        return updatedCategory;
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
}

export function createProductGroup({
  parentCategoryId,
  productGroup,
  messenger,
}) {
  return (dispatch) =>
    postProductGroup({ productGroup, categoryId: parentCategoryId, messenger })
      .then((newProductGroup) => {
        const { id } = newProductGroup;
        dispatch(saveProductGroups({ [id]: newProductGroup }));
        dispatch(getCategory({ categoryId: parentCategoryId }));
        return newProductGroup;
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
}

export function editProductGroup({ productGroup, currentId, messenger }) {
  return (dispatch) =>
    putProductGroup({ productGroup, productGroupId: currentId, messenger })
      .then((updatedProductGroup) => {
        dispatch(saveProductGroups({ [currentId]: updatedProductGroup }));
        dispatch(
          deleteProductSetItems({ productSetIds: updatedProductGroup.order })
        );
        return updatedProductGroup;
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
}

export function createProductSet({
  parentProductGroupId,
  productSet,
  messenger,
}) {
  return (dispatch, getState) => {
    const locale = selector_locale(getState());
    return postProductSet({
      productSet,
      productGroupId: parentProductGroupId,
      messenger,
      locale
    })
      .then((newProductSet) => {
        const { id } = newProductSet;
        dispatch(saveProductSets({ [id]: newProductSet }));
        dispatch(
          getProductGroup({
            productGroupId: parentProductGroupId,
            wId: selector_wId(getState()),
          })
        );
        return newProductSet;
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });}
}

export function editProductSet({ productSet, productSetId, messenger }) {
  return (dispatch, getState) => {
    const locale = selector_locale(getState());
    return putProductSet({ productSet, productSetId, messenger, locale })
      .then((updatedProductSet) => {
        dispatch(saveProductSets({ [productSetId]: updatedProductSet }));
        dispatch(deleteProductSetItems({ productSetIds: [productSetId] }));
        return updatedProductSet;
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
  }
}

export function editSettings(newSettings, messenger) {
  return (dispatch, getState) =>
    putSettings({
      settings: newSettings,
      wId: selector_wId(getState()),
      messenger,
    }).then((data) => {
      dispatch(saveSettings(data));
    });
}

export function editTag({ tag, tagId }) {
  return (dispatch, getState) =>
    postTag({ tag, tagId, wId: selector_wId(getState()) })
      .then(({ data }) => {
        dispatch(saveTags(arrayToMap([data])));
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
}

export function getInitialData({ wId, isManagerView }) {
  return (dispatch) => {
    dispatch(saveWebGroupId(Number(wId)));
    const INSIGHT_CURRENT_LOCALE_COOKIE_NAME = "insight_current_locale";
    const locale = getCurrentLocale(INSIGHT_CURRENT_LOCALE_COOKIE_NAME);
    const promiseArray = [
      dispatch(getInitialLoad()),
      dispatch(getCategories(wId)),
      dispatch(getSettings(wId)),
      dispatch(getTags(wId)),
      i18n({ app: "app-cs-standards", locale }).then((labels) =>
        setToolkitLabels(labels)
      ),
    ];
    return Promise.all(promiseArray)
      .then(() => {
        dispatch(saveInitialLoad());
        dispatch(saveManagerFlag(isManagerView));
      })
      .catch((error) => {
        dispatch(failInitialLoad(error));
        throw error;
      });
  };
}

export function getDifferentGroupCategories(wId) {
  return (dispatch) =>
    fetchCategories({ wId })
      .then(({ data }) => {
        dispatch(saveDifferentWebGroupCategories(arrayToMap(data)));
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
}

export function getCategories(wId) {
  return (dispatch) =>
    fetchCategories({ wId })
      .then(({ data }) => {
        dispatch(saveCategories(arrayToMap(data)));
        dispatch(saveCategoryOrder(createOrderArray(data)));
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
}

export function getCategory({ categoryId, webGroupId }) {
  return (dispatch, getState) => {
    const wId = webGroupId || selector_wId(getState());

    return fetchCategory({ categoryId, wId })
      .then((categoryDetails) => {
        dispatch(saveCategories({ [categoryDetails.id]: categoryDetails }));
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
  };
}

export function getProductGroup({ productGroupId, webGroupId, categoryId }) {
  return (dispatch, getState) => {
    const wId = webGroupId || selector_wId(getState());

    return fetchProductGroup({ productGroupId, wId, categoryId })
      .then((productGroupDetails) => {
        dispatch(
          saveProductGroups({ [productGroupDetails.id]: productGroupDetails })
        );
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
  };
}

export function getProductGroupsByCategory(categoryId) {
  return (dispatch, getState) => {
    if (selector_cache(getState(), categoryId)) return Promise.resolve();
    return fetchProductGroupsByCategory({
      categoryId,
      wId: selector_wId(getState()),
    })
      .then(({ data }) => {
        dispatch(addCache(categoryId));
        const payload = arrayToMap(data)
        dispatch(saveProductGroups(payload))
        return payload
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
  };
}

export function getProductSet({ productSetId, webGroupId, categoryId }) {
  return (dispatch, getState) => {
    const wId = webGroupId || selector_wId(getState());
    const locale = selector_locale(getState());
    return fetchProductSet({ productSetId, wId, locale, categoryId })
      .then((productSet) => {
        dispatch(saveProductSets({ [productSet.id]: productSet }));
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
  };
}

export function getProductSetsByProductGroup(productGroupId) {
  return (dispatch, getState) => {
    if (selector_cache(getState(), productGroupId)) return Promise.resolve();
    return fetchProductSetsByProductGroup({
      productGroupId,
      wId: selector_wId(getState()),
    })
      .then(({ data }) => {
        dispatch(addCache(productGroupId));
        const items = arrayToMap(data)
        dispatch(saveProductSets(items))
        return items
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
  };
}

export function getSettings(wId) {
  return (dispatch) =>
    fetchSettings({ wId })
      .then(({ data }) => {
        if (data) dispatch(saveSettings(data));
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
}

export function getTags(wId) {
  return (dispatch) =>
    fetchTags({ wId })
      .then(({ data }) => {
        dispatch(saveTags(arrayToMap(data)));
      })
      .catch((error) => {
        console.warn(error);
        throw error;
      });
}

export function removeCategory({ id }) {
  return (dispatch, getState) => {
    const wId = selector_wId(getState());
    return deleteCategory({ categoryId: id, wId }).then(() => {
      dispatch(getCategories(wId));
    });
  };
}

export function removeProductGroup({ id, parentId }) {
  return (dispatch) =>
    deleteProductGroup({ productGroupId: id }).then(() => {
      dispatch(getCategory({ categoryId: parentId }));
    });
}

export function removeProductSet({ id, parentId }) {
  return (dispatch, getState) => {
    const wId = selector_wId(getState());
    return deleteProductSet({ productSetId: id }).then(() => {
      dispatch(getProductGroup({ productGroupId: parentId, wId }));
    });
  };
}

export function removeTag({ tagId }) {
  return (dispatch) =>
    deleteTag({ tagId }).then(() => {
      dispatch(delTag(tagId));
    });
}

export function getIpsContracts() {
  return (dispatch, getState) => {
    const wId = selector_wId(getState());
    const ipsContractsCacheName = `${wId}-ipsContracts`;

    return selector_cache(getState(), ipsContractsCacheName)
      ? Promise.resolve()
      : fetchIpsContracts({ wId })
        .then((ipsContracts) => {
          dispatch(addCache(ipsContractsCacheName));
          dispatch(saveIpsContracts(ipsContracts));
        })
        .catch((error) => {
          console.warn(error);
          throw error;
        });
  };
}

export function publishEntity({ data, type }) {
  return (dispatch) =>
    putPublish(data).then((updatedEntity) => {
      const updatedEntityMap = { [updatedEntity.id]: updatedEntity };
      switch (type) {
        case "category":
          dispatch(saveCategories(updatedEntityMap));
          break;
        case "productGroup":
          dispatch(saveProductGroups(updatedEntityMap));
          break;
        case "productSet":
          dispatch(saveProductSets(updatedEntityMap));
          break;
        default:
          break;
      }

      dispatch(removeCache(updatedEntity.id));
      updatedEntity.order.forEach((id) => {
        dispatch(removeCache(id));
      });
    });
}

export function publishAll({ wId, messenger }) {
  return (dispatch) =>
    putPublishAll({ wId, messenger }).then(() => {
      // refetch all categories from top level since this is a publish all action
      // set 1s delay to show success message before reloading categories
      setTimeout(() => {
        const promiseArray = [
          dispatch(getInitialLoad()),
          dispatch(getCategories(wId)),
          dispatch(publishAllFlush()),
        ];
        return Promise.all(promiseArray)
          .then(() => dispatch(saveInitialLoad()))
          .catch((error) => {
            dispatch(failInitialLoad(error));
            throw error;
          });
      }, 1000);
    });
}

export function getLabFees({ labConfig }) {
  return (dispatch, getState) =>
    selector_cache(getState(), labConfig)
      ? Promise.resolve()
      : fetchLabFeesByLabConfig({ labConfig })
        .then((labFees) => {
          dispatch(addCache(labConfig));
          dispatch(saveLabFees({ [labConfig]: labFees }));
        })
        .catch((error) => {
          console.warn(error);
          throw error;
        });
}

export function getProductSetItems(productSetId, categoryId) {
  return (dispatch, getState) => {
    const locale = selector_locale(getState());
    const wId = selector_wId(getState());

    return fetchProductsByProductSet({
      locale,
      productSetId,
      wId,
      categoryId
    }).then((productSetItems) => {
      dispatch(saveProductSetItems({ productSetId, productSetItems }));
    });
  };
}

export function editProductSetItems({ items, productSetId, messenger }) {
  return (dispatch, getState) => {
    const locale = selector_locale(getState());
    const wId = selector_wId(getState());

    return putProductList({ items, locale, productSetId, wId, messenger }).then(
      (productSetItems) => {
        dispatch(removeCache(productSetId));
        dispatch(saveProductSetItems({ productSetId, productSetItems }));
        return productSetItems;
      }
    );
  };
}

export function validateItemsAndAddToProductSet({
  materialIds,
  productSetId,
  quantity,
}) {
  return (dispatch, getState) => {
    const locale = selector_locale(getState());
    const wId = selector_wId(getState());

    return postMaterialIdsValidation({
      locale,
      materialIds,
      productSetId,
      quantity,
      wId,
    }).then((res) => {
      dispatch(
        saveProductSetItems({ productSetId, productSetItems: res.items })
      );
      return res;
    });
  };
}

function arrayToMap(arr, mapKey = "id") {
  return arr.reduce((acc, entry) => {
    acc[entry[mapKey]] = entry;
    return acc;
  }, {});
}

function createOrderArray(arr, orderValueKey = "id") {
  return arr.map((item) => item[orderValueKey]);
}
