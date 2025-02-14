import {
  RefreshShares200Type,
  RefreshShares400Type,
  RefreshShares403Type,
  RefreshShares500Type,
  RefreshSharesRequestType,
} from '../../../generated';

import { refreshSinglePartyShare } from '../../../services/mpc/refreshSinglePartyShare';
import { TypedRequestHandler } from '../../../types/express';

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
}> = async (req, res, next) => {
  try {
    const { roomId, serverEacs } = req.body;

    const refreshedServerEacs = await Promise.all(
      serverEacs.map((serverEac) =>
        refreshSinglePartyShare({ roomId, eac: serverEac }),
      ),
    );

    return res.status(200).json({
      serverEacs: refreshedServerEacs,
    });
  } catch (error) {
    next(error);
  }
};
