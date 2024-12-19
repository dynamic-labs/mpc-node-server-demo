import axios from 'axios';
import { DATA_POLICY_ROLE, EVERVAULT_HOST } from './constants';

export const evervaultEncrypt = async (
  stringToEncrypt: string,
): Promise<string> => {
  const resp = await axios.post(
    `${EVERVAULT_HOST}/encrypt`,
    {
      payload: stringToEncrypt,
    },
    {
      headers: {
        'X-Evervault-Data-Role': DATA_POLICY_ROLE,
        'Content-Type': 'application/json',
      },
    },
  );

  if (resp.status !== 200) {
    throw new Error(
      `Failed to encrypt payload. Error reason:  ${resp.statusText}`,
    );
  }
  return resp.data.payload;
};

export const evervaultDecrypt = async (
  encryptedString: string,
): Promise<string> => {
  const resp = await axios.post(`${EVERVAULT_HOST}/decrypt`, {
    payload: encryptedString,
  });
  return resp.data.payload;
};
