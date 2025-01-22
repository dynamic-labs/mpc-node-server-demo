import { reshareRemainingParty } from '@dynamic-labs/dynamic-wallet-server';
import { Request, Response } from 'express';
import { evervaultEncrypt } from '../../../services/evervault';
import { EAC } from '../../../types/credentials';

/**
 * /api/v1/actions/ReshareRemainingParty
 */
export const ReshareRemainingParty = async (req: Request, res: Response) => {
  const { roomId, eac, clientKeygenId, clientBackupKeygenId, newThreshold } =
    req.body;
  const { serverKeyShare, chain } = eac as EAC;
  // Reshare the remaining party
  const { serverKeyShare: refreshedServerKeyShare } =
    await reshareRemainingParty({
      chain,
      roomId,
      serverKeyShare: JSON.parse(serverKeyShare),
      clientKeygenId,
      clientBackupKeygenId,
      newThreshold,
    });

  const rawEac: EAC = {
    ...eac,
    serverKeyShare: JSON.stringify(refreshedServerKeyShare),
  };

  const modifiedEac = await evervaultEncrypt(JSON.stringify(rawEac));

  return res.status(200).json({
    eac: modifiedEac,
  });
};
