import { Request, Response } from 'express';
import { evervaultEncrypt } from '../../../services/evervault';
import { refreshShares } from '../../../services/wallets';
import { EAC } from '../../../types/credentials';

/**
 * /api/v1/actions/RefreshShares
 */
export const RefreshShares = async (req: Request, res: Response) => {
  const { roomId, eac } = req.body;
  const { serverShare, chain } = eac as EAC;
  console.log('RefreshShares');
  console.log('serverShare', serverShare);
  // Refresh the shares
  const { serverShare: refreshedServerShare } = await refreshShares({
    chain,
    roomId,
    serverShare: JSON.parse(serverShare),
  });

  const rawEac: EAC = {
    ...eac,
    serverShare: JSON.stringify(refreshedServerShare),
  };

  const modifiedEac = await evervaultEncrypt(JSON.stringify(rawEac));

  return res.status(200).json({
    eac: modifiedEac,
  });
};
