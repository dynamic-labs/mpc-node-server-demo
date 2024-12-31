import { Request, Response } from 'express';
import { evervaultEncrypt } from '../../../services/evervault';
import { reshareRemainingParty } from '../../../services/wallets';
import { EAC } from '../../../types/credentials';

/**
 * /api/v1/actions/ReshareRemainingParty
 */
export const ReshareRemainingParty = async (req: Request, res: Response) => {
  const { roomId, eac, clientKeygenId, clientBackupKeygenId, newThreshold } =
    req.body;
  const { serverShare, chain } = eac as EAC;
  // Reshare the remaining party
  const { serverShare: refreshedServerShare } = await reshareRemainingParty({
    chain,
    roomId,
    serverShare: JSON.parse(serverShare),
    clientKeygenId,
    clientBackupKeygenId,
    newThreshold,
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
