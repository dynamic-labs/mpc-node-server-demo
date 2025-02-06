import { refreshShares } from '@dynamic-labs-wallet/server';
import { Request, Response } from 'express';
import {
  RefreshShares200Type,
  RefreshShares400Type,
  RefreshShares403Type,
  RefreshShares500Type,
  RefreshSharesRequestType,
} from 'generated';
import { TypedRequestHandler } from 'types/express';
import { evervaultEncrypt } from '../../../services/evervault';
import { EAC } from '../../../types/credentials';

/**
 * /api/v1/actions/RefreshShares
 */
export const RefreshShares: TypedRequestHandler<{
  request: {
    body: RefreshSharesRequestType;
  };
  response: {
    body:
      | RefreshShares200Type
      | RefreshShares400Type
      | RefreshShares403Type
      | RefreshShares500Type;
    statusCode: 200 | 400 | 403 | 500;
  };
}> = async (req, res) => {
  const { roomId, eac } = req.body;
  const { serverKeyShare, chain } = eac as EAC;
  console.log('RefreshShares');
  console.log('serverShare', serverKeyShare);
  // Refresh the shares
  const { serverKeyShare: refreshedServerKeyShare } = await refreshShares({
    chain,
    roomId,
    serverKeyShare: JSON.parse(serverKeyShare),
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
