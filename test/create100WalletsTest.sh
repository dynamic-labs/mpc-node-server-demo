#!/bin/bash

BASE_API_URL="http://localhost:8010"
API_TOKEN="dyn_xv1AcbnaPTh24CLUoXVudTkXNAaKlx3ttXxvjsW0hrHIMcQrND0hBWJr"
ENVIRONMENT_ID="ad2cb6f8-fb6e-4508-bc87-e2308cd866b1"

for i in {1..100}
do
  response=$(curl -s -X POST "${BASE_API_URL}/api/v1/actions/${ENVIRONMENT_ID}/CreateWalletAccount" \
  -H "Authorization: Bearer ${API_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{"chainName": "EVM", "thresholdSignatureScheme": "TWO_OF_TWO"}')

  accountAddress=$(echo "$response" | jq -r '.accountAddress')
  echo "Wallet Created $i: Account Address - $accountAddress"

#   sleep 2
done