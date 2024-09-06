import axios from "axios";

export const getProductInformation = async ({ locale, materialId }) => {
  try {
    const res = await axios({
      method: "get",
      url: `/insightweb/cs/endUser/productInformation`,
      params: { locale, matId: materialId },
    });
    return res;
  } catch (err) {
    console.warn(`Failed to fetch PDP information`, err);
    throw err;
  }
};
