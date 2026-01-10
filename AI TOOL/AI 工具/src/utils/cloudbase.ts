/// <reference types="vite/client" />
// @ts-nocheck
import cloudbase from "@cloudbase/js-sdk";

// 云开发环境ID
// - 推荐做法：在本地创建 `.env.local` 并设置 `VITE_ENV_ID=你的环境ID`
// - 也可以直接改这里（适合模板快速体验）
export const ENV_ID = import.meta.env.VITE_ENV_ID || "cloud1-0g6jrh9hca15e904";

// 检查环境ID是否已配置（只要非空即可，避免误把“默认示例值”当成未配置）
export const isValidEnvId = Boolean(ENV_ID);

/**
 * 初始化云开发实例
 */
export const init = (config: { env?: string; timeout?: number } = {}) => {
  const appConfig = {
    env: config.env || ENV_ID,
    timeout: config.timeout || 15000,
  };

  return cloudbase.init(appConfig);
};

/**
 * 默认的云开发实例
 */
export const app = init();
export const auth = app.auth();

export type CloudbaseUser = Awaited<ReturnType<typeof auth.getCurrentUser>>;
export type VerificationInfo = Awaited<ReturnType<typeof auth.getVerification>>;

const TRIAL_EXPIRE_KEY = "a2v_trial_expire_at";
const TRIAL_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * 检查环境配置是否有效
 */
export const checkEnvironment = () => {
  if (!isValidEnvId) {
    const message =
      "❌ 云开发环境ID未配置\n\n请按以下步骤配置：\n1. 创建 .env.local 并设置 VITE_ENV_ID=你的环境ID\n   或者打开 src/utils/cloudbase.ts 直接修改 ENV_ID\n2. 保存后刷新页面\n\n获取环境ID：https://console.cloud.tencent.com/tcb";
    console.error(message);
    throw new Error("环境ID未配置");
  }
  return true;
};

export const getLoginState = async () => {
  checkEnvironment();
  return auth.getLoginState();
};

export const getCurrentUser = async () => {
  checkEnvironment();
  return auth.getCurrentUser();
};

export const sendSmsCode = async (phone: string) => {
  checkEnvironment();
  const normalized = phone.slice(0, 3) === "+86" ? phone : `+86 ${phone}`;
  return auth.getVerification({ phone_number: normalized });
};

export const loginWithSms = async (params: {
  phone: string;
  verificationInfo: VerificationInfo;
  verificationCode: string;
}) => {
  checkEnvironment();
  await auth.signInWithSms({
    verificationInfo: params.verificationInfo,
    verificationCode: params.verificationCode,
    phoneNum: params.phone,
  });
  return auth.getCurrentUser();
};

export const signupWithSms = async (params: {
  phone: string;
  verificationInfo: VerificationInfo;
  verificationCode: string;
  name?: string;
  password?: string;
  username?: string;
}) => {
  checkEnvironment();
  const tokenRes = await auth.verify({
    verification_id: params.verificationInfo.verification_id,
    verification_code: params.verificationCode,
  });

  const normalizedPhone = params.phone.slice(0, 3) === "+86" ? params.phone : `+86 ${params.phone}`;

  await auth.signUp({
    phone_number: normalizedPhone,
    verification_code: params.verificationCode,
    verification_token: tokenRes.verification_token,
    name: params.name || "手机用户",
    password: params.password,
    username: params.username || params.phone,
  });

  return auth.getCurrentUser();
};

export const loginWithPassword = async (params: {
  username: string;
  password: string;
}) => {
  checkEnvironment();
  await auth.signIn({
    username: params.username,
    password: params.password,
  });
  return auth.getCurrentUser();
};

/**
 * 退出登录
 */
export const logout = async () => {
  checkEnvironment();
  try {
    await auth.signOut();
    return { success: true, message: "已成功退出登录" };
  } catch (error) {
    console.error("退出登录失败:", error);
    throw error;
  }
};

/**
 * 确保用户已登录
 */
export const ensureLogin = async (): Promise<CloudbaseUser> => {
  checkEnvironment();
  const user = await auth.getCurrentUser();
  if (user) return user;
  throw new Error("用户未登录");
};

/**
 * 监听登录状态变化
 */
export const listenLoginState = (
  callback: (params: Record<string, unknown>) => void,
) => {
  checkEnvironment();
  auth.onLoginStateChanged(callback);
};

export const signInGuest = async () => {
  checkEnvironment();
  await auth.signInAnonymously();
  const expireAt = Date.now() + TRIAL_DURATION_MS;
  localStorage.setItem(TRIAL_EXPIRE_KEY, String(expireAt));
  return auth.getCurrentUser();
};

export const getTrialExpireAt = () => {
  const raw = localStorage.getItem(TRIAL_EXPIRE_KEY);
  const num = raw ? Number(raw) : NaN;
  return isFinite(num) ? num : null;
};

export const clearTrialExpire = () => {
  localStorage.removeItem(TRIAL_EXPIRE_KEY);
};

export default {
  init,
  app,
  auth,
  getLoginState,
  getCurrentUser,
  sendSmsCode,
  loginWithSms,
  signupWithSms,
  loginWithPassword,
  logout,
  ensureLogin,
  listenLoginState,
  checkEnvironment,
  isValidEnvId,
  signInGuest,
  getTrialExpireAt,
  clearTrialExpire,
};
