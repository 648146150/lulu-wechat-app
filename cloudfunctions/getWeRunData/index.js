// 云函数：解密微信运动数据
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  const { encryptedData, iv } = event;
  try {
    const result = await cloud.openapi.werun.getStepInfo({
      encryptedData: encryptedData,
      iv: iv
    });
    return result;
  } catch (err) {
    return { error: err.message };
  }
};
